import { useCallback, useRef, useState } from "react";
import { deleteAddon } from "@xquare/utils";

interface UseDeleteAddonState {
  loading: boolean;
  error: Error | null;
  success: boolean;
}

/**
 * 애드온 삭제 훅
 * - 로딩/에러/성공 상태와 mutate 함수를 제공합니다.
 */
export function useDeleteAddon() {
  const [state, setState] = useState<UseDeleteAddonState>({
    loading: false,
    error: null,
    success: false,
  });
  const inFlightRef = useRef(false);

  const mutate = useCallback(async (addonId: number) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setState({ loading: true, error: null, success: false });

    try {
      await deleteAddon(addonId);
      setState({ loading: false, error: null, success: true });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("애드온 삭제 실패");
      console.error("[useDeleteAddon] 애드온 삭제 실패:", error);
      setState({ loading: false, error, success: false });
      throw error;
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  return { ...state, mutate };
}
