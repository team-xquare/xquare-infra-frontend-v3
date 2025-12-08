import styled from "@emotion/styled";
import { SummaryItem } from "./summaryitem/index";
import { Subtitle } from "../title/index";

function Summary() {
  const items = [
    {
      SummaryValue:
        "XQUARE INFRASTRUCTURE를 이용하여 50일간 서비스 되었습니다.",
    },
    {
      SummaryValue:
        "XQUARE-INFRA-BACKEND-V3 서비스가 api.dsmhs.kr 로 배포되었습니다.",
    },
    {
      SummaryValue:
        "XQUARE INFRASTRUCTURE를 이용하여 50일간 서비스 되었습니다.",
    },
  ];

  return (
    <Summarycontainer>
      <Subtitle title={`Summary`} subTitle={"service status"}></Subtitle>
      <div>
        {items.map((item) => (
          <SummaryItem SummaryValue={item.SummaryValue} />
        ))}
      </div>
    </Summarycontainer>
  );
}

const Summarycontainer = styled.div`
  display: flex;
  width: 45%;
  flex-direction: column;
  gap: 10px;
`;

export { Summary };
