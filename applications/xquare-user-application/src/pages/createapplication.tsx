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
} from "@xquare/user-interfaces";
import { useAuthGuard, useCreateApplication } from "@xquare/hooks";
import { getSelectedTeamId, getSelectedTeam } from "@xquare/utils";
import type { CreateApplicationRequest, ApplicationBuild } from "@xquare/utils";
import { getRepoInfo, listBranches, getLatestCommitSha } from "@xquare/utils";

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

// --- Build configuration required fields per type ---
type BuildField =
  | "VERSION"
  | "BUILD_COMMAND"
  | "START_COMMAND"
  | "INPUT_PATH"
  | "OUTPUT_PATH"
  | "WORKING_DIRECTORY";

const REQUIRED_FIELDS: Record<string, BuildField[]> = {
  gradle: ["VERSION", "BUILD_COMMAND", "OUTPUT_PATH"],
  node_js: ["VERSION", "BUILD_COMMAND", "START_COMMAND"],
  react: ["VERSION", "BUILD_COMMAND", "OUTPUT_PATH"],
  vite: ["VERSION", "BUILD_COMMAND", "OUTPUT_PATH"],
  vue: ["VERSION", "BUILD_COMMAND", "OUTPUT_PATH"],
  next_js: ["VERSION", "BUILD_COMMAND", "START_COMMAND"],
  go: ["VERSION", "BUILD_COMMAND", "OUTPUT_PATH"],
  rust: ["VERSION", "BUILD_COMMAND", "OUTPUT_PATH"],
  maven: ["VERSION", "BUILD_COMMAND", "OUTPUT_PATH"],
  django: ["VERSION", "BUILD_COMMAND", "START_COMMAND"],
  flask: ["VERSION", "BUILD_COMMAND", "START_COMMAND"],
  docker: ["INPUT_PATH", "WORKING_DIRECTORY"],
};

const needsField = (type: string, field: BuildField) => {
  const t = (type ?? "").trim();
  const set = REQUIRED_FIELDS[t];
  return Array.isArray(set) ? set.includes(field) : false;
};

const needsVersion = (type: string) => needsField(type, "VERSION");
const needsBuildCommand = (type: string) => needsField(type, "BUILD_COMMAND");
const needsStartCommand = (type: string) => needsField(type, "START_COMMAND");
const needsInputPath = (type: string) => needsField(type, "INPUT_PATH");
const needsOutputPath = (type: string) => needsField(type, "OUTPUT_PATH");
const needsWorkingDirectory = (type: string) =>
  needsField(type, "WORKING_DIRECTORY");

const CreateApplication = () => {
  useAuthGuard();
  const navigate = useNavigate();
  const {
    create,
    loading: creating,
    error: createError,
  } = useCreateApplication();
  const [teamId] = useState<number | null>(getSelectedTeamId());
  const [teamName] = useState<string>(getSelectedTeam()?.name ?? "");
  const [projectName, setProjectName] = useState("");
  const [repoName, setRepoName] = useState("");
  const [repoOwner, setRepoOwner] = useState("");
  const [installationId, setInstallationId] = useState("");
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

  const handleFetchGithub = async () => {
    if (!repoOwner.trim() || !repoName.trim()) {
      setGithubError("Owner와 Repository를 입력해주세요.");
      return;
    }

    const owner = repoOwner.trim();
    const repo = repoName.trim();

    setGithubLoading(true);
    setGithubError(null);
    setGithubMessage(null);

    try {
      const { defaultBranch } = await getRepoInfo(owner, repo);
      const branchNames = await listBranches(owner, repo, 100);
      setBranches(branchNames);

      const targetBranch =
        branchNames.find((name) => name === defaultBranch) ??
        branchNames[0] ??
        defaultBranch;

      setBranch(targetBranch);

      if (targetBranch) {
        await fetchCommitForBranch(owner, repo, targetBranch);
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
          <SectionHeader>
            <Typography size="5x" weight="bold">
              Step1. Github Repository
            </Typography>
          </SectionHeader>
          <InputArea>
            <Typography size="5x" weight="semiBold">
              Repository Name
            </Typography>
            <InlineInputs>
              <Input_basic
                value={repoName}
                onChange={(e) => {
                  setRepoName(e.target.value);
                }}
                placeholder="Repository Name"
                width="100%"
                height="35px"
              />
            </InlineInputs>
          </InputArea>
          <InputArea>
            <Typography size="5x" weight="semiBold">
              Repository Owner
            </Typography>
            <Input_basic
              value={repoOwner}
              onChange={(e) => {
                setRepoOwner(e.target.value);
              }}
              placeholder="Repository Owner"
              width="950px"
              height="35px"
            />
          </InputArea>
          <div
            style={{
              margin: "0.5rem",
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            <Tooltip
              content="Owner와 Repository의 GitHub 정보를 불러옵니다.
              브랜치 목록과 최신 커밋 해시가 자동으로 채워집니다."
              position="left"
            >
              <Button_square
                type="button"
                width="200px"
                height="40px"
                onClick={handleFetchGithub}
                disabled={
                  githubLoading || !repoOwner.trim() || !repoName.trim()
                }
              >
                {githubLoading ? "불러오는 중..." : "GitHub에서 불러오기"}
              </Button_square>
            </Tooltip>
          </div>
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
            {githubError && <StatusText color="red">{githubError}</StatusText>}
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
        {formError && <StatusText color="red">{formError}</StatusText>}
        {createError && !formError && (
          <StatusText color="red">{createError.message}</StatusText>
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
`;

const InlineInputs = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  width: 80%;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const SelectBox = styled.select`
  width: 300px;
  height: 35px;
  border: none;
  background: transparent;
  text-align: right;
  font-size: 16px;
  color: ${Xquare_colors.gray[700]};

  &:focus {
    outline: none;
  }

  &:disabled {
    color: ${Xquare_colors.gray[400]};
  }
`;

const StatusRow = styled.div`
  display: flex;
  width: 100%;
  min-height: 15px;
  padding: 0 0px;
`;

const StatusText = styled.span<{ color?: string }>`
  font-size: 14px;
  color: ${({ color }) => color ?? Xquare_colors.gray[500]};
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
`;

const InputAreaVertical = styled.div`
  display: flex;
  width: 50%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.5rem;
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
`;

export default CreateApplication;
