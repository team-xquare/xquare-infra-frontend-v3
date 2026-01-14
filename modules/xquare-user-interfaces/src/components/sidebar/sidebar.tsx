import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import type { Team } from "@xquare/utils";
import { SidebarHeader } from "./header/sidebar-header";
import { SidebarSearch } from "./search/sidebar-search";
import { SidebarItem } from "./item/sidebar-item";
import { SidebarFooter } from "./footer/sidebar-footer";
import {
  SidebarContainer,
  SidebarContent,
  SidebarNavContainer,
  SidebarNavContent,
} from "./sidebar-style";

interface SidebarNavItem {
  id: string;
  label: string;
  subItems?: SidebarNavItem[];
  path?: string;
}

interface SidebarProps {
  navItems: SidebarNavItem[];
  projectName: string;
  searchPlaceholder: string;
  userName: string;
  teams?: Team[];
  teamsLoading?: boolean;
  teamsError?: Error | null;
  userRole?: "admin" | "member";
  onNavItemClick: (itemId: string) => void;
  onSearch?: (value: string) => void;
  onTeamCreated?: () => void;
  onTeamUpdated?: () => void;
}

function Sidebar({
  navItems,
  userName,
  projectName,
  searchPlaceholder,
  teams,
  teamsLoading,
  teamsError,
  onNavItemClick,
  onSearch,
  onTeamCreated,
}: SidebarProps) {
  const location = useLocation();

  const isMatch = (basePath?: string) =>
    basePath != null &&
    (location.pathname === basePath ||
      location.pathname.startsWith(`${basePath}/`));

  const activeItemId =
    navItems.find(
      (i) => isMatch(i.path) || i.subItems?.some((s) => isMatch(s.path))
    )?.id ??
    navItems[0]?.id ??
    "";

  const isMainItemActive = useCallback(
    (itemId: string) =>
      itemId === activeItemId ||
      navItems
        .find((i) => i.id === itemId)
        ?.subItems?.some((sub) => sub.id === activeItemId),
    [activeItemId, navItems]
  );

  const handleMainItemClick = useCallback(
    (itemId: string) => {
      onNavItemClick(itemId);
    },
    [onNavItemClick]
  );

  return (
    <SidebarContainer>
      <SidebarHeader />
      <SidebarContent>
        <SidebarSearch placeholder={searchPlaceholder} onSearch={onSearch} />
        <SidebarNavContent>
          <SidebarNavContainer>
            {navItems.map((item) => (
                <SidebarItem
                  label={item.label}
                  isActive={isMainItemActive(item.id)}
                  onClick={() => handleMainItemClick(item.id)}
                />
            ))}
          </SidebarNavContainer>
        </SidebarNavContent>
      </SidebarContent>
      <SidebarFooter
        name={userName}
        project={projectName}
        teams={teams}
        teamsLoading={teamsLoading}
        teamsError={teamsError}
        onTeamCreated={onTeamCreated}
      />
    </SidebarContainer>
  );
}

export { Sidebar };
