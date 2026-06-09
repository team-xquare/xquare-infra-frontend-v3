import {
  clearAllTokens,
  getSelectedTeam,
  saveSelectedTeam,
  SELECTED_TEAM_EVENT,
  type Team,
} from "@xquare/utils";
import { useNavigate } from "react-router-dom";
import { memo, useCallback, useEffect, useState } from "react";
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

  // 사용자가 명시적으로 팀을 선택했는지 추적
  const [isUserSelectedTeam, setIsUserSelectedTeam] = useState(() => {
    return getSelectedTeam() !== null;
  });

  const [selectedProject, setSelectedProject] = useState(() => {
    const savedTeam = getSelectedTeam();
    return savedTeam?.name ?? project;
  });

  // 선택된 팀의 ID를 상태로 관리 (필요시 사용)
  const [, setSelectedTeamId] = useState<number | null>(() => {
    const savedTeam = getSelectedTeam();
    return savedTeam?.id ?? null;
  });

  useEffect(() => {
    const syncSelectedTeam = () => {
      const savedTeam = getSelectedTeam();
      setSelectedProject(savedTeam?.name ?? project);
      setSelectedTeamId(savedTeam?.id ?? null);
      setIsUserSelectedTeam(savedTeam !== null);
    };

    window.addEventListener(SELECTED_TEAM_EVENT, syncSelectedTeam);
    window.addEventListener("storage", syncSelectedTeam);

    return () => {
      window.removeEventListener(SELECTED_TEAM_EVENT, syncSelectedTeam);
      window.removeEventListener("storage", syncSelectedTeam);
    };
  }, [project]);

  const handleLogout = useCallback(() => {
    if (!window.confirm("로그아웃하시겠습니까?")) return;
    clearAllTokens();
    navigate("/login");
  }, [navigate]);

  const handleTeamSelect = useCallback((teamName: string, teamId: number) => {
    // console.log("[SidebarFooter] 팀 선택:", { teamName, teamId });
    setSelectedProject(teamName);
    setSelectedTeamId(teamId);
    setIsUserSelectedTeam(true);

    // 선택한 팀 정보를 스토리지에 저장
    // 현재 저장된 팀 정보를 조회하여 type 필드 유지
    const savedTeam = getSelectedTeam();
    const teamType = savedTeam?.type ?? "개인";

    saveSelectedTeam({
      id: teamId,
      name: teamName,
      type: teamType,
    });
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
          onTeamCreated={onTeamCreated}
        />
      )}
    </>
  );
}

export const SidebarFooter = memo(SidebarFooterComponent);
