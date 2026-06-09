import { useState, useCallback } from "react";
import { emailVerifySubmit } from "@xquare/utils";
import type {
  EmailVerifySubmitRequest,
  EmailVerifySubmitResponse,
} from "@xquare/utils";

export function useEmailVerifySubmit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailVerifySubmitHandler = useCallback(
    async (
      payload: EmailVerifySubmitRequest,
    ): Promise<EmailVerifySubmitResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await emailVerifySubmit(payload);
        // console.log("[useEmailVerifySubmit] 이메일 인증 요청 성공");
        return res;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "알 수 없는 에러";
        console.error("[useEmailVerifySubmit] 에러:", errorMessage);
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { emailVerifySubmitHandler, loading, error };
}
