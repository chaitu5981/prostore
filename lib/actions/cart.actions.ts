"use server";

import { Cart, CartItem } from "@/types";
import { cookies } from "next/headers";
import { formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { prisma } from "../prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";

const calcPrices = (cartItems: CartItem[]) => {
  const itemsPrice = round2(
    cartItems.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  );
  const shippingPrice = round2(itemsPrice < 100 ? 10 : 0);
  const taxPrice = round2(0.15 * itemsPrice);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export const getCart = async (): Promise<Cart | undefined> => {
  const cartSessionId = (await cookies()).get("cartSessionId")?.value;
  const session = await auth();
  const userId = session?.user?.id || undefined;
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { cartSessionId },
  });
  if (!cart) return undefined;
  return {
    ...JSON.parse(JSON.stringify(cart)),
    createdAt: new Date(cart?.createdAt),
    updatedAt: new Date(cart?.updatedAt),
  };
};

export const addItemToCart = async (item: CartItem) => {
  try {
    const cartSessionId = (await cookies()).get("cartSessionId")?.value;
    const session = await auth();
    const userId = session?.user?.id || undefined;
    if (!cartSessionId && !userId) throw new Error("No Session found");
    const cartItem = cartItemSchema.parse(item);
    const product = await prisma.product.findFirst({
      where: {
        id: cartItem.productId,
      },
    });
    if (!product) throw new Error("Product not found");
    const cart = await getCart();
    if (!cart) {
      const newCart = insertCartSchema.parse({
        userId,
        items: [cartItem],
        cartSessionId,
        ...calcPrices([cartItem]),
      });
      await prisma.cart.create({
        data: newCart,
      });
    } else {
      const existItem = cart.items.find(
        (item) => item.productId == cartItem.productId
      ) as CartItem;
      if (existItem) {
        if (product.stock < existItem.qty + 1)
          throw new Error("Product out of Stock");
        else existItem.qty++;
        cart.items = cart.items.map((item) =>
          item.productId == existItem.productId ? existItem : item
        );
      } else cart.items = [...cart.items, cartItem];
      console.log(cart.items);

      await prisma.cart.update({
        where: { id: cart.id },
        data: { ...cart, ...calcPrices(cart.items) },
      });
    }
    // revalidatePath(`/product/${product.slug}`);
    return {
      success: true,
      message: `${item.productName} added to Cart`,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const removeItemFromCart = async (productId: string) => {
  try {
    const cartSessionId = (await cookies()).get("cartSessionId")?.value;
    const session = await auth();
    const userId = session?.user?.id || undefined;
    if (!cartSessionId && !userId) throw new Error("No Session found");
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
      },
    });
    if (!product) throw new Error("Product not found");
    const cart = await getCart();
    if (!cart) throw new Error("Cart not found");
    const existItem = cart.items.find((item) => item.productId == productId);
    if (!existItem) throw new Error("Item not found");
    if (existItem.qty == 1) {
      cart.items = cart.items.filter((item) => item.productId != productId);
      if (cart.items.length == 0)
        await prisma.cart.delete({
          where: {
            id: cart.id,
          },
        });
    } else {
      existItem.qty--;
      cart.items = cart.items.map((item) =>
        item.productId == productId ? existItem : item
      );
    }
    await prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        ...cart,
        ...calcPrices(cart.items),
      },
    });
    // revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} removed from Cart`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};
