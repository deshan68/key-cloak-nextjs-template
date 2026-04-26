/**
 * Dashboard API Validation Schemas
 * Zod schemas for validating dashboard API responses
 */
import { z } from "zod";

/**
 * Schema for dashboard statistics
 */
export const DashboardStatsSchema = z.object({
  total_users: z.number().int().nonnegative("Must be non-negative"),
  total_admins: z.number().int().nonnegative("Must be non-negative"),
  new_users_today: z.number().int().nonnegative("Must be non-negative"),
  active_sessions: z.number().int().nonnegative("Must be non-negative"),
});

export type ValidatedDashboardStats = z.infer<typeof DashboardStatsSchema>;

/**
 * Schema for a single dashboard activity
 */
export const DashboardActivitySchema = z.object({
  id: z.string().uuid("Invalid activity ID"),
  user_id: z.string().uuid("Invalid user ID"),
  action: z.string(),
  resource: z.string(),
  timestamp: z.string().datetime("Invalid datetime"),
  user_email: z.string().email("Invalid email"),
});

export type ValidatedDashboardActivity = z.infer<
  typeof DashboardActivitySchema
>;

/**
 * Schema for dashboard overview
 * Combines stats and recent activities
 */
export const DashboardOverviewSchema = z.object({
  stats: DashboardStatsSchema,
  recent_activities: z.array(DashboardActivitySchema),
});

export type ValidatedDashboardOverview = z.infer<
  typeof DashboardOverviewSchema
>;

/**
 * Schema for dashboard activity filters
 */
export const DashboardActivityFiltersSchema = z.object({
  limit: z.number().int().positive("Limit must be positive").optional(),
  offset: z.number().int().nonnegative("Offset must be non-negative").optional(),
});

export type ValidatedDashboardActivityFilters = z.infer<
  typeof DashboardActivityFiltersSchema
>;

/**
 * Validation utility functions
 */
export const DashboardValidators = {
  /**
   * Validate dashboard statistics response
   */
  validateStats: (data: unknown) => {
    try {
      return {
        success: true,
        data: DashboardStatsSchema.parse(data),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: error.issues,
          message: "Dashboard stats validation failed",
        };
      }
      throw error;
    }
  },

  /**
   * Validate dashboard activity
   */
  validateActivity: (data: unknown) => {
    try {
      return {
        success: true,
        data: DashboardActivitySchema.parse(data),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: error.issues,
          message: "Dashboard activity validation failed",
        };
      }
      throw error;
    }
  },

  /**
   * Validate dashboard overview response
   */
  validateOverview: (data: unknown) => {
    try {
      return {
        success: true,
        data: DashboardOverviewSchema.parse(data),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: error.issues,
          message: "Dashboard overview validation failed",
        };
      }
      throw error;
    }
  },

  /**
   * Validate activity filters
   */
  validateActivityFilters: (data: unknown) => {
    try {
      return {
        success: true,
        data: DashboardActivityFiltersSchema.parse(data),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: error.issues,
          message: "Activity filters validation failed",
        };
      }
      throw error;
    }
  },
};

/**
 * Safe parsing functions (don't throw, return results)
 */
export const DashboardSafeValidators = {
  safeParseStats: (data: unknown) => DashboardStatsSchema.safeParse(data),
  safeParseActivity: (data: unknown) => DashboardActivitySchema.safeParse(data),
  safeParseOverview: (data: unknown) => DashboardOverviewSchema.safeParse(data),
  safeParseActivityFilters: (data: unknown) =>
    DashboardActivityFiltersSchema.safeParse(data),
};
