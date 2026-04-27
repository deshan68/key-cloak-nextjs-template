import {
  Search,
  MessageCircle,
  Star,
  Tag,
  SquarePen,
  Files,
  type LucideIcon,
} from "lucide-react";

export type SidebarSection =
  | "chats"
  | "search"
  | "all-chats"
  | "starred"
  | "tags"
  | "files"
  | null;

export interface RouteConfig {
  id: string;
  section: SidebarSection;
  label: string;
  icon: LucideIcon;
  path: string;
  showContentPanel: boolean;
  description?: string;
}

/**
 * Centralized route configuration
 * Manages all route metadata including icons, labels, paths, and behaviors
 */
export const ROUTES_CONFIG: RouteConfig[] = [
  {
    id: "1",
    section: "chats",
    label: "New Chat",
    icon: SquarePen,
    path: "/new",
    showContentPanel: false,
    description: "Start a new chat conversation",
  },
  {
    id: "2",
    section: "search",
    label: "Search",
    icon: Search,
    path: "",
    showContentPanel: true,
    description: "Search through your chats",
  },
  {
    id: "3",
    section: "all-chats",
    label: "Chats",
    icon: MessageCircle,
    path: "/recents",
    showContentPanel: true,
    description: "View all your chat conversations",
  },
  {
    id: "4",
    section: "starred",
    label: "Starred",
    icon: Star,
    path: "",
    showContentPanel: true,
    description: "Your starred conversations",
  },
  {
    id: "5",
    section: "tags",
    label: "Tags",
    icon: Tag,
    path: "/tags",
    showContentPanel: false,
    description: "Organize chats with tags",
  },
  {
    id: "6",
    section: "files",
    label: "Files",
    icon: Files,
    path: "/files",
    showContentPanel: false,
    description: "Manage your files",
  },
];

/**
 * Map of route paths to sidebar sections
 * Used to determine which icon should be active based on current pathname
 */
export const ROUTE_TO_SECTION_MAP: Record<string, SidebarSection> = {
  "/new": "chats",
  "/files": "files",
  "/tags": "tags",
  "/recents": "all-chats",
  "/dashboard": "all-chats",
  "/": "chats",
};

/**
 * Get route config by section
 */
export function getRouteConfigBySection(
  section: SidebarSection,
): RouteConfig | undefined {
  return ROUTES_CONFIG.find((route) => route.section === section);
}

/**
 * Get all routes that navigate (have a path)
 */
export function getNavigableRoutes(): RouteConfig[] {
  return ROUTES_CONFIG.filter((route) => route.path);
}

/**
 * Get all routes that show content panel
 */
export function getContentPanelRoutes(): RouteConfig[] {
  return ROUTES_CONFIG.filter((route) => route.showContentPanel);
}
