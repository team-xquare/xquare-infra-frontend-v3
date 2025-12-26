import { getAccessToken, isAuthenticated } from "../auth/token";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface TeamAddon {
  id: number;
  name: string;
  type: string;
  tier: string;
  storageGi: number;
}

interface TeamAddonsApiResponse {
  success: boolean;
  data: {
    addons: TeamAddon[];
  };
}

/**
 * 팀의 모든 애드온 조회
 * - 경로: GET /api/v1/teams/{teamId}/addons
 * - 헤더: Authorization: Bearer <accessToken>, Accept: (wildcard all)
 */
export const getTeamAddons = async (teamId: number): Promise<TeamAddon[]> => {
  if (!isAuthenticated()) {
    throw new Error("인증되지 않은 상태입니다.");
  }

  if (typeof teamId !== "number" || Number.isNaN(teamId)) {
    throw new Error("유효한 팀 ID가 필요합니다.");
  }

  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("AccessToken이 없습니다.");
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/teams/${teamId}/addons`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "*/*",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "알 수 없는 네트워크 오류가 발생했습니다.";
    throw new Error(`[getTeamAddons] 네트워크 오류: ${message}`);
  }

  if (!response.ok) {
    throw new Error(
      `팀 애드온 조회 실패 (HTTP ${response.status} ${response.statusText ?? ""})`
    );
  }

  const result = (await response.json()) as TeamAddonsApiResponse;

  if (!result.success || !result.data || !Array.isArray(result.data.addons)) {
    throw new Error("팀 애드온 조회 실패: 응답 데이터가 올바르지 않습니다.");
  }

  return result.data.addons;
};
