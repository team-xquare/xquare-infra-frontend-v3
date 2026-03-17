import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import type { Team } from "@xquare/utils";
import { SidebarHeader } from "./header/SidebarHeaderComponent";
import { SidebarSearch } from "./search/SidebarSearchComponent";
import { SidebarItem } from "./item/SidebarItemComponent";
import { SidebarFooter } from "./footer/SidebarFooterComponent";
import {
  SidebarContainer,
  SidebarContent,
  SidebarNavContainer,
  SidebarNavContent,
} from "./Sidebar-style";

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
                key={item.id}
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
