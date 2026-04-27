"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { SidebarChatList } from "@/components/features/chats/sidebar-chat-list";

export function AllChatsSection() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>All Chats</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarChatList />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
