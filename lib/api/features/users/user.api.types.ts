/**
 * API type exports
 * Re-exports types from user.types.ts for API layer usage
 */
import type { userService } from ".";
import type {
  ApiUserType,
  CreateUserRequestType,
  UpdateUserRequestType,
  UserFiltersType,
  UsersListResponseType,
} from "./user.schemas";

// API User type - shape of data from backend
export type ApiUser = ApiUserType;

// Request types
export type CreateUserRequest = CreateUserRequestType;
export type UpdateUserRequest = UpdateUserRequestType;

// Response types
export type UsersListResponse = UsersListResponseType;

// Filter types
export type UserFilters = UserFiltersType;

// Additional utility types
export type UserRole = string;

// Type for update mutations
export type UpdateUserVariables = {
  userId: string;
  updates: UpdateUserRequest;
};

export type DeleteUserResult = Awaited<
  ReturnType<typeof userService.deleteUser>
>;
