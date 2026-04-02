import { getAccessToken, isAuthenticated } from "../auth/token";
import { fetchWithTimeout } from "../fetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface DeleteMemberRequest {
  ids: number[];
}

export interface DeleteTeamMemberResponse {
  success: boolean;
}

export const deleteTeamMembers = async (
  teamId: number,
  request: DeleteMemberRequest,
): Promise<void> => {
  if (!Number.isInteger(teamId) || teamId <= 0) {
    throw new Error("유효하지 않은 팀 ID입니다.");
  }
  if (!Array.isArray(request.ids) || request.ids.length === 0) {
    throw new Error("삭제할 멤버 ID 목록이 비어있습니다.");
  }
  if (request.ids.some((id) => !Number.isInteger(id) || id <= 0)) {
    throw new Error("유효하지 않은 멤버 ID가 포함되어 있습니다.");
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
    response = await fetchWithTimeout(
      `${API_BASE_URL}/teams/${teamId}/members`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify(request),
      },
    );
  } catch (err) {
    console.error("[deleteTeamMembers] fetch 실패:", err);
    throw new Error("네트워크 오류가 발생했습니다.");
  }

  if (!response.ok) {
    console.error("[deleteTeamMembers] 응답 에러:", response.status);
    throw new Error(
      `팀 멤버 삭제에 실패했습니다. (status: ${response.status})`,
    );
  }

  let json: DeleteTeamMemberResponse;

  try {
    json = await response.json();
  } catch (err) {
    console.error("[deleteTeamMembers] JSON 파싱 실패:", err);
    throw new Error("서버 응답을 파싱할 수 없습니다.");
  }

  if (!json.success) {
    throw new Error("팀 멤버 삭제에 실패했습니다.");
  }
};
