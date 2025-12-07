import React from "react";
import styled from "@emotion/styled";
import { Sidebar } from "@xquare/user-interfaces";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  searchPlaceholder?: string;
  onSearch?: (text: string) => void;
}

function Layout({
  children,
  searchPlaceholder = "검색어를 입력하세요",
  onSearch,
}: LayoutProps) {
  const navigate = useNavigate();

  const navItems = [
    { id: "home", label: "HOME" },
    { id: "notification", label: "NOTIFICATION" },
    { id: "deployment", label: "DEPLOYMENT" },
    { id: "network", label: "NETWORK" },
    { id: "monitor", label: "MONITOR" },
  ];

  const handleNavItemClick = (itemId: string) => {
    const routeMap: Record<string, string> = {
      home: "/",
      notification: "/notification",
      deployment: "/deployment",
      network: "/network",
      monitor: "/monitor",
    };

    navigate(routeMap[itemId]);
  };

  return (
    <Container>
      <Sidebar
        navItems={navItems}
        userName="111"
        projectName=""
        searchPlaceholder={searchPlaceholder}
        onNavItemClick={handleNavItemClick}
        onSearch={onSearch ?? (() => {})}
      />
      {children}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

export default Layout;
