const SELECTED_TEAM_KEY = "xquare:selectedTeam";
export const SELECTED_TEAM_EVENT = "xquare:selectedTeam-changed";

const emitTeamChange = (team: SelectedTeamInfo | null) => {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(
      new CustomEvent(SELECTED_TEAM_EVENT, {
        detail: team,
      }),
    );
  } catch (error) {
    console.error("[emitTeamChange] 이벤트 전파 실패:", error);
  }
};

export interface SelectedTeamInfo {
  id: number;
  name: string;
  type: string;
}

/**
 * 선택된 팀 정보를 로컬 스토리지에 저장
 */
export const saveSelectedTeam = (team: SelectedTeamInfo): void => {
  try {
    localStorage.setItem(SELECTED_TEAM_KEY, JSON.stringify(team));
    emitTeamChange(team);
  } catch (error) {
    console.error("[saveSelectedTeam] 저장 실패:", error);
  }
};

export const getSelectedTeam = (): SelectedTeamInfo | null => {
  try {
    const stored = localStorage.getItem(SELECTED_TEAM_KEY);
    if (!stored) {
      // console.log("[getSelectedTeam] 저장된 팀 없음");
      return null;
    }
    const team = JSON.parse(stored) as SelectedTeamInfo;
    // console.log("[getSelectedTeam] 저장된 팀 조회:", team);
    return team;
  } catch (error) {
    console.error("[getSelectedTeam] 불러오기 실패:", error);
    return null;
  }
};

/**
 * 선택된 팀의 ID 반환
 */
export const getSelectedTeamId = (): number | null => {
  const team = getSelectedTeam();
  const teamId = team?.id ?? null;
  // console.log("[getSelectedTeamId] 팀 ID:", teamId);
  return teamId;
};

/**
 * 선택된 팀 정보 삭제
 */
export const clearSelectedTeam = (): void => {
  try {
    // console.log("[clearSelectedTeam] 팀 정보 삭제 시작");
    localStorage.removeItem(SELECTED_TEAM_KEY);
    emitTeamChange(null);
    // console.log("[clearSelectedTeam] 팀 정보 삭제 완료");
  } catch (error) {
    console.error("[clearSelectedTeam] 삭제 실패:", error);
  }
};
