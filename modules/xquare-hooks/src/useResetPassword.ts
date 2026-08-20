import { useState, useCallback } from "react";
import { resetPasswordUser } from "@xquare/utils";
import type {
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "@xquare/utils";

export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPassword = useCallback(
    async (
      payload: ResetPasswordRequest,
    ): Promise<ResetPasswordResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await resetPasswordUser(payload);
        return res;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "알 수 없는 에러";
        console.error("[useResetPassword] 에러:", errorMessage);
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { resetPassword, loading, error };
}
