"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarHeaderSection } from "@/components/app-ui/sidebar-header";
import { ChatList } from "../app-ui/sidebar-header/chat-list";

export function AppSidebar() {
  const [search] = React.useState("");
  const { open } = useSidebar();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeaderSection />

      <SidebarContent>{open && <ChatList search={search} />}</SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
