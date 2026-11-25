import styled from "@emotion/styled";
import { Xquare_colors } from "@xquare/user-interfaces";
import { formatNumber } from "../format";
import {
  TYPE_COPY,
  cpuTypeOptions,
  findLabel,
  isoOptions,
  nextInstanceId,
  templateOptions,
  type CreateForm,
  type InstanceType,
} from "./options";

interface CreateSummaryProps {
  type: InstanceType;
  form: CreateForm;
  onToggleStart: (checked: boolean) => void;
}

const EMPTY = "-";

const withUnit = (value: string, unit: string) =>
  value ? `${formatNumber(Number(value))} ${unit}` : EMPTY;

function CreateSummary({ type, form, onToggleStart }: CreateSummaryProps) {
  const copy = TYPE_COPY[type];
  const isCt = type === "ct";

  const isoOs = isoOptions.find((option) => option.value === form.iso)?.osName;
  const os = isCt
    ? findLabel(templateOptions, form.template)
    : isoOs && `${isoOs} (ISO)`;
  const cpu = form.cpuCores ? `${form.cpuCores} Core` : EMPTY;
  const autoStart = form.autoStart[type];
  const disk = form.diskGiB
    ? `${withUnit(form.diskGiB, "GiB")} · ${form.storage}`
    : EMPTY;

  const rows = [
    { label: "운영체제", value: os ?? EMPTY },
    { label: "CPU", value: cpu },
    { label: "메모리", value: withUnit(form.memoryMiB, "MiB") },
    isCt
      ? { label: "Swap", value: withUnit(form.swapMiB, "MiB") }
      : {
          label: "CPU 타입",
          value: findLabel(cpuTypeOptions, form.cpuType) ?? EMPTY,
        },
    { label: copy.summaryDiskLabel, value: disk },
    {
      label: "네트워크",
      value: isCt ? `${form.bridge} · DHCP` : `${form.bridge} · VirtIO`,
    },
  ];

  return (
    <Wrapper>
      <Card>
        <CardTitle>생성 요약</CardTitle>
        <CardHint>입력한 설정을 확인하세요.</CardHint>

        <Badge>{copy.badge}</Badge>
        <Name $empty={!form.name}>
          {form.name || `${copy.nameLabel} 미입력`}
        </Name>
        <Meta>
          {copy.idPrefix} {nextInstanceId} · {form.node}
        </Meta>

        <Divider />
        <Rows>
          {rows.map((row) => (
            <Row key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </Row>
          ))}
        </Rows>
        <Divider />

        <AutoStart>
          <span>생성 후 자동 시작</span>
          <AutoStartValue>{autoStart ? "사용" : "사용 안 함"}</AutoStartValue>
        </AutoStart>
      </Card>

      <Card $compact>
        <OptionTitle>생성 옵션</OptionTitle>
        <CheckOption>
          <HiddenCheckbox
            type="checkbox"
            checked={autoStart}
            onChange={(e) => onToggleStart(e.target.checked)}
          />
          <CheckMark aria-hidden>{autoStart ? "✓" : "○"}</CheckMark>
          {copy.startLabel}
        </CheckOption>
      </Card>

      <Note>
        <NoteTitle>{copy.noteTitle}</NoteTitle>
        <NoteDescription>{copy.noteDescription}</NoteDescription>
      </Note>
    </Wrapper>
  );
}

const Wrapper = styled.aside`
  width: 408px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Card = styled.div<{ $compact?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: ${({ $compact }) =>
    $compact ? "14px 19px 30px" : "21px 23px 30px"};
  border: 1px solid ${Xquare_colors.gray[300] as string};
  border-radius: 8px;
  background-color: ${Xquare_colors.white as string};
`;

const CardTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
  color: ${Xquare_colors.black as string};
`;

const CardHint = styled.p`
  margin-top: 7px;
  font-size: 13px;
  line-height: 1.4;
  color: ${Xquare_colors.purple[600] as string};
`;

const Badge = styled.span`
  align-self: flex-start;
  margin-top: 28px;
  padding: 4px 11px;
  border: 1px solid ${Xquare_colors.purple[500] as string};
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  line-height: 20px;
  color: ${Xquare_colors.purple[500] as string};
`;

const Name = styled.p<{ $empty: boolean }>`
  margin-top: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 23px;
  font-weight: 700;
  line-height: 1.4;
  color: ${({ $empty }) =>
    ($empty ? Xquare_colors.gray[500] : Xquare_colors.black) as string};
`;

const Meta = styled.p`
  margin-top: 5px;
  font-size: 13px;
  line-height: 1.4;
  color: ${Xquare_colors.purple[600] as string};
`;

const Divider = styled.hr`
  width: 100%;
  height: 1px;
  margin: 23px 0;
  border: none;
  background-color: ${Xquare_colors.gray[300] as string};
`;

const Rows = styled.dl`
  display: flex;
  flex-direction: column;
  gap: 21px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  line-height: 1.4;

  dt {
    font-size: 13px;
    color: ${Xquare_colors.purple[600] as string};
  }

  dd {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    text-align: right;
    color: ${Xquare_colors.black as string};
  }
`;

const AutoStart = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  line-height: 1.4;
  color: ${Xquare_colors.black as string};
`;

const AutoStartValue = styled.span`
  font-weight: 700;
  color: ${Xquare_colors.purple[500] as string};
`;

const OptionTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
  color: ${Xquare_colors.black as string};
`;

const CheckOption = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  font-size: 14px;
  line-height: 1.4;
  color: ${Xquare_colors.black as string};
  cursor: pointer;
`;

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
`;

const CheckMark = styled.span`
  width: 20px;
  font-size: 20px;
  line-height: 1;
  text-align: center;
  color: ${Xquare_colors.purple[500] as string};

  input:focus-visible + & {
    outline: 2px solid ${Xquare_colors.purple[500] as string};
    outline-offset: 2px;
  }
`;

const Note = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px 19px 20px;
  border-radius: 8px;
  background-color: ${Xquare_colors.gray[300] as string};
  line-height: 1.4;
  color: ${Xquare_colors.purple[600] as string};
`;

const NoteTitle = styled.p`
  font-size: 13px;
  font-weight: 500;
`;

const NoteDescription = styled.p`
  font-size: 12px;
`;

export default CreateSummary;
