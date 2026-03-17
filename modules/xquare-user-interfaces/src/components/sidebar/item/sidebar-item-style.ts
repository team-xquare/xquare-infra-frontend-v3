import styled from "@emotion/styled";
import { Xquare_colors } from "../../../styles/Colors.styles";

const ITEM_PADDING = "10px 0";
const LABEL_FONT_SIZE = "15px";
const LABEL_FONT_WEIGHT = "600";
const TRANSITION_DURATION = "0.05s";

interface SideBarMenuItemProps {
  isActive: boolean;
}

interface SideBarMenuItemLabelProps {
  isActive?: boolean;
}

export const SideBarMenuItem = styled.div<SideBarMenuItemProps>`
  align-items: center;
  background-color: ${Xquare_colors.purple[700]};
  display: flex;
  padding: ${ITEM_PADDING};
  width: 100%;
  cursor: pointer;
`;

export const SideBarMenuItemLabel = styled.button<SideBarMenuItemLabelProps>`
  appearance: none;
  background: transparent;
  border: 0;
  color: ${(props) =>
    props.isActive ? Xquare_colors.white : Xquare_colors.purple[400]};
  cursor: pointer;
  display: block;
  font-size: ${LABEL_FONT_SIZE};
  font-style: normal;
  font-weight: ${LABEL_FONT_WEIGHT};
  line-height: normal;
  margin-bottom: 20px;
  padding: 0;
  text-align: left;
  transition: color ${TRANSITION_DURATION} linear;
  width: 100%;

  &:hover,
  &:focus-visible {
    color: ${Xquare_colors.white};
  }

  &:focus-visible {
    outline: 2px solid ${Xquare_colors.white};
    outline-offset: 2px;
  }
`;
