import styled from "@emotion/styled";
import type { ReactNode } from "react";
import { useId } from "react";
import { Xquare_colors } from "@xquare/user-interfaces";
import type { SelectOption } from "./options";

interface FieldProps {
  label: string;
  required?: boolean;
  children: (id: string) => ReactNode;
}

export function Field({ label, required = false, children }: FieldProps) {
  const id = useId();
  return (
    <FieldWrapper>
      <Label htmlFor={id}>
        {label}
        {required && " *"}
      </Label>
      {children(id)}
    </FieldWrapper>
  );
}

interface TextInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "password" | "number";
  unit?: string;
  disabled?: boolean;
}

export function TextInput({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  unit,
  disabled = false,
}: TextInputProps) {
  return (
    <Box $disabled={disabled}>
      <Input
        id={id}
        type={type}
        value={value}
        min={type === "number" ? 1 : undefined}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
      {unit && <Suffix>{unit}</Suffix>}
    </Box>
  );
}

interface SelectInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
}

export function SelectInput({
  id,
  value,
  onChange,
  options,
  placeholder,
}: SelectInputProps) {
  return (
    <Box>
      <Select
        id={id}
        value={value}
        $empty={value === ""}
        onChange={(e) => onChange(e.target.value)}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Chevron aria-hidden>⌄</Chevron>
    </Box>
  );
}

const FieldWrapper = styled.div`
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  color: ${Xquare_colors.purple[600] as string};
`;

const Box = styled.div<{ $disabled?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 60px;
  padding: 0 15px;
  border: 1px solid ${Xquare_colors.gray[300] as string};
  border-radius: 8px;
  background-color: ${Xquare_colors.white as string};
  transition: border-color 0.15s ease;

  &:focus-within {
    border-color: ${Xquare_colors.purple[500] as string};
  }
`;

const controlStyle = `
  flex: 1;
  min-width: 0;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: 14px;
  letter-spacing: -0.32px;
`;

const Input = styled.input`
  ${controlStyle}
  color: ${Xquare_colors.black as string};

  &::placeholder {
    color: ${Xquare_colors.gray[500] as string};
  }

  &:disabled {
    cursor: not-allowed;
  }

  /* 숫자 입력의 스핀 버튼은 시안에 없으므로 숨긴다 */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    margin: 0;
    -webkit-appearance: none;
  }
  -moz-appearance: textfield;
`;

const Select = styled.select<{ $empty: boolean }>`
  ${controlStyle}
  padding-right: 24px;
  appearance: none;
  cursor: pointer;
  color: ${({ $empty }) =>
    ($empty ? Xquare_colors.gray[500] : Xquare_colors.black) as string};

  option {
    color: ${Xquare_colors.black as string};
  }
`;

const Suffix = styled.span`
  flex-shrink: 0;
  font-size: 14px;
  color: ${Xquare_colors.black as string};
`;

const Chevron = styled.span`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-60%);
  font-size: 16px;
  color: ${Xquare_colors.purple[600] as string};
  pointer-events: none;
`;
