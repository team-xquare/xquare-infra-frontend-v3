import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useAuthGuard, useCreateAddon } from "@xquare/hooks";
import {
  getSelectedTeamId,
  getSelectedTeam,
  SELECTED_TEAM_EVENT,
} from "@xquare/utils";
import {
  Title,
  Xquare_colors,
  Typography,
  Input_basic,
  Button_square,
  ErrorMessage,
} from "@xquare/user-interfaces";

const CreateAddon = () => {
  useAuthGuard();
  const navigate = useNavigate();
  const [teamId, setTeamId] = useState<number | undefined>(
    getSelectedTeamId() ?? undefined
  );
  const [teamName, setTeamName] = useState<string>(
    getSelectedTeam()?.name ?? ""
  );

  useEffect(() => {
    document.title = "XQUARE | Create Addon";
  }, []);

  useEffect(() => {
    const syncTeam = () => {
      setTeamId(getSelectedTeamId() ?? undefined);
      setTeamName(getSelectedTeam()?.name ?? "");
    };

    const handleSelectedTeamChanged: EventListener = () => syncTeam();
    window.addEventListener(SELECTED_TEAM_EVENT, handleSelectedTeamChanged);

    return () => {
      window.removeEventListener(
        SELECTED_TEAM_EVENT,
        handleSelectedTeamChanged
      );
    };
  }, []);

  const parseTeamId = (): number | null => {
    if (!teamId) return null;
    const parsed = typeof teamId === "string" ? parseInt(teamId, 10) : teamId;
    return Number.isNaN(parsed) ? null : parsed;
  };

  const selectedTeamId = parseTeamId();

  const { create, loading, error } = useCreateAddon({
    onSuccess: () => {
      navigate("/");
    },
    onError: (err) => {
      console.error("Addon 생성 실패:", err);
    },
  });

  const [name, setName] = useState("");
  const [type, setType] = useState("mysql");
  const [storageGi, setStorageGi] = useState("");

  const isValid =
    selectedTeamId !== null &&
    name.trim() !== "" &&
    type.trim() !== "" &&
    storageGi.trim() !== "";

  const handleCreateAddon = async () => {
    if (
      !isValid ||
      selectedTeamId === null ||
      typeof selectedTeamId !== "number"
    ) {
      console.error("[CreateAddon] invalid teamId", { selectedTeamId });
      return;
    }

    try {
      await create({
        teamId: selectedTeamId,
        name,
        type: type as
          | "mysql"
          | "postgres"
          | "redis"
          | "mongodb"
          | "kafka"
          | "rabbitmq"
          | "elk"
          | "debezium",
        storageGi: Number(storageGi),
      });
    } catch (err) {
      console.error("Addon 생성 중 오류:", err);
    }
  };

  return (
    <Container>
      <Helmet>
        <title>XQUARE | Create Addon</title>
      </Helmet>
      <ContentsArea>
        <Title title="Addon 생성" subTitle="Create a new addon for XQUARE" />
      </ContentsArea>

      <Contents>
        {/* Step0 */}
        <ValueBox>
          <Typography size="5x" weight="bold">
            Step0. Write Addon Information
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
              Addon Name
            </Typography>
            <Input_basic
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Addon Name"
              width="950px"
              height="35px"
            />
          </InputArea>
        </ValueBox>

        {/* Step1 */}
        <ValueBox>
          <Typography size="5x" weight="bold">
            Step1. Select Addon Type
          </Typography>

          <TypeSelectionArea>
            <TypeGrid>
              {[
                {
                  value: "mysql",
                  label: "MySQL",
                  description: "Relational database management system",
                },
                {
                  value: "postgres",
                  label: "PostgreSQL",
                  description: "Advanced open-source Database",
                },
                {
                  value: "redis",
                  label: "Redis",
                  description: "In-memory data store for caching",
                },
                {
                  value: "mongodb",
                  label: "MongoDB",
                  description: "NoSQL document Database",
                },
                {
                  value: "kafka",
                  label: "Kafka",
                  description: "Distributed event streaming platform",
                },
                {
                  value: "rabbitmq",
                  label: "RabbitMQ",
                  description: "Message Broker for async communication",
                },
                { value: "elk", label: "ELK", description: "Elasticsearch, Logstash, Kibana" },
                {
                  value: "debezium",
                  label: "Debezium",
                  description: "Change data Capture Platform",
                },
              ].map((option) => (
                <TypeCard
                  key={option.value}
                  selected={type === option.value}
                  onClick={() => setType(option.value)}
                >
                  <Typography size="5x" weight="bold" color="inherit">
                    {option.label}
                  </Typography>
                  <Typography
                    size="3x"
                    weight="regular"
                    color={String(Xquare_colors.gray[400])}
                  >
                    {option.description}
                  </Typography>
                </TypeCard>
              ))}
            </TypeGrid>
          </TypeSelectionArea>
        </ValueBox>

        {/* Step2 */}
        <ValueBox>
          <Typography size="5x" weight="bold">
            Step2. Write Configuration
          </Typography>

          <InputArea>
            <Typography size="5x" weight="semiBold">
              Storage (Gi)
            </Typography>
            <Input_basic
              type="number"
              value={storageGi}
              onChange={(e) => setStorageGi(e.target.value)}
              placeholder="ex) 20 (Gi)"
              width="950px"
              height="35px"
            />
          </InputArea>
        </ValueBox>

        {/* Buttons */}
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
            type="button"
            width="120px"
            height="50px"
            disabled={!isValid || loading}
            onClick={handleCreateAddon}
          >
            {loading ? "생성 중..." : "생성"}
          </Button_square>
        </ButtonGroup>

        {error && <ErrorMessage message={error.message} />}
      </Contents>
    </Container>
  );
};

export default CreateAddon;

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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const ValueBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 2rem;
`;

const TypeSelectionArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  width: 100%;
`;

const TypeCard = styled.div<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  border-radius: 12px;
  border: 2px solid
    ${({ selected }) =>
      selected ? Xquare_colors.purple[400] : Xquare_colors.gray[300]};
  background-color: ${Xquare_colors.white};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${Xquare_colors.purple[400]};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  color: ${({ selected }) =>
    selected ? Xquare_colors.purple[500] : Xquare_colors.gray[700]};
`;
