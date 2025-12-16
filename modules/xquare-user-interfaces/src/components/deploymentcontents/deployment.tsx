import { useState } from "react";
import styled from "@emotion/styled";
import { Typography } from "../typography/index";
import Xquare_colors from "../../styles";
import { Input_basic, Input_record } from "../input";

function DeploymentContents({
  id,
  editable,
  onSave,
}: {
  id: number;
  editable: boolean;
  onSave: () => void;
}) {
  const [owner, setOwner] = useState(id.toString());
  const [repo, setRepo] = useState("");
  const [branch, setBranch] = useState("main");
  // const [installationId, setInstallationId] = useState("");
  // const [hash, setHash] = useState(id.toString());
  const [triggerPaths, setTriggerPaths] = useState<string[]>([]);

  const [isDirtyGithub, setIsDirtyGithub] = useState(false);

  const handleAddTriggerPath = () => {
    setTriggerPaths([...triggerPaths, ""]);
    setIsDirtyGithub(true);
  };

  const handleChangeTriggerPath = (index: number, value: string) => {
    const updated = [...triggerPaths];
    updated[index] = value;
    setTriggerPaths(updated);
    setIsDirtyGithub(true);
  };

  const handleSaveGithub = async () => {
    try {
      // const body = {
      //   owner,
      //   repo,
      //   branch,
      //   installationId,
      //   hash,
      //   triggerPaths,
      // };

      // API 로직 들어갈 자리

      setIsDirtyGithub(false);
      onSave();
    } catch (err) {
      console.error(err);
    }
  };

  const [type, setType] = useState("gradle");
  const [version, setVersion] = useState("");
  const [buildCommand, setBuildCommand] = useState("");
  const [startCommand, setStartCommand] = useState("");
  const [inputPath, setInputPath] = useState("");
  const [outputPath, setOutputPath] = useState("");
  const [workingDirectory, setWorkingDirectory] = useState("");

  const [isDirtyBuild, setIsDirtyBuild] = useState(false);

  const handleSaveBuild = async () => {
    try {
      // const body = {
      //   type,
      //   version,
      //   buildCommand,
      //   startCommand,
      //   inputPath,
      //   outputPath,
      //   workingDirectory,
      // };

      // API 로직 들어갈 자리

      setIsDirtyBuild(false);
      onSave();
    } catch (err) {
      console.error(err);
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
            Repository
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
            Owner
          </Typography>
          <Input_basic
            value={owner}
            onChange={(e) => {
              setOwner(e.target.value);
              setIsDirtyGithub(true);
            }}
            placeholder="GitHub Owner"
            width="950px"
            height="35px"
            disabled={!editable}
          />
        </InputArea>

        <InputArea>
          <Typography size="5x" weight="semiBold">
            Branch
          </Typography>
          <Input_basic
            value={branch}
            onChange={(e) => {
              setBranch(e.target.value);
              setIsDirtyGithub(true);
            }}
            placeholder="Branch"
            width="950px"
            height="35px"
            disabled={!editable}
          />
        </InputArea>

        <Typography size="5x" weight="semiBold" style={{ marginLeft: "15px" }}>
          Trigger Paths
        </Typography>

        {triggerPaths.map((path, index) => (
          <InputArea key={index}>
            <Typography size="5x" weight="semiBold">
              #{index + 1}
            </Typography>

            <Input_basic
              value={path}
              onChange={(e) => handleChangeTriggerPath(index, e.target.value)}
              placeholder="ex) src/**"
              width="950px"
              height="35px"
              disabled={!editable}
            />
          </InputArea>
        ))}

        {editable && (
          <AddTriggerBtn onClick={handleAddTriggerPath}>
            + Add Path
          </AddTriggerBtn>
        )}

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
          <Input_basic
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setIsDirtyBuild(true);
            }}
            placeholder="ex) gradle / npm / maven"
            width="950px"
            height="35px"
            disabled={!editable}
          />
        </InputArea>

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

        <InputAreaSecond>
          <InputAreaVertical>
            <Typography size="5x" weight="semiBold">
              Build Command
            </Typography>
            <Input_record
              value={buildCommand}
              onChange={(e) => {
                setBuildCommand(e.target.value);
                setIsDirtyBuild(true);
              }}
              placeholder="ex) ./gradlew build"
              width="100%"
              height="35px"
              disabled={!editable}
            />
          </InputAreaVertical>

          <InputAreaVertical>
            <Typography size="5x" weight="semiBold">
              Start Command
            </Typography>
            <Input_record
              value={startCommand}
              onChange={(e) => {
                setStartCommand(e.target.value);
                setIsDirtyBuild(true);
              }}
              placeholder="ex) java -jar app.jar"
              width="100%"
              height="35px"
              disabled={!editable}
            />
          </InputAreaVertical>
        </InputAreaSecond>

        <InputAreaSecond>
          <InputAreaVertical>
            <Typography size="5x" weight="semiBold">
              Input Path
            </Typography>
            <Input_record
              value={inputPath}
              onChange={(e) => {
                setInputPath(e.target.value);
                setIsDirtyBuild(true);
              }}
              placeholder="ex) ./"
              width="100%"
              height="35px"
              disabled={!editable}
            />
          </InputAreaVertical>

          <InputAreaVertical>
            <Typography size="5x" weight="semiBold">
              Output Path
            </Typography>
            <Input_record
              value={outputPath}
              onChange={(e) => {
                setOutputPath(e.target.value);
                setIsDirtyBuild(true);
              }}
              placeholder="ex) build/libs"
              width="100%"
              height="35px"
              disabled={!editable}
            />
          </InputAreaVertical>
        </InputAreaSecond>

        {editable && isDirtyBuild && (
          <SaveBox>
            <SaveBtn onClick={handleSaveBuild}>저장</SaveBtn>
          </SaveBox>
        )}
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

export default DeploymentContents;
