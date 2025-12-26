import { getAccessToken, isAuthenticated } from "../auth/token";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface NoticeDetail {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

interface NoticeDetailApiResponse {
  success: boolean;
  data: NoticeDetail;
}

// 공지 상세 조회 유틸리티
// - Authorization 헤더에 액세스 토큰 포함
// - 실패 시 오류 메시지와 함께 throw
export const getNoticeDetail = async (
  noticeId: number
): Promise<NoticeDetail> => {
  // 인증 상태 확인
  if (!isAuthenticated()) {
    console.warn("[getNoticeDetail] 인증되지 않은 상태입니다.");
    throw new Error("인증되지 않은 상태입니다.");
  }

  const accessToken = getAccessToken();
  if (!accessToken) {
    console.warn("[getNoticeDetail] AccessToken이 없습니다.");
    throw new Error("AccessToken이 없습니다.");
  }

  const url = `${API_BASE_URL}/notices/${noticeId}`;

  console.log(`[getNoticeDetail] 요청 시작: url=${url}, noticeId=${noticeId}`);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `[getNoticeDetail] HTTP 오류: status=${response.status}, statusText=${response.statusText}`
      );
      throw new Error(`공지 상세 조회 실패 (HTTP ${response.status})`);
    }

    const result = (await response.json()) as NoticeDetailApiResponse;
    if (!result.success || !result.data) {
      console.error(
        "[getNoticeDetail] 응답 성공 플래그가 false이거나 data가 없습니다.",
        result
      );
      throw new Error("공지 상세 조회 실패");
    }

    console.log(`[getNoticeDetail] 요청 성공: id=${result.data.id}`);
    return result.data;
  } catch (error) {
    console.error("[getNoticeDetail] 요청 실패", error);
    throw error instanceof Error
      ? error
      : new Error("공지 상세 조회 중 알 수 없는 오류가 발생했습니다.");
  }
};
