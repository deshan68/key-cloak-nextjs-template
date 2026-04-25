/**
 * Dashboard API service functions
 */
import type { PostgrestClient } from "@supabase/postgrest-js";
import type { DashboardStats, DashboardActivity, DashboardOverview, DashboardActivityFilters } from "./types";

export const dashboardService = {
  /**
   * Fetch dashboard statistics
   */
  getStats: async (apiClient: PostgrestClient): Promise<DashboardStats> => {
    const { data, error } = await apiClient.from("dashboard_stats").select("*").single();
    if (error) {
      throw error;
    }
    return data;
  },

  /**
   * Fetch dashboard overview (stats + activities)
   */
  getOverview: async (apiClient: PostgrestClient): Promise<DashboardOverview> => {
    const stats = await dashboardService.getStats(apiClient);
    const activities = await dashboardService.getActivities(apiClient);
    return { stats, recent_activities: activities };
  },

  /**
   * Fetch recent activities with pagination
   */
  getActivities: async (
    apiClient: PostgrestClient,
    params?: DashboardActivityFilters
  ): Promise<DashboardActivity[]> => {
    let query = apiClient.from("activities").select("*");
    if (params?.limit) {
      query = query.limit(params.limit);
    }
    if (params?.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
    }
    const { data, error } = await query;
    if (error) {
      throw error;
    }
    return data || [];
  },
};
