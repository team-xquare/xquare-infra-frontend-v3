import { getAccessToken, isAuthenticated } from "../auth/token";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface TeamMember {
  userId: number;
  role: "admin" | "member";
}

export interface Team {
  id: number;
  name: string;
  type: "club" | "project" | string;
  members: TeamMember[];
}

interface TeamsApiResponse {
  success: boolean;
  data: {
    teams: Team[];
  };
}

/**
 * 현재 유저의 전체 팀 조회
 * - 경로: GET {API_BASE_URL}/api/v1/teams
 * - 헤더: Authorization Bearer, Accept: all
 */
export const getTeams = async (): Promise<Team[]> => {
  if (!isAuthenticated()) {
    throw new Error("인증되지 않은 상태입니다.");
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
    response = await fetch(`${API_BASE_URL}/teams`, {
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
    throw new Error(`[getTeams] 네트워크 오류: ${message}`);
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("인증이 만료되었거나 유효하지 않습니다. (401)");
    }
    if (response.status === 403) {
      throw new Error("팀 목록에 접근 권한이 없습니다. (403)");
    }
    throw new Error(
      `팀 목록 조회 실패 (HTTP ${response.status} ${response.statusText ?? ""})`
    );
  }

  const result = (await response.json()) as TeamsApiResponse;

  if (!result.success || !result.data || !Array.isArray(result.data.teams)) {
    throw new Error("팀 목록 조회 실패: 응답 데이터가 올바르지 않습니다.");
  }

  return result.data.teams;
};
