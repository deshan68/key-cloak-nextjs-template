"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  type SidebarSection,
  ROUTE_TO_SECTION_MAP,
} from "@/lib/config/routes-config";

interface SidebarContextType {
  activeSection: SidebarSection;
  setActiveSection: (section: SidebarSection) => void;
  isContentOpen: boolean;
  setIsContentOpen: (open: boolean) => void;
  toggleContent: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<SidebarSection>("chats");
  const [isContentOpen, setIsContentOpen] = useState(false);

  // Sync active section with current route
  useEffect(() => {
    const section = ROUTE_TO_SECTION_MAP[pathname] || null;
    if (section) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveSection(section);
    }
  }, [pathname]);

  const toggleContent = () => setIsContentOpen((prev) => !prev);

  return (
    <SidebarContext.Provider
      value={{
        activeSection,
        setActiveSection,
        isContentOpen,
        setIsContentOpen,
        toggleContent,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarSection() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error(
      "useSidebarSection must be used within SidebarContextProvider",
    );
  }
  return context;
}
