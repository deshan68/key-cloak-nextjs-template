/**
 * Dashboard Query Hooks
 */
import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/config/query-keys";
import { dashboardService } from "./service";
import type { DashboardActivityFilters } from "./types";
import { usePostgrestClient } from "@/lib/hooks/usePostgrestClient";

/**
 * Hook to fetch dashboard statistics
 */
export function useGetDashboardStats(
  options?: Omit<UseQueryOptions, "queryKey" | "queryFn">,
) {
  const apiClient = usePostgrestClient();

  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: async () => {
      if (!apiClient) {
        throw new Error("API client not available");
      }
      return dashboardService.getStats(apiClient);
    },
    enabled: !!apiClient,
    ...options,
  });
}

/**
 * Hook to fetch dashboard overview
 */
export function useGetDashboardOverview(
  options?: Omit<UseQueryOptions, "queryKey" | "queryFn">,
) {
  const apiClient = usePostgrestClient();

  return useQuery({
    queryKey: queryKeys.dashboard.overview(),
    queryFn: async () => {
      if (!apiClient) {
        throw new Error("API client not available");
      }
      return dashboardService.getOverview(apiClient);
    },
    enabled: !!apiClient,
    ...options,
  });
}

/**
 * Hook to fetch dashboard activities
 */
export function useGetDashboardActivities(
  params?: DashboardActivityFilters,
  options?: Omit<UseQueryOptions, "queryKey" | "queryFn">,
) {
  const apiClient = usePostgrestClient();

  return useQuery({
    queryKey: queryKeys.dashboard.activity(params?.limit, params?.offset),
    queryFn: async () => {
      if (!apiClient) {
        throw new Error("API client not available");
      }
      return dashboardService.getActivities(apiClient, params);
    },
    enabled: !!apiClient,
    ...options,
  });
}
