import { useCallback, useRef, useState } from "react";
import { deleteApplication } from "@xquare/utils";

interface UseDeleteApplicationState {
  loading: boolean;
  error: Error | null;
  success: boolean;
}

/**
 * 어플리케이션 삭제 훅
 * - 로딩/에러/성공 상태와 mutate 함수를 제공합니다.
 */
export function useDeleteApplication() {
  const [state, setState] = useState<UseDeleteApplicationState>({
    loading: false,
    error: null,
    success: false,
  });
  const inFlightRef = useRef(false);

  const mutate = useCallback(async (applicationId: number) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setState({ loading: true, error: null, success: false });

    try {
      await deleteApplication(applicationId);
      setState({ loading: false, error: null, success: true });
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("어플리케이션 삭제 실패");
      console.error("[useDeleteApplication] 어플리케이션 삭제 실패:", error);
      setState({ loading: false, error, success: false });
      throw error;
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  return { ...state, mutate };
}
