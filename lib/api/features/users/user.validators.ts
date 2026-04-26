/**
 * User Validation Functions
 * Uses Zod schemas from user.schemas.ts to validate data
 * Provides both throwing and safe parsing utilities
 */
import { z } from "zod";
import {
  ApiUserSchema,
  UsersListResponseSchema,
  CreateUserRequestSchema,
  UpdateUserRequestSchema,
} from "./user.schemas";

/**
 * Validation utility functions
 * Throws on validation errors
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
 * Safe parsing functions
 * Don't throw, return results with success flag
 */
export const UserSafeValidators = {
  safeParseUser: (data: unknown) => ApiUserSchema.safeParse(data),
  safeParseUsersList: (data: unknown) => UsersListResponseSchema.safeParse(data),
  safeParseCreateRequest: (data: unknown) =>
    CreateUserRequestSchema.safeParse(data),
  safeParseUpdateRequest: (data: unknown) =>
    UpdateUserRequestSchema.safeParse(data),
};

// Re-export schemas for external use if needed
export {
  ApiUserSchema,
  UserSchema,
  UsersListResponseSchema,
  CreateUserRequestSchema,
  UpdateUserRequestSchema,
  UserFiltersSchema,
} from "./user.schemas";
