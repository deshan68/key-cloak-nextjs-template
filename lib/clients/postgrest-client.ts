import { PostgrestClient } from "@supabase/postgrest-js";

/**
 * Creates a Postgrest client with Bearer token authentication
 * Used for direct database queries via Supabase PostgREST API
 */
export function createPostgrestClient(bearerToken?: string): PostgrestClient {
  const postgrestUrl = process.env.NEXT_PUBLIC_POSTGREST_URL;

  if (!postgrestUrl) {
    throw new Error("NEXT_PUBLIC_POSTGREST_URL is not configured");
  }

  const client = new PostgrestClient(postgrestUrl, {
    headers: {
      "Content-Type": "application/json",
      ...(bearerToken && { Authorization: `Bearer ${bearerToken}` }),
    },
  });

  return client;
}

/**
 * Creates a Postgrest client for server-side operations
 * Uses server-side service role key for privileged operations
 */
export function createServerPostgrestClient(): PostgrestClient {
  const postgrestUrl = process.env.NEXT_PUBLIC_POSTGREST_URL;
  const serviceRoleKey = process.env.POSTGREST_SERVICE_ROLE_KEY;

  if (!postgrestUrl) {
    throw new Error("NEXT_PUBLIC_POSTGREST_URL is not configured");
  }

  if (!serviceRoleKey) {
    throw new Error("POSTGREST_SERVICE_ROLE_KEY is not configured");
  }

  return new PostgrestClient(postgrestUrl, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
    },
  });
}
