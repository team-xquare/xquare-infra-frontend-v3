import { getAccessToken, isAuthenticated } from "../auth/token";
import { fetchWithTimeout } from "../fetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface TeamMemberUpdate {
  id: number;
  role: "admin" | "contributor";
}

export interface UpdateTeamMembersRequest {
  members: TeamMemberUpdate[];
}

interface UpdateTeamMembersApiResponse {
  success: boolean;
}

/**
 * 팀 멤버 추가 또는 수정
 * - 경로: PATCH {API_BASE_URL}/api/v1/teams/{teamId}/members
 * - 헤더: Authorization Bearer, Content-Type: application/json
 */
export const updateTeamMembers = async (
  teamId: number,
  request: UpdateTeamMembersRequest
): Promise<void> => {
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
    response = await fetchWithTimeout(
      `${API_BASE_URL}/teams/${teamId}/members`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify(request),
      }
    );
  } catch (err) {
    console.error("[updateTeamMembers] fetch 실패:", err);
    throw new Error("네트워크 오류가 발생했습니다.");
  }

  if (!response.ok) {
    console.error("[updateTeamMembers] 응답 에러:", response.status);

    if (response.status === 403) {
      throw new Error(
        "팀 멤버는 팀원을 추가할 수 없습니다. 관리자 계정으로 시도하세요."
      );
      console.error(
        "[updateTeamMembers] 권한 없음: 팀 멤버는 팀원을 추가할 수 없습니다."
      );
    }

    throw new Error(
      `팀 멤버 수정에 실패했습니다. (status: ${response.status})`
    );
  }

  let json: UpdateTeamMembersApiResponse;

  try {
    json = await response.json();
  } catch (err) {
    console.error("[updateTeamMembers] JSON 파싱 실패:", err);
    throw new Error("서버 응답을 파싱할 수 없습니다.");
  }

  if (!json.success) {
    throw new Error("팀 멤버 수정에 실패했습니다.");
  }
};
