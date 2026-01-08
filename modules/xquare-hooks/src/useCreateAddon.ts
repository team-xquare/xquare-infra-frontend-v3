import { useCallback, useState } from "react";
import type { CreateAddonRequest } from "@xquare/utils";
import { createAddon } from "@xquare/utils";

interface UseCreateAddonOptions {
  onSuccess?: (addonId: number) => void;
  onError?: (error: Error) => void;
}

export const useCreateAddon = (options?: UseCreateAddonOptions) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(
    async (request: CreateAddonRequest) => {
      setLoading(true);
      setError(null);

      try {
        const addonId = await createAddon(request);
        options?.onSuccess?.(addonId);
        return addonId;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        options?.onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  return {
    create,
    loading,
    error,
  };
};
