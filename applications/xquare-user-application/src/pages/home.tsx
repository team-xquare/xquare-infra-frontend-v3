import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import {
  useAuthGuard,
  useUserName,
  useTeams,
  useTeamApplications,
  useMultipleDeploymentSummaries,
} from "@xquare/hooks";
import {
  HomeImg,
  Typography,
  Title,
  Xquare_colors,
  Summary,
  Notice,
  ErrorMessage,
  LoadingOverlay,
} from "@xquare/user-interfaces";
import { getSelectedTeamId } from "@xquare/utils";

const HomePage = () => {
  useAuthGuard();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [deployCount, setDeployCount] = useState<number>(0);
  const [traffic, setTraffic] = useState<number>(0);
  const { userName, loading } = useUserName();

  useEffect(() => {
    document.title = "XQUARE";
  }, []);

  const { data: teams } = useTeams();

  const selectedTeamId = useMemo(() => {
    const storedTeamId = getSelectedTeamId();
    if (!storedTeamId || !teams) return undefined;
    const foundTeam = teams.find((team) => team.id === storedTeamId);
    return foundTeam?.id;
  }, [teams]);

  const { data: applications } = useTeamApplications(selectedTeamId);

  useEffect(() => {
    setDeployCount(applications?.length ?? 0);
  }, [applications]);

  const applicationIds = useMemo(() => {
    if (!applications || applications.length === 0) return undefined;
    return applications.map((app) => app.id);
  }, [applications]);

  const {
    data: deploymentData,
    loading: deploymentLoading,
    error: deploymentError,
  } = useMultipleDeploymentSummaries(applicationIds);

  /* console.log("[HomePage] deployment data state:", {
    selectedTeamId,
    applicationIds,
    deploymentData,
    deploymentLoading,
  }); */

  useEffect(() => {
    const fetchUser = async () => {
      const userData = {
        deployCount: 0,
        traffic: 0,
      };
      setTraffic(userData.traffic);
    };
    fetchUser();
  }, []);

  const handleTabClick = useCallback((index: number) => {
    setActiveTab(index);
  }, []);

  const handleDeployClick = useCallback(() => {
    navigate("/deployment");
  }, [navigate]);

  const handleNoticeClick = useCallback(() => {
    navigate("/notice");
  }, [navigate]);

  const tabContents = [
    <TabContentWrapper key="notice">
      <TextGroup>
        <Typography size="5x" weight="semiBold">
          대덕소프트웨어마이스터고등학교 배포 플랫폼
        </Typography>
        <Typography size="4x" weight="medium">
          스퀘어 인프라는 완전 자동화된 CI / CD 배포를 가능하게 제공합니다.
        </Typography>
      </TextGroup>
      <ClickableText size="5x" weight="medium" onClick={handleNoticeClick}>
        공지보기 →
      </ClickableText>
    </TabContentWrapper>,
    <TabContentWrapper key="deploy">
      <TextGroup>
        <Typography size="5x" weight="semiBold">
          현재 XQUARE를 통하여<Highlight>{deployCount}</Highlight>개의 서비스가
          배포되었어요.
        </Typography>
        <Typography size="4x" weight="medium">
          Deployment를 통하여 배포된 서비스를 한 눈에 확인하세요.
        </Typography>
      </TextGroup>
      <ClickableText size="5x" weight="medium" onClick={handleDeployClick}>
        바로가기 →
      </ClickableText>
    </TabContentWrapper>,
    <TabContentWrapper key="status">
      <TextGroup>
        <Typography size="5x" weight="semiBold">
          XQUARE를 통하여 <Highlight>{traffic}</Highlight>일 동안 서비스 되고
          있어요.
        </Typography>
        <Typography size="4x" weight="medium">
          XQUARE 인프라를 통해 안정적인 서비스 운영이 가능합니다.
        </Typography>
      </TextGroup>
    </TabContentWrapper>,
  ];

  return (
    <Container>
      <Helmet>
        <title>XQUARE</title>
      </Helmet>
      <LoadingOverlay isLoading={deploymentLoading && !!applicationIds} />
      <ContentsArea>
        <Title
          title={`Welcome, Back ${userName ?? (loading ? "Loading..." : "")}`}
          subTitle={"Deploy your service via xquare infra"}
        ></Title>
      </ContentsArea>

      {deploymentError && applicationIds && (
        <ErrorMessage message={deploymentError.message} />
      )}

      <NoticeContent>
        <Menu>
          {["서비스 공지", "서비스 배포", "서비스 상태"].map((label, index) => (
            <Tab
              key={index}
              active={activeTab === index}
              onClick={() => handleTabClick(index)}
            >
              <Typography
                size="4x"
                weight="medium"
                align="left"
                color="inherit"
              >
                {label}
              </Typography>
            </Tab>
          ))}
        </Menu>

        <RightSection>
          <Contents>{tabContents[activeTab]}</Contents>
        </RightSection>
      </NoticeContent>

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

        <ImgText>
          <Typography
            size="3x"
            weight="medium"
            color={String(Xquare_colors.purple[200])}
          >
            새로운 UI / UX 디자인
          </Typography>
          <Typography
            size="3x"
            weight="medium"
            color={String(Xquare_colors.purple[200])}
          >
            새로운 Application
          </Typography>
          <Typography
            size="3x"
            weight="medium"
            color={String(Xquare_colors.purple[200])}
          >
            새로운 Onpremise infrastructure
          </Typography>
          <Typography
            size="3x"
            weight="medium"
            color={String(Xquare_colors.purple[200])}
          >
            새로운 XQUARE 를 통해 배포하세요.
          </Typography>
        </ImgText>
      </HeroSection>
      <NoticeSection>
        <Summary
          page={1}
          deploymentData={deploymentData}
          deploymentLoading={deploymentLoading}
        />
        <Notice page={1} />
      </NoticeSection>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  padding: 10px 40px;
  cursor: default;
`;

const ContentsArea = styled.div`
  padding-bottom: 10px;
  border-bottom: 2px solid ${Xquare_colors.gray[300]};
  width: 100%;
  margin-bottom: 15px;
  cursor: default;
`;

const NoticeContent = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 160px;
  padding-bottom: 10px;
  margin-bottom: 15px;
  border-bottom: 2px solid ${Xquare_colors.gray[300]};
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  width: 15%;
  height: 150px;
  border-right: 1px solid ${Xquare_colors.black};
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 85%;
  height: 150px;
  padding-left: 20px;
  margin-top: 20px;
  gap: 10px;
`;

const Tab = styled.div<{ active?: boolean }>`
  margin-bottom: 2px;
  padding: 8px 0;
  padding-left: 10px;
  cursor: pointer;
  background-color: ${({ active }) =>
    active ? Xquare_colors.black : "transparent"};
  color: ${({ active }) =>
    active ? Xquare_colors.white : Xquare_colors.black};
`;

const TabContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 13px;
`;

const ClickableText = styled(Typography)`
  cursor: pointer;
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Highlight = styled.span`
  background-color: ${Xquare_colors.green[500]};
  padding: 2px 8px;
  margin: 0 4px;
  border-radius: 8px;
`;

const HeroSection = styled.div`
  width: 100%;
  height: 180px;
  border-radius: 12px;
  display: flex;
  padding: 0 30px;
  align-items: center;
  justify-content: space-between;
  background-image: url(${HomeImg});
  margin-bottom: 15px;
`;

const ImgText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const NoticeSection = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 230px;
  gap: 25px;
`;

export default React.memo(HomePage);
