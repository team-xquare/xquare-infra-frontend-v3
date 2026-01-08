import styled from "@emotion/styled";
import { Xquare_colors } from "../../../styles/colors";

const SEARCH_CONTAINER_GAP = "5px";
const SEARCH_CONTAINER_PADDING = "20px";
const SEARCH_HEIGHT = "40px";
const INPUT_FONT_SIZE = "14px";
const INPUT_FONT_WEIGHT = "400";
const INPUT_LETTER_SPACING = "-0.32px";
const INPUT_LINE_HEIGHT = "140%";
const INPUT_PADDING = "12px 0";
const INPUT_TRANSITION = "border-bottom 0.1s linear";
const PLACEHOLDER_OPACITY = "0.6";

export const SideBarDiv = styled.div`
  align-items: center;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  gap: ${SEARCH_CONTAINER_GAP};
  padding: ${SEARCH_CONTAINER_PADDING};
`;

export const SideBarSearch = styled.section`
  align-items: center;
  align-self: stretch;
  display: flex;
  height: ${SEARCH_HEIGHT};
`;

export const SideBarSearchInput = styled.input`
  background: transparent;
  border: none;
  border-bottom: 1px solid ${Xquare_colors.purple[600]};
  color: ${Xquare_colors.white};
  font-size: ${INPUT_FONT_SIZE};
  font-style: normal;
  font-weight: ${INPUT_FONT_WEIGHT};
  letter-spacing: ${INPUT_LETTER_SPACING};
  line-height: ${INPUT_LINE_HEIGHT};
  padding: ${INPUT_PADDING};
  transition: ${INPUT_TRANSITION};
  width: 100%;
  cursor: text;

  &:disabled {
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${Xquare_colors.white};
    opacity: ${PLACEHOLDER_OPACITY};
  }

  &:focus {
    outline: none;
  }

  &:hover {
    border-bottom: 1px solid ${Xquare_colors.white};
    color: ${Xquare_colors.white};
  }
`;
