/**
 * Environment Configuration
 * Type-safe environment variables with validation
 * Use this for environment-dependent constants and configuration
 */

import { z } from "zod";

// ============================================
// Environment Variable Schema (Validation)
// ============================================
const EnvironmentSchema = z.object({
  // Application
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  
  // Supabase/Postgrest
  NEXT_PUBLIC_POSTGREST_URL: z.string().url("Invalid Postgrest URL"),
  NEXT_PUBLIC_POSTGREST_ANON_KEY: z.string().min(1, "Postgrest key is required"),
  
  // NextAuth
  NEXTAUTH_SECRET: z.string().min(1, "NextAuth secret is required"),
  NEXTAUTH_URL: z.string().url("Invalid NextAuth URL").optional(),
  
  // Keycloak (if using)
  NEXT_PUBLIC_KEYCLOAK_ISSUER: z.string().url("Invalid Keycloak issuer URL").optional(),
  NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: z.string().optional(),
  KEYCLOAK_CLIENT_SECRET: z.string().optional(),
  
  // API Configuration
  NEXT_PUBLIC_API_TIMEOUT: z.coerce.number().default(30000),
  NEXT_PUBLIC_API_RETRY_ATTEMPTS: z.coerce.number().default(3),
});

type EnvironmentVariables = z.infer<typeof EnvironmentSchema>;

// ============================================
// Parse and Validate Environment Variables
// ============================================
function parseEnvironment(): EnvironmentVariables {
  const env = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_POSTGREST_URL: process.env.NEXT_PUBLIC_POSTGREST_URL,
    NEXT_PUBLIC_POSTGREST_ANON_KEY: process.env.NEXT_PUBLIC_POSTGREST_ANON_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_KEYCLOAK_ISSUER: process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER,
    NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
    KEYCLOAK_CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET,
    NEXT_PUBLIC_API_TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT,
    NEXT_PUBLIC_API_RETRY_ATTEMPTS: process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS,
  };

  const result = EnvironmentSchema.safeParse(env);

  if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.format());
    throw new Error("Invalid environment variables. Check console for details.");
  }

  return result.data;
}

// ============================================
// Singleton Environment Configuration
// ============================================
export const env = parseEnvironment();

// ============================================
// Type-Safe Environment Configuration Export
// ============================================
export type Environment = EnvironmentVariables;

// ============================================
// Helper Functions for Environment-Specific Logic
// ============================================
export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";

/**
 * Example usage in other files:
 * 
 * import { env, isDevelopment, isProduction } from "@/lib/config/env";
 * 
 * const apiClient = createClient({
 *   url: env.NEXT_PUBLIC_POSTGREST_URL,
 *   apiKey: env.NEXT_PUBLIC_POSTGREST_ANON_KEY,
 *   timeout: env.NEXT_PUBLIC_API_TIMEOUT,
 * });
 * 
 * if (isDevelopment) {
 *   console.log("Running in development mode");
 * }
 */
