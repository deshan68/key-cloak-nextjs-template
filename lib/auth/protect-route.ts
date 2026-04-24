import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function withAuth(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXT_AUTH_SECRET,
  });

  if (!token?.access_token) {
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

  if (token.error === "RefreshAccessTokenError") {
    return {
      authenticated: false,
      response: new NextResponse(
        JSON.stringify({ error: "Session expired - please login again" }),
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
