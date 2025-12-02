import styled from "@emotion/styled";
import { Xquare_colors } from "../../../styles/colors";

const HEADER_PADDING = "20px";
const TEXT_FONT_SIZE = "12px";
const TEXT_FONT_WEIGHT = "600";
const DESC_MIN_WIDTH = "100px";
const DESC_MAX_WIDTH = "280px";
const ANIMATION_DURATION = "0.3s";

interface SideBarHeaderDescriptionDivProps {
  isExpanded?: boolean;
}

export const SideBarHeader = styled.header`
  align-items: center;
  align-self: stretch;
  background-color: ${Xquare_colors.purple[700]};
  display: flex;
  justify-content: space-between;
  min-width: 300px;
`;

export const SideBarHeaderDiv = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: space-between;
  padding: ${HEADER_PADDING};
  width: 100%;
`;

export const SideBarHeaderNameSpan = styled.span`
  color: ${Xquare_colors.white};
  font-family: "Pretendard";
  font-size: ${TEXT_FONT_SIZE};
  font-style: normal;
  font-weight: ${TEXT_FONT_WEIGHT};
  line-height: normal;
  text-align: center;
`;

export const SideBarHeaderDescriptionDiv = styled.div<SideBarHeaderDescriptionDivProps>`
  max-width: ${(props) => (props.isExpanded ? DESC_MAX_WIDTH : DESC_MIN_WIDTH)};
  overflow: hidden;
  text-overflow: ellipsis;
  transition: max-width ${ANIMATION_DURATION} ease;
  white-space: nowrap;
`;

export const SideBarHeaderDescriptionDivSpan = styled.span`
  color: ${Xquare_colors.white};
  font-family: "Pretendard";
  font-size: ${TEXT_FONT_SIZE};
  font-style: normal;
  font-weight: ${TEXT_FONT_WEIGHT};
  line-height: normal;
  text-align: center;
`;
