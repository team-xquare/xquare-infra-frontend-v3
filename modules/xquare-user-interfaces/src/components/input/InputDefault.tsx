/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { Xquare_colors } from "../../styles/Colors.styles";

// 타입정의
interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: "text" | "password" | "email" | "number";
  width?: string;
  height?: string;
}

// 스타일 정의
const StyledInput = styled.input<InputProps>`
  width: ${({ width }) => width || "300px"};
  height: ${({ height }) => height || "50px"};

  border: none;
  border-bottom: 1.2px solid ${Xquare_colors.gray[500]};
  background-color: ${Xquare_colors.white};
  cursor: text;

  color: ${Xquare_colors.black};
  font-family: "Pretendard";
  font-size: 1.1rem;
  font-weight: 400;
  line-height: 1.1rem;

  &::placeholder {
    color: ${Xquare_colors.gray[500]};
  }

  &:focus {
    outline: none;
    border-bottom: 1.2px solid ${Xquare_colors.purple[500]};
    color: ${Xquare_colors.purple[500]};

    &::placeholder {
      color: ${Xquare_colors.purple[500]};
    }
  }

  &:disabled {
    border-bottom: 1.2px solid ${Xquare_colors.gray[300]};
    cursor: not-allowed;

    &::placeholder {
      color: ${Xquare_colors.gray[300]};
    }
  }
`;

// 컴포넌트
export const Input_default: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  disabled = false,
  type = "text",
  width,
  height,
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
    />
  );
};
