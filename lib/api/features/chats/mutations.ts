/**
 * Chat Mutation Hooks
 * React Query hooks for chat mutations (write operations)
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/config/query-keys";
import { chatService } from "./service";
import { usePostgrestClient } from "@/lib/hooks/usePostgrestClient";
import { CHATS_MESSAGES, CHATS_QUERY_CONFIG } from "./chat.constants";
import type {
  Chat,
  CreateChatRequest,
  UpdateChatRequest,
  UpdateChatVariables,
} from "./chat.types";
import type { DeleteChatResult } from "./chat.api.types";
import type { UseMutationOptionsWithoutFn } from "@/lib/api/types/query-options";

/**
 * Hook to create a new chat
 */
export function useCreateChat(
  options?: UseMutationOptionsWithoutFn<Chat, Error, CreateChatRequest>,
) {
  const apiClient = usePostgrestClient();
  const queryClient = useQueryClient();

  return useMutation<Chat, Error, CreateChatRequest>({
    mutationFn: async (data: CreateChatRequest) => {
      if (!apiClient) {
        throw new Error(CHATS_MESSAGES.serviceErrors.apiClientNotAvailable);
      }
      return chatService.createChat(apiClient, data);
    },
    onSuccess: (newChat) => {
      // Invalidate chats list to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats.lists(),
      });

      // Optionally add to cache
      queryClient.setQueryData(queryKeys.chats.detail(newChat.id), newChat);
    },
    onError: (error) => {
      console.error(CHATS_MESSAGES.errors.createFailed, error);
    },
    retry: CHATS_QUERY_CONFIG.retry,
    ...options,
  });
}

/**
 * Hook to update an existing chat
 */
export function useUpdateChat(
  options?: UseMutationOptionsWithoutFn<Chat, Error, UpdateChatVariables>,
) {
  const apiClient = usePostgrestClient();
  const queryClient = useQueryClient();

  return useMutation<Chat, Error, UpdateChatVariables>({
    mutationFn: async (data: {
      chatId: string;
      updates: UpdateChatRequest;
    }) => {
      if (!apiClient) {
        throw new Error(CHATS_MESSAGES.serviceErrors.apiClientNotAvailable);
      }
      return chatService.updateChat(apiClient, data.chatId, data.updates);
    },
    onSuccess: (updatedChat) => {
      // Update cache for specific chat
      queryClient.setQueryData(
        queryKeys.chats.detail(updatedChat.id),
        updatedChat,
      );

      // Invalidate list
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats.lists(),
      });
    },
    onError: (error) => {
      console.error(CHATS_MESSAGES.errors.updateFailed, error);
    },
    retry: CHATS_QUERY_CONFIG.retry,
    ...options,
  });
}

/**
 * Hook to delete a chat
 */
export function useDeleteChat(
  options?: UseMutationOptionsWithoutFn<DeleteChatResult, Error, string>,
) {
  const apiClient = usePostgrestClient();
  const queryClient = useQueryClient();

  return useMutation<DeleteChatResult, Error, string>({
    mutationFn: async (chatId: string) => {
      if (!apiClient) {
        throw new Error(CHATS_MESSAGES.serviceErrors.apiClientNotAvailable);
      }
      return chatService.deleteChat(apiClient, chatId);
    },
    onSuccess: (_data, chatId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: queryKeys.chats.detail(chatId),
      });

      // Invalidate list
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats.lists(),
      });
    },
    onError: (error) => {
      console.error(CHATS_MESSAGES.errors.deleteFailed, error);
    },
    retry: CHATS_QUERY_CONFIG.retry,
    ...options,
  });
}
