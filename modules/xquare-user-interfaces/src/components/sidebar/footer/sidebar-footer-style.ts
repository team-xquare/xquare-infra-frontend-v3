import styled from "@emotion/styled";
import { Xquare_colors } from "../../../styles/colors";

const FOOTER_PADDING = "20px";
const NAME_FONT_SIZE = "13px";
const NAME_FONT_WEIGHT = "600";
const PROJECT_GAP = "10px";
const PROJECT_PADDING = "5px 10px";
const PROJECT_BORDER_RADIUS = "28px";
const PROJECT_FONT_SIZE = "12px";
const PROJECT_FONT_WEIGHT = "700";

export const SideBarFooter = styled.footer`
  align-items: center;
  background-color: ${Xquare_colors.purple[700]};
  display: flex;
`;

export const SideBarFooterDiv = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: space-between;
  padding: ${FOOTER_PADDING};
  width: 100%;
`;

export const SideBarFooterNameSpan = styled.span`
  color: ${Xquare_colors.white};
  font-size: ${NAME_FONT_SIZE};
  font-style: normal;
  font-weight: ${NAME_FONT_WEIGHT};
  line-height: normal;
  text-align: center;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const SideBarFooterProjectDiv = styled.div`
  align-items: center;
  background: ${Xquare_colors.purple[300]};
  border: 1px solid ${Xquare_colors.purple[500]};
  border-radius: ${PROJECT_BORDER_RADIUS};
  display: flex;
  gap: ${PROJECT_GAP};
  justify-content: center;
  padding: ${PROJECT_PADDING};
  color: ${Xquare_colors.purple[500]};
  font-size: ${PROJECT_FONT_SIZE};
  font-style: normal;
  font-weight: ${PROJECT_FONT_WEIGHT};
  line-height: normal;
  text-align: right;
`;
