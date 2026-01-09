import { useState, useCallback } from "react";
import { updateTeam } from "@xquare/utils";
import type { UpdateTeamRequest } from "@xquare/utils";

interface UseUpdateTeamState {
  loading: boolean;
  error: Error | null;
  success: boolean;
}

/**
 * 팀 정보 수정 훅
 * - 로딩/에러/성공 상태를 제공합니다.
 * - mutate 함수를 통해 팀 정보를 수정할 수 있습니다.
 */
export function useUpdateTeam() {
  const [state, setState] = useState<UseUpdateTeamState>({
    loading: false,
    error: null,
    success: false,
  });

  const mutate = useCallback(
    async (teamId: number, request: UpdateTeamRequest) => {
      setState({ loading: true, error: null, success: false });
      try {
        await updateTeam(teamId, request);
        console.log("[useUpdateTeam] 팀 수정 성공:", teamId);
        setState({ loading: false, error: null, success: true });
      } catch (err) {
        const error = err instanceof Error ? err : new Error("팀 수정 실패");
        console.error("[useUpdateTeam] 팀 수정 실패:", error);
        setState({ loading: false, error, success: false });
        throw error;
      }
    },
    []
  );

  return { ...state, mutate };
}
