import { NextResponse } from "next/server";
import { auth } from "./auth";
export const runtime = "nodejs";
export default auth(async (request) => {
  const protectedPaths = [
    /\/shipping-address/,
    /\/payment-method/,
    /\/place-order/,
    /\/profile/,
    /\/admin\/(.*)/,
    /\/user\/(.*)/,
    /\/order\/(.*)/,
  ];
  const adminPath = /\/admin\/(.*)/;
  const { pathname } = request.nextUrl;
  if (!request.auth && protectedPaths.some((p) => p.test(pathname))) {
    const newUrl = new URL(
      `/sign-in?callbackUrl=${request.nextUrl}`,
      request.nextUrl.origin
    );
    return Response.redirect(newUrl);
  }
  if (adminPath.test(pathname) && request.auth?.user.role != "admin")
    return NextResponse.redirect(
      new URL("/unauthorized", request.nextUrl.origin)
    );
  const cartSessionIdCookie = request.cookies.get("cartSessionId");
  const response = NextResponse.next();
  if (!cartSessionIdCookie) {
    const cartSessionId = crypto.randomUUID();
    response.cookies.set("cartSessionId", cartSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: "lax",
      maxAge: 60 * 60,
    });
    return response;
  } else {
    response.cookies.set(
      "cartSessionId",
      cartSessionIdCookie?.value as string,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: "lax",
        maxAge: 60 * 60,
      }
    );
    return response;
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
