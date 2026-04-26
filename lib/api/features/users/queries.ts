/**
 * User Query Hooks
 * React Query hooks for user queries (read operations)
 */
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/config/query-keys";
import { userService } from "./service";
import { usePostgrestClient } from "@/lib/hooks/usePostgrestClient";
import { USERS_MESSAGES, USERS_QUERY_CONFIG } from "./user.constants";
import type { UseQueryOptionsWithoutKeyAndFn } from "@/lib/api/types/query-options";
import type { UserFilters, UsersListResponse } from "./user.api.types";
import type { User } from "./user.types";

/**
 * Hook to fetch paginated list of users
 */
export function useGetUsers(
  params?: UserFilters,
  options?: UseQueryOptionsWithoutKeyAndFn<UsersListResponse>,
) {
  const apiClient = usePostgrestClient();

  return useQuery<UsersListResponse, Error>({
    queryKey: queryKeys.users.list(params),
    queryFn: async () => {
      if (!apiClient) {
        throw new Error(USERS_MESSAGES.serviceErrors.apiClientNotAvailable);
      }
      return userService.getUsers(apiClient, params);
    },
    enabled: !!apiClient,
    ...USERS_QUERY_CONFIG,
    ...options,
  });
}

/**
 * Hook to fetch a single user by ID
 */
export function useGetUserById(
  userId: string | undefined,
  options?: UseQueryOptionsWithoutKeyAndFn<User>,
) {
  const apiClient = usePostgrestClient();

  return useQuery<User, Error>({
    queryKey: queryKeys.users.detail(userId || ""),
    queryFn: async () => {
      if (!apiClient) {
        throw new Error(USERS_MESSAGES.serviceErrors.apiClientNotAvailable);
      }
      if (!userId) {
        throw new Error(USERS_MESSAGES.serviceErrors.userIdNotAvailable);
      }
      return userService.getUserById(apiClient, userId);
    },
    enabled: !!apiClient && !!userId,
    ...USERS_QUERY_CONFIG,
    ...options,
  });
}
