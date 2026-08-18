import { useState, useCallback } from "react";
import {
  sendRecoveryPasswordEmail,
  verifyRecoveryPasswordEmail,
} from "@xquare/utils";
import type {
  RecoveryPasswordEmailSendRequest,
  RecoveryPasswordEmailVerifyRequest,
  RecoveryPasswordEmailVerifyResponse,
  BaseSuccessResponse,
} from "@xquare/utils";

export function useRecoveryPasswordEmailSend() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendHandler = useCallback(
    async (
      payload: RecoveryPasswordEmailSendRequest,
    ): Promise<BaseSuccessResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        return await sendRecoveryPasswordEmail(payload);
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 에러");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { sendHandler, loading, error };
}

export function useRecoveryPasswordEmailVerify() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyHandler = useCallback(
    async (
      payload: RecoveryPasswordEmailVerifyRequest,
    ): Promise<RecoveryPasswordEmailVerifyResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        return await verifyRecoveryPasswordEmail(payload);
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 에러");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { verifyHandler, loading, error };
}
