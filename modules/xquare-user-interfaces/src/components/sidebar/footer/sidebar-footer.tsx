import { memo } from "react";
import {
  SideBarFooter,
  SideBarFooterDiv,
  SideBarFooterNameSpan,
  SideBarFooterProjectDiv,
} from "./sidebar-footer-style";

interface SidebarFooterProps {
  name: string;
  project: string;
}

function SidebarFooterComponent({ name, project }: SidebarFooterProps) {
  return (
    <SideBarFooter>
      <SideBarFooterDiv>
        <SideBarFooterNameSpan>{name}</SideBarFooterNameSpan>
        <SideBarFooterProjectDiv>{project}</SideBarFooterProjectDiv>
      </SideBarFooterDiv>
    </SideBarFooter>
  );
}

export const SidebarFooter = memo(SidebarFooterComponent);
