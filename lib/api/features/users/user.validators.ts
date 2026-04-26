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
  email: z.string().email("Invalid email format"),
  first_name: z.string(),
  last_name: z.string(),
  role: z.enum(["app_user", "app_admin"]),
  created_at: z.string().datetime("Invalid datetime format"),
  updated_at: z.string().datetime("Invalid datetime format"),
});

export type ValidatedApiUser = z.infer<typeof ApiUserSchema>;

/**
 * Schema for a single user (application format)
 * Used internally after mapping from API format
 */
export const UserSchema = z.object({
  id: z.string().uuid("Invalid user ID"),
  email: z.string().email("Invalid email"),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(["app_user", "app_admin"]),
  createdAt: z.string().datetime("Invalid datetime"),
  updatedAt: z.string().datetime("Invalid datetime"),
});

export type ValidatedUser = z.infer<typeof UserSchema>;

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

/**
 * Schema for create user request
 * Validates user creation payload
 */
export const CreateUserRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  role: z.enum(["app_user", "app_admin"]),
});

export type ValidatedCreateUserRequest = z.infer<
  typeof CreateUserRequestSchema
>;

/**
 * Schema for update user request
 * All fields are optional
 */
export const UpdateUserRequestSchema = z.object({
  first_name: z.string().min(1, "First name must not be empty").optional(),
  last_name: z.string().min(1, "Last name must not be empty").optional(),
  role: z.enum(["app_user", "app_admin"]).optional(),
});

export type ValidatedUpdateUserRequest = z.infer<
  typeof UpdateUserRequestSchema
>;

/**
 * Schema for user filters
 * Validates pagination and filter parameters
 */
export const UserFiltersSchema = z.object({
  page: z.number().int().positive("Page must be positive").optional(),
  limit: z.number().int().positive("Limit must be positive").optional(),
  role: z.enum(["app_user", "app_admin"]).optional(),
  search: z.string().optional(),
});

export type ValidatedUserFilters = z.infer<typeof UserFiltersSchema>;

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
