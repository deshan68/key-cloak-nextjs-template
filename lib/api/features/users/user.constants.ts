/**
 * Users Feature Constants
 * Constants specific to the users feature
 */

// ============================================
// User Roles
// ============================================
export const USER_ROLES_CONFIG = {
  admin: "app_admin",
  user: "app_user",
} as const;

export type UserRoleType = typeof USER_ROLES_CONFIG[keyof typeof USER_ROLES_CONFIG];

// ============================================
// User Status
// ============================================
export const USER_STATUS = {
  active: true,
  inactive: false,
} as const;

// Map boolean values to labels
export function getUserStatusLabel(isActive: boolean): string {
  return isActive ? "Active" : "Inactive";
}

// ============================================
// User Verification Status
// ============================================
export const USER_VERIFICATION = {
  verified: true,
  unverified: false,
} as const;

// Map boolean values to labels
export function getUserVerificationLabel(isVerified: boolean): string {
  return isVerified ? "Verified" : "Unverified";
}

// ============================================
// User List Pagination
// ============================================
export const USERS_PAGINATION = {
  defaultPage: 1,
  defaultLimit: 10,
  maxLimit: 100,
} as const;

// ============================================
// User Validation Rules
// ============================================
export const USER_VALIDATION = {
  username: {
    minLength: 3,
    maxLength: 50,
  },
  name: {
    minLength: 1,
    maxLength: 100,
  },
  email: {
    minLength: 5,
    maxLength: 255,
  },
} as const;

// ============================================
// User API Endpoints (if needed separately)
// ============================================
export const USERS_API_ENDPOINTS = {
  list: "/app_user",
  create: "/app_user",
  update: (userId: string) => `/app_user?id=eq.${userId}`,
  delete: (userId: string) => `/app_user?id=eq.${userId}`,
  byId: (userId: string) => `/app_user?id=eq.${userId}&select=*`,
} as const;

// ============================================
// User Messages
// ============================================
export const USERS_MESSAGES = {
  // Service layer errors
  serviceErrors: {
    apiClientNotAvailable: "API client not available.",
    invalidUserData: "Invalid user data received from server.",
    userIdNotAvailable: "User ID not available.",
    validationFailed: "User data validation failed.",
  },
  // User operation errors (UI feedback)
  errors: {
    createFailed: "Failed to create user. Please try again.",
    updateFailed: "Failed to update user. Please try again.",
    deleteFailed: "Failed to delete user. Please try again.",
    fetchFailed: "Failed to fetch users. Please try again.",
    fetchSingleFailed: "Failed to fetch user. Please try again.",
    userNotFound: "User not found.",
    userAlreadyExists: "User already exists.",
    invalidCredentials: "Invalid credentials provided.",
  },
  // Operation success messages
  success: {
    created: "User created successfully.",
    updated: "User updated successfully.",
    deleted: "User deleted successfully.",
  },
  // User confirmations
  confirmations: {
    deleteUser: "Are you sure you want to delete this user?",
  },
} as const;

// ============================================
// User Filter Options
// ============================================
export const USER_FILTER_OPTIONS = {
  roles: [
    { value: USER_ROLES_CONFIG.admin, label: "Admin" },
    { value: USER_ROLES_CONFIG.user, label: "User" },
  ],
  status: [
    { value: true, label: "Active" },
    { value: false, label: "Inactive" },
  ],
  verification: [
    { value: true, label: "Verified" },
    { value: false, label: "Unverified" },
  ],
} as const;

// ============================================
// User Query Retry Config
// ============================================
export const USERS_QUERY_CONFIG = {
  retry: 3,
  retryDelay: 1000,
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
} as const;
