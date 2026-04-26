/**
 * User Type Definitions
 * All types are inferred from Zod schemas in user.schemas.ts
 * This ensures types always match the validation logic
 */
import type {
  ApiUserType,
  UserType,
  UsersListResponseType,
  CreateUserRequestType,
  UpdateUserRequestType,
  UserFiltersType,
} from "./user.schemas";

// ============================================
// Domain Types (after mapping to app format)
// ============================================

// Single user in application format
export type User = UserType;

// List response
export type UsersListResponse = UsersListResponseType;

// Create user request
export type CreateUserRequest = CreateUserRequestType;

// Update user request
export type UpdateUserRequest = UpdateUserRequestType;

// User filters/query parameters
export type UserFilters = UserFiltersType;

// Variables for update mutation
export type UpdateUserVariables = {
  userId: string;
  updates: UpdateUserRequest;
};

// ============================================
// API Response Types
// ============================================

// Single user from API (snake_case format)
export type ApiUser = ApiUserType;
