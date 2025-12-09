import { useState } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { NoticeItem } from "./noticeitem/index";
import { Subtitle } from "../title/index";
import { Typography } from "../typography/index";
import { SearchBox } from "../input/index";
import Xquare_colors from "../../styles";

interface FeedProps {
  page: number;
}

function Feed({ page }: FeedProps) {
  const navigate = useNavigate();

  function handleDeployClick() {
    navigate("/feed");
  }

  const items = [
    {
      id: 1,
      NoticeValue: "XQUARE INFRASTRUCTURE를 이용하여 50일간 서비스 되었습니다.",
      date: "2024.06.01",
    },
    {
      id: 2,
      NoticeValue: "XQUARE INFRASTRUCTURE를 이용하여 50일간 서비스 되었습니다.",
      date: "2024.06.01",
    },
    {
      id: 3,
      NoticeValue: "XQUARE INFRASTRUCTURE를 이용하여 50일간 서비스 되었습니다.",
      date: "2024.06.01",
    },
    {
      id: 1,
      NoticeValue: "XQUARE INFRASTRUCTURE를 이용하여 50일간 서비스 되었습니다.",
      date: "2024.06.01",
    },
    {
      id: 2,
      NoticeValue: "XQUARE INFRASTRUCTURE를 이용하여 50일간 서비스 되었습니다.",
      date: "2024.06.01",
    },
    {
      id: 3,
      NoticeValue: "XQUARE INFRASTRUCTURE를 이용하여 50일간 서비스 되었습니다.",
      date: "2024.06.01",
    },
    {
      id: 1,
      NoticeValue: "XQUARE INFRASTRUCTURE를 이용하여 50일간 서비스 되었습니다.",
      date: "2024.06.01",
    },
    {
      id: 2,
      NoticeValue: "XQUARE INFRASTRUCTURE를 이용하여 50일간 서비스 되었습니다.",
      date: "2024.06.01",
    },
    {
      id: 3,
      NoticeValue: "XQUARE INFRASTRUCTURE를 이용하여 50일간 서비스 되었습니다.",
      date: "2024.06.01",
    },
  ];

  const displayItems =
    page === 1 ? items.slice(0, 4) : page === 2 ? items.slice(0, 7) : items;

  const [searchValue, setSearchValue] = useState("");

  return (
    <Feedcontainer page={page}>
      <TileArea>
        <Subtitle
          title={`XQUARE 소식 피드`}
          subTitle={"team xquare 의 최신 소식"}
        ></Subtitle>
        {page !== 3 && (
          <ClickableText size="5x" weight="medium" onClick={handleDeployClick}>
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
          <NoticeItem
            type="feed"
            id={item.id}
            NoticeValue={item.NoticeValue}
            date={item.date}
          />
        ))}
      </div>
    </Feedcontainer>
  );
}

const Feedcontainer = styled.div<FeedProps>`
  display: flex;
  width: ${({ page }) => (page === 1 ? "55%" : page === 2 ? "50%" : "100%")};
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

export { Feed };
