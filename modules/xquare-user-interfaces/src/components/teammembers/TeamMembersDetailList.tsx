import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { LoadingOverlay } from "../loadingoverlays";
import { ErrorMessage } from "../errormessage";
import { Typography } from "../typography";
import { Xquare_colors } from "../../styles";
import { getUserDetail } from "@xquare/utils";
import type { UserDetail } from "@xquare/utils";
import { TrashCanIcon } from "@xquare/user-interfaces";

function maskEmail(email?: string | null) {
  if (!email) return "이메일 없음";
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const maskedLocal = "*".repeat(Math.max(local.length, 1));
  return `${maskedLocal}@${domain}`;
}

interface TeamMembersDetailListProps {
  members: Array<{ userId: number; role: string }>;
  loading: boolean;
  error: unknown;
  isCurrentUserAdmin?: boolean;
  onDeleteMember?: (userId: number) => void;
  deleting?: boolean;
}

export function TeamMembersDetailList({
  members,
  loading,
  error,
  isCurrentUserAdmin = false,
  onDeleteMember,
  deleting = false,
}: TeamMembersDetailListProps) {
  const [userDetails, setUserDetails] = useState<
    Record<number, UserDetail | null>
  >({});
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  useEffect(() => {
    if (!members || members.length === 0) {
      setUserDetails({});
      setDetailsError(null);
      setDetailsLoading(false);
      return;
    }

    let cancelled = false;
    setDetailsLoading(true);
    setDetailsError(null);

    (async () => {
      try {
        const results = await Promise.all(
          members.map((m) =>
            getUserDetail(m.userId)
              .then((detail) => ({ userId: m.userId, detail }))
              .catch(() => ({ userId: m.userId, detail: null })),
          ),
        );
        if (cancelled) return;
        const map: Record<number, UserDetail | null> = {};
        results.forEach(({ userId, detail }) => {
          map[userId] = detail;
        });
        setUserDetails(map);
      } catch {
        if (cancelled) return;
        setDetailsError("팀원 정보를 불러오지 못했습니다.");
      } finally {
        if (!cancelled) setDetailsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [members]);

  if (loading || detailsLoading) {
    return <LoadingOverlay isLoading={true} />;
  }
  if (error && error instanceof Error) {
    return <ErrorMessage message={error.message} />;
  }
  if (detailsError) {
    return <ErrorMessage message={detailsError} />;
  }
  if (!members || members.length === 0) {
    return <Typography>팀원이 없습니다.</Typography>;
  }

  return (
    <MembersList>
      {members.map((member) => {
        const detail = userDetails[member.userId];
        return (
          <MemberItem key={member.userId}>
            <MemberInfo>
              <MemberHeader>
                <MemberName>
                  {detail
                    ? `${detail.name} (${detail.username})`
                    : `유저 ID: ${member.userId}`}
                </MemberName>
                <MemberRoleBadge
                  variant={member.role === "admin" ? "admin" : "contributor"}
                >
                  {member.role === "admin" ? "관리자" : "멤버"}
                </MemberRoleBadge>
              </MemberHeader>
              {detail && (
                <MemberMeta>
                  {maskEmail(detail.email)} · 학번 {detail.studentNumber}
                </MemberMeta>
              )}
            </MemberInfo>
            {isCurrentUserAdmin && member.role === "contributor" && (
              <TrashIconButton
                onClick={() => onDeleteMember?.(member.userId)}
                disabled={deleting}
              >
                <TrashIcon src={TrashCanIcon} alt="멤버 제거" />
              </TrashIconButton>
            )}
          </MemberItem>
        );
      })}
    </MembersList>
  );
}

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
  color: #888;
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

const TrashIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const TrashIconButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
`;
