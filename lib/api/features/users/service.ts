/**
 * User API service functions
 * Contains all API calls related to user operations
 */
import type { PostgrestClient } from "@supabase/postgrest-js";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  UsersListResponse,
  UserFilters,
} from "./user.api.types";
import type { User } from "./user.types";
import { userMapper } from "./user.mapper";
import { UserSafeValidators } from "./user.validators";

export const userService = {
  /**
   * Fetch list of users with pagination and filters
   */
  getUsers: async (
    apiClient: PostgrestClient,
    params?: UserFilters,
  ): Promise<UsersListResponse> => {
    const query = apiClient.from("app_user").select("*");

    if (params?.page && params?.limit) {
      const from = (params.page - 1) * params.limit;
      query.range(from, from + params.limit - 1);
    }

    const { data, error } = await query;
    if (error) {
      throw error;
    }

    // Validate API response data
    if (data && Array.isArray(data)) {
      for (const item of data) {
        const validation = UserSafeValidators.safeParseUser(item);
        if (!validation.success) {
          console.error("User validation error:", validation.error);
          throw new Error(`Invalid user data: ${validation.error.message}`);
        }
      }
    }

    const mappedData = (data || []).map((user) => userMapper.toDomain(user));

    return {
      data: mappedData,
      total: (data || []).length,
      page: params?.page || 1,
      limit: params?.limit || 10,
    };
  },

  /**
   * Fetch single user by ID
   */
  getUserById: async (
    apiClient: PostgrestClient,
    userId: string,
  ): Promise<User> => {
    const { data, error } = await apiClient
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) {
      throw error;
    }

    // Validate API response
    const validation = UserSafeValidators.safeParseUser(data);
    if (!validation.success) {
      console.error("User validation error:", validation.error);
      throw new Error(`Invalid user data: ${validation.error.message}`);
    }

    return userMapper.toDomain(data);
  },

  /**
   * Create a new user
   */
  createUser: async (
    apiClient: PostgrestClient,
    data: CreateUserRequest,
  ): Promise<User> => {
    const { data: newUser, error } = await apiClient
      .from("users")
      .insert([data])
      .select()
      .single();
    if (error) {
      throw error;
    }

    // Validate API response
    const validation = UserSafeValidators.safeParseUser(newUser);
    if (!validation.success) {
      console.error("User validation error:", validation.error);
      throw new Error(`Invalid user data: ${validation.error.message}`);
    }

    return userMapper.toDomain(newUser);
  },

  /**
   * Update an existing user
   */
  updateUser: async (
    apiClient: PostgrestClient,
    userId: string,
    data: UpdateUserRequest,
  ): Promise<User> => {
    const { data: updatedUser, error } = await apiClient
      .from("users")
      .update(data)
      .eq("id", userId)
      .select()
      .single();
    if (error) {
      throw error;
    }

    // Validate API response
    const validation = UserSafeValidators.safeParseUser(updatedUser);
    if (!validation.success) {
      console.error("User validation error:", validation.error);
      throw new Error(`Invalid user data: ${validation.error.message}`);
    }

    return userMapper.toDomain(updatedUser);
  },

  /**
   * Delete a user
   */
  deleteUser: async (
    apiClient: PostgrestClient,
    userId: string,
  ): Promise<void> => {
    const { error } = await apiClient.from("users").delete().eq("id", userId);
    if (error) {
      throw error;
    }
  },
};
