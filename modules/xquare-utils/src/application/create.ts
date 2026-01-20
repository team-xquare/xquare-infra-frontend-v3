import { getAccessToken, isAuthenticated } from "../auth/token";
import { fetchWithTimeout } from "../fetch";

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
  triggerPaths?: string[];
}

export interface ApplicationBuild {
  type: string;
  version?: string;
  buildCommand?: string;
  startCommand?: string;
  inputPath?: string;
  outputPath?: string;
  workingDirectory?: string;
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
  request: CreateApplicationRequest,
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

  // Validate configuration object exists
  if (!request.configuration) {
    console.error("[createApplication] missing configuration");
    throw new Error("애플리케이션 설정이 필요합니다.");
  }

  // Validate github configuration
  if (
    typeof request.configuration.github !== "object" ||
    request.configuration.github === null
  ) {
    console.error(
      "[createApplication] invalid github configuration",
      request.configuration.github,
    );
    throw new Error("GitHub 설정이 올바르지 않습니다.");
  }

  const { github } = request.configuration;

  if (typeof github.hash !== "string" || !github.hash.trim()) {
    console.error(
      "[createApplication] invalid or missing github.hash",
      github.hash,
    );
    throw new Error("GitHub 커밋 해시가 필요합니다.");
  }

  if (
    typeof github.installationId !== "string" ||
    !github.installationId.trim()
  ) {
    console.error(
      "[createApplication] invalid or missing github.installationId",
      github.installationId,
    );
    throw new Error("GitHub 설치 ID가 필요합니다.");
  }

  if (typeof github.branch !== "string" || !github.branch.trim()) {
    console.error(
      "[createApplication] invalid or missing github.branch",
      github.branch,
    );
    throw new Error("GitHub 브랜치가 필요합니다.");
  }

  // Validate build configuration
  if (
    typeof request.configuration.build !== "object" ||
    request.configuration.build === null
  ) {
    console.error(
      "[createApplication] invalid build configuration",
      request.configuration.build,
    );
    throw new Error("빌드 설정이 올바르지 않습니다.");
  }

  const ALLOWED_BUILD_TYPES = [
    "gradle",
    "node_js",
    "react",
    "vite",
    "vue",
    "next_js",
    "go",
    "rust",
    "maven",
    "django",
    "flask",
    "docker",
  ];

  if (
    typeof request.configuration.build.type !== "string" ||
    !ALLOWED_BUILD_TYPES.includes(request.configuration.build.type)
  ) {
    console.error(
      "[createApplication] invalid build.type",
      request.configuration.build.type,
      `allowed: ${ALLOWED_BUILD_TYPES.join(", ")}`,
    );
    throw new Error(
      `유효하지 않은 빌드 타입입니다. (허용: ${ALLOWED_BUILD_TYPES.join(", ")})`,
    );
  }

  // Validate build required fields per type (keeps client + server aligned)
  const REQUIRED_BUILD_FIELDS: Record<string, Array<keyof ApplicationBuild>> = {
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

  const build = request.configuration.build;
  const requiredFields = REQUIRED_BUILD_FIELDS[build.type] ?? [];

  const ensureField = (field: keyof ApplicationBuild, label: string): void => {
    const value = build[field];
    if (requiredFields.includes(field)) {
      const validString = typeof value === "string" && value.trim() !== "";
      if (!validString) {
        console.error(`[createApplication] missing build.${field}`, value);
        throw new Error(`${label}을(를) 입력해주세요.`);
      }
    }
  };

  ensureField("version", "빌드 버전");
  ensureField("buildCommand", "빌드 커맨드");
  ensureField("startCommand", "시작 커맨드");
  ensureField("inputPath", "입력 경로");
  ensureField("outputPath", "출력 경로");
  ensureField("workingDirectory", "작업 디렉터리");

  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("AccessToken이 없습니다.");
  }

  let response: Response;

  try {
    response = await fetchWithTimeout(`${API_BASE_URL}/applications`, {
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
    console.error(
      "[createApplication] http error",
      response.status,
      response.statusText,
    );
    throw new Error(
      `애플리케이션 생성 실패 (HTTP ${response.status} ${response.statusText ?? ""})`,
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
      `서버 응답을 파싱할 수 없습니다. (status: ${response.status}, url: ${response.url}, body: ${rawBody})`,
    );
  }

  if (!result.success || !result.data?.applicationId) {
    console.error("[createApplication] invalid response", result);
    throw new Error("애플리케이션 생성 실패: 응답 데이터가 올바르지 않습니다.");
  }

  // console.log("[createApplication] success", result.data.applicationId);
  return result.data.applicationId;
};
