import { auth } from "@/auth";
import { success } from "zod";
import { formatError } from "../utils";
import { getUserById } from "./user.actions";
import { getCart } from "./cart.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "../prisma";

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
    const insertedOrderId = await prisma.$transaction(async (tx) => {});
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: formatError(error),
    };
  }
};
