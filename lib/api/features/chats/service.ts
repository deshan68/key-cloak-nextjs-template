/**
 * Chat API service functions
 * Contains all API calls related to chat operations
 */
import type { PostgrestClient } from "@supabase/postgrest-js";
import type { Chat } from "./chat.types";
import { chatMapper } from "./chat.mapper";
import { ChatSafeValidators } from "./chat.validators";
import { CHATS_MESSAGES, CHATS_PAGINATION } from "./chat.constants";
import type {
  CreateChatRequest,
  UpdateChatRequest,
  ChatsListResponse,
  ChatFilters,
} from "./chat.api.types";

export const chatService = {
  /**
   * Fetch list of chats with pagination and filters
   */
  getChats: async (
    apiClient: PostgrestClient,
    params?: ChatFilters,
  ): Promise<ChatsListResponse> => {
    let query = apiClient.from("chat").select("*", { count: "exact" });

    // Apply filters
    if (params?.chat_type) {
      query = query.eq("chat_type", params.chat_type);
    }
    if (params?.user_id) {
      query = query.eq("user_id", params.user_id);
    }
    if (params?.is_pinned !== undefined) {
      query = query.eq("is_pinned", params.is_pinned);
    }
    if (params?.is_read !== undefined) {
      query = query.eq("is_read", params.is_read);
    }
    if (params?.search) {
      query = query.ilike("name", `%${params.search}%`);
    }

    // Apply pagination
    if (params?.page && params?.limit) {
      const from = (params.page - 1) * params.limit;
      query = query.range(from, from + params.limit - 1);
    }

    const { data, error, count } = await query;
    if (error) {
      throw error;
    }

    // Validate API response data
    // if (data && Array.isArray(data)) {
    //   for (const item of data) {
    //     const validation = ChatSafeValidators.safeParseChat(item);
    //     if (!validation.success) {
    //       console.error("Chat validation error:", validation.error);
    //       throw new Error(
    //         `${CHATS_MESSAGES.serviceErrors.invalidChatData} ${validation.error.message}`,
    //       );
    //     }
    //   }
    // }

    const mappedData = (data || []).map((chat) => chatMapper.toDomain(chat));

    return {
      data: mappedData,
      total: count || 0,
      page: params?.page || CHATS_PAGINATION.defaultPage,
      limit: params?.limit || CHATS_PAGINATION.defaultLimit,
    };
  },

  /**
   * Fetch single chat by ID
   */
  getChatById: async (
    apiClient: PostgrestClient,
    chatId: string,
  ): Promise<Chat> => {
    const { data, error } = await apiClient
      .from("app_chat")
      .select("*")
      .eq("id", chatId)
      .single();
    if (error) {
      throw error;
    }

    // Validate API response
    const validation = ChatSafeValidators.safeParseChat(data);
    if (!validation.success) {
      console.error("Chat validation error:", validation.error);
      throw new Error(
        `${CHATS_MESSAGES.serviceErrors.invalidChatData} ${validation.error.message}`,
      );
    }

    return chatMapper.toDomain(data);
  },

  /**
   * Create a new chat
   */
  createChat: async (
    apiClient: PostgrestClient,
    data: CreateChatRequest,
  ): Promise<Chat> => {
    const { data: newChat, error } = await apiClient
      .from("app_chat")
      .insert([data])
      .select()
      .single();
    if (error) {
      throw error;
    }

    // Validate API response
    const validation = ChatSafeValidators.safeParseChat(newChat);
    if (!validation.success) {
      console.error("Chat validation error:", validation.error);
      throw new Error(
        `${CHATS_MESSAGES.serviceErrors.invalidChatData} ${validation.error.message}`,
      );
    }

    return chatMapper.toDomain(newChat);
  },

  /**
   * Update an existing chat
   */
  updateChat: async (
    apiClient: PostgrestClient,
    chatId: string,
    data: UpdateChatRequest,
  ): Promise<Chat> => {
    const { data: updatedChat, error } = await apiClient
      .from("app_chat")
      .update(data)
      .eq("id", chatId)
      .select()
      .single();
    if (error) {
      throw error;
    }

    // Validate API response
    const validation = ChatSafeValidators.safeParseChat(updatedChat);
    if (!validation.success) {
      console.error("Chat validation error:", validation.error);
      throw new Error(
        `${CHATS_MESSAGES.serviceErrors.invalidChatData} ${validation.error.message}`,
      );
    }

    return chatMapper.toDomain(updatedChat);
  },

  /**
   * Delete a chat
   */
  deleteChat: async (
    apiClient: PostgrestClient,
    chatId: string,
  ): Promise<void> => {
    const { error } = await apiClient
      .from("app_chat")
      .delete()
      .eq("id", chatId);
    if (error) {
      throw error;
    }
  },
};
