"use client";

import { useSidebarSection } from "@/lib/contexts/sidebar-context";
import {
  AllChatsSection,
  SearchSection,
  StarredSection,
  TagsSection,
} from "./sidebar-sections";
import { SidebarChatList } from "@/components/features/chats/sidebar-chat-list";

export function SidebarContentPanelInner() {
  const { activeSection } = useSidebarSection();

  const renderSectionContent = () => {
    if (!activeSection) return null;
    switch (activeSection) {
      case "chats":
        return <SidebarChatList />;
      case "search":
        return <SearchSection />;
      case "all-chats":
        return <AllChatsSection />;
      case "starred":
        return <StarredSection />;
      case "tags":
        return <TagsSection />;
      default:
        return null;
    }
  };

  if (!activeSection) {
    return (
      <div className="flex items-center justify-center p-4 text-muted-foreground">
        <p>Select an item from the menu</p>
      </div>
    );
  }

  return renderSectionContent();
}
