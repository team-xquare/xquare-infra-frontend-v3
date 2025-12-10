/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { Xquare_colors } from "../../styles/colors";

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}

// 스타일 정의
const StyledButton = styled.button<ButtonProps>`
  width: auto;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 11px;

  font-family: "Pretendard";
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 5px 10px;
  outline: none;

  background-color: ${(props) =>
    props.active ? Xquare_colors.purple[100] : "white"};
  color: ${(props) =>
    props.active ? Xquare_colors.purple[400] : Xquare_colors.gray[500]};
  border: ${(props) =>
    props.active
      ? `2px solid ${Xquare_colors.purple[400]}`
      : `2px solid ${Xquare_colors.white}`};

  &:hover {
    color: ${(props) =>
      props.active ? Xquare_colors.purple[400] : Xquare_colors.purple[500]};
  }
`;

// 컴포넌트
export const NavItem: React.FC<ButtonProps> = ({
  children,
  active = false,
  onClick,
}) => {
  return +(
    <StyledButton active={active} onClick={onClick} type="button">
      {children}
    </StyledButton>
  );
};
