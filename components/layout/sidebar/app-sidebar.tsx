"use client";

import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarIconBar } from "./sidebar-icon-bar";
import { SidebarContentPanel } from "./sidebar-content-panel";
import { MobileSidebarContent } from "./mobile-sidebar-content";
import { Menu } from "lucide-react";

export function AppSidebar() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button className="fixed bottom-4 left-4 z-40 rounded-lg bg-primary p-2 text-primary-foreground md:hidden">
            <Menu className="h-6 w-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full p-0 sm:w-96">
          <MobileSidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="flex h-dvh">
      <SidebarIconBar />
      <SidebarContentPanel />
    </div>
  );
}
