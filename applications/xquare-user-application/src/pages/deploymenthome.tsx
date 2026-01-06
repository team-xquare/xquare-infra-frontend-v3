import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import {
  HomeImg,
  Typography,
  Title,
  Xquare_colors,
  Button_round,
  DeploymentItem,
  ErrorMessage,
  LoadingOverlay,
} from "@xquare/user-interfaces";
import { useAuthGuard, useTeamApplications } from "@xquare/hooks";
import { getSelectedTeamId, SELECTED_TEAM_EVENT } from "@xquare/utils";

const DeploymentHome = () => {
  useAuthGuard();
  const navigate = useNavigate();
  const [teamId, setTeamId] = useState<number | undefined>(
    getSelectedTeamId() ?? undefined
  );

  useEffect(() => {
    const syncTeam = () => setTeamId(getSelectedTeamId() ?? undefined);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "xquare:selectedTeam") {
        syncTeam();
      }
    };

    // CustomEvent 리스너를 EventListener 타입으로 캐스팅
    const handleSelectedTeamChanged: EventListener = () => syncTeam();

    window.addEventListener("storage", handleStorage);
    window.addEventListener(SELECTED_TEAM_EVENT, handleSelectedTeamChanged);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(
        SELECTED_TEAM_EVENT,
        handleSelectedTeamChanged
      );
    };
  }, []);

  console.log("[DeploymentHome] 현재 선택된 팀 ID:", teamId);
  const { data: applications, loading, error } = useTeamApplications(teamId);
  console.log(
    "[DeploymentHome] 애플리케이션 상태 - loading:",
    loading,
    ", applications:",
    applications?.length ?? 0,
    "개, error:",
    error
  );

  const handleAddApplicationClick = () => {
    navigate("/deployment/createapplication");
  };

  const handleAddAddonsClick = () => {
    navigate("/addons/createaddon");
  };

  return (
    <Container>
      <LoadingOverlay isLoading={loading && !!teamId} />
      <ContentsArea>
        <Title
          title={`Deployments`}
          subTitle={"Deploy your service via xquare infra"}
        ></Title>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button_round width="180px" onClick={handleAddApplicationClick}>
            Application 추가하기
          </Button_round>
          <Button_round width="150px" onClick={handleAddAddonsClick}>
            Addon 추가하기
          </Button_round>
        </div>
      </ContentsArea>
      <HeroSection>
        <ImgText style={{ width: "75%" }}>
          <Typography size="10x" weight="extraBold" align="left" color="white">
            NEW
          </Typography>
          <Typography size="10x" weight="extraBold" align="left" color="white">
            XQUARE
          </Typography>
          <Typography size="10x" weight="extraBold" align="left" color="white">
            INFRASTRUCTURE
          </Typography>
        </ImgText>
      </HeroSection>
      {!teamId && (
        <div style={{ marginBottom: "12px" }}>
          팀을 선택해주세요. (사이드바 하단에서 팀 선택)
        </div>
      )}
      {error && (
        <ErrorMessage message={`애플리케이션 조회 실패: ${error.message}`} />
      )}
      <DploymentSell>
        {(applications ?? []).map((app) => (
          <DeploymentItem
            id={String(app.id)}
            key={`app-${app.id}`}
            title={app.name}
            domain={`${app.configuration.github.owner}/${app.configuration.github.repo}`}
            type={
              app.configuration.build.type === "gradle" ||
              app.configuration.build.type === "maven"
                ? "pod"
                : "pod"
            }
            description={`Status: ${app.status} | Tier: ${app.configuration.tier}`}
            charge={"-"}
          />
        ))}
      </DploymentSell>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  padding: 10px 40px;
  cursor: default;
`;

const ContentsArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  padding-bottom: 10px;
  border-bottom: 2px solid ${Xquare_colors.gray[300]};
  width: 100%;
  margin-bottom: 15px;
  cursor: default;
`;

const HeroSection = styled.div`
  width: 100%;
  height: 250px;
  border-radius: 12px;
  display: flex;
  padding: 0 30px;
  align-items: center;
  justify-content: space-between;
  background-image: url(${HomeImg});
  margin-bottom: 15px;
  cursor: default;
`;

const ImgText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: default;
`;

const DploymentSell = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(370px, 1fr));
  grid-auto-rows: auto;
  width: 100%;
  row-gap: 20px;
  cursor: default;
`;

export default React.memo(DeploymentHome);
