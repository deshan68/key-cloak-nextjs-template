/**
 * Chat Query Hooks
 * React Query hooks for chat queries (read operations)
 */
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/config/query-keys";
import { chatService } from "./service";
import { usePostgrestClient } from "@/lib/hooks/usePostgrestClient";
import { CHATS_MESSAGES, CHATS_QUERY_CONFIG } from "./chat.constants";
import type { UseQueryOptionsWithoutKeyAndFn } from "@/lib/api/types/query-options";
import type { ChatFilters, ChatsListResponse } from "./chat.api.types";
import type { Chat } from "./chat.types";

/**
 * Hook to fetch paginated list of chats
 */
export function useGetChats(
  params?: ChatFilters,
  options?: UseQueryOptionsWithoutKeyAndFn<ChatsListResponse>,
) {
  const apiClient = usePostgrestClient();

  return useQuery<ChatsListResponse, Error>({
    queryKey: queryKeys.chats.list(params),
    queryFn: async () => {
      if (!apiClient) {
        throw new Error(CHATS_MESSAGES.serviceErrors.apiClientNotAvailable);
      }
      return chatService.getChats(apiClient, params);
    },
    enabled: !!apiClient,
    ...CHATS_QUERY_CONFIG,
    ...options,
  });
}

/**
 * Hook to fetch a single chat by ID
 */
export function useGetChatById(
  chatId: string | undefined,
  options?: UseQueryOptionsWithoutKeyAndFn<Chat>,
) {
  const apiClient = usePostgrestClient();

  return useQuery<Chat, Error>({
    queryKey: queryKeys.chats.detail(chatId || ""),
    queryFn: async () => {
      if (!apiClient) {
        throw new Error(CHATS_MESSAGES.serviceErrors.apiClientNotAvailable);
      }
      if (!chatId) {
        throw new Error(CHATS_MESSAGES.serviceErrors.chatIdNotAvailable);
      }
      return chatService.getChatById(apiClient, chatId);
    },
    enabled: !!apiClient && !!chatId,
    ...CHATS_QUERY_CONFIG,
    ...options,
  });
}

/**
 * Hook to fetch chats with infinite scrolling
 */
export function useGetChatsInfinite(params?: Omit<ChatFilters, 'page'>) {
  const apiClient = usePostgrestClient();

  return useInfiniteQuery({
    queryKey: queryKeys.chats.infiniteList(params),
    queryFn: async ({ pageParam = 1 }) => {
      if (!apiClient) {
        throw new Error(CHATS_MESSAGES.serviceErrors.apiClientNotAvailable);
      }
      const pageParams: ChatFilters = {
        ...params,
        page: pageParam,
        limit: 10,
      };
      return chatService.getChats(apiClient, pageParams);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce((sum, page) => sum + page.data.length, 0);
      return totalLoaded < lastPage.total ? allPages.length + 1 : undefined;
    },
    enabled: !!apiClient,
    ...CHATS_QUERY_CONFIG,
  });
}
