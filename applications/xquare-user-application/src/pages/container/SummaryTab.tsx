import styled from "@emotion/styled";
import { Xquare_colors } from "@xquare/user-interfaces";
import type { PveContainer } from "./types";
import { formatNumber, toPercent } from "./format";
import StatusDot from "./StatusDot";
import UsageChart from "./UsageChart";

const TIME_LABELS = ["13:00", "13:15", "13:30", "13:45", "14:00"];

function SummaryTab({ container: ct }: { container: PveContainer }) {
  const running = ct.status === "running";
  const cpuPercent = toPercent(ct.usage.cpuUsedCores, ct.cpuCores);
  const memoryPercent = toPercent(ct.usage.memoryUsedMiB, ct.memoryMiB);
  const swapPercent = toPercent(ct.usage.swapUsedMiB, ct.swapMiB);
  const diskPercent = toPercent(
    ct.network.rootDiskUsedGiB,
    ct.network.rootDiskTotalGiB,
  );

  const usageCards = [
    {
      label: "CPU",
      capacity: `${ct.cpuCores} Core`,
      percent: cpuPercent,
      detail: `${ct.usage.cpuUsedCores} / ${ct.cpuCores} Core 사용 중`,
    },
    {
      label: "Memory",
      capacity: `${formatNumber(ct.memoryMiB)} MiB`,
      percent: memoryPercent,
      detail: `${formatNumber(ct.usage.memoryUsedMiB)} MiB / ${formatNumber(ct.memoryMiB)} MiB`,
    },
    {
      label: "Swap",
      capacity: `${formatNumber(ct.swapMiB)} MiB`,
      percent: swapPercent,
      detail: `${formatNumber(ct.usage.swapUsedMiB)} MiB / ${formatNumber(ct.swapMiB)} MiB`,
    },
  ];

  const information = [
    { label: "CT ID", value: String(ct.id) },
    { label: "Hostname", value: ct.name },
    { label: "Node", value: ct.node },
    { label: "OS", value: ct.os },
    { label: "Uptime", value: ct.uptime },
  ];

  const networkStorage = [
    { label: "Interface", value: ct.network.interface },
    { label: "IPv4", value: ct.network.ipv4 },
    { label: "Gateway", value: ct.network.gateway },
    {
      label: "Root disk",
      value: `${ct.network.rootDiskUsedGiB} GiB / ${ct.network.rootDiskTotalGiB} GiB (${diskPercent}%)`,
    },
    {
      label: "Network I/O",
      value: `↓ ${ct.network.netInGiB} GiB / ↑ ${formatNumber(ct.network.netOutMiB)} MiB`,
    },
  ];

  return (
    <Wrapper>
      <Identity>
        <IdentityName>
          <Name>{ct.name}</Name>
          <IdentityMeta>
            CT {ct.id} · {ct.node} · {ct.os}
            {running && ` · 가동 ${ct.uptime}`}
          </IdentityMeta>
        </IdentityName>
        <StatusChip $running={running}>
          <StatusDot status={ct.status} />
          {ct.status}
        </StatusChip>
      </Identity>

      <Section $gap={5}>
        <SectionTitle>Usage</SectionTitle>
        <Row>
          {usageCards.map((card) => (
            <UsageCard key={card.label}>
              <SpaceBetween>
                <UsageLabel>{card.label}</UsageLabel>
                <Muted>{card.capacity}</Muted>
              </SpaceBetween>
              <UsagePercent>{card.percent}%</UsagePercent>
              <Track>
                <Level style={{ width: `${card.percent}%` }} />
              </Track>
              <Muted>{card.detail}</Muted>
            </UsageCard>
          ))}
        </Row>
      </Section>

      <Row $gap={20}>
        <Section $gap={5}>
          <SectionTitle>Information</SectionTitle>
          <DetailList items={information} />
        </Section>
        <Section $gap={5}>
          <SectionTitle>Network &amp; Storage</SectionTitle>
          <DetailList items={networkStorage} />
        </Section>
      </Row>

      <Section $gap={10}>
        <SpaceBetween>
          <SectionTitle>Performance</SectionTitle>
          <TimeRange>
            <Muted>최근 1시간 · 1분 간격</Muted>
            <PeriodButton type="button" aria-pressed="true">
              1시간
            </PeriodButton>
          </TimeRange>
        </SpaceBetween>
        <Row>
          <UsageChart
            title="CPU usage"
            current={cpuPercent}
            points={ct.cpuTrend}
            timeLabels={TIME_LABELS}
          />
          <UsageChart
            title="Memory usage"
            current={memoryPercent}
            points={ct.memoryTrend}
            timeLabels={TIME_LABELS}
          />
        </Row>
      </Section>

      <Section $gap={8}>
        <SpaceBetween>
          <SectionTitle>Recent tasks</SectionTitle>
          <Muted>최근 작업 {ct.tasks.length}개</Muted>
        </SpaceBetween>
        <Table>
          <thead>
            <tr>
              <Th $width={170}>시간</Th>
              <Th>작업</Th>
              <Th $width={140}>사용자</Th>
              <Th $shrink>결과</Th>
            </tr>
          </thead>
          <tbody>
            {ct.tasks.map((task) => (
              <tr key={`${task.time}-${task.action}`}>
                <Td>{task.time}</Td>
                <Td>{task.action}</Td>
                <Td>{task.user}</Td>
                <Td>{task.result}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Actions>
        <ActionButton type="button" disabled={!running}>
          종료
        </ActionButton>
        <ActionButton type="button" $primary>
          {running ? "재시작" : "시작"}
        </ActionButton>
      </Actions>
    </Wrapper>
  );
}

function DetailList({ items }: { items: { label: string; value: string }[] }) {
  return (
    <Details>
      {items.map((item) => (
        <DetailRow key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </DetailRow>
      ))}
    </Details>
  );
}

const Wrapper = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
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
  min-width: 0;
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
  flex-shrink: 0;
  padding: 5px 12px;
  border-radius: 28px;
  border: 1px solid
    ${({ $running }) =>
      ($running
        ? Xquare_colors.green[500]
        : Xquare_colors.gray[400]) as string};
  background-color: ${({ $running }) =>
    ($running ? Xquare_colors.green[400] : Xquare_colors.gray[300]) as string};
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
  color: ${Xquare_colors.black as string};
`;

const Section = styled.section<{ $gap: number }>`
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => $gap}px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
  color: ${Xquare_colors.black as string};
`;

const Row = styled.div<{ $gap?: number }>`
  display: flex;
  gap: ${({ $gap = 15 }) => $gap}px;
  width: 100%;
`;

const SpaceBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 1.2;
`;

const Muted = styled.p`
  font-size: 12px;
  line-height: 1.2;
  color: ${Xquare_colors.gray[500] as string};
`;

const UsageCard = styled.div`
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border: 1px solid ${Xquare_colors.gray[300] as string};
  border-radius: 10px;
  background-color: ${Xquare_colors.white as string};
`;

const UsageLabel = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: ${Xquare_colors.black as string};
`;

const UsagePercent = styled.p`
  font-size: 28px;
  font-weight: 500;
  line-height: 1.2;
  color: ${Xquare_colors.black as string};
`;

const Track = styled.div`
  width: 100%;
  height: 8px;
  border-radius: 20px;
  overflow: hidden;
  background-color: ${Xquare_colors.gray[300] as string};
`;

const Level = styled.div`
  height: 100%;
  border-radius: 20px;
  background-color: ${Xquare_colors.purple[500] as string};
`;

const Details = styled.dl`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  line-height: 1.2;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 9px 0;
  border-bottom: 1px solid ${Xquare_colors.gray[300] as string};

  dt {
    color: ${Xquare_colors.gray[500] as string};
  }

  dd {
    margin: 0;
    color: ${Xquare_colors.black as string};
    text-align: right;
  }
`;

const TimeRange = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PeriodButton = styled.button`
  padding: 6px 12px;
  border-radius: 10px;
  border: 1px solid ${Xquare_colors.purple[500] as string};
  background-color: ${Xquare_colors.purple[100] as string};
  font-size: 12px;
  color: ${Xquare_colors.purple[500] as string};
  cursor: pointer;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  text-align: left;

  th:first-of-type,
  td:first-of-type {
    padding-left: 15px;
  }

  th:last-of-type,
  td:last-of-type {
    padding-right: 15px;
  }
`;

const Th = styled.th<{ $width?: number; $shrink?: boolean }>`
  box-sizing: content-box;
  width: ${({ $width, $shrink }) =>
    $shrink ? "1%" : $width ? `${$width}px` : "auto"};
  padding: 8px 0 11px;
  font-weight: 400;
  white-space: nowrap;
  color: ${Xquare_colors.gray[500] as string};
  background-color: ${Xquare_colors.gray[300] as string};
`;

const Td = styled.td`
  /* 시안: 행 31px + 행 사이 8px 간격 → 위쪽 여백에 간격을 합친다 */
  padding: 15px 0 7px;
  white-space: nowrap;
  border-bottom: 1px solid ${Xquare_colors.gray[300] as string};
  color: ${Xquare_colors.black as string};
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
  height: 40px;
  padding: 0 20px;
  border-radius: 10px;
  border: 1px solid
    ${({ $primary }) =>
      ($primary
        ? Xquare_colors.purple[500]
        : Xquare_colors.gray[400]) as string};
  background-color: ${({ $primary }) =>
    ($primary ? Xquare_colors.purple[100] : Xquare_colors.white) as string};
  font-size: 16px;
  color: ${({ $primary }) =>
    ($primary ? Xquare_colors.purple[500] : Xquare_colors.gray[500]) as string};
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    color 0.15s ease;

  &:hover:not(:disabled) {
    border-color: ${Xquare_colors.purple[500] as string};
    color: ${Xquare_colors.purple[500] as string};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export default SummaryTab;
