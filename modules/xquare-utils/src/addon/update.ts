import { getAccessToken, isAuthenticated } from "../auth/token";
import { fetchWithTimeout } from "../fetch";

export interface UpdateAddonRequest {
  storageGi: number;
}

interface UpdateAddonApiResponse {
  success: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 애드온 정보를 수정하는 함수
 * - 경로: PATCH {API_BASE_URL}/addons/{addonId}
 * - 헤더: Authorization Bearer, Content-Type: application/json
 */
export const updateAddon = async (
  addonId: number,
  request: UpdateAddonRequest,
): Promise<void> => {
  if (!isAuthenticated()) {
    throw new Error("인증되지 않은 상태입니다.");
  }

  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL이 설정되어 있지 않습니다.");
  }

  if (typeof addonId !== "number" || Number.isNaN(addonId) || addonId <= 0) {
    throw new Error("유효한 애드온 ID가 필요합니다.");
  }

  if (
    typeof request.storageGi !== "number" ||
    Number.isNaN(request.storageGi) ||
    request.storageGi < 0
  ) {
    throw new Error("유효한 스토리지 용량(GiB)이 필요합니다.");
  }

  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("AccessToken이 없습니다.");
  }

  const url = `${API_BASE_URL}/addons/${addonId}`;

  let response: Response;

  try {
    response = await fetchWithTimeout(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({ storageGi: request.storageGi }),
    });
  } catch (error) {
    console.error("[updateAddon] fetch 실패:", error);
    throw new Error("네트워크 오류가 발생했습니다.");
  }

  if (!response.ok) {
    let message = `애드온 수정에 실패했습니다. (status: ${response.status})`;

    try {
      const errorData = await response.json();
      if (errorData && typeof errorData.message === "string") {
        message = errorData.message;
      }
    } catch (parseError) {
      console.error("[updateAddon] 오류 응답 파싱 실패:", parseError);
    }

    throw new Error(message);
  }

  try {
    const result: UpdateAddonApiResponse = await response.json();
    if (!result.success) {
      throw new Error("애드온 수정에 실패했습니다.");
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "애드온 수정에 실패했습니다."
    ) {
      throw error;
    }

    console.error("[updateAddon] JSON 파싱 실패:", error);
    throw new Error("서버 응답을 파싱할 수 없습니다.");
  }
};
