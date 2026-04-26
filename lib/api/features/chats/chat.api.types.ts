/**
 * API-Specific Type Exports
 * Re-exports main types from chat.types.ts + API-specific utility types
 */
import type { chatService } from "./service";

// Re-export all main types
export * from "./chat.types";

// Additional API-specific utility types
export type DeleteChatResult = Awaited<
  ReturnType<typeof chatService.deleteChat>
>;
