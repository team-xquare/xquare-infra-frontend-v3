import { useState, useCallback } from "react";
import { createTeam } from "@xquare/utils";
import type { CreateTeamRequest } from "@xquare/utils";

/**
 * 팀 생성 훅
 * - 팀 생성 함수와 로딩/에러 상태를 제공합니다.
 */
export function useCreateTeam() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(
    async (request: CreateTeamRequest): Promise<number | null> => {
      setLoading(true);
      setError(null);

      try {
        const teamId = await createTeam(request);
        console.log("[useCreateTeam] 팀 생성 성공:", teamId);
        return teamId;
      } catch (err) {
        console.error("[useCreateTeam] 팀 생성 실패:", err);
        const errorObj = err instanceof Error ? err : new Error("팀 생성 실패");
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
