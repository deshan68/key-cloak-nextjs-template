"use client";

import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSidebarSection } from "@/lib/contexts/sidebar-context";
import { ROUTES_CONFIG } from "@/lib/config/routes-config";
import Image from "next/image";
import Logo from "@/public/logo.svg";

export function SidebarIconBar() {
  const router = useRouter();
  const { activeSection, setActiveSection, setIsContentOpen, toggleContent } =
    useSidebarSection();

  const handleIconClick = (routeConfig: (typeof ROUTES_CONFIG)[0]) => {
    const { section, path, showContentPanel } = routeConfig;

    // Set active section for icon highlighting
    setActiveSection(section);

    // Navigate to the route if it exists
    if (path) {
      router.push(path);
    }

    // Set content panel visibility based on route config
    setIsContentOpen(showContentPanel);
  };

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col items-center border-r bg-sidebar px-2 py-4">
        {/* Logo - Toggle Content */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={toggleContent}
              className="mb-4 flex h-12 w-12 items-center justify-center"
            >
              <Image
                src={Logo}
                alt="Logo"
                width={32}
                height={32}
                className="h-10 w-10"
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Toggle Sidebar</TooltipContent>
        </Tooltip>

        {/* Icon Buttons */}
        <nav className="flex flex-col gap-1">
          {ROUTES_CONFIG.map((route) => {
            const Icon = route.icon;
            const isActive = activeSection === route.section;

            return (
              <Tooltip key={route.id} delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleIconClick(route)}
                    className={cn(
                      "relative flex h-10 w-10 items-center justify-center rounded-lg transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">{route.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </div>
    </TooltipProvider>
  );
}
