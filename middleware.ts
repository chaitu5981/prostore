import { NextResponse } from "next/server";
import { auth } from "./auth";
import { prisma } from "./lib/prisma";
import { InputJsonValue } from "./generated/prisma/runtime/library";
export const runtime = "nodejs";
export default auth(async (request) => {
  if (Math.random() < 0.2) {
    const thresholdTime = new Date(Date.now() - 60 * 1000);
    await prisma.cart.deleteMany({
      where: {
        userId: null,
        updatedAt: {
          lt: thresholdTime,
        },
      },
    });
  }
  const cartSessionIdCookie = request.cookies.get("cartSessionId");
  if (!cartSessionIdCookie) {
    const cartSessionId = crypto.randomUUID();
    console.log(cartSessionId);
    const response = NextResponse.next();
    response.cookies.set("cartSessionId", cartSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: "lax",
      maxAge: 60,
    });
    return response;
  } else {
    const cart = await prisma.cart.findFirst({
      where: {
        cartSessionId: cartSessionIdCookie.value,
        userId: null,
      },
    });
    if (cart && cart.items)
      await prisma.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          items: cart.items as InputJsonValue[],
        },
      });
    const response = NextResponse.next();
    response.cookies.set(
      "cartSessionId",
      cartSessionIdCookie?.value as string,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: "lax",
        maxAge: 60,
      }
    );
    return response;
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
