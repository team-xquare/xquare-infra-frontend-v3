import { useEffect, useState } from "react";
import { getNoticeDetail, NoticeDetail } from "@xquare/utils";

export function useNoticeDetail(noticeId?: number) {
  const [data, setData] = useState<NoticeDetail | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const isValidId = typeof noticeId === "number" && !Number.isNaN(noticeId);

  useEffect(() => {
    if (!isValidId) {
      return;
    }

    let cancelled = false;

    getNoticeDetail(noticeId!)
      .then((res) => {
        if (!cancelled) {
          setData(res);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err : new Error("공지 상세 조회 실패")
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [noticeId, isValidId]);

  const computedError = !isValidId
    ? new Error("유효한 공지 ID가 필요합니다.")
    : error;

  const isCurrentData = data && isValidId ? data.id === noticeId : false;
  const loading = isValidId && !isCurrentData && !computedError;

  return { data: isCurrentData ? data : null, loading, error: computedError };
}
