import { getAccessToken, isAuthenticated } from "../auth/token";
import { fetchWithTimeout } from "../fetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface AddOrUpdateEnvironmentVariableRequest {
  name: string;
  value: string;
}

// 환경변수 추가 또는 수정
export const addOrUpdateEnvironmentVariable = async (
  applicationId: number,
  request: AddOrUpdateEnvironmentVariableRequest
): Promise<void> => {
  console.log("[environment] addOrUpdateEnvironmentVariable", {
    applicationId,
    name: request.name,
  });

  if (!isAuthenticated()) {
    throw new Error("인증이 필요합니다");
  }

  if (!request.name?.trim()) {
    throw new Error("환경변수 이름이 필요합니다");
  }

  const accessToken = getAccessToken();
  const url = `${API_BASE_URL}/applications/${applicationId}/environment-variables`;

  try {
    const response = await fetchWithTimeout(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      console.error("[environment] addOrUpdateEnvironmentVariable error", {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(
        `환경변수 저장 실패 (HTTP ${response.status} ${response.statusText || ""})`
      );
    }

    console.log("[environment] addOrUpdateEnvironmentVariable success", {
      applicationId,
      name: request.name,
    });
  } catch (error) {
    console.error("[environment] addOrUpdateEnvironmentVariable exception", {
      applicationId,
      error,
    });
    throw error;
  }
};
