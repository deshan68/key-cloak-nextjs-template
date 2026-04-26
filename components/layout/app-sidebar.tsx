"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarHeaderSection } from "@/components/app-ui/sidebar-header";
import { ProjectsList } from "../app-ui/sidebar-header/project-list";

export function AppSidebar() {
  const [search] = React.useState("");
  const { open } = useSidebar();

  function handleAddProject() {
    // Wire to your modal / sheet
    alert("Open add-project dialog");
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeaderSection />

      <SidebarContent>
        {open && (
          <ProjectsList search={search} onAddProject={handleAddProject} />
        )}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
