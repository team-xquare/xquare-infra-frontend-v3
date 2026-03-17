import { getAccessToken, isAuthenticated } from "../auth/token";
import { fetchWithTimeout } from "../fetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 환경 변수 삭제
 * - 경로: DELETE {API_BASE_URL}/applications/{applicationId}/environment-variables/{name}
 * - 헤더: Authorization Bearer, Content-Type: application/json
 */
export const deleteEnvironmentVariable = async (
  applicationId: number,
  name: string,
): Promise<void> => {
  /* console.log("[environment] deleteEnvironmentVariable", {
    applicationId,
    name,
  }); */

  if (!isAuthenticated()) {
    throw new Error("인증이 필요합니다");
  }

  if (!name?.trim()) {
    throw new Error("환경변수 이름이 필요합니다");
  }

  const accessToken = getAccessToken();
  const encodedName = encodeURIComponent(name);
  const url = `${API_BASE_URL}/applications/${applicationId}/environment-variables/${encodedName}`;

  try {
    const response = await fetchWithTimeout(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "*/*",
      },
    });

    if (!response.ok) {
      console.error("[environment] deleteEnvironmentVariable error", {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(
        `환경변수 삭제 실패 (HTTP ${response.status} ${response.statusText || ""})`,
      );
    }

    /* console.log("[environment] deleteEnvironmentVariable success", {
      applicationId,
      name,
    }); */
  } catch (error) {
    console.error("[environment] deleteEnvironmentVariable exception", {
      applicationId,
      error,
    });
    throw error;
  }
};
