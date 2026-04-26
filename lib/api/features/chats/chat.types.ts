/**
 * Chat Type Definitions
 * All types are inferred from Zod schemas in chat.schemas.ts
 * This ensures types always match the validation logic
 */
import type {
  ApiChatType,
  ChatType,
  ChatsListResponseType,
  CreateChatRequestType,
  UpdateChatRequestType,
  ChatFiltersType,
} from "./chat.schemas";

// ============================================
// Domain Types (after mapping to app format)
// ============================================

// Single chat in application format
export type Chat = ChatType;

// List response
export type ChatsListResponse = ChatsListResponseType;

// Create chat request
export type CreateChatRequest = CreateChatRequestType;

// Update chat request
export type UpdateChatRequest = UpdateChatRequestType;

// Chat filters/query parameters
export type ChatFilters = ChatFiltersType;

// Variables for update mutation
export type UpdateChatVariables = {
  chatId: string;
  updates: UpdateChatRequest;
};

// ============================================
// API Response Types
// ============================================

// Single chat from API (snake_case format)
export type ApiChat = ApiChatType;
