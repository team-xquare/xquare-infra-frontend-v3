import { useEffect, useMemo, useState } from "react";
import {
  getDeploymentSummary,
  getMultipleDeploymentSummaries,
  type DeploymentSummary,
  type DeploymentListResponse,
} from "@xquare/utils";

export function useDeploymentSummary(
  applicationId?: number,
  page = 0,
  limit = 20
) {
  const [data, setData] = useState<DeploymentSummary[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const isValidId = useMemo(
    () => typeof applicationId === "number" && !Number.isNaN(applicationId),
    [applicationId]
  );

  useEffect(() => {
    if (!isValidId) {
      console.log(
        "[useDeploymentSummary] 유효하지 않은 애플리케이션 ID:",
        applicationId
      );
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;

    getDeploymentSummary(applicationId!, page, limit)
      .then((response: DeploymentListResponse) => {
        if (!cancelled) {
          console.log(
            "[useDeploymentSummary] 배포 정보 조회 성공:",
            response.deployments?.length || 0,
            "개"
          );
          setData(response.deployments || []);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("[useDeploymentSummary] 배포 정보 조회 실패:", err);
          setError(
            err instanceof Error ? err : new Error("배포 정보 조회 실패")
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [applicationId, page, limit]);

  const computedError = !isValidId
    ? new Error("유효한 애플리케이션 ID가 필요합니다.")
    : error;

  const loading = isValidId && data === null && !computedError;

  return { data: isValidId ? data : null, loading, error: computedError };
}

export function useMultipleDeploymentSummaries(
  applicationIds?: number[],
  page = 0,
  limit = 20
) {
  const [data, setData] = useState<Record<
    number,
    DeploymentListResponse
  > | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const isValidIds = useMemo(
    () => Array.isArray(applicationIds) && applicationIds.length > 0,
    [applicationIds]
  );

  useEffect(() => {
    if (!isValidIds) {
      console.log(
        "[useMultipleDeploymentSummaries] 유효하지 않은 애플리케이션 ID 배열:",
        applicationIds
      );
      return;
    }

    let cancelled = false;

    getMultipleDeploymentSummaries(applicationIds!, page, limit)
      .then((summaries) => {
        if (!cancelled) {
          console.log(
            "[useMultipleDeploymentSummaries] 배포 정보 조회 성공:",
            Object.keys(summaries).length,
            "개"
          );
          setData(summaries);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(
            "[useMultipleDeploymentSummaries] 배포 정보 조회 실패:",
            err
          );
          setError(
            err instanceof Error ? err : new Error("배포 정보 조회 실패")
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [applicationIds, isValidIds, page, limit]);

  const computedError = !isValidIds
    ? new Error("유효한 애플리케이션 ID 배열이 필요합니다.")
    : error;

  const loading = isValidIds && data === null && !computedError;

  return { data: isValidIds ? data : null, loading, error: computedError };
}
