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

export const userService = {
  /**
   * Fetch list of users with pagination and filters
   */
  getUsers: async (
    apiClient: PostgrestClient,
    params?: UserFilters,
  ): Promise<UsersListResponse> => {
    const query = apiClient.from("users").select("*");

    if (params?.page && params?.limit) {
      const from = (params.page - 1) * params.limit;
      query.range(from, from + params.limit - 1);
    }

    const { data, error } = await query;
    if (error) {
      throw error;
    }
    return {
      data: data || [],
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
    return data;
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
    return newUser;
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
    return updatedUser;
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
