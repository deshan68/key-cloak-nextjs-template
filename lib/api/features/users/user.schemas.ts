/**
 * User Zod Schemas
 * Contains all Zod schema definitions for user-related data
 * These schemas serve as the single source of truth for validation
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
  dp_url: z.url("Invalid URL format").nullable(),
  email: z.email("Invalid email format"),
  team_id: z.uuid("Invalid team ID format"),
  role: z.string().min(1, "Role is required"),
  is_active: z.boolean(),
  is_verified: z.boolean(),
});

// Inferred types from schemas
export type ApiUserType = z.infer<typeof ApiUserSchema>;

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

export type UserType = z.infer<typeof UserSchema>;

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

export type UsersListResponseType = z.infer<typeof UsersListResponseSchema>;

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

export type CreateUserRequestType = z.infer<typeof CreateUserRequestSchema>;

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

export type UpdateUserRequestType = z.infer<typeof UpdateUserRequestSchema>;

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

export type UserFiltersType = z.infer<typeof UserFiltersSchema>;
