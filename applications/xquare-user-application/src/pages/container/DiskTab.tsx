import styled from "@emotion/styled";
import { useState } from "react";
import { Xquare_colors } from "@xquare/user-interfaces";
import type { PveContainer, PveDisk } from "./types";
import { toPercent } from "./format";
import StatusDot from "./StatusDot";

function DiskTab({ container: ct }: { container: PveContainer }) {
  const [disks, setDisks] = useState(ct.disks);
  const [selectedId, setSelectedId] = useState(disks[0]?.id ?? "");
  const selected = disks.find((disk) => disk.id === selectedId) ?? disks[0];
  const rootDisk = disks.find((disk) => disk.kind === "root") ?? disks[0];
  const rootUsed = ct.network.rootDiskUsedGiB;
  const rootCapacity = rootDisk?.sizeGiB ?? ct.network.rootDiskTotalGiB;
  const additionalCapacity = disks
    .filter((disk) => disk.kind === "mount")
    .reduce((total, disk) => total + disk.sizeGiB, 0);

  const addDisk = () => {
    const nextIndex = disks.filter((disk) => disk.kind === "mount").length;
    const disk: PveDisk = {
      id: `local-lvm:vm-${ct.id}-disk-${disks.length}`,
      label: `Mount point · mp${nextIndex + 1}`,
      kind: "mount",
      storage: "local-lvm",
      mountPath: `/data${nextIndex + 1}`,
      sizeGiB: 50,
      filesystem: "ext4",
      backup: true,
      connected: true,
    };
    setDisks((current) => [...current, disk]);
    setSelectedId(disk.id);
  };

  return (
    <Wrapper>
      <Identity>
        <IdentityName>
          <Name>{ct.name}</Name>
          <IdentityMeta>
            CT {ct.id} · {ct.node} · {ct.os}
            {ct.status === "running" && ` · 가동 ${ct.uptime}`}
          </IdentityMeta>
        </IdentityName>
        <StatusChip $running={ct.status === "running"}>
          <StatusDot status={ct.status} />
          {ct.status}
        </StatusChip>
      </Identity>

      <SummaryCards>
        <MetricCard>
          <MetricLabel>루트 디스크 사용량</MetricLabel>
          <MetricValue>
            {rootUsed} / {rootCapacity} GiB
          </MetricValue>
          <Track>
            <Level style={{ width: `${toPercent(rootUsed, rootCapacity)}%` }} />
          </Track>
          <MetricDetail>
            {toPercent(rootUsed, rootCapacity)}% 사용 중 · 여유{" "}
            {Math.max(rootCapacity - rootUsed, 0).toFixed(1)} GiB
          </MetricDetail>
        </MetricCard>
        <MetricCard>
          <MetricLabel>추가 볼륨 할당량</MetricLabel>
          <MetricValue>{additionalCapacity} GiB</MetricValue>
          <MetricDetail>
            마운트 포인트 {disks.filter((disk) => disk.kind === "mount").length}
            개
          </MetricDetail>
        </MetricCard>
        <MetricCard>
          <MetricLabel>스토리지 여유 공간</MetricLabel>
          <MetricValue>368 GiB</MetricValue>
          <MetricDetail>local-lvm · {ct.node}</MetricDetail>
        </MetricCard>
      </SummaryCards>

      <SectionHeader>
        <SectionTitle>디스크 및 마운트 포인트</SectionTitle>
        <PrimaryButton type="button" onClick={addDisk}>
          ＋ 디스크 추가
        </PrimaryButton>
      </SectionHeader>
      <DiskTable>
        <TableHeader>
          <span>디스크</span>
          <span>스토리지</span>
          <span>마운트 경로</span>
          <span>용량</span>
          <span>백업</span>
          <span>상태</span>
        </TableHeader>
        {disks.map((disk) => (
          <DiskRow
            key={disk.id}
            type="button"
            $selected={disk.id === selected?.id}
            onClick={() => setSelectedId(disk.id)}
          >
            <DiskName>
              <strong>{disk.label}</strong>
              <small>{disk.id}</small>
            </DiskName>
            <span>{disk.storage}</span>
            <span>{disk.mountPath}</span>
            <span>{disk.sizeGiB} GiB</span>
            <span>{disk.backup ? "포함" : "제외"}</span>
            <Connected>
              <StatusDot status="running" /> 연결됨
            </Connected>
          </DiskRow>
        ))}
      </DiskTable>

      {selected && (
        <DetailCard>
          <DetailHeader>
            <DetailTitle>{selected.label}</DetailTitle>
            <Muted>선택한 디스크</Muted>
          </DetailHeader>
          <DetailGrid>
            <DetailItem>
              <Muted>볼륨 ID</Muted>
              <strong>{selected.id}</strong>
            </DetailItem>
            <DetailItem>
              <Muted>파일 시스템</Muted>
              <span>{selected.filesystem}</span>
            </DetailItem>
            <DetailItem>
              <Muted>마운트 경로</Muted>
              <span>{selected.mountPath}</span>
            </DetailItem>
            <DetailItem>
              <Muted>백업</Muted>
              <span>{selected.backup ? "포함" : "제외"}</span>
            </DetailItem>
          </DetailGrid>
          <DetailFooter>
            <PrimaryButton
              type="button"
              disabled={selected.kind === "root"}
              onClick={() => {
                setDisks((current) =>
                  current.filter((disk) => disk.id !== selected.id),
                );
                setSelectedId(
                  disks.find((disk) => disk.id !== selected.id)?.id ?? "",
                );
              }}
            >
              마운트 해제 ↗
            </PrimaryButton>
            <Notice>루트 디스크는 분리하거나 삭제할 수 없습니다.</Notice>
          </DetailFooter>
        </DetailCard>
      )}
      <InfoBox>
        <strong>디스크 변경 전 확인하세요</strong>
        <span>
          디스크 축소는 지원하지 않습니다. 확장·이동 전 백업을 권장하며, 작업에
          따라 CT 중지가 필요할 수 있습니다.
        </span>
      </InfoBox>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Identity = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;
const IdentityName = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  line-height: 1.2;
  color: ${Xquare_colors.black as string};
`;
const Name = styled.h2`
  font-size: 20px;
  font-weight: 500;
`;
const IdentityMeta = styled.p`
  font-size: 12px;
  font-weight: 300;
`;
const StatusChip = styled.span<{ $running: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 28px;
  border: 1px solid
    ${({ $running }) =>
      ($running
        ? Xquare_colors.green[500]
        : Xquare_colors.gray[400]) as string};
  background: ${({ $running }) =>
    ($running ? Xquare_colors.green[400] : Xquare_colors.gray[300]) as string};
  font-size: 12px;
`;
const SummaryCards = styled.div`
  display: flex;
  gap: 20px;
`;
const MetricCard = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 24px;
  border: 1px solid ${Xquare_colors.gray[300] as string};
  border-radius: 10px;
`;
const MetricLabel = styled.p`
  font-size: 14px;
`;
const MetricValue = styled.strong`
  font-size: 28px;
  line-height: 1.1;
`;
const MetricDetail = styled.p`
  font-size: 14px;
  color: ${Xquare_colors.black as string};
`;
const Track = styled.div`
  height: 8px;
  border-radius: 20px;
  overflow: hidden;
  background: ${Xquare_colors.gray[300] as string};
`;
const Level = styled.div`
  height: 100%;
  border-radius: 20px;
  background: ${Xquare_colors.purple[500] as string};
`;
const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
`;
const PrimaryButton = styled.button`
  padding: 12px 20px;
  border: 0;
  border-radius: 18px;
  background: ${Xquare_colors.purple[500] as string};
  color: ${Xquare_colors.white as string};
  font-size: 16px;
  cursor: pointer;
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;
const DiskTable = styled.div`
  border: 1px solid ${Xquare_colors.gray[300] as string};
  border-radius: 10px;
  overflow: hidden;
`;
const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.2fr 1.2fr 0.8fr 0.7fr 1fr;
  gap: 18px;
  padding: 17px 24px;
  background: #f0f3f7;
  font-size: 14px;
`;
const DiskRow = styled.button<{ $selected: boolean }>`
  display: grid;
  grid-template-columns: 2fr 1.2fr 1.2fr 0.8fr 0.7fr 1fr;
  gap: 18px;
  align-items: center;
  width: 100%;
  padding: 16px 24px;
  border: 0;
  border-top: 1px solid ${Xquare_colors.gray[300] as string};
  border-left: 1px solid
    ${({ $selected }) =>
      ($selected ? Xquare_colors.purple[500] : "transparent") as string};
  border-right: 1px solid
    ${({ $selected }) =>
      ($selected ? Xquare_colors.purple[500] : "transparent") as string};
  background: ${Xquare_colors.white as string};
  text-align: left;
  font-size: 14px;
  cursor: pointer;
`;
const DiskName = styled.span`
  display: flex;
  flex-direction: column;
  gap: 5px;
  strong {
    font-size: 16px;
    color: ${Xquare_colors.purple[500] as string};
  }
  small {
    font-size: 12px;
  }
`;
const Connected = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${Xquare_colors.purple[600] as string};
`;
const DetailCard = styled.div`
  padding: 28px 24px 24px;
  border: 1px solid ${Xquare_colors.gray[300] as string};
  border-radius: 10px;
`;
const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const DetailTitle = styled.h3`
  font-size: 20px;
`;
const Muted = styled.span`
  font-size: 12px;
  color: ${Xquare_colors.gray[500] as string};
`;
const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 20px;
  margin-top: 18px;
`;
const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 14px;
`;
const DetailFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 32px;
  padding-top: 18px;
  border-top: 1px solid ${Xquare_colors.gray[300] as string};
`;
const Notice = styled.p`
  font-size: 12px;
`;
const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 22px;
  border-radius: 10px;
  background: #eef3f8;
  font-size: 12px;
`;

export default DiskTab;
