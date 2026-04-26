/**
 * Chats Feature Constants
 * Constants specific to the chats feature
 */

// ============================================
// Chat Types
// ============================================
export const CHAT_TYPES = {
  reflection: "reflection",
  general: "general",
} as const;

export type ChatType = typeof CHAT_TYPES[keyof typeof CHAT_TYPES];

// ============================================
// Chat Status
// ============================================
export const CHAT_STATUS = {
  pinned: true,
  unpinned: false,
} as const;

// Map boolean values to labels
export function getChatPinnedLabel(isPinned: boolean): string {
  return isPinned ? "Pinned" : "Unpinned";
}

// ============================================
// Chat Read Status
// ============================================
export const CHAT_READ_STATUS = {
  read: true,
  unread: false,
} as const;

// Map boolean values to labels
export function getChatReadLabel(isRead: boolean): string {
  return isRead ? "Read" : "Unread";
}

// ============================================
// Chat List Pagination
// ============================================
export const CHATS_PAGINATION = {
  defaultPage: 1,
  defaultLimit: 10,
  maxLimit: 100,
} as const;

// ============================================
// Chat Validation Rules
// ============================================
export const CHAT_VALIDATION = {
  name: {
    minLength: 1,
    maxLength: 255,
  },
  description: {
    minLength: 1,
    maxLength: 1000,
  },
  firstMessage: {
    minLength: 1,
    maxLength: 10000,
  },
} as const;

// ============================================
// Chat API Endpoints
// ============================================
export const CHATS_API_ENDPOINTS = {
  list: "/app_chat",
  create: "/app_chat",
  update: (chatId: string) => `/app_chat?id=eq.${chatId}`,
  delete: (chatId: string) => `/app_chat?id=eq.${chatId}`,
  byId: (chatId: string) => `/app_chat?id=eq.${chatId}&select=*`,
} as const;

// ============================================
// Chat Messages
// ============================================
export const CHATS_MESSAGES = {
  // Service layer errors
  serviceErrors: {
    apiClientNotAvailable: "API client not available.",
    invalidChatData: "Invalid chat data received from server.",
    chatIdNotAvailable: "Chat ID not available.",
    validationFailed: "Chat data validation failed.",
  },
  // Chat operation errors (UI feedback)
  errors: {
    createFailed: "Failed to create chat. Please try again.",
    updateFailed: "Failed to update chat. Please try again.",
    deleteFailed: "Failed to delete chat. Please try again.",
    fetchFailed: "Failed to fetch chats. Please try again.",
    fetchSingleFailed: "Failed to fetch chat. Please try again.",
    chatNotFound: "Chat not found.",
    chatAlreadyExists: "Chat already exists.",
    invalidData: "Invalid data provided.",
  },
  // Operation success messages
  success: {
    created: "Chat created successfully.",
    updated: "Chat updated successfully.",
    deleted: "Chat deleted successfully.",
  },
  // Chat confirmations
  confirmations: {
    deleteChat: "Are you sure you want to delete this chat?",
  },
} as const;

// ============================================
// Chat Filter Options
// ============================================
export const CHAT_FILTER_OPTIONS = {
  types: [
    { value: CHAT_TYPES.reflection, label: "Reflection" },
    { value: CHAT_TYPES.general, label: "General" },
  ],
  pinned: [
    { value: true, label: "Pinned" },
    { value: false, label: "Unpinned" },
  ],
  read: [
    { value: true, label: "Read" },
    { value: false, label: "Unread" },
  ],
} as const;

// ============================================
// Chat Query Retry Config
// ============================================
export const CHATS_QUERY_CONFIG = {
  retry: 3,
  retryDelay: 1000,
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
} as const;
