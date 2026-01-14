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
    <SideBarMenuItemLabel
      type="button"
      isActive={isActive}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </SideBarMenuItemLabel>
  );
}

export const SidebarItem = memo(SidebarItemComponent);
