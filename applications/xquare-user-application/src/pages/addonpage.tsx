import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { useAuthGuard, useTeamAddons } from "@xquare/hooks";
import { getSelectedTeamId } from "@xquare/utils";
import {
  Title,
  Xquare_colors,
  Button_round,
  AddonItem,
} from "@xquare/user-interfaces";

function AddonPage() {
  useAuthGuard();
  const navigate = useNavigate();
  const teamId = getSelectedTeamId() ?? undefined;
  console.log("[AddonPage] 현재 선택된 팀 ID:", teamId);
  const { data: addons, loading, error } = useTeamAddons(teamId);
  console.log("[AddonPage] 애드온 상태 - loading:", loading, ", addons:", addons?.length ?? 0, "개, error:", error);
  const handleAddAddonClick = () => {
    navigate("/addons/createaddon");
  };
  return (
    <Container>
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
      {loading && <div>불러오는 중...</div>}
      {error && (
        <div style={{ color: "red" }}>애드온 조회 실패: {error.message}</div>
      )}
      <Addons>
        {(addons ?? []).map((addon) => (
          <AddonItem
            key={`addon-${addon.id}`}
            title={addon.name}
            domain={""}
            type={addon.type === "pod" ? "pod" : "database"}
            description={`Tier: ${addon.tier} / Storage: ${addon.storageGi}Gi`}
            traffic={0}
            health={3}
            lastdeploy={"-"}
            lastbuild={"-"}
            charge={"-"}
          />
        ))}
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
  padding: 10px 40px;
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
`;

const Addons = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(370px, 1fr));
  grid-auto-rows: auto;
  width: 100%;
  row-gap: 20px;
`;

export default AddonPage;
