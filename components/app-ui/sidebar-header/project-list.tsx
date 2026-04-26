"use client";

import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { MoreHorizontal, Circle } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Project } from "./sidebar-data";
import { useSidebarProjects } from "./use-sidebar-queries";

const STATUS_COLOR: Record<Project["status"], string> = {
  active: "text-emerald-500",
  paused: "text-amber-500",
  archived: "text-muted-foreground",
};

const ITEM_HEIGHT = 32;

type ProjectsListProps = {
  search: string;
  onAddProject: () => void;
};

export function ProjectsList({ search }: ProjectsListProps) {
  const { data: projects = [], isLoading } = useSidebarProjects(search);
  const parentRef = React.useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: projects.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 8,
  });

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        Projects
        <span className="ml-auto text-xs tabular-nums text-muted-foreground">
          {isLoading ? "…" : projects.length}
        </span>
      </SidebarGroupLabel>

      <SidebarGroupContent>
        {isLoading ? (
          <SidebarMenu>
            {Array.from({ length: 5 }).map((_, i) => (
              <SidebarMenuItem key={i}>
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        ) : projects.length === 0 ? (
          <p className="px-2 py-4 text-center text-xs text-muted-foreground">
            No projects match &ldquo;{search}&rdquo;
          </p>
        ) : (
          <div
            ref={parentRef}
            style={{ maxHeight: 600, overflowY: "auto" }}
            className="scrollbar-thin"
          >
            <SidebarMenu
              style={{
                height: virtualizer.getTotalSize(),
                position: "relative",
              }}
            >
              {virtualizer.getVirtualItems().map((vItem) => {
                const project = projects[vItem.index];
                return (
                  <SidebarMenuItem
                    key={project.id}
                    style={{
                      position: "absolute",
                      top: vItem.start,
                      left: 0,
                      right: 0,
                      height: ITEM_HEIGHT,
                    }}
                  >
                    <SidebarMenuButton asChild size="sm">
                      <a
                        href={`#project-${project.id}`}
                        className="flex items-center gap-2"
                      >
                        <span className="text-base leading-none">
                          {project.emoji}
                        </span>
                        <span className="flex-1 truncate">{project.name}</span>
                        <Circle
                          className={`h-2 w-2 shrink-0 fill-current ${STATUS_COLOR[project.status]}`}
                        />
                      </a>
                    </SidebarMenuButton>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction
                          className="opacity-0 group-hover/item:opacity-100 data-[state=open]:opacity-100"
                          showOnHover
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                          <span className="sr-only">More options</span>
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start">
                        <DropdownMenuItem>Open project</DropdownMenuItem>
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </div>
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
