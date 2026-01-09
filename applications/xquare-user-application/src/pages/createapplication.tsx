import styled from "@emotion/styled";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { InfoIcon } from "@xquare/user-interfaces";
import { useNavigate } from "react-router-dom";
import {
  Title,
  Xquare_colors,
  Typography,
  Input_basic,
  Input_record,
  Button_square,
  Tooltip,
  ErrorMessage,
  LoadingOverlay,
} from "@xquare/user-interfaces";
import {
  useAuthGuard,
  useCreateApplication,
  useGithubToken,
} from "@xquare/hooks";
import { getSelectedTeamId, getSelectedTeam } from "@xquare/utils";
import type {
  CreateApplicationRequest,
  ApplicationBuild,
  GithubTokenData,
  GithubRepository,
  GithubInstallation,
} from "@xquare/utils";
import {
  getRepoInfo,
  listBranches,
  getLatestCommitSha,
  listUserInstallations,
  listInstallationRepositories,
  getGithubAppInstallUrl,
  needsVersion,
  needsBuildCommand,
  needsStartCommand,
  needsInputPath,
  needsOutputPath,
  needsWorkingDirectory,
} from "@xquare/utils";

// --- Domain validation helpers (module scope for stable references) ---
function extractHostname(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  try {
    const withProtocol = trimmed.includes("://")
      ? trimmed
      : `https://${trimmed}`;
    const u = new URL(withProtocol);
    return u.hostname;
  } catch {
    return trimmed.split("/")[0];
  }
}

function isAllowedDomain(value: string): boolean {
  const host = extractHostname(value).toLowerCase();
  return host.endsWith(".dsmhs.kr");
}

const CreateApplication = () => {
  useAuthGuard();
  const navigate = useNavigate();
  const {
    create,
    loading: creating,
    error: createError,
  } = useCreateApplication();
  const { getToken, loading: tokenLoading } = useGithubToken();
  const [teamId] = useState<number | null>(getSelectedTeamId());
  const [teamName] = useState<string>(getSelectedTeam()?.name ?? "");
  const [projectName, setProjectName] = useState("");
  const [repoName, setRepoName] = useState("");
  const [repoOwner, setRepoOwner] = useState("");
  const [installationId, setInstallationId] = useState("");
  const [githubToken, setGithubToken] = useState<GithubTokenData | null>(null);
  const [allRepositories, setAllRepositories] = useState<GithubRepository[]>(
    []
  );
  const [ownerTabs, setOwnerTabs] = useState<
    { login: string; avatarUrl?: string }[]
  >([]);
  const [selectedOwner, setSelectedOwner] = useState("");
  const [installations, setInstallations] = useState<GithubInstallation[]>([]);
  const [, setSelectedInstallation] = useState<GithubInstallation | null>(null);
  const [repoPage, setRepoPage] = useState(1);
  const REPOS_PER_PAGE = 12;
  const [branch, setBranch] = useState("");
  const [branches, setBranches] = useState<string[]>([]);
  const [commitHash, setCommitHash] = useState("");
  const [triggerPaths, setTriggerPaths] = useState<string[]>([""]);
  const [buildTools, setBuildTools] = useState("");
  const [javaVersion, setJavaVersion] = useState("");
  const [startCommand, setStartCommand] = useState("");
  const [inputPath, setInputPath] = useState("");
  const [outputPath, setOutputPath] = useState("");
  const [workingDirectory, setWorkingDirectory] = useState("");
  const [buildCommand, setBuildCommand] = useState("");
  const [routes, setRoutes] = useState<{ url: string; port: string }[]>([
    { url: "", port: "" },
  ]);
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState<string | null>(null);
  const [githubMessage, setGithubMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const hasTeam = typeof teamId === "number" && !Number.isNaN(teamId);

  const normalizedTriggerPaths = useMemo(
    () => triggerPaths.map((p) => p.trim()).filter(Boolean),
    [triggerPaths]
  );

  const filteredRepositories = useMemo(
    () => allRepositories.filter((repo) => repo.owner.login === selectedOwner),
    [allRepositories, selectedOwner]
  );

  const totalRepoPages = useMemo(
    () => Math.max(1, Math.ceil(filteredRepositories.length / REPOS_PER_PAGE)),
    [filteredRepositories.length]
  );

  const paginatedRepositories = useMemo(() => {
    const start = (repoPage - 1) * REPOS_PER_PAGE;
    return filteredRepositories.slice(start, start + REPOS_PER_PAGE);
  }, [filteredRepositories, repoPage]);

  const branchOptions = useMemo(
    () =>
      branch && !branches.includes(branch) ? [branch, ...branches] : branches,
    [branch, branches]
  );

  const routesValid = useMemo(
    () =>
      routes.length > 0 &&
      routes.every(
        (r) =>
          r.url.trim() !== "" &&
          isAllowedDomain(r.url) &&
          r.port.trim() !== "" &&
          Number.isFinite(Number(r.port))
      ),
    [routes]
  );
  const isValid = useMemo(
    () =>
      hasTeam &&
      projectName.trim() !== "" &&
      repoName.trim() !== "" &&
      repoOwner.trim() !== "" &&
      installationId.trim() !== "" &&
      branch.trim() !== "" &&
      normalizedTriggerPaths.length > 0 &&
      buildTools.trim() !== "" &&
      (!needsVersion(buildTools) || javaVersion.trim() !== "") &&
      (!needsWorkingDirectory(buildTools) || workingDirectory.trim() !== "") &&
      (!needsBuildCommand(buildTools) || buildCommand.trim() !== "") &&
      (!needsStartCommand(buildTools) || startCommand.trim() !== "") &&
      (!needsInputPath(buildTools) || inputPath.trim() !== "") &&
      (!needsOutputPath(buildTools) || outputPath.trim() !== "") &&
      routesValid,
    [
      hasTeam,
      projectName,
      repoName,
      repoOwner,
      installationId,
      branch,
      normalizedTriggerPaths,
      buildTools,
      javaVersion,
      workingDirectory,
      buildCommand,
      startCommand,
      inputPath,
      outputPath,
      routesValid,
    ]
  );

  const handleKeyChange = (index: number, value: string) => {
    setRoutes((prev) =>
      prev.map((route, i) => (i === index ? { ...route, url: value } : route))
    );
  };

  const handleValueChange = (index: number, value: string) => {
    setRoutes((prev) =>
      prev.map((route, i) => (i === index ? { ...route, port: value } : route))
    );
  };

  const removeRoute = (index: number) => {
    // 라우트 삭제 로그
    console.log("[CreateApplication] remove route", { index });
    setRoutes((prev) => prev.filter((_, i) => i !== index));
  };

  const fetchCommitForBranch = async (
    owner: string,
    repo: string,
    targetBranch: string
  ) => {
    const sha = await getLatestCommitSha(owner, repo, targetBranch);
    setCommitHash(sha);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("[CreateApplication] submit", {
      teamId,
      projectName,
      repoOwner,
      repoName,
    });

    if (!hasTeam) {
      console.error("[CreateApplication] submit error: no team selected");
      setFormError("팀을 선택해주세요. (사이드바 하단)");
      return;
    }
    setFormError(null);

    const endpoints = routes.map((r) => ({
      port: Number(r.port),
      routes: [r.url.trim()],
    }));

    let buildConfig: ApplicationBuild = { type: buildTools.trim() };
    if (needsVersion(buildTools) && javaVersion.trim()) {
      buildConfig = { ...buildConfig, version: javaVersion.trim() };
    }
    if (needsBuildCommand(buildTools) && buildCommand.trim()) {
      buildConfig = { ...buildConfig, buildCommand: buildCommand.trim() };
    }
    if (needsStartCommand(buildTools) && startCommand.trim()) {
      buildConfig = { ...buildConfig, startCommand: startCommand.trim() };
    }
    if (needsInputPath(buildTools) && inputPath.trim()) {
      buildConfig = { ...buildConfig, inputPath: inputPath.trim() };
    }
    if (needsOutputPath(buildTools) && outputPath.trim()) {
      buildConfig = { ...buildConfig, outputPath: outputPath.trim() };
    }
    if (needsWorkingDirectory(buildTools) && workingDirectory.trim()) {
      buildConfig = {
        ...buildConfig,
        workingDirectory: workingDirectory.trim(),
      };
    }

    const payload: CreateApplicationRequest = {
      teamId: teamId!,
      name: projectName.trim(),
      configuration: {
        github: {
          owner: repoOwner.trim(),
          repo: repoName.trim(),
          branch: branch.trim(),
          installationId: installationId.trim(),
          hash: commitHash.trim(),
          triggerPaths: normalizedTriggerPaths,
        },
        build: buildConfig,
        endpoints,
      },
    };

    const createdId = await create(payload);
    if (createdId) {
      navigate("/deployment");
    }
  };

  const handleBranchChange = async (value: string) => {
    setBranch(value);
    console.log("[CreateApplication] branch change", value);

    if (!value.trim() || !repoOwner.trim() || !repoName.trim()) {
      setCommitHash("");
      return;
    }

    setGithubLoading(true);
    setGithubError(null);
    setGithubMessage(null);

    try {
      await fetchCommitForBranch(repoOwner.trim(), repoName.trim(), value);
      setGithubMessage("선택한 브랜치의 최신 커밋을 불러왔습니다.");
    } catch (err) {
      console.error("[CreateApplication] branch commit fetch error", err);
      setGithubError(
        err instanceof Error ? err.message : "커밋 정보를 불러오지 못했습니다."
      );
      setCommitHash("");
    } finally {
      setGithubLoading(false);
    }
  };

  const handleFetchGithub = async (ownerParam?: string, repoParam?: string) => {
    const targetOwner = ownerParam ?? repoOwner.trim();
    const targetRepo = repoParam ?? repoName.trim();

    if (!targetOwner || !targetRepo) {
      setGithubError("Owner와 Repository를 입력해주세요.");
      return;
    }

    setGithubLoading(true);
    setGithubError(null);
    setGithubMessage(null);

    try {
      const { defaultBranch } = await getRepoInfo(targetOwner, targetRepo);
      const branchNames = await listBranches(targetOwner, targetRepo, 100);
      setBranches(branchNames);

      const targetBranch =
        branchNames.find((name) => name === defaultBranch) ??
        branchNames[0] ??
        defaultBranch;

      setBranch(targetBranch);

      if (targetBranch) {
        await fetchCommitForBranch(targetOwner, targetRepo, targetBranch);
      } else {
        setCommitHash("");
      }

      setGithubMessage("GitHub 정보가 업데이트되었습니다.");
    } catch (err) {
      console.error("[CreateApplication] github fetch error", err);
      setGithubError(
        err instanceof Error
          ? err.message
          : "GitHub 정보를 불러오지 못했습니다."
      );
    } finally {
      setGithubLoading(false);
    }
  };

  const handleGithubOAuth = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    if (!clientId) {
      setGithubError("GitHub Client ID가 설정되지 않았습니다.");
      return;
    }

    const baseUrl = import.meta.env.VITE_FRONTEND_URL;
    const redirectUri = `${baseUrl}/github/callback`;
    const scope = "repo,read:user";
    const state = Math.random().toString(36).substring(7);

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;

    const popup = window.open(
      authUrl,
      "GitHub OAuth",
      "width=600,height=800,left=100,top=100"
    );

    if (!popup) {
      setGithubError("팝업이 차단되었습니다. 팝업을 허용해주세요.");
      return;
    }

    let messageHandlerApplied = false;

    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "github-oauth-code") {
        // 이미 처리된 경우 중복 처리 방지
        if (messageHandlerApplied) {
          console.log("[CreateApplication] OAuth already processed, skipping");
          return;
        }
        messageHandlerApplied = true;

        const { code } = event.data;
        console.log("[CreateApplication] OAuth code received", code);

        setGithubLoading(true);
        setGithubError(null);

        try {
          const response = await getToken(code);
          if (response && response.success) {
            setGithubToken(response.data);
            setGithubMessage("GitHub 연동이 완료되었습니다.");

            // GitHub App 설치 목록 로드
            try {
              const installs = await listUserInstallations(
                response.data.accessToken
              );
              setInstallations(installs);
              console.log(
                "[CreateApplication] Installations loaded:",
                installs.length
              );

              // 첫 번째 installation이 있으면 자동으로 레포지토리 로드
              if (installs.length > 0) {
                const firstInstall = installs[0];
                setSelectedInstallation(firstInstall);
                setInstallationId(String(firstInstall.id));

                try {
                  // 모든 installations의 레포지토리 로드
                  const allRepos: GithubRepository[] = [];

                  for (const install of installs) {
                    try {
                      const repos = await listInstallationRepositories(
                        response.data.accessToken,
                        install.id
                      );
                      allRepos.push(...repos);
                      console.log(
                        `[CreateApplication] Loaded ${repos.length} repos from ${install.account.login}`
                      );
                    } catch (repoErr) {
                      console.error(
                        `[CreateApplication] Failed to load repos for installation ${install.id}`,
                        repoErr
                      );
                    }
                  }

                  setAllRepositories(allRepos);

                  // owner 탭 업데이트
                  const ownerMap = new Map<string, string | undefined>();
                  allRepos.forEach((repo) => {
                    if (!ownerMap.has(repo.owner.login)) {
                      ownerMap.set(repo.owner.login, repo.owner.avatar_url);
                    }
                  });

                  const owners = Array.from(ownerMap.entries()).map(
                    ([login, avatarUrl]) => ({ login, avatarUrl })
                  );
                  setOwnerTabs(owners);
                  setSelectedOwner(owners[0]?.login ?? "");
                  setGithubMessage(
                    `${allRepos.length}개의 레포지토리를 불러왔습니다.`
                  );
                  console.log(
                    "[CreateApplication] Total repositories loaded:",
                    allRepos.length
                  );
                } catch (repoErr) {
                  console.error(
                    "[CreateApplication] Failed to load installation repos",
                    repoErr
                  );
                  setGithubError(
                    repoErr instanceof Error
                      ? repoErr.message
                      : "레포지토리 목록을 불러오지 못했습니다."
                  );
                }
              }
            } catch (installErr) {
              console.error(
                "[CreateApplication] Failed to load installations",
                installErr
              );
              setGithubError(
                installErr instanceof Error
                  ? installErr.message
                  : "설치 목록을 불러오지 못했습니다."
              );
            }
          } else {
            setGithubError("GitHub 토큰 교환에 실패했습니다.");
          }
        } catch (err) {
          console.error("[CreateApplication] token exchange error", err);
          setGithubError(
            err instanceof Error
              ? err.message
              : "토큰 교환 중 오류가 발생했습니다."
          );
        } finally {
          setGithubLoading(false);
          window.removeEventListener("message", handleMessage);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    const checkPopup = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopup);
        window.removeEventListener("message", handleMessage);
      }
    }, 1000);
  };

  return (
    <Container>
      <ContentsArea>
        <Title
          title={`Application 생성`}
          subTitle={`Create a new application with XQUARE`}
        ></Title>
      </ContentsArea>
      <Contents as="form" onSubmit={handleSubmit}>
        <ValueBox>
          <Typography size="5x" weight="bold">
            Step0. Application
          </Typography>
          <InputArea>
            <Typography size="5x" weight="semiBold">
              Team
            </Typography>
            <Input_basic
              value={teamName}
              onChange={() => {}}
              placeholder="현재 선택된 팀"
              width="950px"
              height="35px"
              disabled
            />
          </InputArea>
          <InputArea>
            <Typography size="5x" weight="semiBold">
              Project Name
            </Typography>
            <Input_basic
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
              }}
              placeholder="Project Name"
              width="950px"
              height="35px"
            />
          </InputArea>
        </ValueBox>
        <ValueBox>
          <SectionHeader
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <Typography size="5x" weight="bold">
              Step1. Github Repository
            </Typography>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {githubToken && installations.length > 0 && (
                <span
                  style={{
                    fontSize: "14px",
                    color: String(Xquare_colors.gray[500]),
                  }}
                >
                  {installations.length}개 앱 연결됨
                </span>
              )}
              <Tooltip
                content="GitHub App이 설치된 Organization의 Repository를 불러옵니다. 설치 후 다시 불러오기를 눌러주세요."
                position="bottom"
              >
                <Button_square
                  type="button"
                  width="100px"
                  height="36px"
                  onClick={() => {
                    handleGithubOAuth();
                  }}
                  disabled={tokenLoading}
                >
                  불러오기
                </Button_square>
              </Tooltip>
              <Tooltip
                content="앱이 설치된 organization에 한해 불러올 수 있습니다. organization이 안보이면, App을 설치해 주세요."
                position="left"
              >
                <Button_square
                  type="button"
                  width="120px"
                  height="36px"
                  onClick={() => {
                    const appSlug = import.meta.env.VITE_GITHUB_APP_SLUG;
                    if (!appSlug) {
                      setGithubError(
                        "GitHub App 슬러그가 설정되지 않았습니다. 관리자에게 문의하세요."
                      );
                      return;
                    }
                    const installUrl = getGithubAppInstallUrl(
                      appSlug,
                      window.location.origin + "/deployment/createapplication"
                    );
                    window.open(installUrl, "_blank");
                  }}
                >
                  + 앱 추가
                </Button_square>
              </Tooltip>
            </div>
          </SectionHeader>

          <LoadingOverlay
            isLoading={
              !!(githubToken && githubLoading && ownerTabs.length === 0)
            }
          />

          {githubToken && ownerTabs.length > 0 && (
            <InputAreaWithTabs>
              <OrganizationTabs>
                {ownerTabs.map((item) => (
                  <OrgTab
                    key={item.login}
                    isActive={selectedOwner === item.login}
                    onClick={() => {
                      setSelectedOwner(item.login);
                      setRepoPage(1);
                      setRepoName("");
                      setRepoOwner("");
                      setBranch("");
                      setCommitHash("");
                      setGithubMessage(null);
                    }}
                  >
                    {item.avatarUrl ? (
                      <OrgTabIcon src={item.avatarUrl} alt={item.login} />
                    ) : (
                      <OrgTabFallback>
                        {item.login.slice(0, 1).toUpperCase()}
                      </OrgTabFallback>
                    )}
                    <OrgTabLabel>{item.login}</OrgTabLabel>
                  </OrgTab>
                ))}
              </OrganizationTabs>
            </InputAreaWithTabs>
          )}

          {githubToken && filteredRepositories.length > 0 && (
            <>
              <RepositoryGrid>
                {paginatedRepositories.map((repo) => (
                  <RepositoryCard
                    key={repo.id}
                    isSelected={
                      repoName === repo.name && repoOwner === repo.owner.login
                    }
                    onClick={() => {
                      setRepoName(repo.name);
                      setRepoOwner(repo.owner.login);
                      setBranch("");
                      setCommitHash("");
                      setGithubMessage(null);
                      handleFetchGithub(repo.owner.login, repo.name);
                    }}
                  >
                    <RepositoryName>{repo.name}</RepositoryName>
                    <RepositoryOwner>{repo.owner.login}</RepositoryOwner>
                    {repo.description && (
                      <RepositoryDesc>{repo.description}</RepositoryDesc>
                    )}
                  </RepositoryCard>
                ))}
              </RepositoryGrid>

              {totalRepoPages > 1 && (
                <PaginationRow>
                  <PaginationButton
                    type="button"
                    disabled={repoPage === 1}
                    onClick={() => setRepoPage((p) => Math.max(1, p - 1))}
                  >
                    이전
                  </PaginationButton>
                  <PaginationInfo>
                    {repoPage} / {totalRepoPages}
                  </PaginationInfo>
                  <PaginationButton
                    type="button"
                    disabled={repoPage === totalRepoPages}
                    onClick={() =>
                      setRepoPage((p) => Math.min(totalRepoPages, p + 1))
                    }
                  >
                    다음
                  </PaginationButton>
                </PaginationRow>
              )}
            </>
          )}

          {githubToken && ownerTabs.length === 0 && !githubLoading && (
            <StatusRow>
              <StatusText color={String(Xquare_colors.gray[400])}>
                연동한 레포지토리가 없습니다.
              </StatusText>
            </StatusRow>
          )}
          <InputArea style={{ borderColor: String(Xquare_colors.gray[800]) }}>
            <Typography size="5x" weight="semiBold">
              Selected
            </Typography>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  fontSize: "15px",
                  color: String(Xquare_colors.gray[800]),
                  fontWeight: "500",
                }}
              >
                {repoOwner && repoName ? `${repoOwner}/${repoName}` : ""}
              </span>
            </div>
          </InputArea>
          <InputArea>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Typography size="5x" weight="semiBold">
                Branch
              </Typography>
              <Tooltip
                content="배포에 사용할 Branch를 선택해 주세요. 선택한 Branch의 최신 커밋이 자동으로 반영됩니다."
                position="right"
              >
                <InfoIcon size={18} />
              </Tooltip>
            </div>
            <SelectBox
              value={branch}
              onChange={(e) => handleBranchChange(e.target.value)}
              disabled={!branchOptions.length || githubLoading}
            >
              <option value="" disabled>
                {githubLoading ? "불러오는 중..." : "브랜치를 불러오세요"}
              </option>
              {branchOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </SelectBox>
          </InputArea>
          <InputArea>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Typography size="5x" weight="semiBold">
                Installation ID
              </Typography>
              <Tooltip
                content="GitHub App 설치 ID는 저장소 연동 설정에서 확인할 수 있습니다."
                position="right"
              >
                <InfoIcon size={18} />
              </Tooltip>
            </div>
            <Input_basic
              value={installationId}
              onChange={(e) => setInstallationId(e.target.value)}
              placeholder="GitHub App installation id"
              width="950px"
              height="35px"
            />
          </InputArea>
          <InputArea>
            <Typography size="5x" weight="semiBold">
              Commit Hash
            </Typography>
            <Input_basic
              value={commitHash}
              onChange={(e) => setCommitHash(e.target.value)}
              disabled={true}
              placeholder="latest commit sha(auto-filled)"
              width="950px"
              height="35px"
            />
          </InputArea>
          <StatusRow>
            {githubError && <ErrorMessage message={githubError} />}
            {githubMessage && !githubError && (
              <StatusText>{githubMessage}</StatusText>
            )}
          </StatusRow>
          <InputAreaSecond>
            <InputAreaVertical>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Typography size="5x" weight="semiBold">
                  Trigger Paths
                </Typography>
                <Tooltip
                  content="지정된 경로에 변경 사항이 있을 때만 배포에 반영됩니다. 예: src/** (src 폴더 내 모든 변경 감지 후 재배포)"
                  position="right"
                >
                  <InfoIcon size={18} />
                </Tooltip>
              </div>

              {triggerPaths.map((path, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    gap: "1rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Input_record
                    value={path}
                    onChange={(e) =>
                      setTriggerPaths((prev) =>
                        prev.map((p, idx) => (idx === i ? e.target.value : p))
                      )
                    }
                    placeholder="ex) src/main/**"
                    width="100%"
                    height="35px"
                  />

                  {triggerPaths.length > 1 && (
                    <DeleteBtn
                      onClick={() =>
                        setTriggerPaths((prev) =>
                          prev.filter((_, idx) => idx !== i)
                        )
                      }
                    >
                      삭제
                    </DeleteBtn>
                  )}
                </div>
              ))}

              <AddBtn onClick={() => setTriggerPaths((prev) => [...prev, ""])}>
                + 추가
              </AddBtn>
            </InputAreaVertical>
          </InputAreaSecond>
        </ValueBox>
        <ValueBox>
          <Typography size="5x" weight="bold">
            Step2. Build Settings
          </Typography>

          <InputArea>
            <Typography size="5x" weight="semiBold">
              Type
            </Typography>
            <SelectBox
              value={buildTools}
              onChange={(e) => setBuildTools(e.target.value)}
            >
              <option value="" disabled>
                빌드 타입 선택
              </option>
              <option value="gradle">gradle</option>
              <option value="node_js">node_js</option>
              <option value="react">react</option>
              <option value="vite">vite</option>
              <option value="vue">vue</option>
              <option value="next_js">next_js</option>
              <option value="go">go</option>
              <option value="rust">rust</option>
              <option value="maven">maven</option>
              <option value="django">django</option>
              <option value="flask">flask</option>
              <option value="docker">docker</option>
            </SelectBox>
          </InputArea>

          {needsVersion(buildTools) && (
            <InputArea>
              <Typography size="5x" weight="semiBold">
                Version
              </Typography>
              <Input_basic
                value={javaVersion}
                onChange={(e) => setJavaVersion(e.target.value)}
                placeholder="ex) 17"
                width="950px"
                height="35px"
              />
            </InputArea>
          )}

          {needsWorkingDirectory(buildTools) && (
            <InputArea>
              <Typography size="5x" weight="semiBold">
                Working Directory
              </Typography>
              <Input_basic
                value={workingDirectory}
                onChange={(e) => setWorkingDirectory(e.target.value)}
                placeholder="ex) /backend/service"
                width="950px"
                height="35px"
              />
            </InputArea>
          )}

          {(() => {
            const recordFields: {
              id: string;
              label: string;
              value: string;
              onChange: (next: string) => void;
              placeholder: string;
            }[] = [];

            if (needsBuildCommand(buildTools)) {
              recordFields.push({
                id: "buildCommand",
                label: "Build Command",
                value: buildCommand,
                onChange: setBuildCommand,
                placeholder: "ex) ./gradlew build",
              });
            }

            if (needsStartCommand(buildTools)) {
              recordFields.push({
                id: "startCommand",
                label: "Start Command",
                value: startCommand,
                onChange: setStartCommand,
                placeholder: "ex) java -jar app.jar",
              });
            }

            if (needsInputPath(buildTools)) {
              recordFields.push({
                id: "inputPath",
                label: "Input Path",
                value: inputPath,
                onChange: setInputPath,
                placeholder: "Source root path",
              });
            }

            if (needsOutputPath(buildTools)) {
              recordFields.push({
                id: "outputPath",
                label: "Output Path",
                value: outputPath,
                onChange: setOutputPath,
                placeholder: "Build output path",
              });
            }

            const groups: (typeof recordFields)[] = [];
            for (let i = 0; i < recordFields.length; i += 2) {
              groups.push(recordFields.slice(i, i + 2));
            }

            return groups.map((group, idx) => (
              <InputAreaSecond key={`record-row-${idx}`}>
                {group.map((field) => (
                  <InputAreaVertical key={field.id}>
                    <Typography size="5x" weight="semiBold">
                      {field.label}
                    </Typography>
                    <Input_record
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder={field.placeholder}
                      width="100%"
                      height="35px"
                    />
                  </InputAreaVertical>
                ))}
              </InputAreaSecond>
            ));
          })()}
        </ValueBox>
        <ValueBox>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Typography size="5x" weight="bold">
              Step3. Routes
            </Typography>
            <Tooltip
              content="애플리케이션에 접근할 URL 경로와 포트를 설정하세요."
              position="right"
            >
              <InfoIcon size={18} />
            </Tooltip>
          </div>

          {routes.map((item, i) => (
            <InputArea key={i}>
              <Input_basic
                value={item.url}
                onChange={(e) => handleKeyChange(i, e.target.value)}
                placeholder="URL"
                width="850px"
                height="35px"
                align="left"
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "3rem",
                }}
              >
                <Input_basic
                  value={item.port}
                  onChange={(e) => handleValueChange(i, e.target.value)}
                  placeholder="Port"
                  type="number"
                  width="100px"
                  height="35px"
                  align="right"
                />
                <DeleteBtn onClick={() => removeRoute(i)}>삭제</DeleteBtn>
              </div>
            </InputArea>
          ))}

          <AddBtn
            onClick={() =>
              setRoutes((prev) => [...prev, { url: "", port: "" }])
            }
          >
            + 추가
          </AddBtn>
          {routes.some((r) => r.url.trim() && !isAllowedDomain(r.url)) && (
            <StatusText color="red">
              URL은 XXX.dsmhs.kr 형태여야 합니다. (dsmhs.kr 도메인만 허용)
            </StatusText>
          )}
        </ValueBox>
        {formError && <ErrorMessage message={formError} />}
        {createError && !formError && (
          <ErrorMessage message={createError.message} />
        )}
        <ButtonGroup>
          <Button_square
            type="button"
            width="120px"
            height="50px"
            onClick={() => navigate("/deployment")}
          >
            취소
          </Button_square>

          <Button_square
            type="submit"
            disabled={!isValid || creating}
            width="150px"
            height="50px"
          >
            {creating ? "생성 중..." : "생성"}
          </Button_square>
        </ButtonGroup>
      </Contents>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  padding: 10px 40px;
  cursor: default;
`;

const ContentsArea = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  padding-bottom: 10px;
  width: 100%;
  margin-bottom: 15px;
  gap: 15px;
  cursor: default;
`;

const Contents = styled.div`
  width: 100%;
  min-height: 100%;
  height: auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  cursor: default;
`;

const ValueBox = styled.div`
  width: 100%;
  height: auto;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 2rem;
  cursor: default;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 3px 5px;
  width: 100%;
  height: 40px;
  border-bottom: 2px solid ${Xquare_colors.gray[300]};
  cursor: default;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: default;
`;

const SelectBox = styled.select`
  width: 300px;
  height: 35px;
  border: none;
  background: transparent;
  text-align: right;
  font-size: 16px;
  color: ${Xquare_colors.gray[700]};
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &:disabled {
    color: ${Xquare_colors.gray[400]};
    cursor: not-allowed;
  }
`;

const StatusRow = styled.div`
  display: flex;
  width: 100%;
  min-height: 15px;
  padding: 0 0px;
  cursor: default;
`;

const StatusText = styled.span<{ color?: string }>`
  font-size: 14px;
  color: ${({ color }) => color ?? Xquare_colors.gray[500]};
  cursor: default;
`;

const InputAreaSecond = styled.div`
  display: flex;
  padding: 3px 5px;
  width: 100%;
  margin-left: 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  cursor: default;
`;

const InputAreaVertical = styled.div`
  display: flex;
  width: 50%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.5rem;
  cursor: default;
`;

const AddBtn = styled.button`
  background: none;
  border: none;
  color: ${Xquare_colors.gray[500]};
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;

  &:hover {
    color: ${Xquare_colors.gray[400]};
  }
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 0.85rem;

  &:hover {
    opacity: 0.6;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  width: 100%;
  cursor: default;
`;

const RepositoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
  width: 100%;
  margin: 1rem 0;
`;

const InputAreaWithTabs = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 3px 5px;
  width: 100%;
  min-height: 50px;
  border-bottom: 2px solid ${Xquare_colors.gray[300]};
  cursor: default;
`;

const OrganizationTabs = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 5px 0;
  flex: 1;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${Xquare_colors.gray[400]};
    border-radius: 2px;
  }
`;

const OrgTab = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: none;
  border: 1px solid
    ${({ isActive }) =>
      isActive ? Xquare_colors.purple[400] : Xquare_colors.gray[300]};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${({ isActive }) => (isActive ? "600" : "500")};
  color: ${({ isActive }) =>
    isActive ? Xquare_colors.purple[400] : Xquare_colors.gray[500]};
  background: ${({ isActive }) =>
    isActive ? Xquare_colors.purple[50] : "white"};
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    border-color: ${Xquare_colors.purple[400]};
    background: ${Xquare_colors.purple[50]};
  }
`;

const OrgTabIcon = styled.img`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  object-fit: cover;
`;

const OrgTabFallback = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${Xquare_colors.gray[200]};
  color: ${Xquare_colors.gray[600]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
`;

const OrgTabLabel = styled.span`
  display: inline-block;
`;

const RepositoryCard = styled.div<{ isSelected: boolean }>`
  border: 2px solid
    ${({ isSelected }) =>
      isSelected ? Xquare_colors.purple[400] : Xquare_colors.gray[300]};
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ isSelected }) =>
    isSelected ? Xquare_colors.purple[50] : "white"};

  &:hover {
    border-color: ${Xquare_colors.purple[400]};
    background: ${Xquare_colors.purple[50]};
  }

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RepositoryName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${Xquare_colors.gray[700]};
`;

const RepositoryOwner = styled.div`
  font-size: 13px;
  color: ${Xquare_colors.gray[500]};
`;

const RepositoryDesc = styled.div`
  font-size: 12px;
  color: ${Xquare_colors.gray[400]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 4px;
`;

const PaginationRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin: 8px 0 4px;
  width: 100%;
`;

const PaginationButton = styled.button<{ disabled: boolean }>`
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid
    ${({ disabled }) =>
      disabled ? Xquare_colors.gray[200] : Xquare_colors.gray[400]};
  background: ${({ disabled }) =>
    disabled ? Xquare_colors.gray[100] : "white"};
  color: ${({ disabled }) =>
    disabled ? Xquare_colors.gray[400] : Xquare_colors.gray[600]};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;

  &:hover {
    ${({ disabled }) =>
      !disabled &&
      `border-color: ${Xquare_colors.purple[400]}; color: ${Xquare_colors.purple[400]};`}
  }
`;

const PaginationInfo = styled.span`
  font-size: 13px;
  color: ${Xquare_colors.gray[500]};
  min-width: 48px;
  text-align: center;
`;

export default CreateApplication;