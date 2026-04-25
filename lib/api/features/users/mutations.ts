/**
 * User Mutation Hooks
 * React Query hooks for user mutations (write operations)
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/config/query-keys";
import { userService } from "./service";
import { usePostgrestClient } from "@/lib/hooks/usePostgrestClient";
import type { User } from "./user.types";
import type {
  CreateUserRequest,
  DeleteUserResult,
  UpdateUserRequest,
  UpdateUserVariables,
} from "./user.api.types";

/**
 * Hook to create a new user
 */
export function useCreateUser(
  options?: Omit<
    UseMutationOptions<User, Error, CreateUserRequest>,
    "mutationFn"
  >,
) {
  const apiClient = usePostgrestClient();
  const queryClient = useQueryClient();

  return useMutation<User, Error, CreateUserRequest>({
    mutationFn: async (data: CreateUserRequest) => {
      if (!apiClient) {
        throw new Error("API client not available");
      }
      return userService.createUser(apiClient, data);
    },
    onSuccess: (newUser) => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.lists(),
      });

      // Optionally add to cache
      queryClient.setQueryData(queryKeys.users.detail(newUser.id), newUser);
    },
    onError: (error) => {
      console.error("Failed to create user:", error);
    },
    ...options,
  });
}

/**
 * Hook to update an existing user
 */
export function useUpdateUser(
  options?: Omit<
    UseMutationOptions<User, Error, UpdateUserVariables>,
    "mutationFn"
  >,
) {
  const apiClient = usePostgrestClient();
  const queryClient = useQueryClient();

  return useMutation<User, Error, UpdateUserVariables>({
    mutationFn: async (data: {
      userId: string;
      updates: UpdateUserRequest;
    }) => {
      if (!apiClient) {
        throw new Error("API client not available");
      }
      return userService.updateUser(apiClient, data.userId, data.updates);
    },
    onSuccess: (updatedUser) => {
      // Update cache for specific user
      queryClient.setQueryData(
        queryKeys.users.detail(updatedUser.id),
        updatedUser,
      );

      // Invalidate list
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.lists(),
      });
    },
    onError: (error) => {
      console.error("Failed to update user:", error);
    },
    ...options,
  });
}

/**
 * Hook to delete a user
 */
export function useDeleteUser(
  options?: Omit<
    UseMutationOptions<DeleteUserResult, Error, string>,
    "mutationFn"
  >,
) {
  const apiClient = usePostgrestClient();
  const queryClient = useQueryClient();

  return useMutation<DeleteUserResult, Error, string>({
    mutationFn: async (userId: string) => {
      if (!apiClient) {
        throw new Error("API client not available");
      }
      return userService.deleteUser(apiClient, userId);
    },
    onSuccess: (_data, userId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: queryKeys.users.detail(userId),
      });

      // Invalidate list
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.lists(),
      });
    },
    onError: (error) => {
      console.error("Failed to delete user:", error);
    },
    ...options,
  });
}
