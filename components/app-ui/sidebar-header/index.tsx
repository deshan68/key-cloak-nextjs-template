"use client";

import { Search, PlusCircle, Star, File, Tag } from "lucide-react";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { SideBarHeaderItem } from "./side-bar-header-item";

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
    name: "Starred",
    icon: <Star className="mr-1 h-4 w-4 shrink-0" />,
  },
  {
    id: "4",
    name: "Tags",
    icon: <Tag className="mr-1 h-4 w-4 shrink-0" />,
  },
  {
    id: "5",
    name: "Files",
    icon: <File className="mr-1 h-4 w-4 shrink-0" />,
  },
];

export function SidebarHeaderSection() {
  return (
    <SidebarHeader>
      <SidebarMenu className="gap-0">
        <SidebarMenuItem>
          <SidebarMenuButton className="font-semibold">
            <span className="truncate text-lg">Chat App</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        {BASIC_CHAT_ITEMS.map((item) => (
          <SideBarHeaderItem key={item.id} {...item} />
        ))}
      </SidebarMenu>
    </SidebarHeader>
  );
}
