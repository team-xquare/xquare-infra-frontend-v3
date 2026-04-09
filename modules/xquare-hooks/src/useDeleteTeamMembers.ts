import { useState, useCallback } from "react";
import { deleteTeamMembers } from "@xquare/utils";
import type { DeleteMemberRequest } from "@xquare/utils";

interface UseDeleteTeamMembersState {
  loading: boolean;
  error: Error | null;
  success: boolean;
}

/**
 * 팀 멤버 삭제 훅
 * - 팀 멤버 삭제 함수와 로딩/에러 상태를 제공합니다.
 */
export function useDeleteTeamMembers() {
  const [state, setState] = useState<UseDeleteTeamMembersState>({
    loading: false,
    error: null,
    success: false,
  });

  const mutate = useCallback(
    async (teamId: number, request: DeleteMemberRequest): Promise<boolean> => {
      setState({ loading: true, error: null, success: false });

      try {
        await deleteTeamMembers(teamId, request);
        setState({ loading: false, error: null, success: true });
        return true;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("팀 멤버 삭제 실패");
        console.error("[useDeleteTeamMembers] 팀 멤버 삭제 실패:", error);
        setState({ loading: false, error, success: false });
        throw error;
      }
    },
    [],
  );

  return { ...state, mutate };
}
