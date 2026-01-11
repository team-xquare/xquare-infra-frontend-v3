import { useState, useCallback } from "react";
import { exchangeGithubToken } from "@xquare/utils";
import type { GithubTokenResponse } from "@xquare/utils";

export function useGithubToken() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = useCallback(
    async (code: string): Promise<GithubTokenResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await exchangeGithubToken(code);
        // console.log("[useGithubToken] GitHub 토큰 교환 성공");
        return res;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "알 수 없는 에러";
        console.error("[useGithubToken] 에러:", errorMessage);
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { getToken, loading, error };
}
