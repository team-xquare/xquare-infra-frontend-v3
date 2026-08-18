import React from "react";
import { Helmet } from "react-helmet-async";
import styled from "@emotion/styled";
import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  ErrorMessage,
  LoadingOverlay,
  ConfirmModal,
} from "@xquare/user-interfaces";
import {
  useAuthGuard,
  useApplicationDetail,
  useUpdateApplicationConfiguration,
  useDeleteApplication,
} from "@xquare/hooks";

const DeploymentView = () => {
  const navigate = useNavigate();
  useAuthGuard();
  const { id: appIdParam } = useParams<{ id: string }>();
  const applicationId = appIdParam ? parseInt(appIdParam, 10) : undefined;

  useEffect(() => {
    document.title = "XQUARE | Deployment Detail";
  }, []);

  // 애플리케이션 상세 정보 조회
  const {
    data: appDetail,
    loading: appLoading,
    error: appError,
  } = useApplicationDetail(applicationId);

  // 애플리케이션 설정 수정
  const { update: updateConfig, error: updateError } =
    useUpdateApplicationConfiguration();

  const [activeTab, setActiveTab] = useState(0);
  const [editable, setEditable] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // appDetail 또는 기본값 사용
  const id = appDetail?.id ?? 0;
  const servicename = appDetail?.name ?? "service-name";
  const servicedesc = appDetail?.status ?? "service-description";

  /* console.log("[DeploymentView] initialized", {
    applicationId,
    id,
    servicename,
    appDetail,
    loading: appLoading,
    error: appError,
  }); */

  const handleSave = useCallback(() => {
    // 하위 컴포넌트가 저장에 성공하면 편집 모드만 종료한다 (API 재호출 없음)
    setEditable(false);
  }, []);

  // 애플리케이션 삭제
  const { mutate: deleteApplicationMutation, loading: deleteLoading } =
    useDeleteApplication();

  const handleDeleteClick = useCallback(() => {
    if (!applicationId || deleteLoading || !appDetail) {
      return;
    }

    setDeleteError(null);
    setDeleteModalOpen(true);
  }, [applicationId, deleteLoading, appDetail]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!applicationId || deleteLoading || !appDetail) return;

    setDeleteError(null);
    try {
      await deleteApplicationMutation(applicationId);
      navigate("/deployment");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "애플리케이션 삭제에 실패했습니다.";
      setDeleteError(message);
    }
  }, [
    deleteApplicationMutation,
    applicationId,
    navigate,
    appDetail,
    deleteLoading,
  ]);

  const handleDeleteModalClose = useCallback(() => {
    if (deleteLoading) return;
    setDeleteModalOpen(false);
    setDeleteError(null);
  }, [deleteLoading]);

  const tabContents = [
    <SummaryContents
      key="summary"
      appDetail={appDetail || undefined}
      loading={appLoading}
      error={appError}
    />,
    <DeploymentContents
      key={`deployment-${editable ? "edit" : "readonly"}`}
      applicationId={applicationId}
      editable={editable}
      onSave={handleSave}
      github={appDetail?.configuration?.github}
      build={appDetail?.configuration?.build}
      configuration={appDetail?.configuration}
      onUpdate={updateConfig}
    />,
    <SecretContents
      key={`secret-${editable ? "edit" : "readonly"}`}
      id={id}
      editable={editable}
      onSave={handleSave}
    />,
    <RoutesContents
      key={`routes-${editable ? "edit" : "readonly"}`}
      applicationId={applicationId}
      editable={editable}
      onSave={handleSave}
      endpoints={appDetail?.configuration?.endpoints}
      configuration={appDetail?.configuration}
      onUpdate={updateConfig}
    />,
    <LogContents key="log" />,
  ];

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

  if (appError) {
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

  if (updateError) {
    console.error("[DeploymentView] update error", updateError);
  }

  return (
    <Container>
      <Helmet>
        <title>XQUARE | Deployment Detail</title>
      </Helmet>
      <LoadingOverlay isLoading={appLoading} />
      {deleteModalOpen && appDetail && (
        <ConfirmModal
          title="애플리케이션 삭제"
          description={`정말 ${appDetail.name} 애플리케이션을 삭제하시겠습니까? 삭제한 애플리케이션은 복구할 수 없습니다.`}
          confirmLabel="삭제하기"
          loading={deleteLoading}
          errorMessage={deleteError}
          onConfirm={handleDeleteConfirm}
          onClose={handleDeleteModalClose}
        />
      )}
      <ContentsArea>
        <Title title={`${servicename}`} subTitle={`${servicedesc}`}></Title>
        {updateError && (
          <ErrorMessage
            message={updateError.message || "설정 업데이트에 실패했습니다"}
          />
        )}
      </ContentsArea>
      <ButtonArea>
        <NavBar>
          {["Summary", "Deployment", "Secret", "Routes", "Log"].map(
            (label, index) => (
              <NavItem
                key={index}
                children={label}
                onClick={() => handleTabClick(index)}
                active={activeTab === index}
              />
            ),
          )}
        </NavBar>
        <div style={{ minWidth: 100 }}>
          {activeTab === 0 ? (
            <Button_round
              children={"삭제하기"}
              onClick={handleDeleteClick}
              disabled={appLoading || deleteLoading}
            />
          ) : (
            <Button_round
              children={editable ? "취소하기" : "수정하기"}
              onClick={handleeditClick}
              disabled={appLoading}
            />
          )}
        </div>
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
  height: 100vh;
  width: 100%;
  padding: 12px 40px;
  padding-top: 22px;
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
