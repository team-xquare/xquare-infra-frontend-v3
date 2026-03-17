import { getAccessToken, isAuthenticated } from "../auth/token";
import { fetchWithTimeout } from "../fetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 공지 목록 응답 항목 타입
export interface NoticeSummary {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

interface NoticeListApiResponse {
  success: boolean;
  data: {
    notices: NoticeSummary[];
  };
}

// 공지 목록 조회 파라미터 (page는 0부터 시작)
export interface ListNoticesParams {
  page?: number;
  limit?: number;
}

/**
 * 공지 목록 조회
 * - 경로: GET {API_BASE_URL}/notices
 * - 헤더: Authorization Bearer, Content-Type: application/json
 */
export const listNotices = async ({
  page = 0,
  limit = 10,
}: ListNoticesParams = {}): Promise<NoticeSummary[]> => {
  // 인증 상태 확인
  if (!isAuthenticated()) {
    console.warn("[listNotices] 인증되지 않은 상태입니다.");
    throw new Error("인증되지 않은 상태입니다.");
  }

  const accessToken = getAccessToken();
  if (!accessToken) {
    console.warn("[listNotices] AccessToken이 없습니다.");
    throw new Error("AccessToken이 없습니다.");
  }

  const url = new URL(`${API_BASE_URL}/notices`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));

  /* console.log(
    `[listNotices] 요청 시작: url=${url.toString()}, page=${page}, limit=${limit}`
  ); */

  try {
    const response = await fetchWithTimeout(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "*/*",
      },
    });

    if (!response.ok) {
      console.error(
        `[listNotices] HTTP 오류: status=${response.status}, statusText=${response.statusText}`,
      );
      throw new Error(`공지 목록 조회 실패 (HTTP ${response.status})`);
    }

    const result = (await response.json()) as NoticeListApiResponse;
    if (!result.success) {
      console.error("[listNotices] 응답 성공 플래그가 false입니다.", result);
      throw new Error("공지 목록 조회 실패");
    }

    /* console.log(
      `[listNotices] 요청 성공: notices=${result.data.notices.length}개`
    ); */
    return result.data.notices;
  } catch (error) {
    console.error("[listNotices] 요청 실패", error);
    throw error instanceof Error
      ? error
      : new Error("공지 목록 조회 중 알 수 없는 오류가 발생했습니다.");
  }
};
