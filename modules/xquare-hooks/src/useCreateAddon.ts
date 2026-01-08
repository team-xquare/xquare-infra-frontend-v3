import { useCallback, useRef, useState } from "react";
import type { CreateAddonRequest } from "@xquare/utils";
import { createAddon } from "@xquare/utils";

interface UseCreateAddonOptions {
  onSuccess?: (addonId: number) => void;
  onError?: (error: Error) => void;
}

export const useCreateAddon = (options?: UseCreateAddonOptions) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // options을 ref로 캡처하여 create 함수의 의존성 목록 안정화
  const optionsRef = useRef(options);

  // optionsRef.current를 최신 options으로 유지
  optionsRef.current = options;

  const create = useCallback(async (request: CreateAddonRequest) => {
    setLoading(true);
    setError(null);

    try {
      const addonId = await createAddon(request);
      optionsRef.current?.onSuccess?.(addonId);
      return addonId;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      optionsRef.current?.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    create,
    loading,
    error,
  };
};
