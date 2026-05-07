import styled from "@emotion/styled";
import { useCallback, useState, useEffect, useRef } from "react";
import type { FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import {
  Xquare_colors,
  Input_basic,
  Button_square,
  ErrorMessage,
  Typography,
  Subtitle,
  LoadingOverlay,
} from "@xquare/user-interfaces";
import {
  useAuthGuard,
  useDeleteTeamMembers,
  useUpdateTeam,
  useUpdateTeamMembers,
  useSearchUsers,
  useTeamDetail,
} from "@xquare/hooks";
import { getSelectedTeam, checkUser, SELECTED_TEAM_EVENT } from "@xquare/utils";
import type { SelectedTeamInfo, UserSearchResult } from "@xquare/utils";
import { TeamMembersDetailList } from "@xquare/user-interfaces";

function maskEmail(email?: string | null) {
  if (!email) return "이메일 없음";
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const maskedLocal = "*".repeat(Math.max(local.length, 1));
  return `${maskedLocal}@${domain}`;
}

export default function TeamPage() {
  useAuthGuard();

  const [selectedTeam, setSelectedTeam] = useState<SelectedTeamInfo | null>(
    () => getSelectedTeam(),
  );

  const teamId = selectedTeam?.id;

  const {
    data: teamDetail,
    loading: teamDetailLoading,
    error: teamDetailError,
  } = useTeamDetail(teamId);

  const [teamName, setTeamName] = useState(selectedTeam?.name ?? "");
  const [teamType, setTeamType] = useState<"club" | "team" | "individual">(
    (selectedTeam?.type as "club" | "team" | "individual") ?? "team",
  );
  const [infoError, setInfoError] = useState<string | null>(null);
  const [infoSuccess, setInfoSuccess] = useState<string | null>(null);

  const [searchName, setSearchName] = useState("");
  const [memberRole, setMemberRole] = useState<"admin" | "contributor">(
    "contributor",
  );
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
  const [teamSwitchLoading, setTeamSwitchLoading] = useState(false);
  const teamSwitchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSyncedRef = useRef(false);
  const {
    search,
    results: searchResults,
    error: searchError,
  } = useSearchUsers();

  useEffect(() => {
    document.title = "XQUARE | Team";
  }, []);

  useEffect(() => {
    const triggerTeamSwitchOverlay = () => {
      if (teamSwitchTimerRef.current) {
        clearTimeout(teamSwitchTimerRef.current);
      }
      setTeamSwitchLoading(true);
      teamSwitchTimerRef.current = setTimeout(() => {
        setTeamSwitchLoading(false);
        teamSwitchTimerRef.current = null;
      }, 1000);
    };

    const syncTeam = () => {
      const team = getSelectedTeam();
      setSelectedTeam((prevTeam) => {
        const prevId = prevTeam?.id ?? null;
        const nextId = team?.id ?? null;
        if (hasSyncedRef.current && prevId !== nextId) {
          triggerTeamSwitchOverlay();
        }
        return team;
      });
      setTeamName(team?.name ?? "");
      setTeamType((team?.type as "club" | "team" | "individual") ?? "team");
      setTeamMembers([]);
      setMemberRole("contributor");
      setSearchName("");
      setInfoError(null);
      setInfoSuccess(null);
      setMembersError(null);
      setMembersSuccess(null);
      if (!hasSyncedRef.current) {
        hasSyncedRef.current = true;
      }
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "xquare:selectedTeam") {
        syncTeam();
      }
    };

    const handleTeamEvent: EventListener = () => {
      syncTeam();
    };

    syncTeam();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(SELECTED_TEAM_EVENT, handleTeamEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(SELECTED_TEAM_EVENT, handleTeamEvent);
      if (teamSwitchTimerRef.current) {
        clearTimeout(teamSwitchTimerRef.current);
        teamSwitchTimerRef.current = null;
      }
    };
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
  const { mutate: deleteMembers, loading: isDeletingMembers } =
    useDeleteTeamMembers();

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

      try {
        await updateTeam(selectedTeam.id, {
          name: trimmedName,
          type: teamType,
        });
        setInfoSuccess("팀 정보가 성공적으로 수정되었습니다.");
      } catch (err) {
        setInfoError(
          err instanceof Error ? err.message : "팀 정보 수정에 실패했습니다.",
        );
      }
    },
    [selectedTeam, teamName, teamType, updateTeam],
  );

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

      if (teamDetail?.members?.some((m) => m.userId === user.id)) {
        setMembersError("이미 팀에 속한 사용자입니다.");
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
    [currentUserId, memberRole, teamDetail?.members, teamMembers],
  );

  const handleRemoveMember = useCallback((userId: number) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== userId));
  }, []);

  const handleDeleteMember = useCallback(
    async (userId: number) => {
      if (!selectedTeam) {
        setMembersError("선택된 팀이 없습니다. 먼저 팀을 선택해주세요.");
        return;
      }

      const confirmed = window.confirm("정말 이 팀원을 삭제하시겠습니까?");
      if (!confirmed) {
        return;
      }

      setMembersError(null);
      setMembersSuccess(null);

      try {
        const result = await deleteMembers(selectedTeam.id, { ids: [userId] });
        if (result) {
          setMembersSuccess("팀원이 성공적으로 삭제되었습니다.");
        }
      } catch (err) {
        setMembersError(
          err instanceof Error ? err.message : "팀원 삭제에 실패했습니다.",
        );
      }
    },
    [deleteMembers, selectedTeam],
  );

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
          err instanceof Error ? err.message : "팀원 추가에 실패했습니다.",
        );
      }
    },
    [selectedTeam, teamMembers, updateTeamMembers],
  );

  const isCurrentUserTeamAdmin =
    currentUserId !== null &&
    (teamDetail?.members ?? []).some(
      (member) => member.userId === currentUserId && member.role === "admin",
    );

  return (
    <>
      <Helmet>
        <title>XQUARE | Team</title>
      </Helmet>
      <Container>
        <LoadingOverlay isLoading={teamSwitchLoading} />
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
                <FormGroupA>
                  <Input_basic
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="팀 이름을 입력하세요"
                    disabled={true}
                    width="160px"
                    height="35px"
                  />
                  <InlineText> 의 팀 유형을 </InlineText>
                  <Select
                    value={teamType}
                    onChange={(e) =>
                      setTeamType(
                        e.target.value as "club" | "team" | "individual",
                      )
                    }
                    disabled={isUpdatingTeam}
                  >
                    <option value="club">동아리</option>
                    <option value="team">팀</option>
                    <option value="individual">개인</option>
                  </Select>
                  <InlineText> 으로 변경</InlineText>
                </FormGroupA>
                {infoError && <ErrorMessage message={infoError} />}
                <ButtonGroup>
                  <Button_square
                    onClick={() => {}}
                    disabled={isUpdatingTeam}
                    type="submit"
                    width="150px"
                    height="45px"
                  >
                    {isUpdatingTeam ? "저장 중..." : "수정하기"}
                  </Button_square>
                </ButtonGroup>
              </form>
              <SectionTitle style={{ marginTop: 30 }}>팀원 목록</SectionTitle>
              <TeamMembersDetailList
                members={teamDetail?.members || []}
                loading={teamDetailLoading}
                error={teamDetailError}
                isCurrentUserAdmin={isCurrentUserTeamAdmin}
                currentUserId={currentUserId}
                onDeleteMember={handleDeleteMember}
                deleting={isDeletingMembers}
              />
            </FormContainer>
            <FormContainer>
              <SectionTitle>팀원 관리</SectionTitle>
              {membersSuccess && (
                <SuccessMessage>{membersSuccess}</SuccessMessage>
              )}
              <form onSubmit={handleSubmitMembers}>
                <FormGroup>
                  <Label>사용자 검색</Label>
                  <InputRow>
                    <Input_basic
                      placeholder="사용자 이름을 입력하세요"
                      value={searchName}
                      onChange={(e) => {
                        const value = e.target.value;
                        const trimmed = value.trim();
                        setSearchName(value);
                        setMembersError(null);
                        setMembersSuccess(null);

                        if (!trimmed) return;
                        void search(trimmed).catch((err) => {
                          console.error("사용자 검색 실패:", err);
                        });
                      }}
                      disabled={isUpdatingMembers}
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
                {searchName.trim().length > 0 && searchResults.length > 0 && (
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
                              {maskEmail(user.email)} · 학번{" "}
                              {user.studentNumber}
                            </SearchResultMeta>
                          </SearchResultInfo>
                          <Button_square
                            onClick={() => handleAddMember(user)}
                            disabled={
                              isUpdatingMembers ||
                              (currentUserId !== null &&
                                user.id === currentUserId) ||
                              teamDetail?.members?.some(
                                (m) => m.userId === user.id,
                              )
                            }
                            type="button"
                            width="80px"
                            height="40px"
                          >
                            선택
                          </Button_square>
                        </SearchResultItem>
                      ))}
                    </SearchResultsList>
                  </FormGroup>
                )}
                {searchError?.message && (
                  <ErrorMessage message={searchError.message} />
                )}
                {teamMembers.length > 0 && (
                  <FormGroup>
                    <Label>추가할 팀원 목록 ({teamMembers.length}명)</Label>
                    <MembersList>
                      {teamMembers.map((member) => (
                        <MemberItem key={member.id}>
                          <MemberInfo>
                            <MemberHeader>
                              <MemberName>
                                {member.name ?? "이름 없음"} (
                                {member.username ?? member.id})
                              </MemberName>
                              <MemberRoleBadge
                                variant={
                                  member.role === "admin"
                                    ? "admin"
                                    : "contributor"
                                }
                              >
                                {member.role === "admin" ? "관리자" : "멤버"}
                              </MemberRoleBadge>
                            </MemberHeader>
                            <MemberMeta>
                              {maskEmail(member.email ?? null)}
                              {member.studentNumber !== undefined
                                ? ` · 학번 ${member.studentNumber}`
                                : ""}
                            </MemberMeta>
                          </MemberInfo>
                          <Button_square
                            onClick={() => handleRemoveMember(member.id)}
                            disabled={isUpdatingMembers}
                            type="button"
                            width="80px"
                            height="40px"
                          >
                            삭제
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
                      : `저장하기 (${teamMembers.length}명)`}
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
  height: 100vh;
  width: 100%;
  padding: 12px 40px;
  padding-top: 22px;
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

const FormGroupA = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 11px;
  width: 100%;
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
  margin-top: 30px;
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
  margin-top: 35px;
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

const MemberHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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

const MemberRoleBadge = styled.span<{ variant: "admin" | "contributor" }>`
  padding: 4px 8px;
  border-radius: 999px;
  background: ${(props) =>
    props.variant === "admin"
      ? Xquare_colors.purple[100]
      : Xquare_colors.gray[300]};
  color: ${(props) =>
    props.variant === "admin"
      ? Xquare_colors.purple[500]
      : Xquare_colors.gray[500]};
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
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
