import { useState, useEffect, useCallback } from "react";
import {
  getEnvironmentVariables,
  type EnvironmentVariable,
  addOrUpdateEnvironmentVariable,
  deleteEnvironmentVariable,
} from "@xquare/utils";

interface UseEnvironmentVariablesResult {
  variables: EnvironmentVariable[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addOrUpdate: (
    name: string,
    value: string,
    options?: { skipRefetch?: boolean },
  ) => Promise<boolean>;
  remove: (name: string) => Promise<boolean>;
}

export const useEnvironmentVariables = (
  applicationId?: number,
): UseEnvironmentVariablesResult => {
  const [variables, setVariables] = useState<EnvironmentVariable[]>([]);
  const [loadingCount, setLoadingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const loading = loadingCount > 0;

  useEffect(() => {
    let cancelled = false;
    let incrementedCounter = false;

    const fetchVariables = async () => {
      if (!applicationId) {
        /* console.log(
          "[useEnvironmentVariables] no applicationId, skipping fetch"
        ); */
        if (!cancelled) {
          setVariables([]);
        }
        return;
      }

      if (!cancelled) {
        setLoadingCount((prev) => prev + 1);
        incrementedCounter = true;
        setError(null);
      }

      try {
        const data = await getEnvironmentVariables(applicationId);
        if (!cancelled) {
          setVariables(data);
          /* console.log("[useEnvironmentVariables] fetch success", {
            applicationId,
            count: data.length,
          }); */
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : "환경변수를 불러오지 못했습니다";
          console.error("[useEnvironmentVariables] fetch error", err);
          setError(message);
          setVariables([]);
        }
      } finally {
        // Always decrement if we incremented, regardless of cancelled state
        if (incrementedCounter) {
          setLoadingCount((prev) => Math.max(0, prev - 1));
        }
      }
    };

    fetchVariables();

    return () => {
      cancelled = true;
      // Decrement if we incremented but didn't reach finally yet
      if (incrementedCounter) {
        setLoadingCount((prev) => Math.max(0, prev - 1));
        incrementedCounter = false;
      }
    };
  }, [applicationId]);

  const refetch = useCallback(async () => {
    if (!applicationId) {
      /* console.log(
        "[useEnvironmentVariables] no applicationId, skipping refetch"
      ); */
      setVariables([]);
      return;
    }

    setLoadingCount((prev) => prev + 1);
    setError(null);

    try {
      const data = await getEnvironmentVariables(applicationId);
      setVariables(data);
      /* console.log("[useEnvironmentVariables] refetch success", {
        applicationId,
        count: data.length,
      }); */
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "환경변수를 불러오지 못했습니다";
      console.error("[useEnvironmentVariables] refetch error", err);
      setError(message);
      setVariables([]);
    } finally {
      setLoadingCount((prev) => Math.max(0, prev - 1));
    }
  }, [applicationId]);

  const addOrUpdate = useCallback(
    async (
      name: string,
      value: string,
      options?: { skipRefetch?: boolean },
    ): Promise<boolean> => {
      if (!applicationId) {
        console.error("[useEnvironmentVariables] no applicationId");
        setError("애플리케이션 ID가 필요합니다");
        return false;
      }

      setLoadingCount((prev) => prev + 1);
      setError(null);

      try {
        await addOrUpdateEnvironmentVariable(applicationId, { name, value });
        // console.log("[useEnvironmentVariables] addOrUpdate success", { name });
        if (!options?.skipRefetch) {
          await refetch();
        }
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "환경변수 저장에 실패했습니다";
        console.error("[useEnvironmentVariables] addOrUpdate error", err);
        setError(message);
        return false;
      } finally {
        setLoadingCount((prev) => Math.max(0, prev - 1));
      }
    },
    [applicationId, refetch],
  );

  const remove = useCallback(
    async (name: string): Promise<boolean> => {
      if (!applicationId) {
        console.error("[useEnvironmentVariables] no applicationId");
        setError("애플리케이션 ID가 필요합니다");
        return false;
      }

      setLoadingCount((prev) => prev + 1);
      setError(null);

      try {
        await deleteEnvironmentVariable(applicationId, name);
        // console.log("[useEnvironmentVariables] remove success", { name });
        await refetch();
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "환경변수 삭제에 실패했습니다";
        console.error("[useEnvironmentVariables] remove error", err);
        setError(message);
        return false;
      } finally {
        setLoadingCount((prev) => Math.max(0, prev - 1));
      }
    },
    [applicationId, refetch],
  );

  return {
    variables,
    loading,
    error,
    refetch,
    addOrUpdate,
    remove,
  };
};
