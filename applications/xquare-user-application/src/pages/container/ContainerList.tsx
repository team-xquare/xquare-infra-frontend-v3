import styled from "@emotion/styled";
import { useMemo, useState } from "react";
import { Xquare_colors } from "@xquare/user-interfaces";
import SearchIcon from "../../assets/container/search.svg";
import type { PveContainer } from "./types";
import { formatMiB } from "./format";
import StatusDot from "./StatusDot";

interface ContainerListProps {
  containers: PveContainer[];
  selectedId?: number;
  onSelect: (id: number) => void;
}

function ContainerList({
  containers,
  selectedId,
  onSelect,
}: ContainerListProps) {
  const [keyword, setKeyword] = useState("");

  const filtered = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    if (!query) return containers;
    return containers.filter(
      (ct) =>
        ct.name.toLowerCase().includes(query) || String(ct.id).includes(query),
    );
  }, [containers, keyword]);

  return (
    <Wrapper>
      <Header>
        <HeaderTitle>Containers</HeaderTitle>
        <HeaderCount>{containers.length}개</HeaderCount>
      </Header>

      <Search>
        <img src={SearchIcon} alt="" width={16} height={16} />
        <SearchInput
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="CT 이름 또는 ID로 검색"
          aria-label="CT 이름 또는 ID로 검색"
        />
      </Search>

      {filtered.map((ct) => {
        const stopped = ct.status === "stopped";
        return (
          <Card
            key={ct.id}
            type="button"
            $selected={ct.id === selectedId}
            onClick={() => onSelect(ct.id)}
            aria-pressed={ct.id === selectedId}
          >
            <CardTitle>
              <IdBadge $muted={stopped}>{ct.id}</IdBadge>
              <CardName $muted={stopped}>{ct.name}</CardName>
            </CardTitle>
            <CardMeta>
              <MetaText>
                {ct.node} · {ct.os}
              </MetaText>
              <StatusText $muted={stopped}>
                <StatusDot status={ct.status} />
                {ct.status}
              </StatusText>
            </CardMeta>
            <CardSpec>
              <span>CPU {ct.cpuCores}</span>
              <span>RAM {formatMiB(ct.memoryMiB)}</span>
              <span>Swap {formatMiB(ct.swapMiB)}</span>
            </CardSpec>
          </Card>
        );
      })}

      {filtered.length === 0 && <Empty>검색 결과가 없습니다.</Empty>}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 300px;
  flex-shrink: 0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 1.2;
`;

const HeaderTitle = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: ${Xquare_colors.black as string};
`;

const HeaderCount = styled.p`
  font-size: 14px;
  color: ${Xquare_colors.gray[500] as string};
`;

const Search = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 1px solid ${Xquare_colors.gray[300] as string};
  cursor: text;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  line-height: 1.2;
  color: ${Xquare_colors.black as string};

  &::placeholder {
    color: ${Xquare_colors.gray[500] as string};
  }
`;

const Card = styled.button<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 12px 15px;
  border-radius: 5px;
  border: 1px solid
    ${({ $selected }) =>
      ($selected
        ? Xquare_colors.purple[400]
        : Xquare_colors.gray[300]) as string};
  background-color: ${Xquare_colors.white as string};
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${Xquare_colors.purple[400] as string};
  }
`;

const CardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

const IdBadge = styled.span<{ $muted: boolean }>`
  flex-shrink: 0;
  padding: 2px 8px;
  border-radius: 28px;
  border: 1px solid
    ${({ $muted }) =>
      ($muted ? Xquare_colors.gray[500] : Xquare_colors.purple[500]) as string};
  background-color: ${({ $muted }) =>
    ($muted ? Xquare_colors.gray[300] : Xquare_colors.purple[100]) as string};
  color: ${({ $muted }) =>
    ($muted ? Xquare_colors.gray[500] : Xquare_colors.purple[500]) as string};
  font-size: 10px;
  font-weight: 700;
  line-height: 1.2;
`;

const CardName = styled.span<{ $muted: boolean }>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
  color: ${({ $muted }) =>
    ($muted ? Xquare_colors.gray[500] : Xquare_colors.black) as string};
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MetaText = styled.span`
  font-size: 12px;
  font-weight: 300;
  line-height: 1.2;
  color: ${Xquare_colors.black as string};
`;

const StatusText = styled.span<{ $muted: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  line-height: 1.2;
  color: ${({ $muted }) =>
    ($muted ? Xquare_colors.gray[500] : Xquare_colors.black) as string};
`;

const CardSpec = styled.div`
  display: flex;
  gap: 12px;
  font-size: 12px;
  line-height: 1.2;
  color: ${Xquare_colors.gray[500] as string};
`;

const Empty = styled.p`
  padding: 20px 0;
  font-size: 12px;
  text-align: center;
  color: ${Xquare_colors.gray[500] as string};
`;

export default ContainerList;
