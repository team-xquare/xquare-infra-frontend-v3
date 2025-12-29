/**
 * GitHub repository utilities
 * - Public GitHub API calls for repo info, branches, and latest commit
 */

export interface RepoInfo {
  defaultBranch: string;
}

/**
 * Fetch repository info including default branch
 */
export const getRepoInfo = async (
  owner: string,
  repo: string
): Promise<RepoInfo> => {
  console.log("[github] getRepoInfo", { owner, repo });
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
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
  perPage = 100
): Promise<string[]> => {
  console.log("[github] listBranches", { owner, repo, perPage });
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/branches?per_page=${perPage}`
  );
  if (!res.ok) {
    console.error("[github] listBranches error", res.status);
    return [];
  }
  const json: unknown = await res.json();
  if (!Array.isArray(json)) return [];

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
  branch: string
): Promise<string> => {
  console.log("[github] getLatestCommitSha", { owner, repo, branch });
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits/${branch}`
  );
  if (!res.ok) {
    console.error("[github] getLatestCommitSha error", res.status);
    throw new Error(`커밋 정보를 불러오지 못했습니다. (${res.status})`);
  }
  const json = await res.json();
  console.log("[github] getLatestCommitSha success", { sha: json?.sha });
  return json?.sha ?? "";
};
