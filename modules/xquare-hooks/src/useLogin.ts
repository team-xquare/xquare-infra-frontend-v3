import { useState, useCallback } from "react";
import { loginUser } from "@xquare/utils";
import type { LoginRequest, LoginResponse } from "@xquare/utils";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (payload: LoginRequest): Promise<LoginResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await loginUser(payload);
        console.log("[useLogin] 로그인 성공");
        return res;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "알 수 없는 에러";
        console.error("[useLogin] 에러:", errorMessage);
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { login, loading, error };
}
