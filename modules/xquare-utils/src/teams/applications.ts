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
  tier: string;
  github: ApplicationGitHub;
  build: ApplicationBuild;
  endpoints: ApplicationEndpoint[];
}

export interface TeamApplication {
  id: number;
  teamId: number;
  name: string;
  status: "pending" | "running" | "stopped" | "failed" | string;
  configuration: ApplicationConfiguration;
}

interface TeamApplicationsApiResponse {
  success: boolean;
  data: {
    applications: TeamApplication[];
  };
}

/**
 * 팀의 모든 애플리케이션 조회
 * - 경로: GET {API_BASE_URL}/api/v1/teams/{teamId}/applications
 * - 헤더: Authorization Bearer, Accept: all
 */
export const getTeamApplications = async (
  teamId: number
): Promise<TeamApplication[]> => {
  if (!isAuthenticated()) {
    throw new Error("인증되지 않은 상태입니다.");
  }

  if (typeof teamId !== "number" || Number.isNaN(teamId)) {
    throw new Error("유효한 팀 ID가 필요합니다.");
  }

  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL이 설정되어 있지 않습니다.");
  }

  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("AccessToken이 없습니다.");
  }

  console.log("[getTeamApplications] 애플리케이션 조회 시작 - teamId:", teamId);

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/teams/${teamId}/applications`, {
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
    console.error("[getTeamApplications] 네트워크 오류:", message);
    throw new Error(`[getTeamApplications] 네트워크 오류: ${message}`);
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("인증이 만료되었거나 유효하지 않습니다. (401)");
    }
    if (response.status === 403) {
      throw new Error("해당 팀 애플리케이션에 접근 권한이 없습니다. (403)");
    }
    console.error(
      "[getTeamApplications] HTTP 오류:",
      response.status,
      response.statusText
    );
    throw new Error(
      `팀 애플리케이션 조회 실패 (HTTP ${response.status} ${response.statusText ?? ""})`
    );
  }

  const result = (await response.json()) as TeamApplicationsApiResponse;

  if (
    !result.success ||
    !result.data ||
    !Array.isArray(result.data.applications)
  ) {
    console.error("[getTeamApplications] 잘못된 응답 데이터:", result);
    throw new Error(
      "팀 애플리케이션 조회 실패: 응답 데이터가 올바르지 않습니다."
    );
  }

  console.log(
    "[getTeamApplications] 애플리케이션 조회 성공:",
    result.data.applications.length,
    "개",
    result.data.applications
  );

  return result.data.applications;
};
