import { createPortal } from "react-dom";
import styled from "@emotion/styled";
import { useCallback } from "react";
import Xquare_colors from "../../styles";
import { saveSelectedTeam, type Team } from "@xquare/utils";

interface TeamModalProps {
  teams?: Team[];
  loading?: boolean;
  error?: Error | null;
  onSelectTeam: (teamName: string, teamId: number) => void;
  onClose: () => void;
  onCreateTeam?: () => void;
}

export const TeamModal = ({
  teams,
  loading,
  error,
  onSelectTeam,
  onClose,
  onCreateTeam,
}: TeamModalProps) => {
  const handleBackgroundClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  return createPortal(
    <ModalBackground onClick={handleBackgroundClick}>
      <ModalContent>
        <Title>프로젝트 선택</Title>

        {loading && <LoadingText>팀 목록을 불러오는 중...</LoadingText>}
        {error && <ErrorText>팀 목록을 불러올 수 없습니다.</ErrorText>}

        <TeamList>
          {teams?.map((team: Team) => (
            <TeamItem
              key={team.id}
              onClick={() => {
                console.log("[TeamModal] 팀 선택됨:", team);
                saveSelectedTeam({
                  id: team.id,
                  name: team.name,
                  type: team.type,
                });
                console.log(
                  "[TeamModal] onSelectTeam 콜백 호출:",
                  team.name,
                  team.id
                );
                onSelectTeam(team.name, team.id);
                onClose();
              }}
            >
              <TeamName>{team.name}</TeamName>
              <TeamType>{team.type}</TeamType>
            </TeamItem>
          ))}

          {onCreateTeam && (
            <CreateTeamItem onClick={onCreateTeam}>
              <PlusIcon>+</PlusIcon>
              <CreateTeamText>새 팀 만들기</CreateTeamText>
            </CreateTeamItem>
          )}
        </TeamList>

        <CloseButton onClick={onClose}>닫기</CloseButton>
      </ModalContent>
    </ModalBackground>,
    document.body
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
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: #efe7ff;
    border-color: ${Xquare_colors.purple[400]};
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const TeamName = styled.span`
  font-weight: 600;
`;

const TeamType = styled.span`
  font-size: 12px;
  color: ${Xquare_colors.gray[500]};
  text-transform: uppercase;
`;

const LoadingText = styled.p`
  text-align: center;
  color: ${Xquare_colors.gray[500]};
  font-size: 14px;
  margin: 0;
`;

const CreateTeamItem = styled.li`
  padding: 14px 16px;
  border-radius: 12px;
  background: #fff;
  border: 1.5px dashed ${Xquare_colors.purple[300]};
  cursor: pointer;
  font-size: 15px;
  transition: 0.18s;
  color: ${Xquare_colors.purple[400]};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #f8f5ff;
    border-color: ${Xquare_colors.purple[400]};
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const PlusIcon = styled.span`
  font-size: 20px;
  font-weight: bold;
`;

const CreateTeamText = styled.span`
  font-weight: 600;
`;

const ErrorText = styled.p`
  text-align: center;
  color: ${Xquare_colors.red[500]};
  font-size: 14px;
  margin: 0;
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
