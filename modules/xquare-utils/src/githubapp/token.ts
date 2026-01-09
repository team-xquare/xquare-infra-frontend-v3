import { fetchWithTimeout } from "../fetch";
import type { GithubTokenRequest, GithubTokenResponse } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL 환경 변수가 설정되지 않았습니다.");
}

export async function exchangeGithubToken(
  code: string
): Promise<GithubTokenResponse> {
  try {
    const payload: GithubTokenRequest = { code };

    const res = await fetchWithTimeout(`${API_BASE_URL}/github/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "GitHub 토큰 교환에 실패했습니다.");
    }

    const data = await res.json();
    return data as GithubTokenResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("GitHub 연동 중 오류가 발생했습니다.");
  }
}
