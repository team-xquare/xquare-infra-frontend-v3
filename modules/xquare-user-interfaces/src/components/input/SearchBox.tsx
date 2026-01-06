/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { Xquare_colors } from "../../styles/colors";

// 타입정의
interface SearchBoxProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: "text" | "number";
  width?: string;
  height?: string;
}

// 스타일 정의
const StyledInput = styled.input<SearchBoxProps>`
  width: ${({ width }) => width || "400px"};
  height: ${({ height }) => height || "30px"};
  box-sizing: border-box;

  background-color: ${Xquare_colors.white};
  border: 2px solid ${Xquare_colors.gray[400]};
  border-radius: 30px;
  outline: none;
  cursor: text;

  padding: 22px;

  color: ${Xquare_colors.gray[400]};
  font-family: "Pretendard";
  font-size: 1.15rem;
  font-weight: 400;
  line-height: 1rem;

  &::placeholder {
    color: ${Xquare_colors.gray[400]};
  }

  &:disabled {
    border: none;
    border-bottom: 1.2px solid ${Xquare_colors.gray[300]};
    cursor: not-allowed;

    &::placeholder {
      color: ${Xquare_colors.gray[300]};
    }
  }

  &:focus {
    border: 2px solid ${Xquare_colors.purple[400]};
    color: ${Xquare_colors.purple[400]};

    &::placeholder {
      color: ${Xquare_colors.purple[400]};
    }
  }
`;

// 컴포넌트
export const SearchBox: React.FC<SearchBoxProps> = ({
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
