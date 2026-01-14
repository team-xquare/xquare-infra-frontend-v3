import styled from "@emotion/styled";
import { Xquare_colors } from "../../../styles/colors";

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

export const SideBarMenuItemLabel = styled.span<SideBarMenuItemLabelProps>`
  color: ${(props) =>
    props.isActive ? Xquare_colors.white : Xquare_colors.purple[400]};
  font-size: ${LABEL_FONT_SIZE};
  font-style: normal;
  font-weight: ${LABEL_FONT_WEIGHT};
  line-height: normal;
  transition: color ${TRANSITION_DURATION} linear;
  width: 100%;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    color: ${Xquare_colors.white};
  }
`;
