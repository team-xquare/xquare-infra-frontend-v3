import React from "react";
import styled from "@emotion/styled";
import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Title,
  Xquare_colors,
  NavItem,
  Button_round,
  SummaryContents,
  DeploymentContents,
  SecretContents,
  RoutesContents,
  LogContents,
} from "@xquare/user-interfaces";
import { useAuthGuard, useApplicationDetail, useUpdateApplicationConfiguration } from "@xquare/hooks";

const DeploymentView = () => {
  useAuthGuard();
  const { applicationId: appIdParam } = useParams<{ applicationId: string }>();
  const applicationId = appIdParam ? parseInt(appIdParam, 10) : undefined;

  // 애플리케이션 상세 정보 조회
  const { data: appDetail, loading: appLoading, error: appError } = useApplicationDetail(applicationId);

  // 애플리케이션 설정 수정
  const { update: updateConfig, error: updateError } = useUpdateApplicationConfiguration();

  const [activeTab, setActiveTab] = useState(0);
  const [editable, setEditable] = useState(false);

  // appDetail 또는 기본값 사용
  const id = appDetail?.id ?? 0;
  const servicename = appDetail?.name ?? "service-name";
  const servicedesc = appDetail?.status ?? "service-description";

  console.log("[DeploymentView] initialized", { applicationId, id, servicename });

  const handleSave = useCallback(async () => {
    // 구성 변경 시 서버에 저장 (추후 실제 변경된 설정 전달)
    if (appDetail) {
      const success = await updateConfig(applicationId ?? 0, {
        configuration: appDetail.configuration,
      });
      if (success) {
        console.log("[DeploymentView] configuration saved");
        setEditable(false);
      }
    }
  }, [applicationId, appDetail, updateConfig]);

  const tabContents = [
    <SummaryContents key="summary" />,
    <DeploymentContents
      key={`deployment-${editable ? "edit" : "readonly"}`}
      id={id}
      editable={editable}
      onSave={handleSave}
    />,
    <SecretContents
      key={`secret-${editable ? "edit" : "readonly"}`}
      id={id}
      editable={editable}
      onSave={handleSave}
    />,
    <RoutesContents
      key={`routes-${editable ? "edit" : "readonly"}`}
      id={id}
      editable={editable}
      onSave={handleSave}
    />,
    <LogContents key="log" />,
  ];

  // 에러 상태 표시
  if (updateError) {
    console.error("[DeploymentView] update error", updateError);
  }

  const handleTabClick = useCallback((index: number) => {
    setActiveTab(index);
    setEditable(false);
  }, []);

  const handleeditClick = useCallback(() => {
    if (editable) {
      setEditable(false);
    } else {
      setEditable(true);
    }
  }, [editable]);

  // 로딩 중
  if (appLoading) {
    return (
      <Container>
        <ContentsArea>
          <Title title="로딩 중..." subTitle="애플리케이션 정보를 불러오고 있습니다." />
        </ContentsArea>
      </Container>
    );
  }

  // 에러 발생
  if (appError) {
    console.error("[DeploymentView] error", appError);
    return (
      <Container>
        <ContentsArea>
          <Title
            title="오류 발생"
            subTitle={appError.message || "애플리케이션을 불러올 수 없습니다."}
          />
        </ContentsArea>
      </Container>
    );
  }

  return (
    <Container>
      <ContentsArea>
        <Title title={`${servicename}`} subTitle={`${servicedesc}`}></Title>
      </ContentsArea>
      <ButtonArea>
        <NavBar>
          {["Summary", "Deployment", "Secret", "Routes", "Log"].map(
            (label, index) => (
              <NavItem
                children={label}
                onClick={() => handleTabClick(index)}
                active={activeTab === index}
              />
            )
          )}
        </NavBar>
        <Button_round
          children={editable ? "취소하기" : "수정하기"}
          onClick={handleeditClick}
        />
      </ButtonArea>
      <Contents>{tabContents[activeTab]}</Contents>
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

const ButtonArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
`;

const NavBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 35px;
  background-color: ${Xquare_colors.white};
  border-radius: 12px;
  gap: 10px;
  border: 2px solid ${Xquare_colors.gray[500]};
`;

const Contents = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;
  margin-top: 20px;
`;

export default React.memo(DeploymentView);
