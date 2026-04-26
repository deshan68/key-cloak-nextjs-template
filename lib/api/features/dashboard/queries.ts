/**
 * Dashboard Query Hooks
 */
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/config/query-keys";
import { dashboardService } from "./service";
import type { DashboardActivityFilters, DashboardStats, DashboardOverview, DashboardActivity } from "./types";
import { usePostgrestClient } from "@/lib/hooks/usePostgrestClient";
import type { UseQueryOptionsWithoutKeyAndFn } from "@/lib/api/types/query-options";

/**
 * Hook to fetch dashboard statistics
 */
export function useGetDashboardStats(
  options?: UseQueryOptionsWithoutKeyAndFn<DashboardStats>,
) {
  const apiClient = usePostgrestClient();

  return useQuery<DashboardStats, Error>({
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
  options?: UseQueryOptionsWithoutKeyAndFn<DashboardOverview>,
) {
  const apiClient = usePostgrestClient();

  return useQuery<DashboardOverview, Error>({
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
  options?: UseQueryOptionsWithoutKeyAndFn<DashboardActivity[]>,
) {
  const apiClient = usePostgrestClient();

  return useQuery<DashboardActivity[], Error>({
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
