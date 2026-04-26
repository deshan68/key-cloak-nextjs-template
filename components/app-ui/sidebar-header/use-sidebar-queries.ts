import { useQuery } from "@tanstack/react-query";
import { PROJECTS, RECENT_ITEMS, TEAM_MEMBERS } from "./sidebar-data";

export function useSidebarProjects(search: string) {
  return useQuery({
    queryKey: ["sidebar-projects", search],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      if (!search.trim()) return PROJECTS;
      const q = search.toLowerCase();
      return PROJECTS.filter((p) => p.name.toLowerCase().includes(q));
    },
    staleTime: 1000 * 60,
  });
}

export function useSidebarTeam() {
  return useQuery({
    queryKey: ["sidebar-team"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 150));
      return TEAM_MEMBERS;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useSidebarRecent() {
  return useQuery({
    queryKey: ["sidebar-recent"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 100));
      return RECENT_ITEMS;
    },
    staleTime: 1000 * 30,
  });
}
