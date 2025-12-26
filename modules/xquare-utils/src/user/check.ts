import { getAccessToken, isAuthenticated } from "./../auth/token";

/* ======================
 * 타입
 * ====================== */

export interface Me {
  id: number;
  username: string;
  role: "ADMIN" | "USER";
  studentNumber: number;
  name: string;
  email: string;
}

interface MeApiResponse {
  success: boolean;
  data: Me;
}

/* ======================
 * API 호출
 * ====================== */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const USERNAME_CACHE_KEY = "xquare:username";

const canUseStorage = () =>
  typeof window !== "undefined" && !!window.localStorage;

export const getCachedUserName = (): string | null => {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(USERNAME_CACHE_KEY);
};

const writeCachedUserName = (username: string) => {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(USERNAME_CACHE_KEY, username);
  } catch (error) {
    console.warn("[CheckUser] 사용자명 캐시 저장 실패", error);
  }
};

export const CheckUser = async (): Promise<Me> => {
  if (!isAuthenticated()) {
    throw new Error("인증되지 않은 상태입니다.");
  }

  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("AccessToken이 없습니다.");
  }

  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "*/*",
    },
  });

  if (!response.ok) {
    throw new Error(`유저 조회 실패 (HTTP ${response.status})`);
  }

  const result = (await response.json()) as MeApiResponse;

  if (!result.success) {
    throw new Error("유저 조회 실패");
  }

  writeCachedUserName(result.data.username);

  return result.data;
};
