import { getAccessToken, isAuthenticated } from "../auth/token";
import { fetchWithTimeout } from "../fetch";

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

// 빌드 타입별 필수 필드 정의
const BUILD_REQUIRED_FIELDS: Record<string, string[]> = {
  gradle: ["version", "buildCommand", "outputPath"],
  node_js: ["version", "buildCommand", "startCommand"],
  react: ["version", "buildCommand", "outputPath"],
  vite: ["version", "buildCommand", "outputPath"],
  vue: ["version", "buildCommand", "outputPath"],
  next_js: ["version", "buildCommand", "startCommand"],
  go: ["version", "buildCommand", "outputPath"],
  rust: ["version", "buildCommand", "outputPath"],
  maven: ["version", "buildCommand", "outputPath"],
  django: ["version", "buildCommand", "startCommand"],
  flask: ["version", "buildCommand", "startCommand"],
  docker: ["inputPath", "workingDirectory"],
};

// 빌드 설정
export interface ApplicationBuildDetail {
  type: string;
  version?: string;
  buildCommand?: string;
  startCommand?: string;
  inputPath?: string;
  outputPath?: string;
  workingDirectory?: string;
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
  status: "pending" | "running" | "failed" | "stopped" | "published";
  configuration: ApplicationConfigurationDetail;
}

// API 응답
interface GetApplicationDetailApiResponse {
  success: boolean;
  data: ApplicationDetail;
}

/**
 * 런타임 유효성 검사: 응답 객체가 required fields를 포함하는지 확인
 */
const validateApplicationDetailResponse = (
  data: unknown
): data is GetApplicationDetailApiResponse => {
  if (typeof data !== "object" || data === null) {
    console.error(
      "[validateApplicationDetailResponse] data is not an object",
      data
    );
    return false;
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.success !== "boolean") {
    console.error(
      "[validateApplicationDetailResponse] success is not boolean",
      obj.success
    );
    return false;
  }

  if (typeof obj.data !== "object" || obj.data === null) {
    console.error(
      "[validateApplicationDetailResponse] data field is not an object",
      obj.data
    );
    return false;
  }

  const appDetail = obj.data as Record<string, unknown>;

  if (typeof appDetail.id !== "number") {
    console.error(
      "[validateApplicationDetailResponse] data.id is not a number",
      appDetail.id
    );
    return false;
  }

  if (typeof appDetail.teamId !== "number") {
    console.error(
      "[validateApplicationDetailResponse] data.teamId is not a number",
      appDetail.teamId
    );
    return false;
  }

  if (typeof appDetail.name !== "string" || !appDetail.name.trim()) {
    console.error(
      "[validateApplicationDetailResponse] data.name is not a non-empty string",
      appDetail.name
    );
    return false;
  }

  if (
    typeof appDetail.status !== "string" ||
    !["pending", "running", "failed", "stopped", "published"].includes(
      appDetail.status
    )
  ) {
    console.error(
      "[validateApplicationDetailResponse] data.status is not a valid status",
      appDetail.status
    );
    return false;
  }

  if (
    typeof appDetail.configuration !== "object" ||
    appDetail.configuration === null
  ) {
    console.error(
      "[validateApplicationDetailResponse] data.configuration is not an object",
      appDetail.configuration
    );
    return false;
  }

  const config = appDetail.configuration as Record<string, unknown>;

  if (typeof config.github !== "object" || config.github === null) {
    console.error(
      "[validateApplicationDetailResponse] data.configuration.github is not an object",
      config.github
    );
    return false;
  }

  const github = config.github as Record<string, unknown>;
  if (
    typeof github.owner !== "string" ||
    typeof github.repo !== "string" ||
    typeof github.branch !== "string" ||
    typeof github.installationId !== "string" ||
    typeof github.hash !== "string"
  ) {
    console.error(
      "[validateApplicationDetailResponse] github fields are invalid",
      github
    );
    return false;
  }

  if (!Array.isArray(github.triggerPaths)) {
    console.error(
      "[validateApplicationDetailResponse] github.triggerPaths is not an array",
      github.triggerPaths
    );
    return false;
  }

  if (typeof config.build !== "object" || config.build === null) {
    console.error(
      "[validateApplicationDetailResponse] data.configuration.build is not an object",
      config.build
    );
    return false;
  }

  const build = config.build as Record<string, unknown>;
  if (typeof build.type !== "string") {
    console.error(
      "[validateApplicationDetailResponse] build.type is not a string",
      build.type
    );
    return false;
  }

  // 빌드 타입별로 필요한 필드 검증
  const requiredFields = BUILD_REQUIRED_FIELDS[build.type] || [];
  for (const fieldName of requiredFields) {
    const fieldValue = build[fieldName];
    if (typeof fieldValue !== "string" || !fieldValue.trim()) {
      console.error(
        `[validateApplicationDetailResponse] build.${fieldName} is required for type ${build.type}`,
        fieldValue
      );
      return false;
    }
  }

  // 옵셔널 필드는 있으면 string이어야 함
  const optionalFields = [
    "version",
    "buildCommand",
    "startCommand",
    "inputPath",
    "outputPath",
    "workingDirectory",
  ];
  for (const fieldName of optionalFields) {
    const fieldValue = build[fieldName];
    if (fieldValue !== undefined && typeof fieldValue !== "string") {
      console.error(
        `[validateApplicationDetailResponse] build.${fieldName} must be a string if provided`,
        fieldValue
      );
      return false;
    }
  }

  // Validate endpoints array
  if (!Array.isArray(config.endpoints)) {
    console.error(
      "[validateApplicationDetailResponse] data.configuration.endpoints is not an array",
      config.endpoints
    );
    return false;
  }

  for (const endpoint of config.endpoints) {
    if (
      typeof endpoint !== "object" ||
      endpoint === null ||
      typeof (endpoint as Record<string, unknown>).port !== "number" ||
      !Array.isArray((endpoint as Record<string, unknown>).routes)
    ) {
      console.error(
        "[validateApplicationDetailResponse] endpoint is invalid",
        endpoint
      );
      return false;
    }
  }

  return true;
};

/**
 * 애플리케이션 상세 조회
 * - GET {API_BASE_URL}/applications/{applicationId}
 *
 */
export const getApplicationDetail = async (
  applicationId: number
): Promise<ApplicationDetail> => {
  // 시작 로그: 요청 ID
  // console.log("[getApplicationDetail] start", { applicationId });

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
    /* console.log(
      "[getApplicationDetail] GET",
      `${API_BASE_URL}/applications/${applicationId}`
    ); */
    response = await fetchWithTimeout(
      `${API_BASE_URL}/applications/${applicationId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "*/*",
        },
      }
    );
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

  let result: unknown;

  try {
    result = await response.json();
  } catch {
    let rawBody = "";
    try {
      rawBody = await response.clone().text();
    } catch {
      rawBody = "본문을 읽을 수 없습니다";
    }
    console.error("[getApplicationDetail] parse error", {
      status: response.status,
      url: response.url,
      body: rawBody,
    });
    throw new Error(
      `서버 응답을 파싱할 수 없습니다. (status: ${response.status}, url: ${response.url}, body: ${rawBody})`
    );
  }

  // Runtime validation
  if (!validateApplicationDetailResponse(result)) {
    console.error("[getApplicationDetail] validation error", {
      status: response.status,
      url: response.url,
      data: result,
    });
    throw new Error(
      `애플리케이션 조회 실패: 서버 응답 형식이 올바르지 않습니다. (status: ${response.status}, url: ${response.url})`
    );
  }

  if (!result.success) {
    console.error("[getApplicationDetail] response success is false", result);
    throw new Error("애플리케이션 조회 실패: 서버에서 실패를 반환했습니다.");
  }

  // console.log("[getApplicationDetail] success", result.data.id);
  return result.data;
};
