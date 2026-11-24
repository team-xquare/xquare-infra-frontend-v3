import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthGuard } from "@xquare/hooks";
import { Xquare_colors } from "@xquare/user-interfaces";
import CreateSummary from "./CreateSummary";
import { Field, SelectInput, TextInput } from "./FormControls";
import {
  TYPE_COPY,
  bridgeOptions,
  cpuTypeOptions,
  guestOsOptions,
  initialForm,
  isoOptions,
  nodeOptions,
  storageOptions,
  templateOptions,
  type CreateForm,
  type InstanceType,
} from "./options";

const TYPES: InstanceType[] = ["ct", "vm"];

function ContainerCreatePage() {
  useAuthGuard();
  const navigate = useNavigate();
  const [type, setType] = useState<InstanceType>("ct");
  const [form, setForm] = useState<CreateForm>(initialForm);

  useEffect(() => {
    document.title = "XQUARE | CT · VM 생성";
  }, []);

  const copy = TYPE_COPY[type];
  const isCt = type === "ct";
  const node = nodeOptions.find((option) => option.value === form.node);

  const update =
    <K extends keyof CreateForm>(key: K) =>
    (value: CreateForm[K]) =>
      setForm((prev) => ({ ...prev, [key]: value }));

  const requiredValues = [
    form.node,
    form.name.trim(),
    form.cpuCores,
    form.memoryMiB,
    form.storage,
    form.diskGiB,
    form.bridge,
    ...(isCt ? [form.template, form.rootPassword] : [form.iso, form.guestOs]),
  ];
  const canSubmit = requiredValues.every(Boolean);

  // API 연동 전이라 생성 요청 없이 목록으로 돌아간다
  const handleSubmit = () => {
    if (!canSubmit) return;
    navigate("/container");
  };

  return (
    <Wrapper>
      <Heading>
        <Breadcrumb aria-label="breadcrumb">
          <Link to="/container">PVE CONTAINER</Link>
          <span aria-hidden>/</span>
          <span aria-current="page">생성</span>
        </Breadcrumb>
        <Title>CT · VM 생성</Title>
        <Description>
          실행 환경을 선택하고 새 Proxmox 인스턴스를 구성하세요.
        </Description>
      </Heading>

      <Body>
        <Form
          id="pve-create-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <TypeCards role="radiogroup" aria-label="생성할 인스턴스 종류">
            {TYPES.map((option) => {
              const selected = option === type;
              return (
                <TypeCard
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  $selected={selected}
                  onClick={() => setType(option)}
                >
                  <Radio $selected={selected} aria-hidden>
                    {selected ? "●" : "○"}
                  </Radio>
                  <span>
                    <TypeTitle>{TYPE_COPY[option].title}</TypeTitle>
                    <TypeDescription>
                      {TYPE_COPY[option].description}
                    </TypeDescription>
                  </span>
                </TypeCard>
              );
            })}
          </TypeCards>

          <Section>
            <SectionHeader>
              <SectionTitle>기본 정보</SectionTitle>
              <SectionHint>인스턴스를 식별할 정보를 입력하세요.</SectionHint>
            </SectionHeader>
            <Fields>
              <Field label="노드" required>
                {(id) => (
                  <SelectInput
                    id={id}
                    value={form.node}
                    onChange={update("node")}
                    options={nodeOptions}
                  />
                )}
              </Field>
              <Field label="VM / CT ID" required>
                {(id) => (
                  <TextInput
                    id={id}
                    value=""
                    onChange={() => undefined}
                    placeholder="ID는 자동으로 생성돼요"
                    disabled
                  />
                )}
              </Field>
              <Field label={copy.nameLabel} required>
                {(id) => (
                  <TextInput
                    id={id}
                    value={form.name}
                    onChange={update("name")}
                    placeholder={copy.namePlaceholder}
                  />
                )}
              </Field>
            </Fields>
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>{copy.osTitle}</SectionTitle>
              <SectionHint>{copy.osHint}</SectionHint>
            </SectionHeader>
            <Fields $wide>
              {isCt ? (
                <>
                  <Field label="OS 템플릿" required>
                    {(id) => (
                      <SelectInput
                        id={id}
                        value={form.template}
                        onChange={update("template")}
                        options={templateOptions}
                        placeholder="운영체제를 선택해주세요. (필수)"
                      />
                    )}
                  </Field>
                  <Field label="Root 비밀번호" required>
                    {(id) => (
                      <TextInput
                        id={id}
                        type="password"
                        value={form.rootPassword}
                        onChange={update("rootPassword")}
                        placeholder="비밀번호를 입력해주세요. (필수)"
                      />
                    )}
                  </Field>
                </>
              ) : (
                <>
                  <Field label="ISO 이미지" required>
                    {(id) => (
                      <SelectInput
                        id={id}
                        value={form.iso}
                        onChange={update("iso")}
                        options={isoOptions}
                        placeholder="ISO 이미지를 선택해주세요. (필수)"
                      />
                    )}
                  </Field>
                  <Field label="게스트 OS" required>
                    {(id) => (
                      <SelectInput
                        id={id}
                        value={form.guestOs}
                        onChange={update("guestOs")}
                        options={guestOsOptions}
                      />
                    )}
                  </Field>
                </>
              )}
            </Fields>
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>리소스</SectionTitle>
              {node && (
                <SectionHint>
                  노드 가용량: CPU {node.cpuCores} Core · 메모리{" "}
                  {node.memoryGiB} GiB
                </SectionHint>
              )}
            </SectionHeader>
            <Fields>
              <Field label="CPU 코어" required>
                {(id) => (
                  <TextInput
                    id={id}
                    type="number"
                    value={form.cpuCores}
                    onChange={update("cpuCores")}
                    placeholder="사용할 코어 수를 입력해주세요. (필수)"
                  />
                )}
              </Field>
              <Field label="메모리" required>
                {(id) => (
                  <TextInput
                    id={id}
                    type="number"
                    value={form.memoryMiB}
                    onChange={update("memoryMiB")}
                    placeholder="사용할 메모리를 입력해주세요. (필수)"
                    unit="MiB"
                  />
                )}
              </Field>
              {isCt ? (
                <Field label="Swap">
                  {(id) => (
                    <TextInput
                      id={id}
                      type="number"
                      value={form.swapMiB}
                      onChange={update("swapMiB")}
                      placeholder="사용할 Swap을 입력해주세요."
                      unit="MiB"
                    />
                  )}
                </Field>
              ) : (
                <Field label="CPU 타입" required>
                  {(id) => (
                    <SelectInput
                      id={id}
                      value={form.cpuType}
                      onChange={update("cpuType")}
                      options={cpuTypeOptions}
                    />
                  )}
                </Field>
              )}
            </Fields>
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>스토리지 및 네트워크</SectionTitle>
              <SectionHint>
                기본 브리지를 사용해 네트워크를 연결합니다.
              </SectionHint>
            </SectionHeader>
            <Fields>
              <Field label="스토리지" required>
                {(id) => (
                  <SelectInput
                    id={id}
                    value={form.storage}
                    onChange={update("storage")}
                    options={storageOptions}
                  />
                )}
              </Field>
              <Field label={copy.diskLabel} required>
                {(id) => (
                  <TextInput
                    id={id}
                    type="number"
                    value={form.diskGiB}
                    onChange={update("diskGiB")}
                    placeholder="사용할 용량을 입력해주세요. (필수)"
                    unit="GiB"
                  />
                )}
              </Field>
              <Field label="네트워크 브리지" required>
                {(id) => (
                  <SelectInput
                    id={id}
                    value={form.bridge}
                    onChange={update("bridge")}
                    options={bridgeOptions}
                  />
                )}
              </Field>
            </Fields>
            <Defaults>
              {copy.defaults.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </Defaults>
          </Section>
        </Form>

        <CreateSummary
          type={type}
          form={form}
          onToggleStart={update("startAfterCreate")}
        />
      </Body>

      <Actions>
        <RequiredNote>* 필수 입력 항목</RequiredNote>
        <ActionButtons>
          <CancelButton type="button" onClick={() => navigate("/container")}>
            취소
          </CancelButton>
          <SubmitButton
            type="submit"
            form="pve-create-form"
            disabled={!canSubmit}
          >
            {copy.submitLabel}
          </SubmitButton>
        </ActionButtons>
      </Actions>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  padding: 40px;
`;

const Heading = styled.header`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 26px;
  line-height: 1.4;
`;

const Breadcrumb = styled.nav`
  display: flex;
  gap: 8px;
  font-size: 13px;
  color: ${Xquare_colors.purple[600] as string};

  a {
    color: inherit;
    text-decoration: none;
  }

  a:hover {
    color: ${Xquare_colors.purple[500] as string};
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 500;
  color: ${Xquare_colors.black as string};
`;

const Description = styled.p`
  font-size: 16px;
  color: ${Xquare_colors.purple[600] as string};
`;

const Body = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;
`;

const Form = styled.form`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const TypeCards = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: -4px;
`;

const TypeCard = styled.button<{ $selected: boolean }>`
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 20px;
  height: 84px;
  padding: 0 17px;
  border: 1px solid
    ${({ $selected }) =>
      ($selected
        ? Xquare_colors.purple[500]
        : Xquare_colors.gray[300]) as string};
  border-radius: 8px;
  background-color: ${Xquare_colors.white as string};
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${Xquare_colors.purple[500] as string};
  }
`;

const Radio = styled.span<{ $selected: boolean }>`
  width: 16px;
  font-size: 20px;
  line-height: 1;
  color: ${({ $selected }) =>
    ($selected
      ? Xquare_colors.purple[500]
      : Xquare_colors.purple[600]) as string};
`;

const TypeTitle = styled.span`
  display: block;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.4;
  color: ${Xquare_colors.black as string};
`;

const TypeDescription = styled.span`
  display: block;
  margin-top: 7px;
  font-size: 13px;
  line-height: 1.4;
  color: ${Xquare_colors.purple[600] as string};
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
`;

const SectionTitle = styled.h2`
  width: 190px;
  flex-shrink: 0;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.4;
  color: ${Xquare_colors.black as string};
`;

const SectionHint = styled.p`
  font-size: 12px;
  line-height: 1.4;
  color: ${Xquare_colors.purple[600] as string};
`;

const Fields = styled.div<{ $wide?: boolean }>`
  display: flex;
  gap: ${({ $wide }) => ($wide ? 24 : 26)}px;
`;

const Defaults = styled.dl`
  display: grid;
  grid-template-columns: 315px 315px 1fr;
  margin-top: 18px;
  padding: 13px 18px 14px;
  border-radius: 8px;
  background-color: ${Xquare_colors.gray[300] as string};
  line-height: 1.4;

  dt {
    font-size: 13px;
    font-weight: 500;
    color: ${Xquare_colors.purple[600] as string};
  }

  dd {
    margin: 6px 0 0;
    font-size: 14px;
    color: ${Xquare_colors.black as string};
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid ${Xquare_colors.gray[300] as string};
`;

const RequiredNote = styled.p`
  font-size: 13px;
  color: ${Xquare_colors.purple[600] as string};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
`;

const baseButton = `
  height: 40px;
  padding: 0 20px;
  border-radius: 15px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s ease, border-color 0.15s ease, color 0.15s ease;
`;

const CancelButton = styled.button`
  ${baseButton}
  min-width: 100px;
  border: 1px solid ${Xquare_colors.purple[600] as string};
  background-color: ${Xquare_colors.white as string};
  color: ${Xquare_colors.purple[600] as string};

  &:hover {
    border-color: ${Xquare_colors.purple[500] as string};
    color: ${Xquare_colors.purple[500] as string};
  }
`;

const SubmitButton = styled.button`
  ${baseButton}
  min-width: 168px;
  border: 1px solid ${Xquare_colors.purple[500] as string};
  background-color: ${Xquare_colors.purple[500] as string};
  color: ${Xquare_colors.white as string};

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export default ContainerCreatePage;
