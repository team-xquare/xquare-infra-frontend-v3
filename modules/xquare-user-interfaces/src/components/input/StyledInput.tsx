/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { Xquare_colors } from "../../styles/Colors.styles";

// 타입정의
interface InputProps {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: "text" | "password" | "email" | "number";
  width?: string;
  height?: string;
  color?: string;
  align?: "left" | "center" | "right";
  min?: number;
  max?: number;
}

// transient prop: 앞에 $를 붙여 styled 내부에서만 사용하게 함
const StyledInput = styled.input<{
  width?: string;
  height?: string;
  color?: string;
  $align?: "left" | "center" | "right";
}>`
  width: ${({ width }) => width || "300px"};
  height: ${({ height }) => height || "50px"};

  border: none;
  cursor: text;

  color: ${({ color }) => color || Xquare_colors.black};
  font-family: "Pretendard";
  font-size: 1.1rem;
  font-weight: 400;
  line-height: 1.1rem;
  outline: none;
  text-align: ${({ $align }) => $align || "right"};

  &::placeholder {
    color: ${Xquare_colors.gray[500]};
  }

  &:focus {
    color: ${Xquare_colors.purple[400]};

    &::placeholder {
      color: ${Xquare_colors.purple[400]};
    }
  }

  &:disabled {
    background-color: ${Xquare_colors.white};
    cursor: not-allowed;
  }
`;

// 컴포넌트
export const Input_basic: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  disabled = false,
  type = "text",
  width,
  height,
  align,
  color,
  min,
  max,
}) => {
  return (
    <StyledInput
      width={width}
      height={height}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      type={type}
      $align={align}
      color={color}
      min={min}
      max={max}
    />
  );
};
