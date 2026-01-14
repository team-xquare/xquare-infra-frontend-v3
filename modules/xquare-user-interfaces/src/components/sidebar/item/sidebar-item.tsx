import { memo } from "react";
import { SideBarMenuItemLabel } from "./sidebar-item-style";

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
    <SideBarMenuItemLabel isActive={isActive} onClick={onClick}>
      {label}
    </SideBarMenuItemLabel>
  );
}

export const SidebarItem = memo(SidebarItemComponent);
