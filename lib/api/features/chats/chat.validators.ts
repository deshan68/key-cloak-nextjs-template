/**
 * Chat Validation Functions
 * Uses Zod schemas from chat.schemas.ts to validate data
 * Provides both throwing and safe parsing utilities
 */
import { z } from "zod";
import {
  ApiChatSchema,
  ChatsListResponseSchema,
  CreateChatRequestSchema,
  UpdateChatRequestSchema,
} from "./chat.schemas";

/**
 * Validation utility functions
 * Throws on validation errors
 */
export const ChatValidators = {
  /**
   * Validate a single API chat response
   */
  validateApiChat: (data: unknown) => {
    try {
      return {
        success: true,
        data: ApiChatSchema.parse(data),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: error.issues,
          message: "Chat validation failed",
        };
      }
      throw error;
    }
  },

  /**
   * Validate a chat list response
   */
  validateChatsList: (data: unknown) => {
    try {
      return {
        success: true,
        data: ChatsListResponseSchema.parse(data),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: error.issues,
          message: "Chats list validation failed",
        };
      }
      throw error;
    }
  },

  /**
   * Validate create chat request
   */
  validateCreateChatRequest: (data: unknown) => {
    try {
      return {
        success: true,
        data: CreateChatRequestSchema.parse(data),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: error.issues,
          message: "Create chat request validation failed",
        };
      }
      throw error;
    }
  },

  /**
   * Validate update chat request
   */
  validateUpdateChatRequest: (data: unknown) => {
    try {
      return {
        success: true,
        data: UpdateChatRequestSchema.parse(data),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: error.issues,
          message: "Update chat request validation failed",
        };
      }
      throw error;
    }
  },
};

/**
 * Safe parsing functions
 * Don't throw, return results with success flag
 */
export const ChatSafeValidators = {
  safeParseChat: (data: unknown) => ApiChatSchema.safeParse(data),
  safeParseChatsList: (data: unknown) => ChatsListResponseSchema.safeParse(data),
  safeParseCreateRequest: (data: unknown) =>
    CreateChatRequestSchema.safeParse(data),
  safeParseUpdateRequest: (data: unknown) =>
    UpdateChatRequestSchema.safeParse(data),
};

// Re-export schemas for external use if needed
export {
  ApiChatSchema,
  ChatSchema,
  ChatsListResponseSchema,
  CreateChatRequestSchema,
  UpdateChatRequestSchema,
  ChatFiltersSchema,
} from "./chat.schemas";
