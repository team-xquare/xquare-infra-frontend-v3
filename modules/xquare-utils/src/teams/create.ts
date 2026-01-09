import { getAccessToken, isAuthenticated } from "../auth/token";
import { fetchWithTimeout } from "../fetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface CreateTeamMember {
  id: number;
  role: "admin" | "member";
}

export interface CreateTeamRequest {
  name: string;
  type: "club" | "team" | "individual";
  initialMembers: CreateTeamMember[];
}

/**
 * 팀 이름 검증 함수
 * - 3~45자
 * - 알파벳 소문자만 허용
 */
export function validateTeamName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: "팀 이름을 입력해주세요." };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 3) {
    return { valid: false, error: "팀 이름은 최소 3자 이상이어야 합니다." };
  }

  if (trimmedName.length > 45) {
    return { valid: false, error: "팀 이름은 최대 45자까지 가능합니다." };
  }

  const lowercasePattern = /^[a-z]+$/;
  if (!lowercasePattern.test(trimmedName)) {
    return { valid: false, error: "팀 이름은 알파벳 소문자만 사용 가능합니다." };
  }

  return { valid: true };
}

interface CreateTeamApiResponse {
  success: boolean;
  data: {
    id: number;
  };
}

/**
 * 새로운 팀 생성
 * - 경로: POST {API_BASE_URL}/api/v1/teams
 * - 헤더: Authorization Bearer, Content-Type: application/json
 */
export const createTeam = async (
  request: CreateTeamRequest
): Promise<number> => {
  // 팀 이름 검증
  const validation = validateTeamName(request.name);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

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
    response = await fetchWithTimeout(`${API_BASE_URL}/teams`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify(request),
    });
  } catch (err) {
    console.error("[createTeam] fetch 실패:", err);
    throw new Error("네트워크 오류가 발생했습니다.");
  }

  if (!response.ok) {
    console.error("[createTeam] 응답 에러:", response.status);
    throw new Error(`팀 생성에 실패했습니다. (status: ${response.status})`);
  }

  let json: CreateTeamApiResponse;

  try {
    json = await response.json();
  } catch (err) {
    console.error("[createTeam] JSON 파싱 실패:", err);
    throw new Error("서버 응답을 파싱할 수 없습니다.");
  }

  if (!json.success || !json.data?.id) {
    throw new Error("팀 생성에 실패했습니다.");
  }

  return json.data.id;
};
