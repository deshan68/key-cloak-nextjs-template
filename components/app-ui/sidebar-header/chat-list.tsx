"use client";

import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { MessageSquare, Pin } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";

import { useGetChatsInfinite } from "@/lib/api/features/chats";

const ITEM_HEIGHT = 32;

type ChatListProps = {
  search: string;
};

export function ChatList({ search }: ChatListProps) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetChatsInfinite({ search });
  const chats = data?.pages.flatMap((page) => page.data) || [];
  const parentRef = React.useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: chats.length + (hasNextPage ? 1 : 0), // Add 1 for loading indicator
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 8,
  });

  // Fetch more when nearing the end
  const virtualItems = virtualizer.getVirtualItems();
  React.useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();
    if (!lastItem) return;

    if (
      lastItem.index >= chats.length - 10 && // Trigger when 10 items from end
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    virtualItems,
    chats.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  return (
    <SidebarGroup className="pr-0">
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      <SidebarGroupContent>
        {isLoading ? (
          <SidebarMenu>
            {Array.from({ length: 5 }).map((_, i) => (
              <SidebarMenuItem key={i}>
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        ) : chats.length === 0 ? (
          <p className="px-2 py-4 text-center text-xs text-muted-foreground">
            No chats match &ldquo;{search}&rdquo;
          </p>
        ) : (
          <div
            ref={parentRef}
            style={{ maxHeight: 540, overflowY: "auto" }}
            className="scrollbar-thin"
          >
            <SidebarMenu
              style={{
                height: virtualizer.getTotalSize(),
                position: "relative",
              }}
            >
              {virtualizer.getVirtualItems().map((vItem) => {
                if (vItem.index >= chats.length) {
                  // Loading indicator
                  return (
                    <SidebarMenuItem
                      key="loading"
                      style={{
                        position: "absolute",
                        top: vItem.start,
                        left: 0,
                        right: 0,
                        height: ITEM_HEIGHT,
                      }}
                    >
                      <SidebarMenuSkeleton showIcon />
                    </SidebarMenuItem>
                  );
                }

                const chat = chats[vItem.index];
                return (
                  <SidebarMenuItem
                    key={chat.id}
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
                        href={`#chat-${chat.id}`}
                        className="flex items-center gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        {chat.isPinned && (
                          <Pin className="h-3 w-3 text-yellow-500" />
                        )}
                        <span className="flex-1 truncate">{chat.name}</span>
                      </a>
                    </SidebarMenuButton>
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
