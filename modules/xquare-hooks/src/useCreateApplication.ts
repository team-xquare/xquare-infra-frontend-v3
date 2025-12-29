import { useCallback, useState } from "react";
import { createApplication } from "@xquare/utils";
import type { CreateApplicationRequest } from "@xquare/utils";

/**
 * 애플리케이션 생성 훅
 */
export function useCreateApplication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(
    async (request: CreateApplicationRequest): Promise<number | null> => {
      setLoading(true);
      setError(null);
      try {
        const id = await createApplication(request);
        console.log("[useCreateApplication] created id", id);
        return id;
      } catch (err) {
        const errorObj =
          err instanceof Error ? err : new Error("애플리케이션 생성 실패");
        console.error("[useCreateApplication] error", errorObj);
        setError(errorObj);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { create, loading, error };
}
