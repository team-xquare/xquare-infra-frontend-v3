import { clearAllTokens } from "@xquare/utils";
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
}

function SidebarFooterComponent({ name, project }: SidebarFooterProps) {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(project);

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
