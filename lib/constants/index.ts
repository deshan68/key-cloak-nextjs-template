/**
 * Constants Index
 * Central export point for all constants in the application
 * Supports both global and feature-specific constant imports
 */

// ============================================
// Global Constants
// ============================================
export * from "./global";

// ============================================
// How to use Constants:
// ============================================
/*
 * 1. GLOBAL CONSTANTS (shared across the app):
 *    import { APP_CONFIG, API_CONFIG, ROUTES, USER_ROLES } from "@/lib/constants";
 *
 * 2. FEATURE-SPECIFIC CONSTANTS (scoped to a feature):
 *    import { USER_ROLES_CONFIG, USERS_MESSAGES } from "@/lib/api/features/users/user.constants";
 *    import { ACTIVITY_TYPES, DASHBOARD_METRICS } from "@/lib/api/features/dashboard/dashboard.constants";
 *
 * 3. MIXING IMPORTS (when needed):
 *    import { APP_CONFIG } from "@/lib/constants";
 *    import { USER_ROLES_CONFIG } from "@/lib/api/features/users/user.constants";
 *
 * BEST PRACTICES:
 * - Use 'as const' for immutability and type inference
 * - Group related constants together
 * - Use consistent naming: SCREAMING_SNAKE_CASE
 * - Add JSDoc comments explaining purpose
 * - Feature constants should live near the feature code
 * - Global constants should be in lib/constants/
 * - Use enums or objects instead of string literals
 * - Type-safe: Use typeof for extracting types
 */

// Type extraction examples:
// type AppConfig = typeof APP_CONFIG;
// type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
