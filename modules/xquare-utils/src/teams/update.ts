import { getAccessToken, isAuthenticated } from "../auth/token";
import { fetchWithTimeout } from "../fetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface UpdateTeamRequest {
  name: string;
  type: "club" | "team" | "individual";
}

interface UpdateTeamApiResponse {
  success: boolean;
}

//팀 정보 수정
export const updateTeam = async (
  teamId: number,
  request: UpdateTeamRequest
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
    response = await fetchWithTimeout(`${API_BASE_URL}/teams/${teamId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify(request),
    });
  } catch (err) {
    console.error("[updateTeam] fetch 실패:", err);
    throw new Error("네트워크 오류가 발생했습니다.");
  }

  if (!response.ok) {
    console.error("[updateTeam] 응답 에러:", response.status);
    throw new Error(`팀 수정에 실패했습니다. (status: ${response.status})`);
  }

  let json: UpdateTeamApiResponse;

  try {
    json = await response.json();
  } catch (err) {
    console.error("[updateTeam] JSON 파싱 실패:", err);
    throw new Error("서버 응답을 파싱할 수 없습니다.");
  }

  if (!json.success) {
    throw new Error("팀 수정에 실패했습니다.");
  }
};
