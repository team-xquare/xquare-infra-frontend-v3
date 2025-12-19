import { useState, useCallback } from "react";
import { registerUser } from "@xquare/utils";
import type { RegisterRequest, RegisterResponse } from "@xquare/utils";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(
    async (payload: RegisterRequest): Promise<RegisterResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await registerUser(payload);
        return res;
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 에러");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { register, loading, error };
}
