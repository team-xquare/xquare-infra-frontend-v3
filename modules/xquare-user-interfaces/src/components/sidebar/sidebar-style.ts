import styled from "@emotion/styled";
import { Xquare_colors } from "../../styles/colors";

const SIDEBAR_WIDTH = "280px";
const ANIMATION_DURATION = "0.3s";
const CONTENT_GAP = "10px";
const NAV_GAP = "5px";
const NAV_PADDING = "20px";

export const SidebarContainer = styled.div`
  display: flex;
  position: fixed;
  flex-direction: column;
  height: 100vh;
  width: ${SIDEBAR_WIDTH};
  transition: width ${ANIMATION_DURATION} ease;
  cursor: default;
`;

export const SidebarContent = styled.div`
  background-color: ${Xquare_colors.purple[700]};
  display: flex;
  flex-direction: column;
  gap: ${CONTENT_GAP};
  height: 100%;
`;

export const SidebarNavContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  height: 100%;
`;

export const SidebarNavItemWrapper = styled.div`
  width: 100%;
`;

export const SidebarNavContainer = styled.nav`
  align-items: flex-start;
  align-self: stretch;
  background-color: ${Xquare_colors.purple[700]};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${NAV_GAP};
  padding: ${NAV_PADDING};
  width: ${SIDEBAR_WIDTH};
`;

export const SubItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  margin-left: 16px;
  gap: 6px;
`;

interface SubItemProps {
  isActive?: boolean;
}

export const SubItem = styled.button<SubItemProps>`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background-color: ${(props) =>
    props.isActive ? Xquare_colors.purple[600] : "transparent"};
  color: ${(props) =>
    props.isActive ? Xquare_colors.white : Xquare_colors.gray[100]};
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;

  &:hover {
    background-color: ${Xquare_colors.purple[600]};
    color: ${Xquare_colors.white};
  }
`;
