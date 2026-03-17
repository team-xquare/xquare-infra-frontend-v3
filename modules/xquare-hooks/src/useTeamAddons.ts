import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const requestIdRef = useRef(0);

  const isValidId = useMemo(
    () => typeof teamId === "number" && !Number.isNaN(teamId),
    [teamId],
  );

  const fetchAddons = useCallback(async () => {
    if (!isValidId) {
      const invalidError = new Error("유효한 팀 ID가 필요합니다.");
      setData(null);
      setError(invalidError);
      setLoading(false);
      throw invalidError;
    }

    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const addons = await getTeamAddons(teamId!);
      if (requestId === requestIdRef.current) {
        setData(addons);
        setLoading(false);
      }
    } catch (err) {
      const nextError =
        err instanceof Error ? err : new Error("팀 애드온 조회 실패");
      if (requestId === requestIdRef.current) {
        setError(nextError);
        setLoading(false);
      }
      throw nextError;
    }
  }, [teamId, isValidId]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchAddons().catch(() => undefined);
    }, 0);

    return () => {
      clearTimeout(timerId);
    };
  }, [fetchAddons]);

  const computedError = !isValidId
    ? new Error("유효한 팀 ID가 필요합니다.")
    : error;

  return {
    data: isValidId ? data : null,
    loading: isValidId ? loading : false,
    error: computedError,
    refetch: fetchAddons,
  };
}
