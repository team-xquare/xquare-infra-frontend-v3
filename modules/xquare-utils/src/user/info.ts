import { getAccessToken, isAuthenticated } from "../auth/token";
import { fetchWithTimeout } from "../fetch";

export interface UserDetail {
  id: number;
  username: string;
  role: string;
  studentNumber: number;
  name: string;
  email: string;
}

export interface GetUserDetailResponse {
  success: boolean;
  data: UserDetail;
}

/**
 * 유저 상세 정보를 조회합니다.
 * @param userId 유저의 ID
 * @returns 유저 상세 정보
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getUserDetail(
  userId: number,
): Promise<UserDetail | null> {
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

  const url = `${API_BASE_URL}/users/${userId}`;

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
    console.error("[getUserDetail] fetch 실패", err);
    throw new Error("유저 정보 조회 중 네트워크 오류가 발생했습니다.");
  }

  if (!response.ok) {
    console.error("[getUserDetail] 응답 에러", response.status);
    throw new Error(
      `유저 정보 조회에 실패했습니다. (status: ${response.status})`,
    );
  }

  let json: GetUserDetailResponse;
  try {
    json = await response.json();
  } catch (err) {
    console.error("[getUserDetail] JSON 파싱 실패", err);
    throw new Error("유저 정보를 파싱할 수 없습니다.");
  }

  if (!json.success || !json.data) {
    return null;
  }

  return json.data;
}
