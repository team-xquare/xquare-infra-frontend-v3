import { clearAllTokens, getSelectedTeam, type Team } from "@xquare/utils";
import { useNavigate } from "react-router-dom";
import { memo, useCallback, useState } from "react";
import { TeamModal } from "../../teammodal";
import { CreateTeamModal } from "./create-team-modal";
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
  onTeamCreated?: () => void;
}

function SidebarFooterComponent({
  name,
  project,
  teams,
  teamsLoading,
  teamsError,
  onTeamCreated,
}: SidebarFooterProps) {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // 사용자가 명시적으로 팀을 선택했는지 추적
  const [isUserSelectedTeam, setIsUserSelectedTeam] = useState(() => {
    return getSelectedTeam() !== null;
  });

  const [selectedProject, setSelectedProject] = useState(() => {
    const savedTeam = getSelectedTeam();
    return savedTeam?.name ?? project;
  });

  const handleLogout = useCallback(() => {
    if (!window.confirm("로그아웃하시겠습니까?")) return;
    clearAllTokens();
    navigate("/login");
  }, [navigate]);

  const handleOpenCreateModal = useCallback(() => {
    setModalOpen(false);
    setCreateModalOpen(true);
  }, []);

  const handleTeamCreated = useCallback(() => {
    setCreateModalOpen(false);
    if (onTeamCreated) {
      onTeamCreated();
    }
  }, [onTeamCreated]);

  // 팀 선택 처리: 명시적 선택 상태와 팀명 모두 업데이트
  const handleTeamSelect = useCallback((teamName: string) => {
    setSelectedProject(teamName);
    setIsUserSelectedTeam(true);
  }, []);

  const isTeamSelected = isUserSelectedTeam;

  return (
    <>
      <SideBarFooter>
        <SideBarFooterDiv>
          <SideBarFooterNameSpan onClick={handleLogout}>
            {name}
          </SideBarFooterNameSpan>

          <SideBarFooterProjectDiv onClick={() => setModalOpen(true)}>
            {isTeamSelected ? selectedProject : "팀 선택"}
          </SideBarFooterProjectDiv>
        </SideBarFooterDiv>
      </SideBarFooter>

      {modalOpen && (
        <TeamModal
          teams={teams ?? []}
          loading={teamsLoading}
          error={teamsError}
          onSelectTeam={handleTeamSelect}
          onClose={() => setModalOpen(false)}
          onCreateTeam={handleOpenCreateModal}
        />
      )}

      {createModalOpen && (
        <CreateTeamModal
          onClose={() => setCreateModalOpen(false)}
          onSuccess={handleTeamCreated}
        />
      )}
    </>
  );
}

export const SidebarFooter = memo(SidebarFooterComponent);
