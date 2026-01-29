import { useEffect, useState } from "react";
import { getTeamDetail } from "@xquare/utils";
import type { TeamDetail } from "@xquare/utils";

export function useTeamDetail(teamId?: number) {
  const [data, setData] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (typeof teamId !== "number" || Number.isNaN(teamId)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    getTeamDetail(teamId)
      .then((team) => {
        if (!cancelled) setData(team);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("팀 상세조회 실패"));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [teamId]);

  return { data, loading, error };
}
