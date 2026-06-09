import { useState, useCallback } from "react";
import { emailVerifySend } from "@xquare/utils";
import type {
  EmailVerifySendRequest,
  EmailVerifySendResponse,
} from "@xquare/utils";

export function useEmailVerifySend() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailVerifySendHandler = useCallback(
    async (
      payload: EmailVerifySendRequest,
    ): Promise<EmailVerifySendResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await emailVerifySend(payload);
        // console.log("[useEmailVerifySend] 이메일 인증 요청 성공");
        return res;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "알 수 없는 에러";
        console.error("[useEmailVerifySend] 에러:", errorMessage);
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { emailVerifySendHandler, loading, error };
}
