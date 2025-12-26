import { useEffect, useState } from "react";
import { getTeams } from "@xquare/utils";
import type { Team } from "@xquare/utils";

/**
 * 현재 유저의 전체 팀 목록 조회 훅
 * - 로딩/에러/데이터 상태를 제공합니다.
 */
export function useTeams() {
  const [data, setData] = useState<Team[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    getTeams()
      .then((teams) => {
        if (!cancelled) {
          console.log("[useTeams] 팀 목록 조회 성공:", teams.length, "개", teams);
          setData(teams);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("[useTeams] 팀 목록 조회 실패:", err);
          setError(err instanceof Error ? err : new Error("팀 목록 조회 실패"));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
