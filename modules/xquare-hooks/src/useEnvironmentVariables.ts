import { useState, useEffect, useCallback } from "react";
import {
  getEnvironmentVariables,
  type EnvironmentVariable,
} from "@xquare/utils";
import { addOrUpdateEnvironmentVariable } from "@xquare/utils";
import { deleteEnvironmentVariable } from "@xquare/utils";

interface UseEnvironmentVariablesResult {
  variables: EnvironmentVariable[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addOrUpdate: (name: string, value: string) => Promise<boolean>;
  remove: (name: string) => Promise<boolean>;
}

export const useEnvironmentVariables = (
  applicationId?: number
): UseEnvironmentVariablesResult => {
  const [variables, setVariables] = useState<EnvironmentVariable[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVariables = useCallback(async () => {
    if (!applicationId) {
      console.log("[useEnvironmentVariables] no applicationId, skipping fetch");
      setVariables([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getEnvironmentVariables(applicationId);
      setVariables(data);
      console.log("[useEnvironmentVariables] fetch success", {
        applicationId,
        count: data.length,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "환경변수를 불러오지 못했습니다";
      console.error("[useEnvironmentVariables] fetch error", err);
      setError(message);
      setVariables([]);
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchVariables();
  }, [fetchVariables]);

  const addOrUpdate = useCallback(
    async (name: string, value: string): Promise<boolean> => {
      if (!applicationId) {
        console.error("[useEnvironmentVariables] no applicationId");
        setError("애플리케이션 ID가 필요합니다");
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        await addOrUpdateEnvironmentVariable(applicationId, { name, value });
        console.log("[useEnvironmentVariables] addOrUpdate success", { name });
        await fetchVariables();
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "환경변수 저장에 실패했습니다";
        console.error("[useEnvironmentVariables] addOrUpdate error", err);
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [applicationId, fetchVariables]
  );

  const remove = useCallback(
    async (name: string): Promise<boolean> => {
      if (!applicationId) {
        console.error("[useEnvironmentVariables] no applicationId");
        setError("애플리케이션 ID가 필요합니다");
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        await deleteEnvironmentVariable(applicationId, name);
        console.log("[useEnvironmentVariables] remove success", { name });
        await fetchVariables();
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "환경변수 삭제에 실패했습니다";
        console.error("[useEnvironmentVariables] remove error", err);
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [applicationId, fetchVariables]
  );

  return {
    variables,
    loading,
    error,
    refetch: fetchVariables,
    addOrUpdate,
    remove,
  };
};
