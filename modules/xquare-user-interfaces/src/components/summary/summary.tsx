import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { SummaryItem } from "./Summaryitem/index";
import { Subtitle } from "../title/index";
import { Typography } from "../typography/index";
import Xquare_colors from "../../styles";
import type { DeploymentListResponse } from "@xquare/utils";
import { LoadingOverlay } from "../loadingoverlays";

interface SummaryProps {
  page?: number;
  deploymentData?: Record<number, DeploymentListResponse> | null;
  deploymentLoading?: boolean;
}

function Summary({ page, deploymentData, deploymentLoading }: SummaryProps) {
  const navigate = useNavigate();

  const generateDeploymentItems = () => {
    if (!deploymentData || Object.keys(deploymentData).length === 0) {
      return [
        {
          id: 0,
          SummaryValue: "배포 정보가 없습니다.",
        },
      ];
    }

    const items: Array<{ id: number; SummaryValue: string }> = [];
    let itemId = 1;

    Object.entries(deploymentData).forEach(([appId, deploymentList]) => {
      if (deploymentList.deployments && deploymentList.deployments.length > 0) {
        const latestDeployment = deploymentList.deployments[0];
        items.push({
          id: itemId++,
          SummaryValue: `애플리케이션 #${appId} - ${latestDeployment.status} (${latestDeployment.commitHash.substring(0, 7)})`,
        });
      }
    });

    return items.length > 0
      ? items
      : [
          {
            id: 0,
            SummaryValue: "배포 정보가 없습니다.",
          },
        ];
  };

  const deploymentItems = generateDeploymentItems();

  const hasRealDeploymentData =
    !deploymentLoading &&
    deploymentData &&
    Object.keys(deploymentData).length > 0;

  const items = hasRealDeploymentData
    ? page === 1
      ? deploymentItems.slice(0, 4)
      : page === 2
        ? deploymentItems.slice(0, 3)
        : deploymentItems
    : deploymentLoading
      ? []
      : deploymentItems;

  function handleViewAllClick() {
    navigate("/summary");
  }

  return (
    <Summarycontainer page={page}>
      <LoadingOverlay isLoading={deploymentLoading} />
      <TileArea>
        <Subtitle title={`Summary`} subTitle={"service status"} />
        {page !== 3 && (
          <ClickableText size="4x" weight="medium" onClick={handleViewAllClick}>
            전체보기 →
          </ClickableText>
        )}
      </TileArea>
      <div>
        {items.map((item) => (
          <SummaryItem
            key={item.SummaryValue}
            SummaryValue={item.SummaryValue}
          />
        ))}
      </div>
    </Summarycontainer>
  );
}

const Summarycontainer = styled.div<SummaryProps>`
  display: flex;
  width: ${({ page }) => (page === 1 ? "45%" : page === 2 ? "100%" : "100%")};
  flex-direction: column;
  gap: 10px;
`;

const TileArea = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: default;
`;

const ClickableText = styled(Typography)`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${Xquare_colors.gray[500]};
`;

export { Summary };
