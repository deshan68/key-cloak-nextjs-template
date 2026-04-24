import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware";

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXT_AUTH_SECRET,
  });

  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  if (token?.error === "RefreshAccessTokenError") {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/create-user/:path*",
    "/api/protected/:path*",
  ],
};
