import { getAccessToken, isAuthenticated } from "../auth/token";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// GitHub 설정
export interface ApplicationGitHubDetail {
  owner: string;
  repo: string;
  branch: string;
  installationId: string;
  hash: string;
  triggerPaths: string[];
}

// 빌드 설정
export interface ApplicationBuildDetail {
  type: string;
  version: string;
  buildCommand: string;
  startCommand: string;
  inputPath: string;
  outputPath: string;
  workingDirectory: string;
}

// 엔드포인트
export interface ApplicationEndpointDetail {
  port: number;
  routes: string[];
}

// 애플리케이션 설정
export interface ApplicationConfigurationDetail {
  tier?: string;
  github: ApplicationGitHubDetail;
  build: ApplicationBuildDetail;
  endpoints: ApplicationEndpointDetail[];
}

// 애플리케이션 상세 정보
export interface ApplicationDetail {
  id: number;
  teamId: number;
  name: string;
  status: "pending" | "running" | "failed" | "stopped";
  configuration: ApplicationConfigurationDetail;
}

// API 응답
interface GetApplicationDetailApiResponse {
  success: boolean;
  data: ApplicationDetail;
}

/**
 * 애플리케이션 상세 조회
 * - GET {API_BASE_URL}/applications/{applicationId}
 *
 */
export const getApplicationDetail = async (
  applicationId: number
): Promise<ApplicationDetail> => {
  // 시작 로그: 요청 ID
  console.log("[getApplicationDetail] start", { applicationId });

  if (!isAuthenticated()) {
    console.error("[getApplicationDetail] not authenticated");
    throw new Error("인증되지 않은 상태입니다.");
  }

  if (!API_BASE_URL) {
    console.error("[getApplicationDetail] missing API_BASE_URL");
    throw new Error("API_BASE_URL이 설정되어 있지 않습니다.");
  }

  const accessToken = getAccessToken();
  if (!accessToken) {
    console.error("[getApplicationDetail] missing access token");
    throw new Error("AccessToken이 없습니다.");
  }

  let response: Response;

  try {
    console.log(
      "[getApplicationDetail] GET",
      `${API_BASE_URL}/applications/${applicationId}`
    );
    response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "*/*",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "알 수 없는 네트워크 오류가 발생했습니다.";
    console.error("[getApplicationDetail] network error", message);
    throw new Error(`[getApplicationDetail] 네트워크 오류: ${message}`);
  }

  if (!response.ok) {
    if (response.status === 401) {
      console.error("[getApplicationDetail] unauthorized (401)");
      throw new Error("인증이 만료되었거나 유효하지 않습니다. (401)");
    }
    if (response.status === 403) {
      console.error("[getApplicationDetail] forbidden (403)");
      throw new Error("애플리케이션 조회 권한이 없습니다. (403)");
    }
    if (response.status === 404) {
      console.error("[getApplicationDetail] not found (404)");
      throw new Error("애플리케이션을 찾을 수 없습니다. (404)");
    }
    console.error(
      "[getApplicationDetail] http error",
      response.status,
      response.statusText
    );
    throw new Error(
      `애플리케이션 조회 실패 (HTTP ${response.status} ${response.statusText ?? ""})`
    );
  }

  let result: GetApplicationDetailApiResponse;

  try {
    result = (await response.json()) as GetApplicationDetailApiResponse;
  } catch {
    let rawBody = "";
    try {
      rawBody = await response.clone().text();
    } catch {
      rawBody = "본문을 읽을 수 없습니다";
    }
    console.error("[getApplicationDetail] parse error", {
      status: response.status,
      body: rawBody,
    });
    throw new Error(
      `서버 응답을 파싱할 수 없습니다. (status: ${response.status}, url: ${response.url}, body: ${rawBody})`
    );
  }

  if (!result.success || !result.data) {
    console.error("[getApplicationDetail] invalid response", result);
    throw new Error("애플리케이션 조회 실패: 응답 데이터가 올바르지 않습니다.");
  }

  console.log("[getApplicationDetail] success", result.data.id);
  return result.data;
};
