import { fetchWithTimeout } from "../fetch";

export interface GithubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url?: string;
  };
  description: string | null;
  private: boolean;
  url: string;
}

export interface GithubOrganization {
  id: number;
  login: string;
  avatar_url: string;
  description: string | null;
}

export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
}

export interface RepositoriesByOrg {
  org: GithubOrganization;
  repositories: GithubRepository[];
}

export interface GithubInstallation {
  id: number;
  account: {
    login: string;
    id: number;
    avatar_url: string;
    type: string;
  };
  repository_selection: string;
  created_at: string;
  updated_at: string;
}

export async function getCurrentUser(accessToken: string): Promise<GithubUser> {
  try {
    const res = await fetchWithTimeout("https://api.github.com/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!res.ok) {
      throw new Error("사용자 정보를 불러오지 못했습니다.");
    }

    const data = (await res.json()) as GithubUser;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("사용자 정보 조회 중 오류가 발생했습니다.");
  }
}

export async function listUserOrganizations(
  accessToken: string
): Promise<GithubOrganization[]> {
  try {
    const res = await fetchWithTimeout("https://api.github.com/user/orgs", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!res.ok) {
      throw new Error("GitHub 조직 목록을 불러오지 못했습니다.");
    }

    const data = (await res.json()) as GithubOrganization[];
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("GitHub 조직 조회 중 오류가 발생했습니다.");
  }
}

export async function listOrganizationRepositories(
  accessToken: string,
  orgName: string
): Promise<GithubRepository[]> {
  try {
    const perPage = 100;
    let page = 1;
    const all: GithubRepository[] = [];

    while (true) {
      const url = `https://api.github.com/orgs/${orgName}/repos?per_page=${perPage}&page=${page}&type=all`;
      const res = await fetchWithTimeout(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      if (!res.ok) {
        throw new Error(`${orgName} 조직의 레포지토리를 불러오지 못했습니다.`);
      }

      const pageData = (await res.json()) as GithubRepository[];
      all.push(...pageData);

      if (pageData.length < perPage) break;
      page += 1;
    }

    return all;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("레포지토리 조회 중 오류가 발생했습니다.");
  }
}

export async function listUserRepositories(
  accessToken: string
): Promise<GithubRepository[]> {
  try {
    const perPage = 100;
    let page = 1;
    const all: GithubRepository[] = [];

    while (true) {
      const url = `https://api.github.com/user/repos?per_page=${perPage}&page=${page}&affiliation=owner,collaborator,organization_member&sort=updated&visibility=all`;
      const res = await fetchWithTimeout(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      if (!res.ok) {
        throw new Error("GitHub 레포지토리 목록을 불러오지 못했습니다.");
      }

      const pageData = (await res.json()) as GithubRepository[];
      all.push(...pageData);

      if (pageData.length < perPage) break;
      page += 1;
    }

    return all;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("GitHub 레포지토리 조회 중 오류가 발생했습니다.");
  }
}

export async function listAllRepositoriesByOrg(
  accessToken: string
): Promise<RepositoriesByOrg[]> {
  try {
    // 현재 사용자 정보 조회
    const currentUser = await getCurrentUser(accessToken);

    // 개인 레포지토리 조회 (사용자 소유 레포만)
    const allUserRepos = await listUserRepositories(accessToken);
    const personalRepos = allUserRepos.filter(
      (repo) => repo.owner.login === currentUser.login
    );

    // 사용자의 조직 목록 조회
    const orgs = await listUserOrganizations(accessToken);

    // 결과 배열 초기화
    const result: RepositoriesByOrg[] = [];

    // 개인 레포지토리를 먼저 추가 (Personal 조직으로)
    if (personalRepos.length > 0) {
      result.push({
        org: {
          id: -1,
          login: "Personal",
          avatar_url: currentUser.avatar_url,
          description: "개인 레포지토리",
        },
        repositories: personalRepos,
      });
    }

    // 각 조직의 레포지토리 추가
    for (const org of orgs) {
      try {
        const repos = await listOrganizationRepositories(
          accessToken,
          org.login
        );
        if (repos.length > 0) {
          result.push({
            org,
            repositories: repos,
          });
        }
      } catch (err) {
        console.error(`Failed to load repos for ${org.login}:`, err);
      }
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("조직별 레포지토리 조회 중 오류가 발생했습니다.");
  }
}

export async function listUserInstallations(
  accessToken: string
): Promise<GithubInstallation[]> {
  try {
    const res = await fetchWithTimeout(
      "https://api.github.com/user/installations",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    if (!res.ok) {
      throw new Error("GitHub App 설치 목록을 불러오지 못했습니다.");
    }

    const data = await res.json();
    return (data.installations || []) as GithubInstallation[];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("GitHub App 설치 목록 조회 중 오류가 발생했습니다.");
  }
}

export async function listInstallationRepositories(
  accessToken: string,
  installationId: number
): Promise<GithubRepository[]> {
  try {
    const perPage = 100;
    let page = 1;
    const all: GithubRepository[] = [];

    while (true) {
      const url = `https://api.github.com/user/installations/${installationId}/repositories?per_page=${perPage}&page=${page}`;
      const res = await fetchWithTimeout(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      if (!res.ok) {
        throw new Error(
          `설치 ID ${installationId}의 레포지토리를 불러오지 못했습니다.`
        );
      }

      const data = await res.json();
      const pageData = (data.repositories || []) as GithubRepository[];
      all.push(...pageData);

      if (pageData.length < perPage) break;
      page += 1;
    }

    return all;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("설치된 앱의 레포지토리 조회 중 오류가 발생했습니다.");
  }
}

export function getGithubAppInstallUrl(
  appName: string,
  redirectUri?: string
): string {
  const baseUrl = `https://github.com/apps/${appName}/installations/new`;
  if (redirectUri) {
    return `${baseUrl}?redirect_uri=${encodeURIComponent(redirectUri)}`;
  }
  return baseUrl;
}
