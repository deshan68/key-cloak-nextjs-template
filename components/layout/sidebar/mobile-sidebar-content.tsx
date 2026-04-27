"use client";

import { useRouter } from "next/navigation";
import { PlusCircle, Search, MessageCircle, Star, Tag, Files } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarSection } from "@/lib/contexts/sidebar-context";
import { SidebarContentPanelInner } from "./sidebar-content-panel-inner";

const SIDEBAR_ICONS = [
  {
    id: "1",
    name: "New Chat",
    icon: PlusCircle,
    section: "chats" as const,
  },
  {
    id: "2",
    name: "Search",
    icon: Search,
    section: "search" as const,
  },
  {
    id: "3",
    name: "All Chats",
    icon: MessageCircle,
    section: "all-chats" as const,
  },
  {
    id: "4",
    name: "Starred",
    icon: Star,
    section: "starred" as const,
  },
  {
    id: "5",
    name: "Tags",
    icon: Tag,
    section: "tags" as const,
  },
  {
    id: "6",
    name: "Files",
    icon: Files,
    section: "files" as const,
  },
];

export function MobileSidebarContent() {
  const router = useRouter();
  const { activeSection, setActiveSection } = useSidebarSection();

  const handleItemClick = (section: typeof activeSection) => {
    // Navigate to dedicated routes for these sections
    if (section === "chats") {
      router.push("/new");
      return;
    }

    if (section === "files") {
      router.push("/files");
      return;
    }

    if (section === "tags") {
      router.push("/tags");
      return;
    }

    setActiveSection(section);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Icon Navigation */}
      <div className="border-b p-3">
        <nav className="flex flex-wrap gap-2">
          {SIDEBAR_ICONS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.section;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.section)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 transition-all duration-300",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <SidebarContentPanelInner />
      </div>
    </div>
  );
}
