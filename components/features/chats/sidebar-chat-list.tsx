"use client";

import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
  useSidebar,
} from "@/components/ui/sidebar";
import logo from "@/public/logo.svg";

import { useGetChatsInfinite } from "@/lib/api/features/chats";
import Image from "next/image";
import { truncate } from "@/lib/utils";

const ITEM_HEIGHT = 52; // Slightly taller to prevent description cut-off

export function SidebarChatList() {
  const { isMobile } = useSidebar();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetChatsInfinite();
  const chats = data?.pages.flatMap((page) => page.data) || [];
  const parentRef = React.useRef<HTMLDivElement>(null);

  // Dynamically calculate max height based on viewport
  const [listMaxHeight, setListMaxHeight] = React.useState(540);

  React.useEffect(() => {
    function updateHeight() {
      // Reserve space for sidebar header, group label, padding, etc.
      const reserved = 160;
      setListMaxHeight(Math.max(200, window.innerHeight - reserved));
    }
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: chats.length + (hasNextPage ? 1 : 0),
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
      lastItem.index >= chats.length - 10 &&
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
      <SidebarGroupContent>
        {isLoading ? (
          <SidebarMenu>
            {Array.from({ length: 10 }).map((_, i) => (
              <SidebarMenuItem key={i}>
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        ) : chats.length === 0 ? (
          <p className="px-2 py-4 text-center text-xs text-muted-foreground">
            No chats yet. Start a new conversation!
          </p>
        ) : (
          <div
            ref={parentRef}
            style={{ maxHeight: listMaxHeight, overflowY: "auto" }}
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
                  // Loading indicator for next page
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

                // Only truncate if the text is actually long
                const displayName = chat.name
                  ? truncate(chat.name, isMobile ? 32 : 22)
                  : "Unnamed Chat";

                const displayDescription = chat.description
                  ? truncate(chat.description, isMobile ? 50 : 32)
                  : "No description";

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
                    <SidebarMenuButton asChild className="h-full py-1">
                      <a
                        href={`#chat-${chat.id}`}
                        className="flex items-center gap-2"
                      >
                        {/* Avatar icon */}
                        <div className="shrink-0 rounded-full bg-secondary-foreground w-7 aspect-square flex items-center justify-center">
                          <Image
                            src={logo}
                            alt="Chat"
                            className="w-3/4 h-3/4"
                          />
                        </div>

                        {/* Text block — min-w-0 so truncation works in flex */}
                        <div className="flex flex-col min-w-0 flex-1 leading-tight">
                          <span
                            className="truncate font-medium text-sm leading-5"
                            title={chat.name || "Unnamed Chat"}
                          >
                            {displayName}
                          </span>
                          <span
                            className="truncate text-xs text-muted-foreground leading-4"
                            title={chat.description || "No description"}
                          >
                            {displayDescription}
                          </span>
                        </div>
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
