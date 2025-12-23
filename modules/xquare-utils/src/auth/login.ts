import { validateAuthResponse } from "./validation";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("VITE_API_BASE_URL 환경 변수가 설정되지 않았습니다.");
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  success: boolean;
  data: LoginResponseData;
}

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "로그인 실패");
    }
    const data = await res.json();

    // 응답 구조 검증
  validateAuthResponse(data, "login");

    return data as LoginResponse;
  } catch (error) {
    // 네트워크 오류 또는 기타 오류 처리
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("네트워크 오류가 발생했습니다.");
  }
}
