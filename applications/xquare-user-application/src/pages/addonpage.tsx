import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useAuthGuard, useTeamAddons } from "@xquare/hooks";
import { getSelectedTeamId } from "@xquare/utils";
import {
  Title,
  Xquare_colors,
  Button_round,
  AddonItem,
  ErrorMessage,
  LoadingOverlay,
} from "@xquare/user-interfaces";

function AddonPage() {
  useAuthGuard();
  const navigate = useNavigate();
  const [teamId, setTeamId] = useState<number | undefined>(
    () => getSelectedTeamId() ?? undefined
  );

  useEffect(() => {
    document.title = "XQUARE | Addon";
  }, []);

  useEffect(() => {
    const syncTeam = () => setTeamId(getSelectedTeamId() ?? undefined);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "xquare:selectedTeam") {
        syncTeam();
      }
    };

    syncTeam();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("xquare:selectedTeam-changed", syncTeam);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("xquare:selectedTeam-changed", syncTeam);
    };
  }, []);
  // console.log("[AddonPage] 현재 선택된 팀 ID:", teamId);
  const { data: addons, loading, error } = useTeamAddons(teamId);
  /* console.log(
    "[AddonPage] 애드온 상태 - loading:",
    loading,
    ", addons:",
    addons?.length ?? 0,
    "개, error:",
    error
  ); */
  const handleAddAddonClick = () => {
    navigate("/addons/createaddon");
  };
  return (
    <Container>
      <Helmet>
        <title>XQUARE | Addon</title>
      </Helmet>
      <LoadingOverlay isLoading={loading && !!teamId} />
      <ContentsArea>
        <Title
          title={`Addons`}
          subTitle={"Deploy addons via xquare infra"}
        ></Title>
        <Button_round width="150px" onClick={handleAddAddonClick}>
          Addon 추가하기
        </Button_round>
      </ContentsArea>
      {!teamId && (
        <div style={{ marginBottom: "12px" }}>
          팀을 선택해주세요. (사이드바 하단에서 팀 선택)
        </div>
      )}
      {error && <ErrorMessage message={`애드온 조회 실패: ${error.message}`} />}
      <Addons>
        {(addons ?? []).map((addon) => {
          type AddonWithMeta = typeof addon & {
            traffic?: number;
            health?: number;
            lastDeploy?: string;
            lastdeploy?: string;
            lastBuild?: string;
            lastbuild?: string;
            charge?: string;
          };

          const addonWithMeta = addon as AddonWithMeta;

          return (
            <AddonItem
              key={`addon-${addon.id}`}
              title={addon.name}
              domain={""}
              type={addon.type === "pod" ? "pod" : "database"}
              description={`Tier: ${addon.tier} / Storage: ${addon.storageGi}Gi`}
              traffic={
                typeof addonWithMeta.traffic === "number"
                  ? addonWithMeta.traffic
                  : "N/A"
              }
              health={
                typeof addonWithMeta.health === "number"
                  ? addonWithMeta.health
                  : "N/A"
              }
              lastdeploy={
                addonWithMeta.lastDeploy ?? addonWithMeta.lastdeploy ?? "N/A"
              }
              lastbuild={
                addonWithMeta.lastBuild ?? addonWithMeta.lastbuild ?? "N/A"
              }
              charge={addonWithMeta.charge ?? "N/A"}
            />
          );
        })}
      </Addons>
    </Container>
  );
}

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
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 2px solid ${Xquare_colors.gray[300]};
  width: 100%;
  margin-bottom: 20px;
  cursor: default;
`;

const Addons = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(370px, 1fr));
  grid-auto-rows: auto;
  width: 100%;
  row-gap: 20px;
  cursor: default;
`;

export default AddonPage;
