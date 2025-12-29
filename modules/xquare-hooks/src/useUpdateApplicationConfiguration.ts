import { useCallback, useState } from "react";
import {
  updateApplicationConfiguration,
  type UpdateApplicationConfigurationRequest,
} from "@xquare/utils";

/**
 * 애플리케이션 설정 수정 훅
 *
 */
export function useUpdateApplicationConfiguration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(
    async (
      applicationId: number,
      request: UpdateApplicationConfigurationRequest
    ): Promise<boolean> => {
      console.log("[useUpdateApplicationConfiguration] update called", {
        applicationId,
      });
      setLoading(true);
      setError(null);

      try {
        // 유틸 호출 로그는 유틸 내에서 수행
        await updateApplicationConfiguration(applicationId, request);
        console.log("[useUpdateApplicationConfiguration] update success");
        return true;
      } catch (err) {
        const errorObj =
          err instanceof Error
            ? err
            : new Error("애플리케이션 설정 수정 실패");
        console.error(
          "[useUpdateApplicationConfiguration] update error",
          errorObj
        );
        setError(errorObj);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { update, loading, error };
}
