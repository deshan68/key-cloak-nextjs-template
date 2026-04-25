/**
 * Global Type Definitions
 * Application-wide types organized by domain
 */

// Dashboard Domain
export type {
  DashboardStats,
  DashboardActivity,
  DashboardOverview,
  DashboardActivityFilters,
} from "@/lib/api/features/dashboard/types";

// API Common
export type {
  ApiResponse,
  ApiPaginationParams,
  ApiPaginatedResponse,
  ApiError,
  SortOrder,
  SortParams,
} from "@/lib/api/types";
