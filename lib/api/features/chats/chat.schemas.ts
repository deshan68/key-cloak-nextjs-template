/**
 * Chat Zod Schemas
 * Contains all Zod schema definitions for chat-related data
 * These schemas serve as the single source of truth for validation
 */
import { z } from "zod";
import { CHAT_TYPES } from "./chat.constants";

/**
 * Schema for a single chat from API
 * Validates the shape of chat data coming from the server
 */
export const ApiChatSchema = z.object({
  id: z.uuid("Invalid chat ID format"),
  thread_id: z.uuid("Invalid thread ID format"),
  name: z.string(),
  created_at: z.string("Invalid created_at format"),
  updated_at: z.string("Invalid updated_at format"),
  user_id: z.uuid("Invalid user ID format"),
  chat_type: z.enum(Object.values(CHAT_TYPES), "Invalid chat type"),
  description: z.string().optional(),
  is_pinned: z.boolean(),
  first_message: z.string().optional().nullable(),
  card_id: z.uuid("Invalid card ID format").optional().nullable(),
  is_read: z.boolean(),
});

// Inferred types from schemas
export type ApiChatType = z.infer<typeof ApiChatSchema>;

/**
 * Schema for a single chat (application format)
 * Used internally after mapping from API format
 */
export const ChatSchema = z.object({
  id: z.uuid("Invalid chat ID"),
  threadId: z.uuid("Invalid thread ID"),
  name: z.string().min(1, "Name is required"),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.uuid("Invalid user ID"),
  chatType: z.enum(Object.values(CHAT_TYPES), "Invalid chat type"),
  description: z.string().optional(),
  isPinned: z.boolean(),
  firstMessage: z.string().optional().nullable(),
  cardId: z.uuid("Invalid card ID").optional().nullable(),
  isRead: z.boolean(),
});

export type ChatType = z.infer<typeof ChatSchema>;

/**
 * Schema for chats list response
 * Validates the complete list response structure
 */
export const ChatsListResponseSchema = z.object({
  data: z.array(ChatSchema),
  total: z.number().int().nonnegative("Total must be non-negative"),
  page: z.number().int().positive("Page must be positive"),
  limit: z.number().int().positive("Limit must be positive"),
});

export type ChatsListResponseType = z.infer<typeof ChatsListResponseSchema>;

/**
 * Schema for create chat request
 * Validates chat creation payload
 */
export const CreateChatRequestSchema = z.object({
  thread_id: z.string().uuid("Invalid thread ID format"),
  name: z.string().min(1, "Name is required"),
  user_id: z.string().uuid("Invalid user ID format"),
  chat_type: z.enum(Object.values(CHAT_TYPES), "Invalid chat type"),
  description: z.string().optional(),
  is_pinned: z.boolean().optional(),
  first_message: z.string().optional().nullable(),
  card_id: z.uuid("Invalid card ID format").optional().nullable(),
  is_read: z.boolean().optional(),
});

export type CreateChatRequestType = z.infer<typeof CreateChatRequestSchema>;

/**
 * Schema for update chat request
 * All fields are optional
 */
export const UpdateChatRequestSchema = z.object({
  thread_id: z.string().uuid("Invalid thread ID format").optional(),
  name: z.string().min(1, "Name must not be empty").optional(),
  user_id: z.string().uuid("Invalid user ID format").optional(),
  chat_type: z.enum(Object.values(CHAT_TYPES), "Invalid chat type").optional(),
  description: z.string().optional(),
  is_pinned: z.boolean().optional(),
  first_message: z
    .string()
    .min(1, "First message must not be empty")
    .optional(),
  card_id: z.uuid("Invalid card ID format").optional().nullable(),
  is_read: z.boolean().optional(),
});

export type UpdateChatRequestType = z.infer<typeof UpdateChatRequestSchema>;

/**
 * Schema for chat filters
 * Validates pagination and filter parameters
 */
export const ChatFiltersSchema = z.object({
  page: z.number().int().positive("Page must be positive").optional(),
  limit: z.number().int().positive("Limit must be positive").optional(),
  chat_type: z.enum(Object.values(CHAT_TYPES), "Invalid chat type").optional(),
  search: z.string().optional(),
  user_id: z.string().uuid("Invalid user ID format").optional(),
  is_pinned: z.boolean().optional(),
  is_read: z.boolean().optional(),
});

export type ChatFiltersType = z.infer<typeof ChatFiltersSchema>;
