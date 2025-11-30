"use server";
import { auth } from "@/auth";
import { success } from "zod";
import { formatError } from "../utils";
import { getUserById } from "./user.actions";
import { getCart } from "./cart.actions";
import { insertOrderItemSchema, insertOrderSchema } from "../validators";
import { prisma } from "../prisma";
import { isRedirectError } from "next/dist/client/components/redirect-error";

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
        const insertedOrderItem = await tx.orderItem.create({
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
