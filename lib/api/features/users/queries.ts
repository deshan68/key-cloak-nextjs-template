/**
 * User Query Hooks
 * React Query hooks for user queries (read operations)
 */
import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/config/query-keys";
import { userService } from "./service";
import type { UserFilters } from "./user.api.types";
import { usePostgrestClient } from "@/lib/hooks/usePostgrestClient";

/**
 * Hook to fetch paginated list of users
 */
export function useGetUsers(
  params?: UserFilters,
  options?: Omit<UseQueryOptions, "queryKey" | "queryFn">,
) {
  const apiClient = usePostgrestClient();

  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: async () => {
      if (!apiClient) {
        throw new Error("API client not available");
      }
      return userService.getUsers(apiClient, params);
    },
    enabled: !!apiClient,
    ...options,
  });
}

/**
 * Hook to fetch a single user by ID
 */
export function useGetUserById(
  userId: string | undefined,
  options?: Omit<UseQueryOptions, "queryKey" | "queryFn">,
) {
  const apiClient = usePostgrestClient();

  return useQuery({
    queryKey: queryKeys.users.detail(userId || ""),
    queryFn: async () => {
      if (!apiClient || !userId) {
        throw new Error("API client or userId not available");
      }
      return userService.getUserById(apiClient, userId);
    },
    enabled: !!apiClient && !!userId,
    ...options,
  });
}
