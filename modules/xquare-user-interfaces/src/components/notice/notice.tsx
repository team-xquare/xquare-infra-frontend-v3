import { useState } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { NoticeItem } from "./noticeitem/index";
import { Subtitle } from "../title/index";
import { Typography } from "../typography/index";
import { SearchBox } from "../input/index";
import Xquare_colors from "../../styles";

interface NoticeProps {
  page: number;
}

function Notice({ page }: NoticeProps) {
  const navigate = useNavigate();

  function handleViewAllClick() {
    navigate("/notice");
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
    <Noticecontainer page={page}>
      <TileArea>
        <Subtitle
          title={`XQUARE 공지사항`}
          subTitle={"xquare infrastructure 의 주요 수정사항 및, 공지사항"}
        ></Subtitle>
        {page !== 3 && (
          <ClickableText size="4x" weight="medium" onClick={handleViewAllClick}>
            전체보기 →
          </ClickableText>
        )}
        {page === 3 && (
          <SearchBox
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="검색어를 입력하세요"
            width="300px"
            height="20px"
          />
        )}
      </TileArea>
      <div>
        {displayItems.map((item) => (
          <NoticeItem
            type="notice"
            id={item.id}
            NoticeValue={item.NoticeValue}
            date={item.date}
          />
        ))}
      </div>
    </Noticecontainer>
  );
}

const Noticecontainer = styled.div<NoticeProps>`
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

export { Notice };
