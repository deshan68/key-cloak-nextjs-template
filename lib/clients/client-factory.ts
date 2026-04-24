import type { PostgrestClient } from "@supabase/postgrest-js";
import {
  createPostgrestClient,
  createServerPostgrestClient,
} from "./postgrest-client";

/**
 * Client factory for managing multiple service clients
 * Follows the factory pattern for centralized client creation and configuration
 */
export class ClientFactory {
  private static postgrestClient: PostgrestClient | null = null;
  private static serverPostgrestClient: PostgrestClient | null = null;

  /**
   * Get or create Postgrest client (client-side)
   * Should be called with access token from session
   */
  static getPostgrestClient(bearerToken?: string): PostgrestClient {
    if (!this.postgrestClient) {
      this.postgrestClient = createPostgrestClient(bearerToken);
    }
    return this.postgrestClient;
  }

  /**
   * Get or create server-side Postgrest client
   * Uses service role key - only for server-side operations
   */
  static getServerPostgrestClient(): PostgrestClient {
    if (!this.serverPostgrestClient) {
      this.serverPostgrestClient = createServerPostgrestClient();
    }
    return this.serverPostgrestClient;
  }

  /**
   * Reset clients (useful for testing or re-authentication)
   */
  static reset(): void {
    this.postgrestClient = null;
    this.serverPostgrestClient = null;
  }
}
