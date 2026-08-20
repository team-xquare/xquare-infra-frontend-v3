import { fetchWithTimeout } from "../fetch";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("VITE_API_BASE_URL 환경 변수가 설정되지 않았습니다.");
}

export interface ResetPasswordRequest {
  passwordResetToken: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
}

export async function resetPasswordUser(
  payload: ResetPasswordRequest,
): Promise<ResetPasswordResponse> {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/auth/recovery/password`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || "비밀번호 재설정 실패";
      console.error(
        "[Auth-resetPassword] 실패:",
        errorMessage,
        "(Status:",
        res.status,
        ")",
      );
      throw new Error(errorMessage);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error("[Auth-resetPassword] 에러:", error.message);
      throw error;
    }
    console.error("[Auth-resetPassword] 알 수 없는 에러");
    throw new Error("네트워크 오류가 발생했습니다.");
  }
}
