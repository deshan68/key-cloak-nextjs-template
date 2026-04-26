"use client";

import {
  Search,
  PlusCircle,
  Star,
  File,
  Tag,
  PanelLeft,
  MessageCircle,
} from "lucide-react";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { SideBarHeaderItem } from "./side-bar-header-item";
import Logo from "@/public/logo.svg";
import Image from "next/image";

const BASIC_CHAT_ITEMS = [
  {
    id: "1",
    name: "New chat",
    icon: <PlusCircle className="mr-1 h-4 w-4 shrink-0" />,
  },
  {
    id: "2",
    name: "Search",
    icon: <Search className="mr-1 h-4 w-4 shrink-0" />,
  },
  {
    id: "3",
    name: "All chats",
    icon: <MessageCircle className="mr-1 h-4 w-4 shrink-0" />,
  },
  {
    id: "4",
    name: "Starred",
    icon: <Star className="mr-1 h-4 w-4 shrink-0" />,
  },
  {
    id: "5",
    name: "Tags",
    icon: <Tag className="mr-1 h-4 w-4 shrink-0" />,
  },
  {
    id: "6",
    name: "Files",
    icon: <File className="mr-1 h-4 w-4 shrink-0" />,
  },
];

export function SidebarHeaderSection() {
  const { open, toggleSidebar } = useSidebar();

  const handleLogoClick = (id: string) => {
    if (id === "logo") toggleSidebar();
  };

  return (
    <SidebarHeader className="pb-0">
      <SidebarMenu className="gap-0">
        <SidebarMenuItem className="pb-2">
          <SidebarMenuButton asChild>
            <div
              className="cursor-default"
              onClick={() => handleLogoClick("logo")}
            >
              <Image src={Logo} alt="ChatGPT Logo" className="h-5 w-5" />
              {open && <span className="text-sm font-medium">Emvia</span>}
            </div>
          </SidebarMenuButton>
          <SidebarMenuBadge className="ml-auto">
            <PanelLeft className="ml-auto h-4 w-4 shrink-0" />
          </SidebarMenuBadge>
        </SidebarMenuItem>

        {BASIC_CHAT_ITEMS.map((item) => (
          <SideBarHeaderItem
            key={item.id}
            {...item}
            onClick={(name) => handleLogoClick(name)}
          />
        ))}
      </SidebarMenu>
    </SidebarHeader>
  );
}
