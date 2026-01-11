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
        // console.log("[useRegister] 회원가입 성공");
        return res;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "알 수 없는 에러";
        console.error("[useRegister] 에러:", errorMessage);
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { register, loading, error };
}
