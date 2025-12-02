import { useCallback, useMemo, useState } from "react";
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
  SidebarSubNavContainer,
} from "./sidebar-style";

interface SidebarNavItem {
  id: string;
  label: string;
  subItems?: SidebarNavItem[];
}

interface SidebarProps {
  navItems: SidebarNavItem[];
  projectName: string;
  searchPlaceholder: string;
  userName: string;
  onNavItemClick: (itemId: string) => void;
  onSearch?: (value: string) => void;
}

export function Sidebar({
  navItems,
  userName,
  projectName,
  searchPlaceholder,
  onNavItemClick,
  onSearch,
}: SidebarProps) {
  const [activeItemId, setActiveItemId] = useState<string>(navItems[0].id);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const isMainItemActive = useCallback(
    (itemId: string) =>
      itemId === activeItemId ||
      navItems
        .find((i) => i.id === itemId)
        ?.subItems?.some((sub) => sub.id === activeItemId),
    [activeItemId, navItems],
  );

  const subItems = useMemo(() => {
    const activeItem = navItems.find(
      (item) =>
        item.id === activeItemId ||
        item.subItems?.some((sub) => sub.id === activeItemId),
    );
    return activeItem?.subItems || [];
  }, [activeItemId, navItems]);

  const handleMainItemClick = useCallback(
    (itemId: string) => {
      setActiveItemId(itemId);
      onNavItemClick(itemId);
    },
    [onNavItemClick],
  );

  const handleSubItemClick = useCallback(
    (itemId: string) => {
      setActiveItemId(itemId);
      onNavItemClick(itemId);
    },
    [onNavItemClick],
  );

  const handleNavLeave = useCallback(() => {
    setHoveredItemId(null);
  }, []);

  const handleItemHover = useCallback((itemId: string) => {
    setHoveredItemId(itemId);
  }, []);

  const isExpanded = !!hoveredItemId;

  return (
    <SidebarContainer isExpanded={isExpanded}>
      <SidebarHeader isExpanded={isExpanded} />
      <SidebarContent>
        <SidebarSearch placeholder={searchPlaceholder} onSearch={onSearch} />
        <SidebarNavContent onMouseLeave={handleNavLeave}>
          <SidebarNavContainer>
            {navItems.map((item) => (
              <SidebarNavItemWrapper
                key={item.id}
                onMouseEnter={() => handleItemHover(item.id)}
              >
                <SidebarItem
                  label={item.label}
                  isActive={isMainItemActive(item.id)}
                  onClick={() => handleMainItemClick(item.id)}
                />
              </SidebarNavItemWrapper>
            ))}
          </SidebarNavContainer>
          <SidebarSubNavContainer isExpanded={isExpanded}>
            {subItems.map((item: SidebarNavItem) => (
              <SidebarNavItemWrapper
                key={item.id}
                onMouseEnter={() => handleItemHover(item.id)}
              >
                <SidebarItem
                  label={item.label}
                  isActive={item.id === activeItemId}
                  onClick={() => handleSubItemClick(item.id)}
                />
              </SidebarNavItemWrapper>
            ))}
          </SidebarSubNavContainer>
        </SidebarNavContent>
      </SidebarContent>
      <SidebarFooter name={userName} project={projectName} />
    </SidebarContainer>
  );
}
