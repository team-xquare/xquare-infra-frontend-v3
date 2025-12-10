/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { Xquare_colors } from "../../styles/colors";

// 타입정의
interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: "text" | "number";
  width?: string;
  height?: string;
}

// 스타일 정의
const StyledInput = styled.input<InputProps>`
  width: ${({ width }) => width || "600px"};
  height: ${({ height }) => height || "60px"};
  box-sizing: border-box;

  border: none;
  background-color: ${Xquare_colors.purple[700]};
  border-radius: 10px;

  padding: 22px;

  color: ${Xquare_colors.white};
  font-family: "Pretendard";
  font-size: 1rem;
  font-weight: 300;
  line-height: 1rem;

  &::placeholder {
    color: ${Xquare_colors.gray[500]};
  }

  &:focus {
    outline: none;
    color: ${Xquare_colors.white};

    &::placeholder {
      color: ${Xquare_colors.white};
    }
  }

  &:disabled {
    border-bottom: 1.2px solid ${Xquare_colors.gray[300]};

    &::placeholder {
      color: ${Xquare_colors.gray[300]};
    }
  }
`;

// 컴포넌트
export const Input_record: React.FC<InputProps> = ({
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
