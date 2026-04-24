import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
  });

  const { pathname } = req.nextUrl;
  const isAuthenticated = !!token && token.error !== "RefreshAccessTokenError";

  // Broken token — clear cookies and redirect to login
  if (token?.error === "RefreshAccessTokenError") {
    const response = NextResponse.redirect(new URL("/", req.url));
    response.cookies.delete("next-auth.session-token");
    response.cookies.delete("__Secure-next-auth.session-token");
    return response;
  }

  // Logged in user hits login page — send to dashboard
  if (isAuthenticated && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Unauthenticated user hits protected route — send to login
  if (
    !isAuthenticated &&
    (pathname.startsWith("/dashboard") || pathname.startsWith("/create-user"))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Runs on all routes except Next.js internals and NextAuth itself
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
