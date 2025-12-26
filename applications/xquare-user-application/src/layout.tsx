import React from "react";
import styled from "@emotion/styled";
import { Sidebar } from "@xquare/user-interfaces";
import { useUserName } from "@xquare/hooks";
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
  const { userName, loading } = useUserName();

  const navItems = React.useMemo(
    () => [
      { id: "home", label: "HOME", path: "/" },
      { id: "deployment", label: "DEPLOYMENT", path: "/deployment" },
      { id: "addons", label: "ADDONS", path: "/addons" },
      { id: "status", label: "STATUS", path: "/status" },
      { id: "notice", label: "NOTICE", path: "/notice" },
      // { id: "feed", label: "FEED", path: "/feed" },
    ],
    []
  );

  const handleNavItemClick = (itemId: string) => {
    const routeMap: Record<string, string> = {
      home: "/",
      deployment: "/deployment",
      addons: "/addons",
      status: "/status",
      notice: "/notice",
      // feed: "/feed",
    };

    const path = routeMap[itemId];
    if (!path) return;
    navigate(path);
  };

  return (
    <Container>
      <Sidebar
        navItems={navItems}
        userName={userName ?? (loading ? "Loading..." : "")}
        projectName=""
        searchPlaceholder={searchPlaceholder}
        onNavItemClick={handleNavItemClick}
        onSearch={onSearch}
      />
      <Page>{children}</Page>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const Page = styled.div`
  margin-left: 280px;
  width: calc(100% - 280px);
  height: 100vh;
  overflow-y: auto;
`;

export default Layout;
