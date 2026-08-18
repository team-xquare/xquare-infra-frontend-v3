import { getAccessToken, isAuthenticated } from "../auth/token";
import { fetchWithTimeout } from "../fetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface DeleteApplicationApiResponse {
  success: boolean;
}

// 애플리케이션 삭제 요청
export const deleteApplication = async (
  applicationId: number,
): Promise<void> => {
  if (!isAuthenticated()) {
    console.error("[deleteApplication] not authenticated");
    throw new Error("인증되지 않은 상태입니다.");
  }

  if (!API_BASE_URL) {
    console.error("[deleteApplication] missing API_BASE_URL");
    throw new Error("API_BASE_URL이 설정되어 있지 않습니다.");
  }

  if (
    typeof applicationId !== "number" ||
    !Number.isFinite(applicationId) ||
    applicationId <= 0
  ) {
    throw new Error("유효한 애플리케이션 ID가 필요합니다.");
  }

  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("AccessToken이 없습니다.");
  }

  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/applications/${applicationId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[deleteApplication] API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      throw new Error(
        errorData?.message ||
          `애플리케이션 삭제 실패: ${response.status} ${response.statusText}`,
      );
    }

    if (response.status === 204) {
      return;
    }

    const responseText = await response.text();
    if (!responseText.trim()) {
      return;
    }

    let result: DeleteApplicationApiResponse;
    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error("삭제 응답을 해석할 수 없습니다.");
    }

    if (typeof result.success !== "boolean" || !result.success) {
      throw new Error("애플리케이션 삭제에 실패했습니다.");
    }
  } catch (error) {
    if (
      !(error instanceof Error) ||
      !error.message.includes("애플리케이션 삭제")
    ) {
      console.error("[deleteApplication] error", error);
    }
    throw error;
  }
};
