/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { Xquare_colors } from "../../styles/colors";

// 타입 정의
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  width?: string;
  height?: string;
  type?: "button" | "submit" | "reset";
}

// 스타일 정의
const StyledButton = styled.button<ButtonProps>`
  width: ${({ width }) => width || "300px"};
  height: ${({ height }) => height || "60px"};

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid ${Xquare_colors.gray[500]};
  border-radius: 15px;
  background-color: ${Xquare_colors.white};
  color: ${Xquare_colors.gray[500]};

  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    color: ${Xquare_colors.purple[500]};
    border: 1px solid ${Xquare_colors.purple[500]};
  }

  &:active {
    color: ${Xquare_colors.purple[600]};
    border: 1px solid ${Xquare_colors.purple[600]};
    background-color: ${Xquare_colors.purple[200]};
  }

  &:disabled {
    background-color: ${Xquare_colors.gray[300]};
    color: ${Xquare_colors.gray[300]};
    cursor: not-allowed;
  }
`;

// 컴포넌트
export const Button_square: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  width,
  height,
  type = "button",
}) => {
  return (
    <StyledButton
      width={width}
      height={height}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </StyledButton>
  );
};
