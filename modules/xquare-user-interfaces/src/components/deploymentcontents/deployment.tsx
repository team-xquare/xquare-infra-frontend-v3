import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { Typography } from "../typography/index";
import Xquare_colors from "../../styles";
import { Input_basic, Input_record } from "../input";
import type {
  ApplicationGitHubDetail,
  ApplicationBuildDetail,
  ApplicationConfigurationDetail,
  UpdateApplicationConfigurationRequest,
} from "@xquare/utils";
import { getRepoInfo, listBranches, getLatestCommitSha } from "@xquare/utils";

// 빌드 타입별 필수 필드 정의 (createapplication.tsx와 동일)
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

interface DeploymentContentsProps {
  applicationId?: number;
  editable: boolean;
  onSave: () => void;
  github?: ApplicationGitHubDetail;
  build?: ApplicationBuildDetail;
  configuration?: ApplicationConfigurationDetail;
  onUpdate: (
    applicationId: number,
    request: UpdateApplicationConfigurationRequest
  ) => Promise<boolean>;
}

function DeploymentContents({
  applicationId,
  editable,
  onSave,
  github,
  build,
  configuration,
  onUpdate,
}: DeploymentContentsProps) {
  // GitHub 설정
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [branch, setBranch] = useState("main");
  const [branches, setBranches] = useState<string[]>([]);
  const [installationId, setInstallationId] = useState("");
  const [hash, setHash] = useState("");
  const [triggerPaths, setTriggerPaths] = useState<string[]>([]);
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState<string | null>(null);
  const [githubMessage, setGithubMessage] = useState<string | null>(null);

  // API로부터 받은 GitHub 데이터로 초기화
  useEffect(() => {
    if (github) {
      setOwner(github.owner || "");
      setRepo(github.repo || "");
      setBranch(github.branch || "main");
      setInstallationId(github.installationId || "");
      setHash(github.hash || "");
      setTriggerPaths(github.triggerPaths || []);
    }
  }, [github]);

  const [isDirtyGithub, setIsDirtyGithub] = useState(false);

  const branchOptions =
    branch && !branches.includes(branch) ? [branch, ...branches] : branches;

  const handleAddTriggerPath = () => {
    setTriggerPaths([...triggerPaths, ""]);
    setIsDirtyGithub(true);
  };

  const handleRemoveTriggerPath = (index: number) => {
    setTriggerPaths((prev) => prev.filter((_, i) => i !== index));
    setIsDirtyGithub(true);
  };

  const handleChangeTriggerPath = (index: number, value: string) => {
    const updated = [...triggerPaths];
    updated[index] = value;
    setTriggerPaths(updated);
    setIsDirtyGithub(true);
  };

  const fetchCommitForBranch = async (
    ownerVal: string,
    repoVal: string,
    targetBranch: string,
    signal?: AbortSignal
  ) => {
    const sha = await getLatestCommitSha(
      ownerVal,
      repoVal,
      targetBranch,
      signal
    );
    setHash(sha);
  };

  const handleBranchChange = async (value: string) => {
    setBranch(value);
    setIsDirtyGithub(true);
    console.log("[DeploymentContents] branch change", value);

    if (!value.trim() || !owner.trim() || !repo.trim()) {
      setHash("");
      return;
    }

    setGithubLoading(true);
    setGithubError(null);
    setGithubMessage(null);

    try {
      await fetchCommitForBranch(owner.trim(), repo.trim(), value);
      setGithubMessage("선택한 브랜치의 최신 커밋을 불러왔습니다.");
    } catch (err) {
      console.error("[DeploymentContents] branch commit fetch error", err);
      setGithubError(
        err instanceof Error ? err.message : "커밋 정보를 불러오지 못했습니다."
      );
      setHash("");
    } finally {
      setGithubLoading(false);
    }
  };

  const githubAbortRef = useRef<AbortController | null>(null);

  const handleFetchGithub = async () => {
    if (!owner.trim() || !repo.trim()) {
      setGithubError("Owner와 Repository를 입력해주세요.");
      return;
    }

    const ownerVal = owner.trim();
    const repoVal = repo.trim();

    githubAbortRef.current?.abort();
    const controller = new AbortController();
    githubAbortRef.current = controller;

    setGithubLoading(true);
    setGithubError(null);
    setGithubMessage(null);

    try {
      const { defaultBranch } = await getRepoInfo(
        ownerVal,
        repoVal,
        controller.signal
      );
      const branchNames = await listBranches(
        ownerVal,
        repoVal,
        100,
        controller.signal
      );
      setBranches(branchNames);

      const targetBranch =
        branchNames.find((name) => name === defaultBranch) ??
        branchNames[0] ??
        defaultBranch;

      setBranch(targetBranch);

      if (targetBranch) {
        await fetchCommitForBranch(
          ownerVal,
          repoVal,
          targetBranch,
          controller.signal
        );
      } else {
        setHash("");
      }

      setGithubMessage("GitHub 정보가 업데이트되었습니다.");
      setIsDirtyGithub(true);
    } catch (err) {
      const aborted =
        (err instanceof DOMException && err.name === "AbortError") ||
        (err instanceof Error && err.name === "AbortError");
      if (aborted) {
        console.log("[DeploymentContents] github fetch aborted");
        return;
      }
      console.error("[DeploymentContents] github fetch error", err);
      setGithubError(
        err instanceof Error
          ? err.message
          : "GitHub 정보를 불러오지 못했습니다."
      );
    } finally {
      setGithubLoading(false);
      if (githubAbortRef.current === controller) {
        githubAbortRef.current = null;
      }
    }
  };

  const handleSaveGithub = async () => {
    if (!applicationId || !configuration) {
      console.error(
        "[DeploymentContents] applicationId or configuration missing"
      );
      return;
    }

    try {
      const updatedConfig: ApplicationConfigurationDetail = {
        ...configuration,
        github: {
          ...configuration.github,
          owner,
          repo,
          branch,
          installationId,
          hash,
          triggerPaths,
        },
      };

      await onUpdate(applicationId, { configuration: updatedConfig });
      console.log("[DeploymentContents] GitHub 설정 저장 성공");
      setIsDirtyGithub(false);
      setGithubMessage(null);
      setGithubError(null);
      onSave();
    } catch (err) {
      console.error("[DeploymentContents] GitHub 설정 저장 실패", err);
      const errorMessage =
        err instanceof Error ? err.message : "알 수 없는 오류";
      setGithubMessage(null);
      setGithubError(errorMessage);
    }
  };

  // Build 설정
  const [type, setType] = useState("gradle");
  const [version, setVersion] = useState("");
  const [buildCommand, setBuildCommand] = useState("");
  const [startCommand, setStartCommand] = useState("");
  const [inputPath, setInputPath] = useState("");
  const [outputPath, setOutputPath] = useState("");
  const [workingDirectory, setWorkingDirectory] = useState("");

  // API로부터 받은 빌드 데이터로 초기화
  useEffect(() => {
    if (build) {
      setType(build.type || "gradle");
      setVersion(build.version || "");
      setBuildCommand(build.buildCommand || "");
      setStartCommand(build.startCommand || "");
      setInputPath(build.inputPath || "");
      setOutputPath(build.outputPath || "");
      setWorkingDirectory(build.workingDirectory || "");
    }
  }, [build]);

  const [isDirtyBuild, setIsDirtyBuild] = useState(false);
  const [buildError, setBuildError] = useState<string | null>(null);

  const handleSaveBuild = async () => {
    if (!applicationId || !configuration) {
      console.error(
        "[DeploymentContents] applicationId or configuration missing"
      );
      return;
    }

    try {
      const updatedBuild: ApplicationBuildDetail = { type };
      if (needsVersion(type) && version.trim()) {
        updatedBuild.version = version.trim();
      }
      if (needsBuildCommand(type) && buildCommand.trim()) {
        updatedBuild.buildCommand = buildCommand.trim();
      }
      if (needsStartCommand(type) && startCommand.trim()) {
        updatedBuild.startCommand = startCommand.trim();
      }
      if (needsInputPath(type) && inputPath.trim()) {
        updatedBuild.inputPath = inputPath.trim();
      }
      if (needsOutputPath(type) && outputPath.trim()) {
        updatedBuild.outputPath = outputPath.trim();
      }
      if (needsWorkingDirectory(type) && workingDirectory.trim()) {
        updatedBuild.workingDirectory = workingDirectory.trim();
      }

      const updatedConfig: ApplicationConfigurationDetail = {
        ...configuration,
        build: updatedBuild,
      };

      await onUpdate(applicationId, { configuration: updatedConfig });
      console.log("[DeploymentContents] Build 설정 저장 성공");
      setIsDirtyBuild(false);
      setBuildError(null);
      onSave();
    } catch (err) {
      console.error("[DeploymentContents] Build 설정 저장 실패", err);
      const errorMessage =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setBuildError(`저장에 실패했습니다: ${errorMessage}`);
      // onSave는 호출하지 않음 - 에러가 발생했으므로 저장되지 않음
    }
  };

  return (
    <Container>
      <ValueBox>
        <Typography size="6x" weight="bold">
          GitHub
        </Typography>

        <InputArea>
          <Typography size="5x" weight="semiBold">
            Repository Name
          </Typography>
          <Input_basic
            value={repo}
            onChange={(e) => {
              setRepo(e.target.value);
              setIsDirtyGithub(true);
            }}
            placeholder="Repository Name"
            width="950px"
            height="35px"
            disabled={!editable}
          />
        </InputArea>

        <InputArea>
          <Typography size="5x" weight="semiBold">
            Repository Owner
          </Typography>
          <Input_basic
            value={owner}
            onChange={(e) => {
              setOwner(e.target.value);
              setIsDirtyGithub(true);
            }}
            placeholder="Repository Owner"
            width="950px"
            height="35px"
            disabled={!editable}
          />
        </InputArea>

        {editable && (
          <div
            style={{
              margin: "0.5rem",
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            <Button_fetch
              onClick={handleFetchGithub}
              disabled={githubLoading || !owner.trim() || !repo.trim()}
            >
              {githubLoading ? "불러오는 중..." : "GitHub에서 불러오기"}
            </Button_fetch>
          </div>
        )}

        <InputArea>
          <Typography size="5x" weight="semiBold">
            Branch
          </Typography>
          <SelectBox
            value={branch}
            onChange={(e) => handleBranchChange(e.target.value)}
            disabled={!editable || !branchOptions.length || githubLoading}
          >
            <option value="" disabled>
              {githubLoading ? "불러오는 중..." : "브랜치를 선택하세요"}
            </option>
            {branchOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </SelectBox>
        </InputArea>

        <InputArea>
          <Typography size="5x" weight="semiBold">
            Installation ID
          </Typography>
          <Input_basic
            value={installationId}
            onChange={(e) => {
              setInstallationId(e.target.value);
              setIsDirtyGithub(true);
            }}
            placeholder="GitHub App installation id"
            width="950px"
            height="35px"
            disabled={!editable}
          />
        </InputArea>

        <InputArea>
          <Typography size="5x" weight="semiBold">
            Commit Hash
          </Typography>
          <Input_basic
            value={hash}
            onChange={(e) => {
              setHash(e.target.value);
              setIsDirtyGithub(true);
            }}
            placeholder="Commit hash"
            width="950px"
            height="35px"
            disabled={!editable}
          />
        </InputArea>

        <StatusRow>
          {githubError && <StatusText color="red">{githubError}</StatusText>}
          {githubMessage && !githubError && (
            <StatusText>{githubMessage}</StatusText>
          )}
        </StatusRow>

        <TriggerPathsSection>
          <Typography size="5x" weight="semiBold" style={{ marginLeft: "0px" }}>
            Trigger Paths
          </Typography>

          {triggerPaths.map((path, index) => (
            <TriggerPathInputArea key={index}>
              <Input_record
                value={path}
                onChange={(e) => handleChangeTriggerPath(index, e.target.value)}
                placeholder="ex) src/**"
                width="100%"
                height="35px"
                disabled={!editable}
              />
              {editable && triggerPaths.length > 1 && (
                <DeleteBtn onClick={() => handleRemoveTriggerPath(index)}>
                  삭제
                </DeleteBtn>
              )}
            </TriggerPathInputArea>
          ))}

          {editable && (
            <AddTriggerBtn onClick={handleAddTriggerPath}>+ 추가</AddTriggerBtn>
          )}
        </TriggerPathsSection>

        {editable && isDirtyGithub && (
          <SaveBox>
            <SaveBtn onClick={handleSaveGithub}>저장</SaveBtn>
          </SaveBox>
        )}
      </ValueBox>

      <ValueBox>
        <Typography size="6x" weight="bold">
          Builds
        </Typography>

        <InputArea>
          <Typography size="5x" weight="semiBold">
            Build Type
          </Typography>
          <SelectBox
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setIsDirtyBuild(true);
            }}
            disabled={!editable}
          >
            <option value="">빌드 타입 선택</option>
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

        {needsVersion(type) && (
          <InputArea>
            <Typography size="5x" weight="semiBold">
              Version
            </Typography>
            <Input_basic
              value={version}
              onChange={(e) => {
                setVersion(e.target.value);
                setIsDirtyBuild(true);
              }}
              placeholder="ex) 17, 21"
              width="950px"
              height="35px"
              disabled={!editable}
            />
          </InputArea>
        )}

        {needsWorkingDirectory(type) && (
          <InputArea>
            <Typography size="5x" weight="semiBold">
              Working Directory
            </Typography>
            <Input_basic
              value={workingDirectory}
              onChange={(e) => {
                setWorkingDirectory(e.target.value);
                setIsDirtyBuild(true);
              }}
              placeholder="ex) ./"
              width="950px"
              height="35px"
              disabled={!editable}
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

          if (needsBuildCommand(type)) {
            recordFields.push({
              id: "buildCommand",
              label: "Build Command",
              value: buildCommand,
              onChange: (val) => {
                setBuildCommand(val);
                setIsDirtyBuild(true);
              },
              placeholder: "ex) ./gradlew build",
            });
          }

          if (needsStartCommand(type)) {
            recordFields.push({
              id: "startCommand",
              label: "Start Command",
              value: startCommand,
              onChange: (val) => {
                setStartCommand(val);
                setIsDirtyBuild(true);
              },
              placeholder: "ex) java -jar app.jar",
            });
          }

          if (needsInputPath(type)) {
            recordFields.push({
              id: "inputPath",
              label: "Input Path",
              value: inputPath,
              onChange: (val) => {
                setInputPath(val);
                setIsDirtyBuild(true);
              },
              placeholder: "Source root path",
            });
          }

          if (needsOutputPath(type)) {
            recordFields.push({
              id: "outputPath",
              label: "Output Path",
              value: outputPath,
              onChange: (val) => {
                setOutputPath(val);
                setIsDirtyBuild(true);
              },
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
                    disabled={!editable}
                  />
                </InputAreaVertical>
              ))}
            </InputAreaSecond>
          ));
        })()}

        {editable && isDirtyBuild && (
          <SaveBox>
            <SaveBtn onClick={handleSaveBuild}>저장</SaveBtn>
          </SaveBox>
        )}
        {buildError && <StatusText color="red">{buildError}</StatusText>}
      </ValueBox>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  min-height: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const ValueBox = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
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

const InputAreaSecond = styled.div`
  display: flex;
  padding: 3px 5px;
  width: 100%;
  margin-left: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
`;

const InputAreaVertical = styled.div`
  display: flex;
  width: 50%;
  flex-direction: column;
  gap: 0.5rem;
`;

const SaveBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const SaveBtn = styled.button`
  padding: 8px 14px;
  background-color: ${Xquare_colors.gray[400]};
  color: white;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  &:hover {
    background-color: ${Xquare_colors.gray[500]};
  }
`;

const AddTriggerBtn = styled.button`
  width: 100%;
  display: flex;
  justify-content: flex-start;
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

const SelectBox = styled.select`
  width: 300px;
  height: 35px;
  border: none;
  background: transparent;
  text-align: right;
  font-size: 16px;
  color: ${Xquare_colors.gray[700]};
  padding: 0 8px;

  &:focus {
    outline: none;
  }

  &:disabled {
    background-color: ${Xquare_colors.gray[100]};
    color: ${Xquare_colors.gray[700]};
    cursor: not-allowed;
    border-radius: 4px;
  }
`;

const StatusRow = styled.div`
  display: flex;
  width: 100%;
  min-height: auto;
  padding: 0 0px;
  margin: 0;
`;

const StatusText = styled.span<{ color?: string }>`
  font-size: 14px;
  color: ${({ color }) => color ?? Xquare_colors.gray[500]};
`;

const TriggerPathsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const TriggerPathInputArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 3px 5px;
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 0.85rem;
  white-space: nowrap;

  &:hover {
    opacity: 0.6;
  }
`;

const Button_fetch = styled.button`
  padding: 8px 16px;
  background-color: ${Xquare_colors.gray[500]};
  color: white;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  font-size: 14px;

  &:hover:not(:disabled) {
    background-color: ${Xquare_colors.gray[600]};
  }

  &:disabled {
    background-color: ${Xquare_colors.gray[300]};
    cursor: not-allowed;
  }
`;

export default DeploymentContents;
