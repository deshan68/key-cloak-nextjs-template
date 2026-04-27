"use client";

import { useRouter } from "next/navigation";
import {
  Search,
  MessageCircle,
  Star,
  Tag,
  SquarePen,
  Files,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSidebarSection } from "@/lib/contexts/sidebar-context";
import Image from "next/image";
import Logo from "@/public/logo.svg";

const SIDEBAR_ICONS = [
  {
    id: "1",
    name: "New Chat",
    icon: SquarePen,
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

export function SidebarIconBar() {
  const router = useRouter();
  const { activeSection, setActiveSection, setIsContentOpen, toggleContent } =
    useSidebarSection();

  const handleIconClick = (section: typeof activeSection) => {
    // Set active section for icon highlighting
    setActiveSection(section);

    // Navigate to dedicated routes for these sections
    if (section === "chats") {
      router.push("/new");
      setIsContentOpen(false);
      return;
    }

    if (section === "files") {
      router.push("/files");
      setIsContentOpen(false);
      return;
    }

    if (section === "tags") {
      router.push("/tags");
      setIsContentOpen(false);
      return;
    }

    // Open the content panel for other sections
    setIsContentOpen(true);
  };

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col items-center border-r bg-sidebar px-2 py-4">
        {/* Logo - Toggle Content */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={toggleContent}
              className="mb-4 flex h-12 w-12 items-center justify-center"
            >
              <Image
                src={Logo}
                alt="Logo"
                width={32}
                height={32}
                className="h-10 w-10"
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Toggle Sidebar</TooltipContent>
        </Tooltip>

        {/* Icon Buttons */}
        <nav className="flex flex-col gap-1">
          {SIDEBAR_ICONS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.section;

            return (
              <Tooltip key={item.id} delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleIconClick(item.section)}
                    className={cn(
                      "relative flex h-10 w-10 items-center justify-center rounded-lg transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">{item.name}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </div>
    </TooltipProvider>
  );
}
