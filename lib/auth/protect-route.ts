import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function withAuth(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // No token found
  if (!token || !token.access_token) {
    return {
      authenticated: false,
      response: new NextResponse(
        JSON.stringify({ error: "Unauthorized: No valid session" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      ),
    };
  }

  // Token refresh error - user needs to re-login
  if (token.error === "RefreshAccessTokenError") {
    return {
      authenticated: false,
      response: new NextResponse(
        JSON.stringify({ 
          error: "Session expired - please login again",
          code: "TOKEN_REFRESH_ERROR"
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      ),
    };
  }

  return {
    authenticated: true,
    token,
    response: null,
  };
}
