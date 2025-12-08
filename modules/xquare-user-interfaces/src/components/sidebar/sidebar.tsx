import { useCallback, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SidebarHeader } from "./header/sidebar-header";
import { SidebarSearch } from "./search/sidebar-search";
import { SidebarItem } from "./item/sidebar-item";
import { SidebarFooter } from "./footer/sidebar-footer";
import {
  SidebarContainer,
  SidebarContent,
  SidebarNavContainer,
  SidebarNavContent,
  SidebarNavItemWrapper,
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
  onNavItemClick: (itemId: string) => void;
  onSearch?: (value: string) => void;
}

function Sidebar({
  navItems,
  userName,
  projectName,
  searchPlaceholder,
  onNavItemClick,
  onSearch,
}: SidebarProps) {
  const location = useLocation();

  const [activeItemId, setActiveItemId] = useState<string>(navItems[0].id);

  useEffect(() => {
    const current = navItems.find(
      (i) =>
        i.path === location.pathname ||
        i.subItems?.some((s) => s.path === location.pathname),
    );

    if (current) {
      queueMicrotask(() => setActiveItemId(current.id));
    }
  }, [location.pathname, navItems]);

  const isMainItemActive = useCallback(
    (itemId: string) =>
      itemId === activeItemId ||
      navItems
        .find((i) => i.id === itemId)
        ?.subItems?.some((sub) => sub.id === activeItemId),
    [activeItemId, navItems],
  );

  const handleMainItemClick = useCallback(
    (itemId: string) => {
      setActiveItemId(itemId);
      onNavItemClick(itemId);
    },
    [onNavItemClick],
  );

  return (
    <SidebarContainer>
      <SidebarHeader />
      <SidebarContent>
        <SidebarSearch placeholder={searchPlaceholder} onSearch={onSearch} />
        <SidebarNavContent>
          <SidebarNavContainer>
            {navItems.map((item) => (
              <SidebarNavItemWrapper key={item.id}>
                <SidebarItem
                  label={item.label}
                  isActive={isMainItemActive(item.id)}
                  onClick={() => handleMainItemClick(item.id)}
                />
              </SidebarNavItemWrapper>
            ))}
          </SidebarNavContainer>
        </SidebarNavContent>
      </SidebarContent>
      <SidebarFooter name={userName} project={projectName} />
    </SidebarContainer>
  );
}

export { Sidebar };
