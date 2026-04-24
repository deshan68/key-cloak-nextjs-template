import { PostgrestClient } from "@supabase/postgrest-js";
import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

/**
 * Get authenticated PostgreSQL client (Server-side only)
 * Token is automatically refreshed via NextAuth jwt callback
 */
export const getServerAuthenticatedClient = async (): Promise<{
  client: PostgrestClient | null;
  userId: string | null;
  error: string | null;
}> => {
  try {
    // getToken triggers jwt callback - auto-refreshes if expired
    const token = await getToken({
      req: { headers: await headers() } as NextRequest,
      secret: process.env.NEXT_AUTH_SECRET,
    });

    if (!token?.access_token) {
      return {
        client: null,
        userId: null,
        error: "Unauthorized: No valid token",
      };
    }

    // Check if token refresh failed
    if (token.error === "RefreshAccessTokenError") {
      return {
        client: null,
        userId: null,
        error: "Token expired - please login again",
      };
    }

    const restUrl = process.env.REST_URL;

    if (!restUrl) {
      return {
        client: null,
        userId: null,
        error: "REST_URL not configured",
      };
    }

    const client = new PostgrestClient(restUrl, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return {
      client,
      userId: token.sub ?? null,
      error: null,
    };
  } catch (error) {
    console.error("Error getting authenticated client:", error);
    return {
      client: null,
      userId: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Client-side helper to get authenticated client
 * Use this only in the browser with a valid session
 */
export const getClientAuthenticatedClient = (
  accessToken: string
): PostgrestClient | null => {
  const restUrl = process.env.NEXT_PUBLIC_REST_URL;

  if (!restUrl) {
    console.warn("NEXT_PUBLIC_REST_URL environment variable is not set");
    return null;
  }

  if (!accessToken) {
    console.warn("No access token provided");
    return null;
  }

  try {
    const client = new PostgrestClient(restUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return client;
  } catch (error) {
    console.error(
      "Failed to initialize client-side authenticated PostgrestClient:",
      error
    );
    return null;
  }
};
