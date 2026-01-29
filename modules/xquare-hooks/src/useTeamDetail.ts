import { useEffect, useState } from "react";
import { getTeamDetail } from "@xquare/utils";
import type { TeamDetail } from "@xquare/utils";

export function useTeamDetail(teamId?: number) {
  const [data, setData] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (typeof teamId !== "number" || Number.isNaN(teamId)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    getTeamDetail(teamId)
      .then((team) => setData(team))
      .catch((err) =>
        setError(err instanceof Error ? err : new Error("팀 상세조회 실패")),
      )
      .finally(() => setLoading(false));
  }, [teamId]);

  return { data, loading, error };
}
