import { useState, useCallback } from "react";
import { updateTeamMembers } from "@xquare/utils";
import type { UpdateTeamMembersRequest } from "@xquare/utils";

interface UseUpdateTeamMembersState {
  loading: boolean;
  error: Error | null;
  success: boolean;
}

/**
 * 팀 멤버 수정 훅
 * - 로딩/에러/성공 상태를 제공합니다.
 * - mutate 함수를 통해 팀 멤버를 수정할 수 있습니다.
 */
export function useUpdateTeamMembers() {
  const [state, setState] = useState<UseUpdateTeamMembersState>({
    loading: false,
    error: null,
    success: false,
  });

  const mutate = useCallback(
    async (teamId: number, request: UpdateTeamMembersRequest) => {
      setState({ loading: true, error: null, success: false });
      try {
        await updateTeamMembers(teamId, request);
        // console.log("[useUpdateTeamMembers] 팀 멤버 수정 성공:", teamId);
        setState({ loading: false, error: null, success: true });
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("팀 멤버 수정 실패");
        console.error("[useUpdateTeamMembers] 팀 멤버 수정 실패:", error);
        setState({ loading: false, error, success: false });
        throw error;
      }
    },
    []
  );

  return { ...state, mutate };
}
