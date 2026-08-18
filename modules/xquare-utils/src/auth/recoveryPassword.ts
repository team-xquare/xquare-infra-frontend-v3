import { fetchWithTimeout } from "../fetch";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface RecoveryPasswordEmailSendRequest {
  username: string;
  studentNumber: number;
  name: string;
  email: string;
}

export interface RecoveryPasswordEmailVerifyRequest {
  username: string;
  studentNumber: number;
  name: string;
  email: string;
  otp: string;
}

export interface RecoveryPasswordEmailVerifyResponse {
  success: boolean;
  data: {
    passwordResetToken: string;
  };
}

export interface BaseSuccessResponse {
  success: boolean;
}

// 비밀번호 재설정 이메일 발송
export async function sendRecoveryPasswordEmail(
  payload: RecoveryPasswordEmailSendRequest,
): Promise<BaseSuccessResponse> {
  try {
    const res = await fetchWithTimeout(
      `${BASE_URL}/auth/recovery/password/email/send`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage =
        errorData.message || errorData.data?.errorCode || "OTP 발송 실패";
      console.error("[Auth-recoveryPasswordSend] 실패:", errorMessage);
      throw new Error(errorMessage);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("네트워크 오류가 발생했습니다.");
  }
}

// 비밀번호 재설정 이메일 검증
export async function verifyRecoveryPasswordEmail(
  payload: RecoveryPasswordEmailVerifyRequest,
): Promise<RecoveryPasswordEmailVerifyResponse> {
  try {
    const res = await fetchWithTimeout(
      `${BASE_URL}/auth/recovery/password/email/verify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage =
        errorData.message || errorData.data?.errorCode || "OTP 검증 실패";
      console.error("[Auth-recoveryPasswordVerify] 실패:", errorMessage);
      throw new Error(errorMessage);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("네트워크 오류가 발생했습니다.");
  }
}
