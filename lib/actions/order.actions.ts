"use server";
import { auth } from "@/auth";
import { formatError } from "../utils";
import { getUserById } from "./user.actions";
import { getCart } from "./cart.actions";
import { insertOrderItemSchema, insertOrderSchema } from "../validators";
import { prisma } from "../prisma";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { paypal } from "../paypal";
import { PaymentResult, ShippingAddress } from "@/types";

export const getOrderById = async (orderId: string) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderItems: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
  if (!order || !order.shippingAddress) return null;
  return {
    ...order,
    itemsPrice: order?.itemsPrice.toString(),
    taxPrice: order?.taxPrice.toString(),
    shippingPrice: order?.shippingPrice.toString(),
    totalPrice: order?.totalPrice.toString(),
    shippingAddress: order.shippingAddress as ShippingAddress,
    paymentResult: order.paymentResult as PaymentResult,
    orderItems: order.orderItems.map((orderItem) => ({
      ...orderItem,
      price: orderItem.price.toString(),
    })),
  };
};

export const createOrder = async () => {
  try {
    const session = await auth();
    if (!session) throw new Error("User not authenticated");
    const userId = session.user.id;
    if (!userId) throw new Error("User not found");
    const user = await getUserById(userId);
    const cart = await getCart();
    if (!cart)
      return {
        success: false,
        message: "Cart not found",
        redirectTo: "/cart",
      };
    if (!user?.address)
      return {
        success: false,
        message: "Shipping Address not found",
        redirectTo: "/shipping-address",
      };
    if (!user.paymentMethod)
      return {
        success: false,
        message: "Payment method not found",
        redirectTo: "/payment-method",
      };
    const order = insertOrderSchema.parse({
      userId,
      itemsPrice: cart.itemsPrice,
      taxPrice: cart.taxPrice,
      shippingPrice: cart.shippingPrice,
      totalPrice: cart.totalPrice,
      paymentMethod: user.paymentMethod,
      shippingAddress: user.address,
    });
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      const insertedOrder = await tx.order.create({ data: order });
      for (const item of cart.items) {
        const orderItem = insertOrderItemSchema.parse({
          ...item,
          orderId: insertedOrder.id,
        });
        await tx.orderItem.create({
          data: orderItem,
        });
      }
      await tx.cart.delete({
        where: {
          id: cart.id,
        },
      });
      return insertedOrder.id;
    });
    if (insertedOrderId)
      return {
        success: true,
        message: "Order Created successfully",
        redirectTo: `/order/${insertedOrderId}`,
      };
    throw new Error("Order not created");
  } catch (error) {
    console.log(error);
    if (isRedirectError(error)) throw error;
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const createPaypalOrder = async (orderId: string, price: string) => {
  try {
    const res = await paypal.createOrder(price);
    if (!res.id) throw new Error("Paypal Order could not be created");
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        paymentResult: {
          id: res.id,
          status: "",
          email: "",
          pricePaid: 0,
        },
      },
    });
    return {
      success: true,
      orderID: res.id,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const approvePaypalOrder = async (orderId: string, orderID: string) => {
  try {
    const captureData = await paypal.captureOrder(orderID);
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        orderItems: true,
      },
    });
    if (!order) throw new Error("Order not found");
    if (order?.isPaid) throw new Error("Oder is already paid");
    if (
      !captureData ||
      captureData.status !== "COMPLETED" ||
      captureData.id !== (order?.paymentResult as PaymentResult).id
    )
      throw new Error("Paypal payment failed");
    await prisma.$transaction(async (tx) => {
      const outOfStockItems: string[] = [];
      for (const orderItem of order.orderItems) {
        const product = await tx.product.findFirst({
          where: {
            id: orderItem.productId,
          },
          select: {
            id: true,
            name: true,
            stock: true,
          },
        });
        if (!product || !product.stock)
          outOfStockItems.push(orderItem.productName);
        else if (product?.stock < orderItem.qty)
          outOfStockItems.push(orderItem.productName);
        if (outOfStockItems.length > 0)
          throw new Error(
            `Products ${outOfStockItems.join(" ")} are out of stock`
          );
      }

      order?.orderItems.forEach(async (orderItem) => {
        await tx.product.update({
          where: {
            id: orderItem.productId,
          },
          data: {
            stock: {
              increment: -orderItem.qty,
            },
          },
        });
      });
      await tx.order.update({
        where: {
          id: orderId,
        },
        data: {
          isPaid: true,
          paidAt: new Date(),
          paymentResult: {
            id: captureData.id,
            status: captureData.status,
            email: captureData.payment_source.paypal.email_address,
            pricePaid:
              captureData.purchase_units[0].payments.captures[0].amount.value,
          },
        },
      });
    });
    const updatedOrder = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        orderItems: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    if (!updatedOrder) throw new Error("Order not found");
    return {
      success: true,
      message: "Paypal payment successful",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const getMyOrders = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  try {
    const session = await auth();
    if (!session) throw new Error("Not Authorized");
    const user = session.user;
    if (!user) throw new Error("User not found");
    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    const orderCount = await prisma.order.count({
      where: { userId: user.id },
    });
    return {
      success: true,
      data: orders,
      noOfPages: Math.ceil(orderCount / limit),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};
