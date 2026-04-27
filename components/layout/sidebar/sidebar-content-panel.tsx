"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSidebarSection } from "@/lib/contexts/sidebar-context";
import { SidebarChatList } from "@/components/features/chats/sidebar-chat-list";
import { ChevronLeft } from "lucide-react";
import {
  FilesSection,
  SearchSection,
  StarredSection,
  TagsSection,
} from "./sidebar-sections";

const SECTION_TITLES: Record<string, string> = {
  chats: "Chats",
  search: "Search",
  "all-chats": "Chats",
  starred: "Starred",
  tags: "Tags",
  files: "Files",
};

export function SidebarContentPanel() {
  const { activeSection, isContentOpen, toggleContent } = useSidebarSection();

  // Show content based on isContentOpen and activeSection
  if (!isContentOpen || !activeSection) return null;

  const sectionTitle = SECTION_TITLES[activeSection] || "Sidebar";

  const renderSectionContent = () => {
    switch (activeSection) {
      case "chats":
        return null;
      case "search":
        return <SearchSection />;
      case "all-chats":
        return <SidebarChatList />;
      case "starred":
        return <StarredSection />;
      case "tags":
        return <TagsSection />;
      case "files":
        return <FilesSection />;
      default:
        return null;
    }
  };

  return (
    <Sidebar variant="sidebar" collapsible="none" className="border-l">
      {/* Header with Title and Close Button */}
      <SidebarHeader className="flex flex-row items-center justify-between px-4 py-3">
        <h2 className="text-lg font-semibold">{sectionTitle}</h2>
        <button
          onClick={toggleContent}
          className="rounded-md p-1 hover:bg-accent transition-colors"
          title="Collapse sidebar"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </SidebarHeader>

      <SidebarContent className="flex-1">
        {renderSectionContent()}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
