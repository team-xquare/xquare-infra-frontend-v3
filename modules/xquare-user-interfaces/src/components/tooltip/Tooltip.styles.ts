/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { Xquare_colors } from "../../styles/colors";

const fadeIn = keyframes`
  from {
    opacity: 0;
    visibility: hidden;
  }
  to {
    opacity: 1;
    visibility: visible;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    visibility: visible;
  }
  to {
    opacity: 0;
    visibility: hidden;
  }
`;

export const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const TooltipTrigger = styled.button<{
  $isIcon?: boolean;
}>`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: inherit;
  color: inherit;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  &:focus {
    outline: 2px solid ${Xquare_colors.blue[500]};
    outline-offset: 2px;
    border-radius: 4px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const TooltipPopover = styled.div<{
  $position: "top" | "bottom" | "left" | "right";
  $isVisible: boolean;
}>`
  position: absolute;
  z-index: 1000;
  background-color: #0f0f0f;
  color: ${Xquare_colors.white};
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.6;
  width: max-content;
  max-width: 320px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);

  animation: ${({ $isVisible }) => ($isVisible ? fadeIn : fadeOut)} 0.2s
    ease-in-out;

  ${({ $position }) => {
    switch ($position) {
      case "top":
        return `
          bottom: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%);
        `;
      case "bottom":
        return `
          top: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%);
        `;
      case "left":
        return `
          right: calc(100% + 12px);
          top: 50%;
          transform: translateY(-50%);
        `;
      case "right":
        return `
          left: calc(100% + 12px);
          top: 50%;
          transform: translateY(-50%);
        `;
      default:
        return "";
    }
  }}
`;

export const TooltipContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const TooltipText = styled.span`
  font-size: 13px;
  line-height: 1.6;
  word-break: keep-all;
  letter-spacing: 0px;
`;
