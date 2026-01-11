import { getAccessToken, isAuthenticated } from "../auth/token";
import { fetchWithTimeout } from "../fetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface EnvironmentVariable {
  name: string;
  value: string;
}

export interface EnvironmentVariablesResponse {
  [key: string]: string;
}

// 환경변수 조회
export const getEnvironmentVariables = async (
  applicationId: number
): Promise<EnvironmentVariable[]> => {
  // console.log("[environment] getEnvironmentVariables", { applicationId });

  if (!isAuthenticated()) {
    throw new Error("인증이 필요합니다");
  }

  const accessToken = getAccessToken();
  const url = `${API_BASE_URL}/applications/${applicationId}/environment-variables`;

  try {
    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "*/*",
      },
    });

    if (!response.ok) {
      console.error("[environment] getEnvironmentVariables error", {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(
        `환경변수 조회 실패 (HTTP ${response.status} ${response.statusText || ""})`
      );
    }

    const data: EnvironmentVariablesResponse = await response.json();

    // 객체를 배열로 변환
    const variables = Object.entries(data).map(([name, value]) => ({
      name,
      value,
    }));

    /* console.log("[environment] getEnvironmentVariables success", {
      applicationId,
      count: variables.length,
    }); */

    return variables;
  } catch (error) {
    console.error("[environment] getEnvironmentVariables exception", {
      applicationId,
      error,
    });
    throw error;
  }
};
