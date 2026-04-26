/**
 * API-Specific Type Exports
 * Re-exports main types from user.types.ts + API-specific utility types
 */
import type { userService } from "./service";

// Re-export all main types
export * from "./user.types";

// Additional API-specific utility types
export type DeleteUserResult = Awaited<
  ReturnType<typeof userService.deleteUser>
>;
