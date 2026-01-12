import { getAccessToken, isAuthenticated } from "../auth/token";
import { fetchWithTimeout } from "../fetch";
import type { ApplicationConfigurationDetail } from "./detail";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 설정 수정 요청
export interface UpdateApplicationConfigurationRequest {
  configuration: ApplicationConfigurationDetail;
}

// API 응답
interface UpdateApplicationConfigurationApiResponse {
  success: boolean;
}

/**
 * 애플리케이션 설정 수정
 * - PUT {API_BASE_URL}/applications/{applicationId}/configuration
 *
 */
export const updateApplicationConfiguration = async (
  applicationId: number,
  request: UpdateApplicationConfigurationRequest
): Promise<void> => {
  // console.log("[updateApplicationConfiguration] start", { applicationId });

  if (!isAuthenticated()) {
    console.error("[updateApplicationConfiguration] not authenticated");
    throw new Error("인증되지 않은 상태입니다.");
  }

  if (!API_BASE_URL) {
    console.error("[updateApplicationConfiguration] missing API_BASE_URL");
    throw new Error("API_BASE_URL이 설정되어 있지 않습니다.");
  }

  const accessToken = getAccessToken();
  if (!accessToken) {
    console.error("[updateApplicationConfiguration] missing access token");
    throw new Error("AccessToken이 없습니다.");
  }

  let response: Response;

  try {
    /* console.log(
      "[updateApplicationConfiguration] PUT",
      `${API_BASE_URL}/applications/${applicationId}/configuration`
    ); */
    response = await fetchWithTimeout(
      `${API_BASE_URL}/applications/${applicationId}/configuration`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify(request),
      }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "알 수 없는 네트워크 오류가 발생했습니다.";
    console.error("[updateApplicationConfiguration] network error", message);
    throw new Error(
      `[updateApplicationConfiguration] 네트워크 오류: ${message}`
    );
  }

  if (!response.ok) {
    if (response.status === 401) {
      console.error("[updateApplicationConfiguration] unauthorized (401)");
      throw new Error("인증이 만료되었거나 유효하지 않습니다. (401)");
    }
    if (response.status === 403) {
      console.error("[updateApplicationConfiguration] forbidden (403)");
      throw new Error("애플리케이션 수정 권한이 없습니다. (403)");
    }
    if (response.status === 404) {
      console.error("[updateApplicationConfiguration] not found (404)");
      throw new Error("애플리케이션을 찾을 수 없습니다. (404)");
    }
    console.error(
      "[updateApplicationConfiguration] http error",
      response.status,
      response.statusText
    );
    throw new Error(
      `애플리케이션 설정 수정 실패 (HTTP ${response.status} ${response.statusText ?? ""})`
    );
  }

  let result: UpdateApplicationConfigurationApiResponse;

  try {
    result =
      (await response.json()) as UpdateApplicationConfigurationApiResponse;
  } catch {
    let rawBody = "";
    try {
      rawBody = await response.clone().text();
    } catch {
      rawBody = "본문을 읽을 수 없습니다";
    }
    console.error("[updateApplicationConfiguration] parse error", {
      status: response.status,
      body: rawBody,
    });
    throw new Error(
      `서버 응답을 파싱할 수 없습니다. (status: ${response.status}, url: ${response.url}, body: ${rawBody})`
    );
  }

  if (!result.success) {
    console.error("[updateApplicationConfiguration] invalid response", result);
    throw new Error(
      "애플리케이션 설정 수정 실패: 응답 데이터가 올바르지 않습니다."
    );
  }

  // console.log("[updateApplicationConfiguration] success");
};
