"use client";

import { SidebarTrigger, useSidebar } from "../ui/sidebar";

export function AppContentLayout({ children }: { children: React.ReactNode }) {
  const { isMobile } = useSidebar();

  return (
    <main className="flex h-dvh bg-sidebar w-dvw">
      {/* Content wrapper */}
      <div className="flex flex-1 flex-col overflow-hidden p-2">
        <div className="flex h-full w-full flex-col rounded-md bg-background overflow-hidden">
          {/* Mobile header */}
          {isMobile && (
            <div className="flex items-center p-2 border-b">
              <SidebarTrigger />
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    </main>
  );
}
