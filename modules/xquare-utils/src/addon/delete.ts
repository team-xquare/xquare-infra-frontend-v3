import { getAccessToken, isAuthenticated } from "../auth/token";
import { fetchWithTimeout } from "../fetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface DeleteAddonApiResponse {
  success: boolean;
}

// 애드온 삭제 요청
export const deleteAddon = async (addonId: number): Promise<void> => {
  if (!isAuthenticated()) {
    console.error("[deleteAddon] not authenticated");
    throw new Error("인증되지 않은 상태입니다.");
  }

  if (!API_BASE_URL) {
    console.error("[deleteAddon] missing API_BASE_URL");
    throw new Error("API_BASE_URL이 설정되어 있지 않습니다.");
  }

  if (
    typeof addonId !== "number" ||
    !Number.isFinite(addonId) ||
    addonId <= 0
  ) {
    throw new Error("유효한 애드온 ID가 필요합니다.");
  }

  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("AccessToken이 없습니다.");
  }

  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/addons/${addonId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[deleteAddon] API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      throw new Error(
        errorData?.message ||
          `애드온 삭제 실패: ${response.status} ${response.statusText}`,
      );
    }

    // 204 No Content: 응답 바디가 없으므로 JSON 파싱을 건너뜁니다.
    if (response.status === 204) {
      return;
    }

    const result = (await response.json()) as DeleteAddonApiResponse;

    if (!result.success) {

    }
  } catch (error) {
    console.error("[deleteAddon] error", error);
    throw error;
  }
};
