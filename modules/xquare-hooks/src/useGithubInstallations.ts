import { useState, useCallback, useEffect } from "react";
import {
  listUserInstallations,
  listInstallationRepositories,
  type GithubInstallation,
  type GithubRepository,
} from "@xquare/utils";

export function useGithubInstallations(accessToken: string | null) {
  const [installations, setInstallations] = useState<GithubInstallation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInstallations = useCallback(async () => {
    if (!accessToken) {
      setInstallations([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const installs = await listUserInstallations(accessToken);
      setInstallations(installs);
      console.log(
        "[useGithubInstallations] Installations loaded:",
        installs.length
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "설치 목록을 불러오지 못했습니다.";
      console.error("[useGithubInstallations] Error:", err);
      setError(message);
      setInstallations([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchInstallations();
  }, [fetchInstallations]);

  const getInstallationRepositories = useCallback(
    async (installationId: number): Promise<GithubRepository[]> => {
      if (!accessToken) {
        throw new Error("Access token이 필요합니다.");
      }

      try {
        const repos = await listInstallationRepositories(
          accessToken,
          installationId
        );
        console.log(
          "[useGithubInstallations] Installation repositories loaded:",
          repos.length
        );
        return repos;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "레포지토리 목록을 불러오지 못했습니다.";
        console.error(
          "[useGithubInstallations] Get installation repos error:",
          err
        );
        throw new Error(message);
      }
    },
    [accessToken]
  );

  return {
    installations,
    loading,
    error,
    refetch: fetchInstallations,
    getInstallationRepositories,
  };
}
