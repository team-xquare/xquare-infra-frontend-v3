import { useCallback, useEffect, useRef, useState } from "react";
import { getAddonDetail } from "@xquare/utils";
import type { AddonDetail } from "@xquare/utils";

interface UseAddonDetailState {
  data: AddonDetail | null;
  loading: boolean;
  error: Error | null;
}

/**
 * 애드온 상세 조회 훅
 */
export function useAddonDetail(addonId?: number) {
  const [state, setState] = useState<UseAddonDetailState>({
    data: null,
    loading: false,
    error: null,
  });
  const requestIdRef = useRef(0);

  const isValidId = typeof addonId === "number" && !Number.isNaN(addonId);

  const fetchDetail = useCallback(async () => {
    if (!isValidId) {
      const invalidError = new Error("유효한 애드온 ID가 필요합니다.");
      setState({ data: null, loading: false, error: invalidError });
      throw invalidError;
    }

    const requestId = ++requestIdRef.current;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await getAddonDetail(addonId!);
      if (requestId === requestIdRef.current) {
        setState({ data, loading: false, error: null });
      }
    } catch (err) {
      const nextError =
        err instanceof Error ? err : new Error("애드온 조회에 실패했습니다.");
      if (requestId === requestIdRef.current) {
        setState({ data: null, loading: false, error: nextError });
      }
      throw nextError;
    }
  }, [addonId, isValidId]);

  useEffect(() => {
    fetchDetail().catch(() => undefined);
  }, [fetchDetail]);

  return {
    data: isValidId ? state.data : null,
    loading: isValidId ? state.loading : false,
    error: state.error,
    refetch: fetchDetail,
  };
}
