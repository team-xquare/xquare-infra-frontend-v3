import { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { NoticeItem } from "./noticeitem/index";
import { Subtitle } from "../title/index";
import { Typography } from "../typography/index";
import { SearchBox } from "../input/index";
import { formatDate } from "@xquare/utils";
import Xquare_colors from "../../styles";
import { listNotices } from "@xquare/utils";
import type { NoticeSummary } from "@xquare/utils";

interface NoticeProps {
  page: number;
}

function Notice({ page }: NoticeProps) {
  const navigate = useNavigate();

  function handleViewAllClick() {
    navigate("/notice");
  }

  const [items, setItems] = useState<NoticeSummary[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [pagination, setPagination] = useState({ pageKey: page, index: 0 });

  const currentPage = useMemo(
    () => (pagination.pageKey === page ? pagination.index : 0),
    [pagination.pageKey, pagination.index, page]
  );

  const isFullList = page === 3;
  const fetchLimit = useMemo(() => (page === 1 ? 4 : 15), [page]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const serverPage = isFullList ? currentPage + 1 : 1;
        const notices = await listNotices({
          page: serverPage,
          limit: fetchLimit,
        });
        if (!cancelled) setItems(notices);
      } catch (e) {
        console.error("[Notice] 공지 목록 조회 실패", e);
        if (!cancelled) setItems([]);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [page, fetchLimit, currentPage, isFullList]);

  const { displayItems, hasNext } = useMemo(() => {
    const filtered = items.filter((n) =>
      n.title.toLowerCase().includes(searchValue.trim().toLowerCase())
    );

    if (!isFullList) {
      return {
        displayItems: filtered.slice(0, fetchLimit),
        hasNext: false,
      };
    }

    const serverPaged = filtered.length <= fetchLimit;

    if (serverPaged) {
      return {
        displayItems: filtered,
        hasNext: filtered.length === fetchLimit,
      };
    }

    const start = currentPage * fetchLimit;
    const end = start + fetchLimit;
    const sliced = filtered.slice(start, end);
    const moreFromSlice = end < filtered.length;

    return { displayItems: sliced, hasNext: moreFromSlice };
  }, [items, searchValue, fetchLimit, isFullList, currentPage]);

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
            key={item.id}
            type="notice"
            id={item.id}
            NoticeValue={item.title}
            date={formatDate(item.createdAt)}
          />
        ))}
      </div>
      {isFullList && (
        <PaginationArea>
          <PageButton
            disabled={currentPage === 0}
            onClick={() =>
              setPagination({
                pageKey: page,
                index: Math.max(0, currentPage - 1),
              })
            }
          >
            이전
          </PageButton>
          <Typography size="3x" weight="medium">
            Page {currentPage + 1}
          </Typography>
          <PageButton
            disabled={!hasNext}
            onClick={() =>
              setPagination({
                pageKey: page,
                index: currentPage + 1,
              })
            }
          >
            다음
          </PageButton>
        </PaginationArea>
      )}
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

const PaginationArea = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 10px;
`;

const PageButton = styled.button<{ disabled?: boolean }>`
  padding: 6px 12px;
  border: 1px solid ${Xquare_colors.gray[300]};
  background: ${({ disabled }) =>
    disabled ? Xquare_colors.gray[200] : Xquare_colors.white};
  color: ${Xquare_colors.black};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  border-radius: 6px;
`;

export { Notice };
