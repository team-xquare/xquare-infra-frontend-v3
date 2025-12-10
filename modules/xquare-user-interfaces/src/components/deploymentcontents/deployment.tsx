import { useState } from "react";
import styled from "@emotion/styled";
import { Typography } from "../typography/index";
import Xquare_colors from "../../styles";
import { Input_basic, Input_record } from "../input";

function DeploymentContents({
  id,
  editable,
}: {
  id: number;
  editable: boolean;
}) {
  const PageId = id;
  const servicename = "undefined";
  const servicerecord = "undefined";
  const [repoName, setRepoName] = useState("pageid-" + PageId);
  const [repoOwner, setRepoOwner] = useState("");
  const [installationId, setInstallationId] = useState("");
  const [commit, setCommit] = useState("");
  const [isDirty1, setIsDirty1] = useState(false);

  const handleSave1 = async () => {
    try {
      // const body = {
      //   repoName,
      //   repoOwner,
      //   installationId,
      //   commit,
      // };

      // 여기에 API 호출 로직 추가

      window.location.reload();
      setIsDirty1(false);
    } catch (err) {
      console.error(err);
    }
  };

  const [buildTools, setBuildTools] = useState("");
  const [javaVersion, setJavaVersion] = useState("");
  const [buildpath, setBuildpath] = useState("");
  const [buildcommand, setBuildcommand] = useState("");
  const [isDirty2, setIsDirty2] = useState(false);

  const handleSave2 = async () => {
    try {
      // const body = {
      //   buildTools,
      //   javaVersion,
      // };

      // 여기에 API 호출 로직 추가
      window.location.reload();
      setIsDirty2(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <InfoBox>
        <Img></Img>
        <Text>
          <Typography size="7x" weight="bold">
            {servicename}
          </Typography>
          <Typography size="5x" weight="regular">
            {servicerecord}
          </Typography>
        </Text>
      </InfoBox>
      <ValueBox>
        <Typography size="6x" weight="bold">
          Repository
        </Typography>
        <InputArea>
          <Typography size="5x" weight="semiBold">
            Repository Name
          </Typography>
          <Input_basic
            value={repoName}
            onChange={(e) => {
              setRepoName(e.target.value);
              setIsDirty1(true);
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
            value={repoOwner}
            onChange={(e) => {
              setRepoOwner(e.target.value);
              setIsDirty1(true);
            }}
            placeholder="Repository Owner"
            width="950px"
            height="35px"
            disabled={!editable}
          />
        </InputArea>
        <InputArea>
          <Typography size="5x" weight="semiBold">
            Installation ID
          </Typography>
          <Input_basic
            value={installationId}
            onChange={(e) => {
              setInstallationId(e.target.value);
              setIsDirty1(true);
            }}
            placeholder="Installation ID"
            width="950px"
            height="35px"
            disabled={!editable}
          />
        </InputArea>
        <InputArea>
          <Typography size="5x" weight="semiBold">
            Commit
          </Typography>
          <Input_basic
            value={commit}
            onChange={(e) => {
              setCommit(e.target.value);
              setIsDirty1(true);
            }}
            placeholder="Commit"
            width="950px"
            height="35px"
            disabled={!editable}
          />
        </InputArea>
        {editable && isDirty1 && (
          <SaveBox>
            <SaveBtn onClick={handleSave1}>저장</SaveBtn>
          </SaveBox>
        )}
      </ValueBox>
      <ValueBox>
        <Typography size="6x" weight="bold">
          Builds
        </Typography>
        <InputArea>
          <Typography size="5x" weight="semiBold">
            Build Tools
          </Typography>
          <Input_basic
            value={buildTools}
            onChange={(e) => {
              setBuildTools(e.target.value);
              setIsDirty2(true);
            }}
            placeholder="Build Tools"
            width="950px"
            height="35px"
            disabled={!editable}
          />
        </InputArea>
        <InputArea>
          <Typography size="5x" weight="semiBold">
            Java Version
          </Typography>
          <Input_basic
            value={javaVersion}
            onChange={(e) => {
              setJavaVersion(e.target.value);
              setIsDirty2(true);
            }}
            placeholder="Java Version"
            width="950px"
            height="35px"
            disabled={!editable}
          />
        </InputArea>
        <InputAreaSecond>
          <InputAreaVertical>
            <Typography size="5x" weight="semiBold">
              Build Output Path
            </Typography>
            <Input_record
              value={buildpath}
              onChange={(e) => {
                setBuildpath(e.target.value);
                setIsDirty2(true);
              }}
              placeholder="Build Output Path"
              width="100%"
              height="35px"
              disabled={!editable}
            />
          </InputAreaVertical>
          <InputAreaVertical>
            <Typography size="5x" weight="semiBold">
              Build Command
            </Typography>
            <Input_record
              value={buildcommand}
              onChange={(e) => {
                setBuildcommand(e.target.value);
                setIsDirty2(true);
              }}
              placeholder="Build Command"
              width="100%"
              height="35px"
              disabled={!editable}
            />
          </InputAreaVertical>
        </InputAreaSecond>
        {editable && isDirty2 && (
          <SaveBox>
            <SaveBtn onClick={handleSave2}>저장</SaveBtn>
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
  justify-content: center;
`;

const InfoBox = styled.div`
  width: 100%;
  height: auto;

  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 5px;

  margin-bottom: 2rem;
`;

const Img = styled.div`
  width: 70px;
  height: 70px;
  margin-right: 2rem;

  background-color: ${Xquare_colors.gray[200]};
  border-radius: 12px;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.8rem;
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
  margin-left: 15px;
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
  align-items: flex-start;
  justify-content: center;
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

export default DeploymentContents;
