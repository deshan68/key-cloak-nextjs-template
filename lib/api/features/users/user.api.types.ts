/**
 * API type exports
 * All types are now inferred from Zod schemas in validators.ts
 * This ensures single source of truth for all user-related types
 */
import type { UpdateUserRequest } from "./user.validators";
import type { userService } from ".";

// Re-export types from validators
export type {
  ApiUser,
  CreateUserRequest,
  UpdateUserRequest,
  UsersListResponse,
  UserFilters,
  User,
} from "./user.validators";

export type UpdateUserVariables = {
  userId: string;
  updates: UpdateUserRequest;
};
export type DeleteUserResult = Awaited<
  ReturnType<typeof userService.deleteUser>
>;
