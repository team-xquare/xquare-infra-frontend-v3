import { createPortal } from "react-dom";
import styled from "@emotion/styled";
import { useCallback } from "react";
import Xquare_colors from "../../styles";

interface TeamModalProps {
  onSelectTeam: (teamName: string, teamId: number) => void;
  onClose: () => void;
}

export const TeamModal = ({ onSelectTeam, onClose }: TeamModalProps) => {
  // 더미 데이터
  const teams = [
    { id: 0, name: "XQUARE", type: "club" },
    { id: 1, name: "DMS", type: "club" },
    { id: 2, name: "PICK", type: "club" },
  ];

  const handleBackgroundClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  return createPortal(
    <ModalBackground onClick={handleBackgroundClick}>
      <ModalContent>
        <Title>프로젝트 선택</Title>

        <TeamList>
          {teams.map((team) => (
            <TeamItem
              key={team.id}
              onClick={() => {
                localStorage.setItem("selectedTeamId", String(team.id));
                onSelectTeam(team.name, team.id);
                onClose();
              }}
            >
              {team.name}
            </TeamItem>
          ))}
        </TeamList>

        <CloseButton onClick={onClose}>닫기</CloseButton>
      </ModalContent>
    </ModalBackground>,
    document.body,
  );
};

const ModalBackground = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  width: 300px;
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
  animation: fadeIn 0.22s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(7px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h3`
  margin: 0;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: ${Xquare_colors.purple[400]};
`;

const TeamList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TeamItem = styled.li`
  padding: 14px 16px;
  border-radius: 12px;
  background: #f8f5ff;
  border: 1.5px solid #ece3ff;
  cursor: pointer;
  font-size: 15px;
  transition: 0.18s;
  color: #4a3d66;

  &:hover {
    background: #efe7ff;
    border-color: ${Xquare_colors.purple[400]};
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CloseButton = styled.button`
  padding: 12px 0;
  border: none;
  border-radius: 12px;
  background: ${Xquare_colors.purple[400]};
  color: #fff;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: 0.18s;

  &:hover {
    background: #6c28d9;
  }

  &:active {
    transform: scale(0.98);
  }
`;
