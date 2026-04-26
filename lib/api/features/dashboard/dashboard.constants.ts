/**
 * Dashboard Feature Constants
 * Constants specific to the dashboard feature
 */

// ============================================
// Dashboard Sections
// ============================================
export const DASHBOARD_SECTIONS = {
  overview: "overview",
  stats: "stats",
  activities: "activities",
  recentUsers: "recent_users",
} as const;

// ============================================
// Activity Types
// ============================================
export const ACTIVITY_TYPES = {
  userCreated: "user_created",
  userUpdated: "user_updated",
  userDeleted: "user_deleted",
  userLogin: "user_login",
  userLogout: "user_logout",
  settingsChanged: "settings_changed",
} as const;

export const ACTIVITY_TYPE_LABELS = {
  [ACTIVITY_TYPES.userCreated]: "User Created",
  [ACTIVITY_TYPES.userUpdated]: "User Updated",
  [ACTIVITY_TYPES.userDeleted]: "User Deleted",
  [ACTIVITY_TYPES.userLogin]: "User Login",
  [ACTIVITY_TYPES.userLogout]: "User Logout",
  [ACTIVITY_TYPES.settingsChanged]: "Settings Changed",
} as const;

// ============================================
// Dashboard Pagination
// ============================================
export const DASHBOARD_PAGINATION = {
  activitiesLimit: 10,
  recentUsersLimit: 5,
  defaultOffset: 0,
} as const;

// ============================================
// Dashboard Refresh Intervals
// ============================================
export const DASHBOARD_REFRESH = {
  statsInterval: 5 * 60 * 1000, // 5 minutes
  activitiesInterval: 2 * 60 * 1000, // 2 minutes
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
} as const;

// ============================================
// Dashboard Query Configuration
// ============================================
export const DASHBOARD_QUERY_CONFIG = {
  staleTime: 2 * 60 * 1000, // 2 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  retry: 2,
  retryDelay: 1000,
} as const;

// ============================================
// Dashboard Messages
// ============================================
export const DASHBOARD_MESSAGES = {
  // Service layer errors
  serviceErrors: {
    apiClientNotAvailable: "API client not available.",
    invalidStatsData: "Invalid dashboard statistics data received from server.",
    invalidActivityData: "Invalid activity data received from server.",
  },
  // User-facing errors
  errors: {
    fetchStatsFailed: "Failed to fetch dashboard statistics.",
    fetchActivitiesFailed: "Failed to fetch recent activities.",
    fetchOverviewFailed: "Failed to fetch dashboard overview.",
  },
  // Empty state messages
  empty: {
    noActivities: "No recent activities",
    noUsers: "No users found",
  },
} as const;

// ============================================
// Dashboard Metrics
// ============================================
export const DASHBOARD_METRICS = {
  totalUsers: "total_users",
  activeUsers: "active_users",
  newUsersThisMonth: "new_users_this_month",
  systemHealth: "system_health",
} as const;
