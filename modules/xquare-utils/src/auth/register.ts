import { validateAuthResponse } from "./validation";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("VITE_API_BASE_URL 환경 변수가 설정되지 않았습니다.");
}

export interface RegisterRequest {
  username: string;
  password: string;
  studentNumber: number;
  name: string;
  email: string;
}

export interface RegisterResponseData {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  success: boolean;
  data: RegisterResponseData;
}

export async function registerUser(
  payload: RegisterRequest
): Promise<RegisterResponse> {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || "회원가입 실패";
      console.error(
        "[Auth-register] 실패:",
        errorMessage,
        "(Status:",
        res.status,
        ")"
      );
      throw new Error(errorMessage);
    }
    const data = await res.json();

    // 응답 구조 검증
    // 검증 통과한 토큰 저장
  validateAuthResponse(data, "register");

    return data as RegisterResponse;
  } catch (error) {
    // 네트워크 오류 또는 기타 오류 처리
    if (error instanceof Error) {
      console.error("[Auth-register] 에러:", error.message);
      throw error;
    }
    console.error("[Auth-register] 알 수 없는 에러");
    throw new Error("네트워크 오류가 발생했습니다.");
  }
}
