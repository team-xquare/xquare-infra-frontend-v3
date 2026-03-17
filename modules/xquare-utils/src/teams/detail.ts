import { getAccessToken, isAuthenticated } from "../auth/token";
import { fetchWithTimeout } from "../fetch";

export interface TeamMember {
  userId: number;
  role: "admin" | "member";
}

export interface TeamDetail {
  id: number;
  name: string;
  type: "club" | "team" | "individual" | string;
  members: TeamMember[];
}

interface TeamDetailApiResponse {
  success: boolean;
  data: TeamDetail;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 팀 상세정보 조회
 * - 경로: GET {API_BASE_URL}/teams/{teamId}
 * - 헤더: Authorization Bearer, Accept: all
 */
export const getTeamDetail = async (teamId: number): Promise<TeamDetail> => {
  if (!isAuthenticated()) {
    throw new Error("인증되지 않은 상태입니다.");
  }
  if (typeof teamId !== "number" || Number.isNaN(teamId)) {
    throw new Error("유효한 팀 ID가 필요합니다.");
  }
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL이 설정되어 있지 않습니다.");
  }
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("AccessToken이 없습니다.");
  }
  let response: Response;
  try {
    response = await fetchWithTimeout(`${API_BASE_URL}/teams/${teamId}`, {
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
    throw new Error(`[getTeamDetail] 네트워크 오류: ${message}`);
  }
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("인증이 만료되었거나 유효하지 않습니다. (401)");
    }
    if (response.status === 403) {
      throw new Error("팀 상세정보에 접근 권한이 없습니다. (403)");
    }
    throw new Error(
      `팀 상세정보 조회 실패 (HTTP ${response.status} ${response.statusText ?? ""})`,
    );
  }
  const result = (await response.json()) as TeamDetailApiResponse;
  if (!result.success || !result.data) {
    throw new Error("팀 상세정보 조회 실패: 응답 데이터가 올바르지 않습니다.");
  }
  return result.data;
};
