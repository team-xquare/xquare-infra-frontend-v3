import styled from "@emotion/styled";
import { SummaryItem } from "./summaryitem/index";
import { Subtitle } from "../title/index";

interface SummaryProps {
  page?: number;
}

function Summary({ page }: SummaryProps) {
  const items = [
    {
      id: 1,
      SummaryValue:
        "XQUARE INFRASTRUCTURE를 이용하여 50일간 서비스 되었습니다.",
    },
    {
      id: 2,
      SummaryValue:
        "XQUARE-INFRA-BACKEND-V3 서비스가 api.dsmhs.kr 로 배포되었습니다.",
    },
    {
      id: 3,
      SummaryValue:
        "XQUARE INFRASTRUCTURE를 이용하여 50일간 서비스 되었습니다.",
    },
    {
      id: 4,
      SummaryValue:
        "XQUARE INFRASTRUCTURE를 이용하여 50일간 서비스 되었습니다.",
    },
    {
      id: 5,
      SummaryValue:
        "XQUARE-INFRA-BACKEND-V3 서비스가 api.dsmhs.kr 로 배포되었습니다.",
    },
    {
      id: 6,
      SummaryValue:
        "XQUARE INFRASTRUCTURE를 이용하여 50일간 서비스 되었습니다.",
    },
    {
      id: 7,
      SummaryValue:
        "XQUARE INFRASTRUCTURE를 이용하여 50일간 서비스 되었습니다.",
    },
    {
      id: 8,
      SummaryValue:
        "XQUARE-INFRA-BACKEND-V3 서비스가 api.dsmhs.kr 로 배포되었습니다.",
    },
    {
      id: 9,
      SummaryValue:
        "XQUARE INFRASTRUCTURE를 이용하여 50일간 서비스 되었습니다.",
    },
  ];

  const displayItems = page === 1 ? items.slice(0, 4) : items;

  return (
    <Summarycontainer page={page}>
      <Subtitle title={`Summary`} subTitle={"service status"} />
      <div>
        {displayItems.map((item) => (
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
  width: ${({ page }) => (page === 1 ? "45%" : "100%")};
  flex-direction: column;
  gap: 10px;
`;

export { Summary };
