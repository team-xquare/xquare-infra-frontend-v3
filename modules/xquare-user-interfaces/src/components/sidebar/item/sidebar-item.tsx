import { memo } from "react";
import { SideBarMenuItem, SideBarMenuItemLabel } from "./sidebar-item-style";

interface SidebarItemProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

function SidebarItemComponent({
  label,
  isActive = false,
  onClick,
}: SidebarItemProps) {
  return (
    <SideBarMenuItem isActive={isActive} onClick={onClick}>
      <SideBarMenuItemLabel isActive={isActive}>{label}</SideBarMenuItemLabel>
    </SideBarMenuItem>
  );
}

export const SidebarItem = memo(SidebarItemComponent);
