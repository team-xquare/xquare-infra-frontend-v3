import { useCallback, useRef, useState } from "react";
import { updateAddon } from "@xquare/utils";
import type { UpdateAddonRequest } from "@xquare/utils";

interface UseUpdateAddonState {
  loading: boolean;
  error: Error | null;
  success: boolean;
}

/**
 * 애드온 수정 훅
 * - 로딩/에러/성공 상태와 mutate 함수를 제공합니다.
 */
export function useUpdateAddon() {
  const [state, setState] = useState<UseUpdateAddonState>({
    loading: false,
    error: null,
    success: false,
  });
  const inFlightRef = useRef(false);

  const mutate = useCallback(
    async (addonId: number, request: UpdateAddonRequest) => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      setState({ loading: true, error: null, success: false });

      try {
        await updateAddon(addonId, request);
        setState({ loading: false, error: null, success: true });
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("애드온 수정 실패");
        console.error("[useUpdateAddon] 애드온 수정 실패:", error);
        setState({ loading: false, error, success: false });
        throw error;
      }
      inFlightRef.current = false;
    },
    [],
  );

  return { ...state, mutate };
}
