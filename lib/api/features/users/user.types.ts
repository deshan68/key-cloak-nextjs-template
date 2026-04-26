import type { ValidatedApiUser } from "./user.validators";

/**
 * User domain model types are now imported from validators
 * which uses Zod schemas as the single source of truth
 */
export type { User } from "./user.validators";

// Export as primary API user type
export type ApiUser = ValidatedApiUser;

export type UserRole = string;
