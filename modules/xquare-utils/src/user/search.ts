import { getAccessToken, isAuthenticated } from "../auth/token";
import { fetchWithTimeout } from "../fetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface UserSearchResult {
  id: number;
  username: string;
  role: "ADMIN" | "USER" | string;
  studentNumber: number;
  name: string;
  email: string;
}

interface UserSearchResponse {
  success: boolean;
  data?: {
    user: UserSearchResult[];
  };
}

export const searchUsersByName = async (
  name: string
): Promise<UserSearchResult[]> => {
  if (!isAuthenticated()) {
    throw new Error("인증되지 않은 상태입니다.");
  }

  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL이 설정되어 있지 않습니다.");
  }

  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("검색할 이름을 입력해주세요.");
  }

  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("AccessToken이 없습니다.");
  }

  const url = `${API_BASE_URL}/users/search?name=${encodeURIComponent(trimmed)}`;

  let response: Response;
  try {
    response = await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "*/*",
      },
    });
  } catch (err) {
    console.error("[searchUsersByName] fetch 실패", err);
    throw new Error("유저 검색 중 네트워크 오류가 발생했습니다.");
  }

  if (!response.ok) {
    console.error("[searchUsersByName] 응답 에러", response.status);
    throw new Error(`유저 검색에 실패했습니다. (status: ${response.status})`);
  }

  let json: UserSearchResponse;
  try {
    json = await response.json();
  } catch (err) {
    console.error("[searchUsersByName] JSON 파싱 실패", err);
    throw new Error("검색 결과를 파싱할 수 없습니다.");
  }

  if (!json.success || !json.data?.user) {
    return [];
  }

  return json.data.user;
};
