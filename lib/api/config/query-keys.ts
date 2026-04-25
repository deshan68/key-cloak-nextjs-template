/**
 * Query Keys Factory
 * Centralized query key management using TanStack Query conventions
 * Reference: https://tanstack.com/query/latest/docs/react/guides/important-defaults
 */

export const queryKeys = {
  // Users feature
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters?: { role?: string; search?: string }) =>
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (userId: string) =>
      [...queryKeys.users.details(), userId] as const,
    infinite: () => [...queryKeys.users.all, "infinite"] as const,
    infiniteList: (filters?: { role?: string; search?: string }) =>
      [...queryKeys.users.infinite(), filters] as const,
  },

  // Dashboard feature
  dashboard: {
    all: ["dashboard"] as const,
    stats: () => [...queryKeys.dashboard.all, "stats"] as const,
    overview: () => [...queryKeys.dashboard.all, "overview"] as const,
    activities: () => [...queryKeys.dashboard.all, "activities"] as const,
    activity: (limit?: number, offset?: number) =>
      [...queryKeys.dashboard.activities(), { limit, offset }] as const,
  },

  // Profile feature
  profile: {
    all: ["profile"] as const,
    current: () => [...queryKeys.profile.all, "current"] as const,
    settings: () => [...queryKeys.profile.all, "settings"] as const,
  },
};
