"use client";

import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import { SidebarChatList } from "@/components/features/chats/sidebar-chat-list";

export function AllChatsSection() {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarChatList />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
