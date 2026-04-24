"use client";

import { useSession } from "next-auth/react";
import type { PostgrestClient } from "@supabase/postgrest-js";
import { useMemo } from "react";
import { ClientFactory } from "../clients";

/**
 * Hook to get Postgrest client with authenticated session
 * Automatically uses access token from NextAuth session
 * Returns null if not authenticated
 */
export function usePostgrestClient(): PostgrestClient | null {
  const { data: session } = useSession();
  const accessToken = session?.access_token;

  const client = useMemo(() => {
    if (!accessToken) {
      return null;
    }

    return ClientFactory.getPostgrestClient(accessToken);
  }, [accessToken]);

  return client;
}

/**
 * Hook to check if Postgrest client is ready
 */
export function usePostgrestClientReady(): boolean {
  const client = usePostgrestClient();
  return client !== null;
}
