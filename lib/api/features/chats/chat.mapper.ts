import type { ApiChat } from "./chat.api.types";
import type { Chat } from "./chat.types";

export const chatMapper = {
  toDomain(api: ApiChat): Chat {
    return {
      id: api.id,
      threadId: api.thread_id,
      name: api.name,
      createdAt: new Date(api.created_at),
      updatedAt: new Date(api.updated_at),
      userId: api.user_id,
      chatType: api.chat_type,
      description: api.description,
      isPinned: api.is_pinned,
      firstMessage: api.first_message,
      cardId: api.card_id,
      isRead: api.is_read,
    };
  },
};
