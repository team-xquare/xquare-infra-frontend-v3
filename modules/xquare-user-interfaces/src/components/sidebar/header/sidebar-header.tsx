import { memo, useMemo } from "react";
import {
  SideBarHeader,
  SideBarHeaderDescriptionDiv,
  SideBarHeaderDescriptionDivSpan,
  SideBarHeaderDiv,
  SideBarHeaderNameSpan,
} from "./sidebar-header-style";

const HEADER_TITLE = "XQUARE";
const EXPANDED_TEXT = "대덕소프트웨어마이스터고등학교 배포 플랫폼";
const COLLAPSED_TEXT = "DSM 배포 플랫폼";

interface SidebarHeaderProps {
  isExpanded?: boolean;
}

function SidebarHeaderComponent({ isExpanded = false }: SidebarHeaderProps) {
  const descriptionText = useMemo(
    () => (isExpanded ? EXPANDED_TEXT : COLLAPSED_TEXT),
    [isExpanded],
  );

  return (
    <SideBarHeader>
      <SideBarHeaderDiv>
        <SideBarHeaderNameSpan>{HEADER_TITLE}</SideBarHeaderNameSpan>
        <SideBarHeaderDescriptionDiv isExpanded={isExpanded}>
          <SideBarHeaderDescriptionDivSpan>
            {descriptionText}
          </SideBarHeaderDescriptionDivSpan>
        </SideBarHeaderDescriptionDiv>
      </SideBarHeaderDiv>
    </SideBarHeader>
  );
}

export const SidebarHeader = memo(SidebarHeaderComponent);
