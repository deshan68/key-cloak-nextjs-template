"use client";

import React, { createContext, useContext, useState } from "react";

type SidebarSection =
  | "chats"
  | "search"
  | "all-chats"
  | "starred"
  | "tags"
  | "files"
  | null;

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
  const [activeSection, setActiveSection] = useState<SidebarSection>("chats");
  const [isContentOpen, setIsContentOpen] = useState(true);

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
