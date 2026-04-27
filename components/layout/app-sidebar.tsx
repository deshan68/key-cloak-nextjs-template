"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarHeaderSection } from "@/components/app-ui/sidebar-header";
import { SidebarChatList } from "../features/chats/sidebar-chat-list";

export function AppSidebar() {
  const { open, isMobile, openMobile } = useSidebar();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeaderSection />

      <SidebarContent>
        {open && <SidebarChatList />}
        {isMobile && openMobile && <SidebarChatList />}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
