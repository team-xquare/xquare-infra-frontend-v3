import { clearAllTokens, getSelectedTeam, type Team } from "@xquare/utils";
import { useNavigate } from "react-router-dom";
import { memo, useCallback, useState } from "react";
import { TeamModal } from "../../teammodal";
import {
  SideBarFooter,
  SideBarFooterDiv,
  SideBarFooterNameSpan,
  SideBarFooterProjectDiv,
} from "./sidebar-footer-style";

interface SidebarFooterProps {
  name: string;
  project: string;
  teams?: Team[];
  teamsLoading?: boolean;
  teamsError?: Error | null;
}

function SidebarFooterComponent({
  name,
  project,
  teams,
  teamsLoading,
  teamsError,
}: SidebarFooterProps) {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  // Initialize selected project from localStorage or fallback to prop
  const [selectedProject, setSelectedProject] = useState(() => {
    const savedTeam = getSelectedTeam();
    return savedTeam?.name ?? project;
  });

  const handleLogout = useCallback(() => {
    if (!window.confirm("로그아웃하시겠습니까?")) return;
    clearAllTokens();
    navigate("/login");
  }, [navigate]);

  return (
    <>
      <SideBarFooter>
        <SideBarFooterDiv>
          <SideBarFooterNameSpan onClick={handleLogout}>
            {name}
          </SideBarFooterNameSpan>

          <SideBarFooterProjectDiv onClick={() => setModalOpen(true)}>
            {selectedProject}
          </SideBarFooterProjectDiv>
        </SideBarFooterDiv>
      </SideBarFooter>

      {modalOpen && (
        <TeamModal
          teams={teams ?? []}
          loading={teamsLoading}
          error={teamsError}
          onSelectTeam={(teamName) => {
            setSelectedProject(teamName);
          }}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

export const SidebarFooter = memo(SidebarFooterComponent);
