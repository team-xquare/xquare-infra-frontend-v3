import styled from "@emotion/styled";
import { useCallback, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import {
  Xquare_colors,
  Input_basic,
  Button_square,
  ErrorMessage,
  Typography,
  Subtitle,
} from "@xquare/user-interfaces";
import {
  useAuthGuard,
  useUpdateTeam,
  useUpdateTeamMembers,
} from "@xquare/hooks";
import { getSelectedTeam } from "@xquare/utils";

export default function TeamPage() {
  useAuthGuard();

  const selectedTeam = useMemo(() => getSelectedTeam(), []);

  // Team Info State
  const [teamName, setTeamName] = useState(selectedTeam?.name ?? "");
  const [teamType, setTeamType] = useState<"club" | "team" | "individual">(
    (selectedTeam?.type as "club" | "team" | "individual") ?? "team"
  );
  const [infoError, setInfoError] = useState<string | null>(null);
  const [infoSuccess, setInfoSuccess] = useState<string | null>(null);

  // Team Members State
  const [memberUserId, setMemberUserId] = useState("");
  const [memberRole, setMemberRole] = useState<"admin" | "member">("member");
  const [teamMembers, setTeamMembers] = useState<
    Array<{ id: number; role: "admin" | "member" }>
  >([]);
  const [membersError, setMembersError] = useState<string | null>(null);
  const [membersSuccess, setMembersSuccess] = useState<string | null>(null);

  const { mutate: updateTeam, loading: isUpdatingTeam } = useUpdateTeam();
  const { mutate: updateTeamMembers, loading: isUpdatingMembers } =
    useUpdateTeamMembers();

  const handleUpdateTeamInfo = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setInfoError(null);
      setInfoSuccess(null);

      if (!selectedTeam) {
        setInfoError("선택된 팀이 없습니다. 먼저 팀을 선택해주세요.");
        return;
      }

      if (!teamName.trim()) {
        setInfoError("팀 이름을 입력해주세요.");
        return;
      }

      try {
        await updateTeam(selectedTeam.id, {
          name: teamName,
          type: teamType,
        });
        setInfoSuccess("팀 정보가 성공적으로 수정되었습니다.");
      } catch (err) {
        setInfoError(
          err instanceof Error ? err.message : "팀 정보 수정에 실패했습니다."
        );
      }
    },
    [selectedTeam, teamName, teamType, updateTeam]
  );

  const handleAddMember = useCallback(() => {
    setMembersError(null);

    if (!memberUserId.trim()) {
      setMembersError("사용자 ID를 입력해주세요.");
      return;
    }

    const userId = Number(memberUserId);
    if (isNaN(userId)) {
      setMembersError("유효한 사용자 ID를 입력해주세요.");
      return;
    }

    if (teamMembers.some((m) => m.id === userId)) {
      setMembersError("이미 추가된 사용자입니다.");
      return;
    }

    setTeamMembers((prev) => [...prev, { id: userId, role: memberRole }]);
    setMemberUserId("");
    setMemberRole("member");
  }, [memberUserId, memberRole, teamMembers]);

  const handleRemoveMember = useCallback((userId: number) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== userId));
  }, []);

  const handleSubmitMembers = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setMembersError(null);
      setMembersSuccess(null);

      if (!selectedTeam) {
        setMembersError("선택된 팀이 없습니다. 먼저 팀을 선택해주세요.");
        return;
      }

      if (teamMembers.length === 0) {
        setMembersError("추가할 팀원이 없습니다.");
        return;
      }

      try {
        await updateTeamMembers(selectedTeam.id, {
          members: teamMembers,
        });
        setTeamMembers([]);
        setMembersSuccess("팀원이 성공적으로 추가되었습니다.");
      } catch (err) {
        setMembersError(
          err instanceof Error ? err.message : "팀원 추가에 실패했습니다."
        );
      }
    },
    [selectedTeam, teamMembers, updateTeamMembers]
  );

  return (
    <>
      <Helmet>
        <title>XQUARE | Team</title>
      </Helmet>
      <Container>
        <ContentsArea>
          <Subtitle title="팀 관리" subTitle="팀 정보 수정 및 팀원 관리" />
        </ContentsArea>

        {!selectedTeam ? (
          <Typography>
            선택된 팀이 없습니다. 사이드바 하단에서 팀을 선택해주세요.
          </Typography>
        ) : (
          <ContentWrapper>
            <FormContainer>
              <SectionTitle>팀 정보 수정</SectionTitle>
              {infoSuccess && <SuccessMessage>{infoSuccess}</SuccessMessage>}

              <form onSubmit={handleUpdateTeamInfo}>
                <InputArea>
                  <Typography size="5x" weight="semiBold">
                    팀 이름
                  </Typography>
                  <Input_basic
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="팀 이름을 입력하세요"
                    disabled={isUpdatingTeam}
                    width="300px"
                    height="35px"
                  />
                </InputArea>

                <FormGroup>
                  <Label htmlFor="teamType">팀 유형</Label>
                  <Select
                    value={teamType}
                    onChange={(e) =>
                      setTeamType(
                        e.target.value as "club" | "team" | "individual"
                      )
                    }
                    disabled={isUpdatingTeam}
                  >
                    <option value="club">동아리</option>
                    <option value="team">팀</option>
                    <option value="individual">개인</option>
                  </Select>
                </FormGroup>

                {infoError && <ErrorMessage message={infoError} />}

                <ButtonGroup>
                  <Button_square
                    onClick={() => {}}
                    disabled={isUpdatingTeam}
                    type="submit"
                    width="150px"
                    height="45px"
                  >
                    {isUpdatingTeam ? "저장 중..." : "팀 정보 저장"}
                  </Button_square>
                </ButtonGroup>
              </form>
            </FormContainer>

            {/* 팀원 관리 섹션 */}
            <FormContainer>
              <SectionTitle>팀원 관리</SectionTitle>
              {membersSuccess && (
                <SuccessMessage>{membersSuccess}</SuccessMessage>
              )}

              <form onSubmit={handleSubmitMembers}>
                <FormGroup>
                  <Label>팀원 추가</Label>
                  <InputRow>
                    <StyledInput
                      placeholder="사용자 ID를 입력하세요"
                      value={memberUserId}
                      onChange={(e) => setMemberUserId(e.target.value)}
                      disabled={isUpdatingMembers}
                    />
                    <InlineText>님을</InlineText>
                    <Select
                      value={memberRole}
                      onChange={(e) =>
                        setMemberRole(e.target.value as "admin" | "member")
                      }
                      disabled={isUpdatingMembers}
                    >
                      <option value="member">멤버</option>
                      <option value="admin">관리자</option>
                    </Select>
                    <InlineText>역할로</InlineText>
                    <Button_square
                      onClick={handleAddMember}
                      disabled={isUpdatingMembers}
                      type="button"
                      width="80px"
                      height="42px"
                    >
                      추가
                    </Button_square>
                  </InputRow>
                </FormGroup>

                {teamMembers.length > 0 && (
                  <FormGroup>
                    <Label>추가할 팀원 목록 ({teamMembers.length}명)</Label>
                    <MembersList>
                      {teamMembers.map((member) => (
                        <MemberItem key={member.id}>
                          <MemberInfo>
                            <MemberUserId>사용자 ID: {member.id}</MemberUserId>
                            <MemberRole>
                              역할:{" "}
                              {member.role === "admin" ? "관리자" : "멤버"}
                            </MemberRole>
                          </MemberInfo>
                          <Button_square
                            onClick={() => handleRemoveMember(member.id)}
                            disabled={isUpdatingMembers}
                            type="button"
                            width="80px"
                            height="40px"
                          >
                            제거
                          </Button_square>
                        </MemberItem>
                      ))}
                    </MembersList>
                  </FormGroup>
                )}

                {membersError && <ErrorMessage message={membersError} />}

                <ButtonGroup>
                  <Button_square
                    onClick={() => {}}
                    disabled={isUpdatingMembers || teamMembers.length === 0}
                    type="submit"
                    width="180px"
                    height="45px"
                  >
                    {isUpdatingMembers
                      ? "저장 중..."
                      : `팀원 저장 (${teamMembers.length}명)`}
                  </Button_square>
                </ButtonGroup>
              </form>
            </FormContainer>
          </ContentWrapper>
        )}
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  padding: 10px 40px;
  cursor: default;
`;

const ContentsArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  padding-bottom: 10px;
  border-bottom: 2px solid ${Xquare_colors.gray[300]};
  width: 100%;
  margin-bottom: 15px;
  cursor: default;
`;

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 24px;
  align-items: flex-start;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 20px;
`;

const FormContainer = styled.div`
  flex: 1;
  background: #ffffff;
  padding: 32px;
  border-radius: 12px;
  border: 1px solid ${Xquare_colors.gray[300]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin-left: 5px;
`;

const Select = styled.select`
  padding: 12px;
  border: 1.5px solid ${Xquare_colors.gray[300]};
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  background: #ffffff;

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
  margin-top: 37px;
  justify-content: flex-end;
`;

const SuccessMessage = styled.div`
  padding: 12px;
  background: ${Xquare_colors.green[400]};
  color: #ffffff;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 16px;
`;

const InputRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: nowrap;
`;

const StyledInput = styled(Input_basic)`
  flex: 1;
  min-width: 0;
`;

const InlineText = styled.span`
  color: ${Xquare_colors.gray[500]};
  font-size: 13px;
  line-height: 1.4;
  white-space: nowrap;
`;

const MembersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
`;

const MemberItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f8f5ff;
  border-radius: 8px;
  border: 1.5px solid #ece3ff;
`;

const MemberInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MemberUserId = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
`;

const MemberRole = styled.span`
  font-size: 13px;
  color: ${Xquare_colors.gray[500]};
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 3px 5px;
  width: 100%;
  height: 40px;
  border-bottom: 2px solid ${Xquare_colors.gray[300]};
  cursor: default;
  margin-bottom: 20px;
`;
