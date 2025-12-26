import { useEffect, useMemo, useState } from "react";
import { getTeamAddons } from "@xquare/utils";
import type { TeamAddon } from "@xquare/utils";

/**
 * 팀 애드온 목록 조회 훅
 * - `teamId`가 유효해야 호출합니다.
 * - 로딩/에러/데이터 상태를 제공합니다.
 */
export function useTeamAddons(teamId?: number) {
  const [data, setData] = useState<TeamAddon[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const isValidId = useMemo(
    () => typeof teamId === "number" && !Number.isNaN(teamId),
    [teamId]
  );

  useEffect(() => {
    if (!isValidId) {
      console.log("[useTeamAddons] 유효하지 않은 팀 ID:", teamId);
      return;
    }

    let cancelled = false;

    getTeamAddons(teamId!)
      .then((addons) => {
        if (!cancelled) {
          setData(addons);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err : new Error("팀 애드온 조회 실패")
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [teamId, isValidId]);

  const computedError = !isValidId
    ? new Error("유효한 팀 ID가 필요합니다.")
    : error;

  const loading = isValidId && data === null && !computedError;

  return { data: isValidId ? data : null, loading, error: computedError };
}
