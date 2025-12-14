import { memo, useState } from "react";
import { TeamModal } from "../../teammodal";
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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(project);

  return (
    <>
      <SideBarFooter>
        <SideBarFooterDiv>
          <SideBarFooterNameSpan>{name}</SideBarFooterNameSpan>

          <SideBarFooterProjectDiv onClick={() => setModalOpen(true)}>
            {selectedProject}
          </SideBarFooterProjectDiv>
        </SideBarFooterDiv>
      </SideBarFooter>

      {modalOpen && (
        <TeamModal
          onSelectTeam={(teamName) => {
            setSelectedProject(teamName);
          }}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

export const SidebarFooter = memo(SidebarFooterComponent);
