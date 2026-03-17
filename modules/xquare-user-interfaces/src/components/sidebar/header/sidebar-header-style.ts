import styled from "@emotion/styled";
import { Xquare_colors } from "../../../styles/Colors.styles";

const HEADER_PADDING = "20px";
const TEXT_FONT_SIZE = "13px";
const TEXT_FONT_WEIGHT = "600";

export const SideBarHeader = styled.header`
  align-items: center;
  align-self: stretch;
  background-color: ${Xquare_colors.purple[700]};
  display: flex;
  justify-content: space-between;
  min-width: 280px;
  cursor: default;
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
  font-size: ${TEXT_FONT_SIZE};
  font-style: normal;
  font-weight: ${TEXT_FONT_WEIGHT};
  line-height: normal;
  text-align: center;
`;

export const SideBarHeaderDescriptionDiv = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SideBarHeaderDescriptionDivSpan = styled.span`
  color: ${Xquare_colors.white};
  font-size: ${TEXT_FONT_SIZE};
  font-style: normal;
  font-weight: ${TEXT_FONT_WEIGHT};
  line-height: normal;
  text-align: center;
`;
