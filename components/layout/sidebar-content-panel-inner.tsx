"use client";

import { useSidebarSection } from "@/lib/contexts/sidebar-context";
import { SidebarChatList } from "@/components/features/chats/sidebar-chat-list";
import { SearchSection } from "./sidebar-sections/search-section";
import { AllChatsSection } from "./sidebar-sections/all-chats-section";
import { StarredSection } from "./sidebar-sections/starred-section";
import { TagsSection } from "./sidebar-sections/tags-section";

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
