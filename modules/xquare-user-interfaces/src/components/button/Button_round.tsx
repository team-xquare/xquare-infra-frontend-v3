/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { Xquare_colors } from "../../styles/colors";
import type { ButtonProps } from "./Button.types";

// 스타일 정의
const StyledButton = styled.button<ButtonProps>`
  width: ${({ width }) => width || "120px"};
  height: ${({ height }) => height || "40px"};

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid ${Xquare_colors.gray[500]};
  border-radius: 24px;
  background-color: ${Xquare_colors.white};
  color: ${Xquare_colors.gray[500]};

  font-family: "Pretendard";
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    color: ${({ variant }) =>
      variant === "danger"
        ? Xquare_colors.red[500]
        : Xquare_colors.purple[500]};
    border: 1px solid
      ${({ variant }) =>
        variant === "danger"
          ? Xquare_colors.red[500]
          : Xquare_colors.purple[500]};
  }

  &:active {
    color: ${({ variant }) =>
      variant === "danger"
        ? Xquare_colors.red[600]
        : Xquare_colors.purple[600]};
    border: 1px solid
      ${({ variant }) =>
        variant === "danger"
          ? Xquare_colors.red[600]
          : Xquare_colors.purple[600]};
  }

  &:disabled {
    border: 1px solid ${Xquare_colors.gray[300]};
    color: ${Xquare_colors.gray[300]};
    cursor: not-allowed;
  }
`;

// 컴포넌트
export const Button_round: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  width,
  height,
  type = "button",
  variant = "default",
}) => {
  return (
    <StyledButton
      width={width}
      height={height}
      onClick={onClick}
      disabled={disabled}
      type={type}
      variant={variant}
    >
      {children}
    </StyledButton>
  );
};
