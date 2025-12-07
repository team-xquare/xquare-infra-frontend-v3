import styled from "@emotion/styled";
import { Xquare_colors } from "../../../styles/colors";

const ITEM_PADDING = "10px 0";
const LABEL_FONT_SIZE = "15px";
const LABEL_FONT_WEIGHT = "600";
const TRANSITION_DURATION = "0.05s";
const LABEL_MARGIN_RIGHT = "5px";

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
  font-family: "Pretendard";
  padding: ${ITEM_PADDING};
  width: 100%;
`;

export const SideBarMenuItemWrapper = styled.div`
  width: 100%;
`;

export const SideBarMenuItemLabel = styled.span<SideBarMenuItemLabelProps>`
  color: ${(props) =>
    props.isActive ? Xquare_colors.white : Xquare_colors.purple[600]};
  font-size: ${LABEL_FONT_SIZE};
  font-style: normal;
  font-weight: ${LABEL_FONT_WEIGHT};
  line-height: normal;
  margin-right: ${LABEL_MARGIN_RIGHT};
  transition: color ${TRANSITION_DURATION} linear;
  width: 100%;

  &:hover {
    color: ${Xquare_colors.white};
  }
`;
