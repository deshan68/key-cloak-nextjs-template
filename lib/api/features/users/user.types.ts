/**
 * User Type Definitions
 * All types are inferred from Zod schemas in user.schemas.ts
 * This ensures types always match the validation logic
 */
import type { UserType } from "./user.schemas";

// Domain User type - shape after mapping to application format
export type User = UserType;
