/**
 * GitHub repository utilities
 * - Public GitHub API calls for repo info, branches, and latest commit
 */

import { fetchWithTimeout } from "../fetch";

export interface RepoInfo {
  defaultBranch: string;
}

/**
 * Fetch repository info including default branch
 */
export const getRepoInfo = async (
  owner: string,
  repo: string,
  signal?: AbortSignal
): Promise<RepoInfo> => {
  console.log("[github] getRepoInfo", { owner, repo });
  const res = await fetchWithTimeout(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
      signal,
    }
  );
  if (!res.ok) {
    console.error("[github] getRepoInfo error", res.status);
    throw new Error(`GitHub 응답 오류: ${res.status}`);
  }
  const json = await res.json();
  const defaultBranch = json?.default_branch || "main";
  console.log("[github] getRepoInfo success", { defaultBranch });
  return { defaultBranch };
};

/**
 * List branches for a repository (up to perPage)
 */
export const listBranches = async (
  owner: string,
  repo: string,
  perPage = 100,
  signal?: AbortSignal
): Promise<string[]> => {
  console.log("[github] listBranches", { owner, repo, perPage });
  const res = await fetchWithTimeout(
    `https://api.github.com/repos/${owner}/${repo}/branches?per_page=${perPage}`,
    { signal }
  );
  if (!res.ok) {
    console.error("[github] listBranches error", {
      status: res.status,
      statusText: res.statusText,
    });
    throw new Error(
      `브랜치 목록 조회 실패 (HTTP ${res.status} ${res.statusText || ""})`
    );
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : "JSON 파싱 오류";
    console.error("[github] listBranches parse error", message);
    throw new Error(`브랜치 목록 파싱 실패: ${message}`);
  }

  if (!Array.isArray(json)) {
    console.error("[github] listBranches invalid response type", {
      receivedType: typeof json,
      receivedValue: json,
    });
    throw new Error(
      `브랜치 목록이 배열이 아닙니다. (받은 타입: ${typeof json})`
    );
  }

  return (json as Array<{ name?: string }>)
    .map((item) => item.name)
    .filter((name): name is string => typeof name === "string");
};

/**
 * Get latest commit SHA for a branch
 */
export const getLatestCommitSha = async (
  owner: string,
  repo: string,
  branch: string,
  signal?: AbortSignal
): Promise<string> => {
  console.log("[github] getLatestCommitSha", { owner, repo, branch });
  const res = await fetchWithTimeout(
    `https://api.github.com/repos/${owner}/${repo}/commits/${branch}`,
    { signal }
  );
  if (!res.ok) {
    console.error("[github] getLatestCommitSha error", res.status);
    throw new Error(`커밋 정보를 불러오지 못했습니다. (${res.status})`);
  }
  const json = await res.json();
  console.log("[github] getLatestCommitSha success", { sha: json?.sha });
  return json?.sha ?? "";
};
