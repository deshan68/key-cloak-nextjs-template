import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

type SideBarHeaderItemProps = {
  id: string;
  name: string;
  icon: React.ReactNode;
  onClick?: (name: string) => void;
};

export function SideBarHeaderItem({
  id,
  name,
  icon,
  onClick,
}: SideBarHeaderItemProps) {
  return (
    <SidebarMenuItem key={id} onClick={() => onClick?.(name)}>
      <SidebarMenuButton asChild>
        <div className="cursor-default">
          {icon}
          <span>{name}</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
