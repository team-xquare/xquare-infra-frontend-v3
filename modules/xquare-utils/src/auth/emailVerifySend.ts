import { fetchWithTimeout } from "../fetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface EmailVerifySendRequest {
  email: string;
}

export interface EmailVerifySendResponse {
  success: boolean;
}

/**
 * 이메일 인증
 * - POST {API_BASE_URL}/api/v1/email/send
 */
export async function emailVerifySend(
  payload: EmailVerifySendRequest,
): Promise<EmailVerifySendResponse> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/auth/email/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "이메일 발송 실패");
    }
    const data = await res.json();

    return data as EmailVerifySendResponse;
  } catch (error) {
    // 네트워크 오류 또는 기타 오류 처리
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("네트워크 오류가 발생했습니다.");
  }
}
