import { useEffect, useState } from "react";
import { getApplicationDetail } from "@xquare/utils";
import type { ApplicationDetail } from "@xquare/utils";

/**
 * 애플리케이션 상세 조회 훅
 */
export function useApplicationDetail(applicationId?: number) {
  const [data, setData] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 초기 로드 (applicationId 변경 시 자동 조회)
  useEffect(() => {
    let cancelled = false;

    const execute = async () => {
      // ID 미제공 시 조기 반환
      if (!applicationId || applicationId < 0) {
        console.log("[useApplicationDetail] no valid applicationId");
        if (!cancelled) {
          setData(null);
          setError(null);
        }
        return;
      }

      console.log("[useApplicationDetail] fetch called", { applicationId });
      setLoading(true);
      setError(null);

      try {
        // 유틸 호출 로그는 유틸 내에서 수행
        const result = await getApplicationDetail(applicationId);
        if (!cancelled) {
          console.log("[useApplicationDetail] fetch success", result.id);
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          const errorObj =
            err instanceof Error ? err : new Error("애플리케이션 조회 실패");
          console.error("[useApplicationDetail] fetch error", errorObj);
          setError(errorObj);
          setData(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    execute();

    return () => {
      cancelled = true;
    };
  }, [applicationId]);

  return { data, loading, error };
}
