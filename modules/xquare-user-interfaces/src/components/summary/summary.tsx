import React from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { SummaryItem } from "./summaryitem/index";
import { Subtitle } from "../title/index";
import { Typography } from "../typography/index";
import Xquare_colors from "../../styles";
import { SearchBox } from "../input";

interface SummaryProps {
  page?: number;
}

function Summary({ page }: SummaryProps) {
  const navigate = useNavigate();
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

  const displayItems =
    page === 1 ? items.slice(0, 4) : page === 2 ? items.slice(0, 3) : items;

  function handleViewAllClick() {
    navigate("/monitor");
  }

  const [searchValue, setSearchValue] = React.useState("");

  return (
    <Summarycontainer page={page}>
      <TileArea>
        <Subtitle title={`Summary`} subTitle={"service status"} />
        {page !== 3 && (
          <ClickableText size="5x" weight="medium" onClick={handleViewAllClick}>
            전체보기 →
          </ClickableText>
        )}
        {page === 3 && (
          <SearchBox
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="검색어를 입력하세요"
            disabled={false}
            type="text"
            width="300px"
            height="20px"
          />
        )}
      </TileArea>
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
`;

const ClickableText = styled(Typography)`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${Xquare_colors.gray[500]};
`;

export { Summary };
