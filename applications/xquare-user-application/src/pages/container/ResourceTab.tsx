import styled from "@emotion/styled";
import { useMemo, useState } from "react";
import { Xquare_colors } from "@xquare/user-interfaces";
import type { PveContainer } from "./types";
import { formatMiB, toPercent } from "./format";
import StatusDot from "./StatusDot";

interface ResourceValues {
  memoryMiB: number;
  swapMiB: number;
  cpuCores: number;
  cpuLimit: number;
}

const MEMORY_OPTIONS = [1024, 2048, 4096, 8192];
const SWAP_OPTIONS = [0, 512, 1024, 2048];
const CPU_OPTIONS = [1, 2, 4, 8];

function ResourceTab({ container: ct }: { container: PveContainer }) {
  const initialValues = useMemo<ResourceValues>(
    () => ({
      memoryMiB: ct.memoryMiB,
      swapMiB: ct.swapMiB,
      cpuCores: ct.cpuCores,
      cpuLimit: 0,
    }),
    [ct.cpuCores, ct.memoryMiB, ct.swapMiB],
  );
  const [values, setValues] = useState(initialValues);
  const [appliedValues, setAppliedValues] = useState(initialValues);
  const hasChanges = JSON.stringify(values) !== JSON.stringify(appliedValues);

  const update = <K extends keyof ResourceValues>(
    key: K,
    value: ResourceValues[K],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const reset = () => setValues(appliedValues);
  const apply = () => setAppliedValues(values);

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

      <SectionTitle>Usage</SectionTitle>
      <UsageCards>
        <UsageCard>
          <SpaceBetween>
            <Label>CPU</Label>
            <Muted>{values.cpuCores} Core</Muted>
          </SpaceBetween>
          <Percent>
            {toPercent(ct.usage.cpuUsedCores, values.cpuCores)}%
          </Percent>
          <Track>
            <Level
              style={{
                width: `${toPercent(ct.usage.cpuUsedCores, values.cpuCores)}%`,
              }}
            />
          </Track>
          <Muted>
            {ct.usage.cpuUsedCores} / {values.cpuCores} Core 사용 중
          </Muted>
        </UsageCard>
        <UsageCard>
          <SpaceBetween>
            <Label>Memory</Label>
            <Muted>{formatMiB(values.memoryMiB)}</Muted>
          </SpaceBetween>
          <Percent>
            {toPercent(ct.usage.memoryUsedMiB, values.memoryMiB)}%
          </Percent>
          <Track>
            <Level
              style={{
                width: `${toPercent(ct.usage.memoryUsedMiB, values.memoryMiB)}%`,
              }}
            />
          </Track>
          <Muted>
            {formatMiB(ct.usage.memoryUsedMiB)} / {formatMiB(values.memoryMiB)}
          </Muted>
        </UsageCard>
        <UsageCard>
          <SpaceBetween>
            <Label>Swap</Label>
            <Muted>{formatMiB(values.swapMiB)}</Muted>
          </SpaceBetween>
          <Percent>{toPercent(ct.usage.swapUsedMiB, values.swapMiB)}%</Percent>
          <Track>
            <Level
              style={{
                width: `${toPercent(ct.usage.swapUsedMiB, values.swapMiB)}%`,
              }}
            />
          </Track>
          <Muted>
            {formatMiB(ct.usage.swapUsedMiB)} / {formatMiB(values.swapMiB)}
          </Muted>
        </UsageCard>
      </UsageCards>

      <SectionHeader>
        <SectionTitle>Resource</SectionTitle>
        <Muted>변경한 값은 적용하기를 눌러야 반영돼요.</Muted>
      </SectionHeader>
      <ResourceList>
        <ResourceRow>
          <ResourceInfo>
            <ResourceName>memory</ResourceName>
            <ResourceDescription>
              최소 16 MiB · 현재 {formatMiB(ct.usage.memoryUsedMiB)} 사용 중
            </ResourceDescription>
          </ResourceInfo>
          <ResourceControl>
            <Pills
              options={MEMORY_OPTIONS}
              value={values.memoryMiB}
              onChange={(value) => update("memoryMiB", value)}
              format={formatMiB}
            />
            <Stepper
              value={values.memoryMiB}
              onChange={(value) => update("memoryMiB", value)}
              min={16}
              step={512}
            />
            <Unit>MiB</Unit>
          </ResourceControl>
        </ResourceRow>
        <ResourceRow>
          <ResourceInfo>
            <ResourceName>swap</ResourceName>
            <ResourceDescription>
              RAM이 부족할 때 디스크를 메모리처럼 사용 · 0이면 사용 안 함
            </ResourceDescription>
          </ResourceInfo>
          <ResourceControl>
            <Pills
              options={SWAP_OPTIONS}
              value={values.swapMiB}
              onChange={(value) => update("swapMiB", value)}
              format={formatMiB}
            />
            <Stepper
              value={values.swapMiB}
              onChange={(value) => update("swapMiB", value)}
              min={0}
              step={512}
            />
            <Unit>MiB</Unit>
          </ResourceControl>
        </ResourceRow>
        <ResourceRow>
          <ResourceInfo>
            <ResourceName>cpu cores</ResourceName>
            <ResourceDescription>
              할당할 코어 수 · 이 노드 최대 8 Core
            </ResourceDescription>
          </ResourceInfo>
          <ResourceControl>
            <Pills
              options={CPU_OPTIONS}
              value={values.cpuCores}
              onChange={(value) => update("cpuCores", value)}
              format={(value) => String(value)}
            />
            <Unit>Core</Unit>
          </ResourceControl>
        </ResourceRow>
        <ResourceRow>
          <ResourceInfo>
            <ResourceName>cpu limit</ResourceName>
            <ResourceDescription>
              실제 사용량 상한 · 0이면 제한 없음
            </ResourceDescription>
          </ResourceInfo>
          <ResourceControl>
            <LimitInput
              type="number"
              min={0}
              value={values.cpuLimit}
              onChange={(event) =>
                update("cpuLimit", Math.max(0, Number(event.target.value)))
              }
            />
            <Unit>Core</Unit>
          </ResourceControl>
        </ResourceRow>
      </ResourceList>

      <SectionTitle>Changes</SectionTitle>
      <Changes $hasChanges={hasChanges}>
        <ChangeRow>
          <span>memory</span>
          <span>
            {formatMiB(appliedValues.memoryMiB)} <Arrow>→</Arrow>{" "}
            <Changed>{formatMiB(values.memoryMiB)}</Changed>
          </span>
        </ChangeRow>
        <ChangeRow>
          <span>swap</span>
          <span>
            {formatMiB(appliedValues.swapMiB)} <Arrow>→</Arrow>{" "}
            <Changed>{formatMiB(values.swapMiB)}</Changed>
          </span>
        </ChangeRow>
        <ChangeRow>
          <span>cpu cores</span>
          <span>
            {appliedValues.cpuCores} Core <Arrow>→</Arrow>{" "}
            <Changed>{values.cpuCores} Core</Changed>
          </span>
        </ChangeRow>
      </Changes>
      <HelpText>
        실행 중인 컨테이너에도 재시작 없이 바로 적용돼요. 현재 사용량보다 작게
        줄이면 프로세스가 강제 종료될 수 있어요.
      </HelpText>
      <Actions>
        <SecondaryButton type="button" onClick={reset} disabled={!hasChanges}>
          초기화
        </SecondaryButton>
        <ApplyButton type="button" onClick={apply} disabled={!hasChanges}>
          적용하기 →
        </ApplyButton>
      </Actions>
    </Wrapper>
  );
}

function Pills({
  options,
  value,
  onChange,
  format,
}: {
  options: number[];
  value: number;
  onChange: (value: number) => void;
  format: (value: number) => string;
}) {
  return (
    <PillGroup>
      {options.map((option) => (
        <Pill
          key={option}
          type="button"
          $active={option === value}
          onClick={() => onChange(option)}
        >
          {format(option)}
        </Pill>
      ))}
    </PillGroup>
  );
}

function Stepper({
  value,
  onChange,
  min,
  step,
}: {
  value: number;
  onChange: (value: number) => void;
  min: number;
  step: number;
}) {
  return (
    <StepperBox>
      <StepButton
        type="button"
        onClick={() => onChange(Math.max(min, value - step))}
      >
        −
      </StepButton>
      <StepValue>{value.toLocaleString("en-US")}</StepValue>
      <StepButton type="button" onClick={() => onChange(value + step)}>
        ＋
      </StepButton>
    </StepperBox>
  );
}

const Wrapper = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
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
const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
`;
const UsageCards = styled.div`
  display: flex;
  gap: 20px;
`;
const UsageCard = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px;
  border: 1px solid ${Xquare_colors.gray[300] as string};
  border-radius: 10px;
`;
const SpaceBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Label = styled.strong`
  font-size: 16px;
`;
const Muted = styled.span`
  font-size: 14px;
  color: ${Xquare_colors.gray[500] as string};
`;
const Percent = styled.strong`
  font-size: 28px;
  font-weight: 500;
  line-height: 1.1;
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
const ResourceList = styled.div`
  border-top: 1px solid ${Xquare_colors.gray[300] as string};
`;
const ResourceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 100px;
  padding: 17px 0;
  border-bottom: 1px solid ${Xquare_colors.gray[300] as string};
`;
const ResourceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 230px;
`;
const ResourceName = styled.span`
  font-size: 16px;
`;
const ResourceDescription = styled.span`
  font-size: 12px;
  color: ${Xquare_colors.gray[500] as string};
`;
const ResourceControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
`;
const PillGroup = styled.div`
  display: flex;
  gap: 8px;
`;
const Pill = styled.button<{ $active: boolean }>`
  padding: 9px 18px;
  border: 1px solid
    ${({ $active }) =>
      ($active
        ? Xquare_colors.purple[500]
        : Xquare_colors.gray[400]) as string};
  border-radius: 20px;
  background: ${({ $active }) =>
    ($active ? Xquare_colors.purple[100] : Xquare_colors.white) as string};
  color: ${({ $active }) =>
    ($active ? Xquare_colors.purple[500] : Xquare_colors.gray[500]) as string};
  font-size: 14px;
  cursor: pointer;
`;
const StepperBox = styled.div`
  display: flex;
  align-items: center;
  height: 46px;
  border: 1px solid ${Xquare_colors.gray[400] as string};
  border-radius: 12px;
  overflow: hidden;
`;
const StepButton = styled.button`
  width: 48px;
  height: 100%;
  border: 0;
  background: ${Xquare_colors.white as string};
  font-size: 22px;
  cursor: pointer;
`;
const StepValue = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 126px;
  height: 100%;
  border-left: 1px solid ${Xquare_colors.gray[400] as string};
  border-right: 1px solid ${Xquare_colors.gray[400] as string};
  font-size: 16px;
  font-weight: 600;
`;
const LimitInput = styled.input`
  width: 180px;
  height: 46px;
  padding: 0 16px;
  border: 1px solid ${Xquare_colors.gray[400] as string};
  border-radius: 12px;
  text-align: right;
  font-size: 18px;
  outline: none;
  &:focus {
    border-color: ${Xquare_colors.purple[500] as string};
  }
`;
const Unit = styled.span`
  font-size: 16px;
  color: ${Xquare_colors.gray[500] as string};
`;
const Changes = styled.div<{ $hasChanges: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px 28px;
  border-radius: 10px;
  background: ${Xquare_colors.purple[700] as string};
  color: ${Xquare_colors.white as string};
`;
const ChangeRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 16px;
`;
const Arrow = styled.span`
  margin: 0 12px;
  color: ${Xquare_colors.gray[400] as string};
`;
const Changed = styled.strong`
  color: ${Xquare_colors.purple[300] as string};
`;
const HelpText = styled.p`
  font-size: 12px;
  color: ${Xquare_colors.gray[500] as string};
`;
const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;
const SecondaryButton = styled.button`
  padding: 12px 22px;
  border: 1px solid ${Xquare_colors.gray[400] as string};
  border-radius: 12px;
  background: ${Xquare_colors.white as string};
  color: ${Xquare_colors.gray[500] as string};
  font-size: 16px;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const ApplyButton = styled(SecondaryButton)`
  border-color: ${Xquare_colors.purple[500] as string};
  background: ${Xquare_colors.purple[100] as string};
  color: ${Xquare_colors.purple[500] as string};
  &:disabled {
    opacity: 0.5;
  }
`;

export default ResourceTab;
