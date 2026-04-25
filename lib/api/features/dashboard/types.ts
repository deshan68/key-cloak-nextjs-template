/**
 * Dashboard API Types
 * All type definitions related to dashboard operations
 */

export interface DashboardStats {
  total_users: number;
  total_admins: number;
  new_users_today: number;
  active_sessions: number;
}

export interface DashboardActivity {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  timestamp: string;
  user_email: string;
}

export interface DashboardOverview {
  stats: DashboardStats;
  recent_activities: DashboardActivity[];
}

export interface DashboardActivityFilters {
  limit?: number;
  offset?: number;
}
