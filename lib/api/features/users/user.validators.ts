/**
 * User API Validation Schemas
 * Zod schemas for validating API responses
 */
import { z } from "zod";

/**
 * Schema for a single user from API
 * Validates the shape of user data coming from the server
 */
export const ApiUserSchema = z.object({
  id: z.string().uuid("Invalid user ID format"),
  user_name: z.string().min(1, "Username is required"),
  name: z.string().min(1, "Name is required"),
  dp_url: z.string().url("Invalid URL format").nullable(),
  email: z.string().email("Invalid email format"),
  team_id: z.string().uuid("Invalid team ID format"),
  role: z.string().min(1, "Role is required"),
  is_active: z.boolean(),
  is_verified: z.boolean(),
});

export type ValidatedApiUser = z.infer<typeof ApiUserSchema>;
// Export as primary API user type
export type ApiUser = ValidatedApiUser;

/**
 * Schema for a single user (application format)
 * Used internally after mapping from API format
 */
export const UserSchema = z.object({
  id: z.string().uuid("Invalid user ID"),
  userName: z.string().min(1, "Username is required"),
  name: z.string().min(1, "Name is required"),
  dpUrl: z.string().url("Invalid URL format").nullable(),
  email: z.string().email("Invalid email"),
  teamId: z.string().uuid("Invalid team ID format"),
  role: z.string().min(1, "Role is required"),
  isActive: z.boolean(),
  isVerified: z.boolean(),
});

export type ValidatedUser = z.infer<typeof UserSchema>;
// Export User type as primary domain model
export type User = ValidatedUser;

/**
 * Schema for users list response
 * Validates the complete list response structure
 */
export const UsersListResponseSchema = z.object({
  data: z.array(UserSchema),
  total: z.number().int().nonnegative("Total must be non-negative"),
  page: z.number().int().positive("Page must be positive"),
  limit: z.number().int().positive("Limit must be positive"),
});

export type ValidatedUsersListResponse = z.infer<
  typeof UsersListResponseSchema
>;
// Export as primary response type
export type UsersListResponse = ValidatedUsersListResponse;

/**
 * Schema for create user request
 * Validates user creation payload
 */
export const CreateUserRequestSchema = z.object({
  user_name: z.string().min(1, "Username is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  team_id: z.string().uuid("Invalid team ID format"),
  role: z.string().min(1, "Role is required"),
  dp_url: z.string().url("Invalid URL format").nullable().optional(),
  is_active: z.boolean().optional(),
  is_verified: z.boolean().optional(),
});

export type ValidatedCreateUserRequest = z.infer<
  typeof CreateUserRequestSchema
>;
// Export as primary API request type
export type CreateUserRequest = ValidatedCreateUserRequest;

/**
 * Schema for update user request
 * All fields are optional
 */
export const UpdateUserRequestSchema = z.object({
  user_name: z.string().min(1, "Username must not be empty").optional(),
  name: z.string().min(1, "Name must not be empty").optional(),
  email: z.string().email("Invalid email format").optional(),
  team_id: z.string().uuid("Invalid team ID format").optional(),
  role: z.string().min(1, "Role must not be empty").optional(),
  dp_url: z.string().url("Invalid URL format").nullable().optional(),
  is_active: z.boolean().optional(),
  is_verified: z.boolean().optional(),
});

export type ValidatedUpdateUserRequest = z.infer<
  typeof UpdateUserRequestSchema
>;
// Export as primary API request type
export type UpdateUserRequest = ValidatedUpdateUserRequest;

/**
 * Schema for user filters
 * Validates pagination and filter parameters
 */
export const UserFiltersSchema = z.object({
  page: z.number().int().positive("Page must be positive").optional(),
  limit: z.number().int().positive("Limit must be positive").optional(),
  role: z.string().optional(),
  search: z.string().optional(),
  team_id: z.string().uuid("Invalid team ID format").optional(),
  is_active: z.boolean().optional(),
  is_verified: z.boolean().optional(),
});

export type ValidatedUserFilters = z.infer<typeof UserFiltersSchema>;
// Export as primary filter type
export type UserFilters = ValidatedUserFilters;

/**
 * Validation utility functions
 */
export const UserValidators = {
  /**
   * Validate a single API user response
   */
  validateApiUser: (data: unknown) => {
    try {
      return {
        success: true,
        data: ApiUserSchema.parse(data),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: error.issues,
          message: "User validation failed",
        };
      }
      throw error;
    }
  },

  /**
   * Validate a user list response
   */
  validateUsersList: (data: unknown) => {
    try {
      return {
        success: true,
        data: UsersListResponseSchema.parse(data),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: error.issues,
          message: "Users list validation failed",
        };
      }
      throw error;
    }
  },

  /**
   * Validate create user request
   */
  validateCreateUserRequest: (data: unknown) => {
    try {
      return {
        success: true,
        data: CreateUserRequestSchema.parse(data),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: error.issues,
          message: "Create user request validation failed",
        };
      }
      throw error;
    }
  },

  /**
   * Validate update user request
   */
  validateUpdateUserRequest: (data: unknown) => {
    try {
      return {
        success: true,
        data: UpdateUserRequestSchema.parse(data),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: error.issues,
          message: "Update user request validation failed",
        };
      }
      throw error;
    }
  },
};

/**
 * Safe parsing functions (don't throw, return results)
 */
export const UserSafeValidators = {
  safeParseUser: (data: unknown) => ApiUserSchema.safeParse(data),
  safeParseUsersList: (data: unknown) => UsersListResponseSchema.safeParse(data),
  safeParseCreateRequest: (data: unknown) =>
    CreateUserRequestSchema.safeParse(data),
  safeParseUpdateRequest: (data: unknown) =>
    UpdateUserRequestSchema.safeParse(data),
};
