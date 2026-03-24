import { createPortal } from "react-dom";
import styled from "@emotion/styled";
import { useCallback, useState } from "react";
import Xquare_colors from "../../styles";
import { saveSelectedTeam, type Team } from "@xquare/utils";
import { useCreateTeam } from "@xquare/hooks";
import type { CreateTeamRequest } from "@xquare/utils";

interface TeamModalProps {
  teams?: Team[];
  loading?: boolean;
  error?: Error | null;
  onSelectTeam: (teamName: string, teamId: number) => void;
  onClose: () => void;
  onTeamCreated?: () => void;
}

export const TeamModal = ({
  teams,
  loading,
  error,
  onSelectTeam,
  onClose,
  onTeamCreated,
}: TeamModalProps) => {
  const [activeTab, setActiveTab] = useState<"select" | "create">("select");
  const [teamName, setTeamName] = useState("");
  const [teamType, setTeamType] = useState<"club" | "team" | "individual">(
    "team",
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const {
    create: createTeam,
    loading: isCreating,
    error: createError,
  } = useCreateTeam();

  const handleBackgroundClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget && !isCreating) onClose();
    },
    [onClose, isCreating],
  );

  const handleCreateTeam = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setValidationError(null);

      const trimmedName = teamName.trim();

      if (!trimmedName) {
        setValidationError("팀 이름을 입력해주세요.");
        return;
      }

      if (trimmedName.length < 3) {
        setValidationError("팀 이름은 최소 3자 이상이어야 합니다.");
        return;
      }

      if (trimmedName.length > 45) {
        setValidationError("팀 이름은 최대 45자까지 가능합니다.");
        return;
      }

      const lowercasePattern = /^[a-z]+$/;
      if (!lowercasePattern.test(trimmedName)) {
        setValidationError("팀 이름은 알파벳 소문자만 사용 가능합니다.");
        return;
      }

      const request: CreateTeamRequest = {
        name: trimmedName,
        type: teamType,
        initialMembers: [],
      };

      const teamId = await createTeam(request);
      if (teamId) {
        setTeamName("");
        setTeamType("team");
        setValidationError(null);
        setActiveTab("select");
        if (onTeamCreated) {
          onTeamCreated();
        }
      }
    },
    [teamName, teamType, createTeam, onTeamCreated],
  );

  return createPortal(
    <ModalBackground onClick={handleBackgroundClick}>
      <ModalContent>
        <TabContainer>
          <Tab
            active={activeTab === "select"}
            onClick={() => setActiveTab("select")}
          >
            팀 선택
          </Tab>
          <Tab
            active={activeTab === "create"}
            onClick={() => setActiveTab("create")}
          >
            팀 생성
          </Tab>
        </TabContainer>

        {activeTab === "select" && (
          <>
            {error && <ErrorText>팀 목록을 불러올 수 없습니다.</ErrorText>}

            <TeamList>
              {!loading && !error && teams?.length === 0 && (
                <EmptyText>소속된 팀이 없습니다.</EmptyText>
              )}
              {teams?.map((team: Team) => (
                <TeamItem
                  key={team.id}
                  onClick={() => {
                    saveSelectedTeam({
                      id: team.id,
                      name: team.name,
                      type: team.type,
                    });
                    onSelectTeam(team.name, team.id);
                    onClose();
                  }}
                >
                  <TeamName>{team.name}</TeamName>
                  <TeamType>{team.type}</TeamType>
                </TeamItem>
              ))}
            </TeamList>

            <FooterContainer>
              <CloseButton onClick={onClose}>닫기</CloseButton>
            </FooterContainer>
          </>
        )}

        {activeTab === "create" && (
          <>
            <CreateForm onSubmit={handleCreateTeam}>
              <FormGroup>
                <Label>팀 이름 *</Label>
                <Input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="팀 이름을 입력하세요"
                  disabled={isCreating}
                  autoFocus
                />
              </FormGroup>

              <FormGroup>
                <Label>팀 유형 *</Label>
                <Select
                  value={teamType}
                  onChange={(e) =>
                    setTeamType(
                      e.target.value as "club" | "team" | "individual",
                    )
                  }
                  disabled={isCreating}
                >
                  <option value="team">팀</option>
                  <option value="club">동아리</option>
                  <option value="individual">개인</option>
                </Select>
              </FormGroup>

              {validationError && <ErrorText>{validationError}</ErrorText>}
              {createError && <ErrorText>{createError.message}</ErrorText>}

              <ButtonGroup>
                <CancelButton
                  type="button"
                  onClick={onClose}
                  disabled={isCreating}
                >
                  취소
                </CancelButton>
                <SubmitButton type="submit" disabled={isCreating}>
                  {isCreating ? "생성 중..." : "생성"}
                </SubmitButton>
              </ButtonGroup>
            </CreateForm>
          </>
        )}
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
  cursor: default;
`;

const ModalContent = styled.div`
  width: 380px;
  background: #ffffff;
  padding: 28px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
  animation: fadeIn 0.22s ease-out;
  cursor: default;

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

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  padding: 4px;
  background: #f5f5f5;
  border-radius: 12px;
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) =>
    props.active ? Xquare_colors.purple[400] : "transparent"};
  color: ${(props) => (props.active ? "#ffffff" : "#666666")};

  &:hover {
    background: ${(props) =>
      props.active ? Xquare_colors.purple[500] : "#e8e8e8"};
  }
`;

const TeamList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TeamItem = styled.div`
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
  cursor: default;
  flex: 1;
`;

const TeamType = styled.span`
  font-size: 12px;
  color: ${Xquare_colors.gray[500]};
  text-transform: uppercase;
  cursor: default;
`;

const ErrorText = styled.p`
  text-align: center;
  color: ${Xquare_colors.red[500]};
  font-size: 14px;
  margin: 0;
  cursor: default;
`;

const EmptyText = styled.p`
  text-align: center;
  color: ${Xquare_colors.gray[500]};
  font-size: 14px;
  margin: 0;
  cursor: default;
`;

const FooterContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const CreateForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #333333;
`;

const Input = styled.input`
  padding: 12px;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${Xquare_colors.purple[400]};
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${Xquare_colors.purple[400]};
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 12px 0;
  border: 1.5px solid #e0e0e0;
  border-radius: 12px;
  background: #ffffff;
  color: #666666;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: 0.18s;

  &:hover {
    background: #f5f5f5;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  flex: 1;
  padding: 12px 0;
  border: none;
  border-radius: 12px;
  background: ${Xquare_colors.purple[400]};
  color: #ffffff;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: 0.18s;

  &:hover {
    background: ${Xquare_colors.purple[500]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CloseButton = styled.button`
  flex: 1;
  padding: 12px 0;
  border: none;
  border-radius: 12px;
  background: ${Xquare_colors.gray[300]};
  color: #fff;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: 0.18s;

  &:hover {
    background: ${Xquare_colors.gray[400]};
  }

  &:active {
    transform: scale(0.98);
  }
`;
