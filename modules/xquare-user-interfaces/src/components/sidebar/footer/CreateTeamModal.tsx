import { createPortal } from "react-dom";
import styled from "@emotion/styled";
import { useCallback, useState } from "react";
import Xquare_colors from "../../../styles";
import { useCreateTeam } from "./../../../../../xquare-hooks/index";
import type { CreateTeamRequest } from "./../../../../../xquare-utils/index";

interface CreateTeamModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateTeamModal = ({
  onClose,
  onSuccess,
}: CreateTeamModalProps) => {
  const [teamName, setTeamName] = useState("");
  const [teamType, setTeamType] = useState<"club" | "team" | "individual">(
    "club"
  );
  const { create, loading, error } = useCreateTeam();

  const handleBackgroundClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget && !loading) onClose();
    },
    [onClose, loading]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!teamName.trim()) {
        alert("팀 이름을 입력해주세요.");
        return;
      }

      const request: CreateTeamRequest = {
        name: teamName.trim(),
        type: teamType,
        initialMembers: [], // 빈 배열로 현재 사용자만 admin으로 추가
      };

      const teamId = await create(request);

      if (teamId) {
        alert(`팀 "${teamName}"이 성공적으로 생성되었습니다!`);
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      }
    },
    [teamName, teamType, create, onSuccess, onClose]
  );

  return createPortal(
    <ModalBackground onClick={handleBackgroundClick}>
      <ModalContent>
        <Title>새 팀 만들기</Title>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="teamName">팀 이름</Label>
            <Input
              id="teamName"
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="팀 이름을 입력하세요"
              disabled={loading}
              autoFocus
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="teamType">팀 유형</Label>
            <Select
              id="teamType"
              value={teamType}
              onChange={(e) =>
                setTeamType(e.target.value as "club" | "team" | "individual")
              }
              disabled={loading}
            >
              <option value="club">동아리</option>
              <option value="team">팀</option>
              <option value="individual">개인</option>
            </Select>
          </FormGroup>

          {error && <ErrorText>{error.message}</ErrorText>}

          <ButtonGroup>
            <CancelButton type="button" onClick={onClose} disabled={loading}>
              취소
            </CancelButton>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? "생성 중..." : "생성"}
            </SubmitButton>
          </ButtonGroup>
        </Form>
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
  cursor: default;
`;

const ModalContent = styled.div`
  width: 360px;
  background: #ffffff;
  padding: 28px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
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

const Title = styled.h3`
  margin: 0;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: ${Xquare_colors.purple[400]};
  cursor: default;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  cursor: default;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: default;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${Xquare_colors.gray[700]};
  cursor: default;
`;

const Input = styled.input`
  padding: 12px 14px;
  border: 1.5px solid ${Xquare_colors.gray[300]};
  border-radius: 10px;
  font-size: 15px;
  transition: 0.18s;
  outline: none;

  &:focus {
    border-color: ${Xquare_colors.purple[400]};
    box-shadow: 0 0 0 3px rgba(123, 43, 226, 0.1);
  }

  &:disabled {
    background: ${Xquare_colors.gray[100]};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${Xquare_colors.gray[400]};
  }
`;

const Select = styled.select`
  padding: 12px 14px;
  border: 1.5px solid ${Xquare_colors.gray[300]};
  border-radius: 10px;
  font-size: 15px;
  transition: 0.18s;
  outline: none;
  background: white;
  cursor: pointer;

  &:focus {
    border-color: ${Xquare_colors.purple[400]};
    box-shadow: 0 0 0 3px rgba(123, 43, 226, 0.1);
  }

  &:disabled {
    background: ${Xquare_colors.gray[100]};
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  text-align: center;
  color: ${Xquare_colors.red[500]};
  font-size: 14px;
  margin: 0;
  cursor: default;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  cursor: default;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px 0;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: 0.18s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

const CancelButton = styled(Button)`
  background: ${Xquare_colors.gray[200]};
  color: ${Xquare_colors.gray[700]};

  &:hover:not(:disabled) {
    background: ${Xquare_colors.gray[300]};
  }
`;

const SubmitButton = styled(Button)`
  background: ${Xquare_colors.purple[400]};
  color: #fff;

  &:hover:not(:disabled) {
    background: #6c28d9;
  }
`;
