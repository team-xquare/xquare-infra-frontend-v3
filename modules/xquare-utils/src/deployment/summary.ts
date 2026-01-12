import { getAccessToken, isAuthenticated } from "../auth/token";
import { fetchWithTimeout } from "../fetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface DeploymentSummary {
  applicationId: number;
  commitHash: string;
  startedAt: string;
  finishedAt: string;
  status: "deploying" | "success" | "failed";
}

export interface DeploymentListResponse {
  deployments: DeploymentSummary[];
}

/**
 * 특정 애플리케이션의 배포 정보 조회
 * GET /api/v1/applications/{applicationId}/deployments
 *
 * @param applicationId - 애플리케이션 ID
 * @param page - 페이지 번호 (기본값: 0)
 * @param limit - 조회 개수 (기본값: 20)
 * @returns DeploymentListResponse 배포 정보 목록
 */
export const getDeploymentSummary = async (
  applicationId: number,
  page = 0,
  limit = 20
): Promise<DeploymentListResponse> => {
  /* console.log("[deployment] getDeploymentSummary", {
    applicationId,
    page,
    limit,
  }); */

  if (!isAuthenticated()) {
    throw new Error("인증이 필요합니다");
  }

  const accessToken = getAccessToken();
  const url = new URL(
    `${API_BASE_URL}/applications/${applicationId}/deployments`
  );

  url.searchParams.append("page", String(page));
  url.searchParams.append("limit", String(limit));

  try {
    const response = await fetchWithTimeout(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error("[deployment] getDeploymentSummary error", {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(
        `배포 정보 조회 실패 (HTTP ${response.status} ${response.statusText || ""})`
      );
    }

    const data: DeploymentListResponse = await response.json();
    /* console.log("[deployment] getDeploymentSummary success", {
      applicationId,
      deploymentCount: data.deployments.length,
    }); */

    return data;
  } catch (error) {
    console.error("[deployment] getDeploymentSummary exception", {
      applicationId,
      error,
    });
    throw error;
  }
};

/**
 * 여러 애플리케이션의 배포 정보를 동시에 조회
 *
 * @param applicationIds - 애플리케이션 ID 배열
 * @param page - 페이지 번호 (기본값: 0)
 * @param limit - 조회 개수 (기본값: 20)
 * @returns 애플리케이션별 배포 정보 맵 (key: applicationId)
 */
export const getMultipleDeploymentSummaries = async (
  applicationIds: number[],
  page = 0,
  limit = 20
): Promise<Record<number, DeploymentListResponse>> => {
  /* console.log("[deployment] getMultipleDeploymentSummaries", {
    applicationCount: applicationIds.length,
    page,
    limit,
  }); */

  try {
    const promises = applicationIds.map((appId) =>
      getDeploymentSummary(appId, page, limit)
        .then((data) => ({ appId, data, error: null }))
        .catch((error) => ({ appId, data: null, error }))
    );

    const results = await Promise.all(promises);

    const summaries: Record<number, DeploymentListResponse> = {};
    results.forEach(({ appId, data, error }) => {
      if (error) {
        console.warn(
          `[deployment] Failed to fetch deployment for app ${appId}`,
          error
        );
      } else if (data) {
        summaries[appId] = data;
      }
    });

    /* console.log("[deployment] getMultipleDeploymentSummaries success", {
      successCount: Object.keys(summaries).length,
      failureCount: results.length - Object.keys(summaries).length,
    }); */

    return summaries;
  } catch (error) {
    console.error("[deployment] getMultipleDeploymentSummaries exception", {
      error,
    });
    throw error;
  }
};
