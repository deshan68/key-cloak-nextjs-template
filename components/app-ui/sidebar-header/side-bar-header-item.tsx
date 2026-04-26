import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

type SideBarHeaderItemProps = {
  id: string;
  name: string;
  icon: React.ReactNode;
};

export function SideBarHeaderItem({ id, name, icon }: SideBarHeaderItemProps) {
  return (
    <SidebarMenuItem key={id}>
      <SidebarMenuButton asChild>
        <div className="cursor-default">
          {icon}
          <span>{name}</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
