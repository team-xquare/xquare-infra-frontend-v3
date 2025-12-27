import styled from "@emotion/styled";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Title,
  Xquare_colors,
  Typography,
  Input_basic,
  Input_record,
  Button_square,
} from "@xquare/user-interfaces";
import { useAuthGuard } from "@xquare/hooks";

const CreateApplication = () => {
  useAuthGuard();
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [repoName, setRepoName] = useState("");
  const [repoOwner, setRepoOwner] = useState("");
  // const [installationId, setInstallationId] = useState("");
  const [branch, setBranch] = useState("");
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

  const isValid =
    projectName.trim() !== "" &&
    repoName.trim() !== "" &&
    repoOwner.trim() !== "" &&
    // installationId.trim() !== "" &&
    branch.trim() !== "" &&
    triggerPaths.every((path) => path.trim() !== "") &&
    buildTools.trim() !== "" &&
    javaVersion.trim() !== "" &&
    workingDirectory.trim() !== "" &&
    buildCommand.trim() !== "" &&
    startCommand.trim() !== "" &&
    inputPath.trim() !== "" &&
    outputPath.trim() !== "" &&
    routes.every((r) => r.url.trim() !== "" && r.port.trim() !== "");

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
    setRoutes((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Container>
      <ContentsArea>
        <Title
          title={`Application 생성`}
          subTitle={`Create a new application with XQUARE`}
        ></Title>
      </ContentsArea>
      <Contents>
        <ValueBox>
          <Typography size="5x" weight="bold">
            Step0. Application
          </Typography>
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
          <Typography size="5x" weight="bold">
            Step1. Repository
          </Typography>
          <InputArea>
            <Typography size="5x" weight="semiBold">
              Repository Name
            </Typography>
            <Input_basic
              value={repoName}
              onChange={(e) => {
                setRepoName(e.target.value);
              }}
              placeholder="Repository Name"
              width="950px"
              height="35px"
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
              }}
              placeholder="Repository Owner"
              width="950px"
              height="35px"
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
              }}
              placeholder="Branch"
              width="950px"
              height="35px"
            />
          </InputArea>
          <InputAreaSecond>
            <InputAreaVertical>
              <Typography size="5x" weight="semiBold">
                Trigger Paths
              </Typography>

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
            <Input_basic
              value={buildTools}
              onChange={(e) => setBuildTools(e.target.value)}
              placeholder="ex) gradle / maven"
              width="950px"
              height="35px"
            />
          </InputArea>

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

          <InputAreaSecond>
            <InputAreaVertical>
              <Typography size="5x" weight="semiBold">
                Build Command
              </Typography>
              <Input_record
                value={buildCommand}
                onChange={(e) => setBuildCommand(e.target.value)}
                placeholder="ex) ./gradlew build"
                width="100%"
                height="35px"
              />
            </InputAreaVertical>

            <InputAreaVertical>
              <Typography size="5x" weight="semiBold">
                Start Command
              </Typography>
              <Input_record
                value={startCommand}
                onChange={(e) => setStartCommand(e.target.value)}
                placeholder="ex) java -jar app.jar"
                width="100%"
                height="35px"
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
                onChange={(e) => setInputPath(e.target.value)}
                placeholder="Source root path"
                width="100%"
                height="35px"
              />
            </InputAreaVertical>

            <InputAreaVertical>
              <Typography size="5x" weight="semiBold">
                Output Path
              </Typography>
              <Input_record
                value={outputPath}
                onChange={(e) => setOutputPath(e.target.value)}
                placeholder="Build output path"
                width="100%"
                height="35px"
              />
            </InputAreaVertical>
          </InputAreaSecond>
        </ValueBox>
        <ValueBox>
          <Typography size="5x" weight="bold">
            Step3. Routes
          </Typography>

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
        </ValueBox>
        <ButtonGroup>
          <Button_square
            type="button"
            width="120px"
            height="50px"
            onClick={() => navigate("/")}
          >
            취소
          </Button_square>

          <Button_square
            type="submit"
            disabled={!isValid}
            width="120px"
            height="50px"
          >
            생성
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
