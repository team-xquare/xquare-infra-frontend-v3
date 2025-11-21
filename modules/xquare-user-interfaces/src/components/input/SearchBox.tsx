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
  width: ${({ width }) => width || "400px"};
  height: ${({ height }) => height || "30px"};
  box-sizing: border-box;

  background-color: ${Xquare_colors.white};
  border: 2px solid ${Xquare_colors.purple[600]};
  border-radius: 30px;

  padding: 22px;

  color: ${Xquare_colors.purple[600]};
  font-size: 1.15rem;
  font-weight: 400;
  line-height: 1rem;

  &::placeholder {
    color: ${Xquare_colors.gray[600]};
  }

  &:disabled {
    border-bottom: 1.2px solid ${Xquare_colors.gray[300]};

    &::placeholder {
      color: ${Xquare_colors.gray[300]};
    }
  }
`;

// 컴포넌트
export const SearchBox: React.FC<InputProps> = ({
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
