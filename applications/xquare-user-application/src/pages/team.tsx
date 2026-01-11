import styled from "@emotion/styled";
import { useCallback, useMemo, useState, useEffect } from "react";
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
  useSearchUsers,
} from "@xquare/hooks";
import { getSelectedTeam, checkUser } from "@xquare/utils";
import type { UserSearchResult } from "@xquare/utils";

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
  const [searchName, setSearchName] = useState("");
  const [memberRole, setMemberRole] = useState<"admin" | "contributor">("contributor");
  const [teamMembers, setTeamMembers] = useState<
    Array<{
      id: number;
      role: "admin" | "contributor";
      name?: string;
      username?: string;
      email?: string;
      studentNumber?: number;
    }>
  >([]);
  const [membersError, setMembersError] = useState<string | null>(null);
  const [membersSuccess, setMembersSuccess] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const {
    search,
    results: searchResults,
    loading: searching,
    error: searchError,
  } = useSearchUsers();

  useEffect(() => {
    document.title = "XQUARE | Team";
  }, []);

  useEffect(() => {
    checkUser()
      .then((me) => setCurrentUserId(me.id))
      .catch((err) => {
        console.error("[TeamPage] 현재 사용자 조회 실패", err);
      });
  }, []);

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

      const trimmedName = teamName.trim();

      if (!trimmedName) {
        setInfoError("팀 이름을 입력해주세요.");
        return;
      }

      if (trimmedName.length < 3) {
        setInfoError("팀 이름은 최소 3자 이상이어야 합니다.");
        return;
      }

      if (trimmedName.length > 45) {
        setInfoError("팀 이름은 최대 45자까지 가능합니다.");
        return;
      }

      const lowercasePattern = /^[a-z]+$/;
      if (!lowercasePattern.test(trimmedName)) {
        setInfoError("팀 이름은 알파벳 소문자만 사용 가능합니다.");
        return;
      }

      try {
        await updateTeam(selectedTeam.id, {
          name: trimmedName,
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

  const handleSearchUsers = useCallback(async () => {
    setMembersError(null);
    setMembersSuccess(null);

    const trimmed = searchName.trim();
    if (!trimmed) {
      setMembersError("검색할 이름을 입력해주세요.");
      return;
    }

    try {
      await search(trimmed);
    } catch (err) {
      setMembersError(
        err instanceof Error ? err.message : "유저 검색에 실패했습니다."
      );
    }
  }, [search, searchName]);

  useEffect(() => {
    const trimmed = searchName.trim();
    if (!trimmed) return;

    const timer = setTimeout(() => {
      handleSearchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [handleSearchUsers, searchName]);

  const handleAddMember = useCallback(
    (user: UserSearchResult) => {
      setMembersError(null);
      setMembersSuccess(null);

      if (currentUserId !== null && user.id === currentUserId) {
        setMembersError("본인은 추가할 수 없습니다.");
        return;
      }

      if (teamMembers.some((m) => m.id === user.id)) {
        setMembersError("이미 추가된 사용자입니다.");
        return;
      }

      setTeamMembers((prev) => [
        ...prev,
        {
          id: user.id,
          role: memberRole,
          name: user.name,
          username: user.username,
          email: user.email,
          studentNumber: user.studentNumber,
        },
      ]);
    },
    [currentUserId, memberRole, teamMembers]
  );

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
          members: teamMembers.map((m) => ({ id: m.id, role: m.role })),
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
                    disabled={true}
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
                  <Label>팀원 검색</Label>
                  <InputRow>
                    <Input_basic
                      placeholder="사용자 이름을 입력하세요"
                      value={searchName}
                      onChange={(e) => {
                        setSearchName(e.target.value);
                        setMembersError(null);
                        setMembersSuccess(null);
                      }}
                      disabled={isUpdatingMembers || searching}
                      width="200px"
                    />

                    <InlineText>을(를)</InlineText>
                    <RoleSelect
                      value={memberRole}
                      onChange={(e) =>
                        setMemberRole(e.target.value as "admin" | "contributor")
                      }
                      disabled={isUpdatingMembers}
                    >
                      <option value="contributor">멤버</option>
                      <option value="admin">관리자</option>
                    </RoleSelect>
                    <InlineText>역할로 추가</InlineText>
                  </InputRow>
                </FormGroup>

                {searchResults.length > 0 && (
                  <FormGroup>
                    <Label>검색 결과 ({searchResults.length}명)</Label>
                    <SearchResultsList>
                      {searchResults.map((user) => (
                        <SearchResultItem key={user.id}>
                          <SearchResultInfo>
                            <SearchResultName>
                              {user.name} ({user.username})
                            </SearchResultName>
                            <SearchResultMeta>
                              {user.email} · 학번 {user.studentNumber}
                            </SearchResultMeta>
                          </SearchResultInfo>
                          <Button_square
                            onClick={() => handleAddMember(user)}
                            disabled={
                              isUpdatingMembers ||
                              (currentUserId !== null &&
                                user.id === currentUserId)
                            }
                            type="button"
                            width="80px"
                            height="40px"
                          >
                            추가
                          </Button_square>
                        </SearchResultItem>
                      ))}
                    </SearchResultsList>
                  </FormGroup>
                )}

                {searchError && <ErrorMessage message={searchError.message} />}

                {teamMembers.length > 0 && (
                  <FormGroup>
                    <Label>추가할 팀원 목록 ({teamMembers.length}명)</Label>
                    <MembersList>
                      {teamMembers.map((member) => (
                        <MemberItem key={member.id}>
                          <MemberInfo>
                            <MemberName>
                              {member.name ?? "이름 없음"} (
                              {member.username ?? member.id})
                            </MemberName>
                            <MemberMeta>
                              {member.email ?? "이메일 없음"}
                              {member.studentNumber !== undefined
                                ? ` · 학번 ${member.studentNumber}`
                                : ""}
                            </MemberMeta>
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
  flex-wrap: wrap;
`;

const InlineText = styled.span`
  color: ${Xquare_colors.gray[500]};
  font-size: 15px;
  line-height: 1.4;
  white-space: nowrap;
`;

const RoleSelect = styled(Select)`
  min-width: 120px;
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

const MemberName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #000000;
`;

const MemberMeta = styled.span`
  font-size: 12px;
  color: ${Xquare_colors.gray[500]};
`;

const MemberRole = styled.span`
  font-size: 13px;
  color: ${Xquare_colors.gray[600]};
`;

const SearchResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SearchResultItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border: 1px solid ${Xquare_colors.gray[300]};
  border-radius: 8px;
  background: #ffffff;
  gap: 12px;
`;

const SearchResultInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SearchResultName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #000000;
`;

const SearchResultMeta = styled.span`
  font-size: 12px;
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
