import { getAccessToken, isAuthenticated } from "../auth/token";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ApplicationEndpoint {
  port: number;
  routes: string[];
}

export interface ApplicationGitHub {
  owner: string;
  repo: string;
  branch: string;
  installationId: string;
  hash: string;
  triggerPaths: string[];
}

export interface ApplicationBuild {
  type: string;
  version: string;
  buildCommand: string;
  startCommand: string;
  inputPath: string;
  outputPath: string;
  workingDirectory: string;
}

export interface ApplicationConfiguration {
  tier?: string;
  github: ApplicationGitHub;
  build: ApplicationBuild;
  endpoints: ApplicationEndpoint[];
}

export interface CreateApplicationRequest {
  teamId: number;
  name: string;
  configuration: ApplicationConfiguration;
}

interface CreateApplicationApiResponse {
  success: boolean;
  data: {
    applicationId: number;
  };
}

/**
 * 애플리케이션 생성
 * - POST {API_BASE_URL}/api/v1/applications
 */
export const createApplication = async (
  request: CreateApplicationRequest
): Promise<number> => {
  if (!isAuthenticated()) {
    console.error("[createApplication] not authenticated");
    throw new Error("인증되지 않은 상태입니다.");
  }

  if (!API_BASE_URL) {
    console.error("[createApplication] missing API_BASE_URL");
    throw new Error("API_BASE_URL이 설정되어 있지 않습니다.");
  }

  if (typeof request.teamId !== "number" || Number.isNaN(request.teamId)) {
    throw new Error("유효한 팀 ID가 필요합니다.");
  }

  if (!request.name?.trim()) {
    throw new Error("애플리케이션 이름이 필요합니다.");
  }

  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("AccessToken이 없습니다.");
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/applications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify(request),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "알 수 없는 네트워크 오류가 발생했습니다.";
    console.error("[createApplication] network error", message);
    throw new Error(`[createApplication] 네트워크 오류: ${message}`);
  }

  if (!response.ok) {
    if (response.status === 401) {
      console.error("[createApplication] unauthorized (401)");
      throw new Error("인증이 만료되었거나 유효하지 않습니다. (401)");
    }
    if (response.status === 403) {
      console.error("[createApplication] forbidden (403)");
      throw new Error("애플리케이션 생성 권한이 없습니다. (403)");
    }
    console.error("[createApplication] http error", response.status, response.statusText);
    throw new Error(
      `애플리케이션 생성 실패 (HTTP ${response.status} ${response.statusText ?? ""})`
    );
  }

  let result: CreateApplicationApiResponse;

  try {
    result = (await response.json()) as CreateApplicationApiResponse;
  } catch {
    let rawBody = "";
    try {
      rawBody = await response.clone().text();
    } catch {
      rawBody = "본문을 읽을 수 없습니다";
    }
    throw new Error(
      `서버 응답을 파싱할 수 없습니다. (status: ${response.status}, url: ${response.url}, body: ${rawBody})`
    );
  }

  if (!result.success || !result.data?.applicationId) {
    console.error("[createApplication] invalid response", result);
    throw new Error("애플리케이션 생성 실패: 응답 데이터가 올바르지 않습니다.");
  }

  console.log("[createApplication] success", result.data.applicationId);
  return result.data.applicationId;
};
