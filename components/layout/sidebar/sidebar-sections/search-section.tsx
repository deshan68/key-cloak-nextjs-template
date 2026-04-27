"use client";

import { Input } from "@/components/ui/input";
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";

export function SearchSection() {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <div className="space-y-3">
          <Input
            placeholder="Search chats, tags, or content..."
            className="h-9"
          />
          <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
            <p>Enter a search term to find chats</p>
          </div>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
