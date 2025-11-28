import NextAuth from "next-auth";
import { prisma } from "./lib/prisma";
// import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Cart, CartItem } from "./types";
import { calcPrices } from "./lib/utils";
import { InputJsonValue, JsonValue } from "./generated/prisma/runtime/library";
export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  debug: true,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;
        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        });
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );
          if (isMatch)
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    session: async ({ session, user, token, trigger }) => {
      session.user.id = token.sub as string;
      session.user.role = token.role as string;
      if (trigger == "update") session.user.name = user.name;
      return session;
    },
    jwt: async ({ token, user, trigger }) => {
      // console.log(token);
      if (user) token.role = user.role;
      if (trigger == "signIn" || trigger == "signUp") {
        const cartSessionId = (await cookies()).get("cartSessionId")?.value;
        if (cartSessionId) {
          const guestCart = await prisma.cart.findFirst({
            where: { cartSessionId, userId: null },
          });
          if (guestCart) {
            const existingCart = await prisma.cart.findFirst({
              where: {
                userId: token.sub,
              },
            });
            if (existingCart) {
              (guestCart?.items as CartItem[]).forEach(
                async (guestCartItem) => {
                  const matchedItem = (existingCart?.items as CartItem[]).find(
                    (existingItem) =>
                      (existingItem as CartItem)?.productId ==
                      (guestCartItem as CartItem)?.productId
                  );
                  if (!matchedItem) {
                    existingCart.items = [
                      ...existingCart?.items,
                      guestCartItem,
                    ];
                  } else {
                    const product = await prisma.product.findFirst({
                      where: {
                        id: matchedItem.productId,
                      },
                    });

                    if (
                      product &&
                      matchedItem.qty + guestCartItem.qty <= product?.stock
                    ) {
                      existingCart.items = (
                        existingCart.items as CartItem[]
                      ).map((existingItem) => {
                        if (existingItem.productId == matchedItem.productId)
                          return {
                            ...existingItem,
                            qty: matchedItem.qty + guestCartItem.qty,
                          };
                        else return existingItem;
                      });
                    }
                  }
                }
              );
              await prisma.cart.update({
                where: {
                  id: existingCart.id,
                },
                data: {
                  items: existingCart.items as InputJsonValue[],
                  ...calcPrices(existingCart.items as CartItem[]),
                },
              });
            } else {
              await prisma.cart.create({
                data: {
                  cartSessionId: guestCart.cartSessionId,
                  userId: token.sub,
                  items: guestCart.items as InputJsonValue[],
                  itemsPrice: guestCart.itemsPrice,
                  totalPrice: guestCart.totalPrice,
                  taxPrice: guestCart.taxPrice,
                  shippingPrice: guestCart.shippingPrice,
                },
              });
            }
            await prisma.cart.delete({
              where: { id: guestCart.id },
            });
          }
        }
      }
      return token;
    },
  },
});
