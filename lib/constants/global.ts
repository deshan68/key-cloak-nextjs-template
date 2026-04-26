/**
 * Global Application Constants
 * Shared constants used across the entire application
 */

// ============================================
// Application Configuration
// ============================================
export const APP_CONFIG = {
  name: "Key Cloak Next.js Template",
  version: "0.1.0",
  environment: process.env.NODE_ENV || "development",
};

// ============================================
// API Configuration
// ============================================
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_POSTGREST_URL || "",
  timeout: 30000, // ms
  retryAttempts: 3,
  retryDelay: 1000, // ms
} as const;

// ============================================
// Authentication
// ============================================
export const AUTH_CONFIG = {
  providers: {
    keycloak: "keycloak",
    oauth: "oauth",
  },
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours in ms
  refreshThreshold: 5 * 60 * 1000, // 5 minutes in ms
} as const;

// ============================================
// Common User Roles (Global - adjust based on backend)
// ============================================
export const USER_ROLES = {
  admin: "app_admin",
  user: "app_user",
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// ============================================
// Pagination Defaults
// ============================================
export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 10,
  maxLimit: 100,
  limitOptions: [5, 10, 20, 50] as const,
} as const;

// ============================================
// HTTP Status Codes
// ============================================
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// ============================================
// Error Messages (Global)
// ============================================
export const ERROR_MESSAGES = {
  generic: "An unexpected error occurred. Please try again.",
  networkError: "Network error. Please check your connection.",
  unauthorized: "You are not authorized to perform this action.",
  forbidden: "Access denied.",
  notFound: "Resource not found.",
  serverError: "Server error. Please try again later.",
  validationError: "Please check your input and try again.",
} as const;

// ============================================
// Success Messages (Global)
// ============================================
export const SUCCESS_MESSAGES = {
  created: "Created successfully.",
  updated: "Updated successfully.",
  deleted: "Deleted successfully.",
  saved: "Saved successfully.",
} as const;

// ============================================
// Local Storage Keys
// ============================================
export const STORAGE_KEYS = {
  user: "app:user",
  token: "app:token",
  theme: "app:theme",
  preferences: "app:preferences",
} as const;

// ============================================
// Date/Time Formats
// ============================================
export const DATE_FORMATS = {
  date: "MMM dd, yyyy",
  time: "HH:mm:ss",
  dateTime: "MMM dd, yyyy HH:mm:ss",
  iso: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const;

// ============================================
// Navigation Routes
// ============================================
export const ROUTES = {
  home: "/",
  dashboard: "/dashboard",
  auth: "/api/auth",
  createUser: "/create-user",
  notFound: "/404",
} as const;
