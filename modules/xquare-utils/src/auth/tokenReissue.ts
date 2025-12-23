//========================================
// 토큰 재발급 설정
//========================================

/* 토큰 재발급 간격 (밀리초) */
const REISSUE_INTERVAL = 14 * 60 * 1000; // 14분

/* API 엔드포인트 */
const getReissueEndpoint = (): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) {
    throw new Error(
      "[Auth-reissue] VITE_API_BASE_URL 환경 변수가 설정되지 않았습니다"
    );
  }
  return `${baseUrl}/auth/refresh`;
};

/* localStorage 키 */
const LAST_REISSUE_TIME_KEY = "lastReissueTime";
const REFRESH_TOKEN_KEY = "refreshToken";
const ACCESS_TOKEN_KEY = "accessToken";

/* 재발급 진행 중 플래그 */
let isReissuing = false;

/* Interval ID */
let intervalId: NodeJS.Timeout | null = null;

/* 초기 타임아웃 ID */
let initialTimeoutId: NodeJS.Timeout | null = null;

/* 스토리지 이벤트 핸들러 */
let storageHandler: ((event: StorageEvent) => void) | null = null;

//========================================
// 토큰 재발급 로직
//========================================

/* 액세스 토큰 재발급 */
export async function reissueAccessToken(): Promise<boolean> {
  if (isReissuing) {
    console.log("[Auth-reissue] 재발급 진행 중, 중복 방지");
    return false;
  }

  isReissuing = true;

  try {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      console.error("[Auth-reissue] 실패: refreshToken 없음");
      stopTokenAutoReissue();
      return false;
    }

    console.log(`[Auth-reissue] 시도: 시간=${new Date().toLocaleTimeString()}`);

    const response = await fetch(getReissueEndpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.error("[Auth-reissue] 실패: 리프레시 토큰 만료 (401)");
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        stopTokenAutoReissue();

        window.location.href = "/login";
        return false;
      }

      console.error(`[Auth-reissue] 실패: HTTP ${response.status}`);
      return false;
    }

    const data = await response.json();

    if (!data?.success) {
      console.error("[Auth-reissue] 실패: success 필드가 false", data);
      return false;
    }

    if (!data?.data?.accessToken || !data?.data?.refreshToken) {
      console.error("[Auth-reissue] 실패: 응답 데이터 없음", data);
      return false;
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, data.data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.data.refreshToken);
    localStorage.setItem(LAST_REISSUE_TIME_KEY, String(Date.now()));

    console.log(`[Auth-reissue] 성공: 시간=${new Date().toLocaleTimeString()}`);

    return true;
  } catch (error) {
    console.error(
      "[Auth-reissue] 실패:",
      error instanceof Error ? error.message : "알 수 없는 오류"
    );
    return false;
  } finally {
    isReissuing = false;
  }
}

//========================================
// Interval 관리
//========================================

/* 토큰 자동 재발급 시작 */
export function startTokenAutoReissue(): void {
  if (intervalId || initialTimeoutId) {
    console.log("[Auth-reissue] 이미 실행 중, 중복 방지");
    return;
  }

  const lastReissueTime = parseInt(
    localStorage.getItem(LAST_REISSUE_TIME_KEY) || "0",
    10
  );
  const now = Date.now();
  const elapsed = now - lastReissueTime;
  const remaining = Math.max(REISSUE_INTERVAL - elapsed, 0);

  console.log(
    `[Auth-reissue] 시작: ${Math.round(remaining / 1000)}초 후 첫 재발급`
  );

  /* 초기 재발급 */
  initialTimeoutId = setTimeout(() => {
    reissueAccessToken();

    intervalId = setInterval(reissueAccessToken, REISSUE_INTERVAL);
    console.log(
      `[Auth-reissue] 주기 설정: ${Math.round(REISSUE_INTERVAL / 60000)}분 간격`
    );

    initialTimeoutId = null;
  }, remaining);

  storageHandler = (event: StorageEvent) => {
    if (event.key === LAST_REISSUE_TIME_KEY && event.newValue) {
      console.log("[Auth-reissue] 다른 탭에서 재발급 감지, 동기화");

      if (initialTimeoutId) {
        clearTimeout(initialTimeoutId);
        initialTimeoutId = null;
      }
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }

      startTokenAutoReissue();
    }
  };

  window.addEventListener("storage", storageHandler);
}

/* 토큰 자동 재발급 중지 */
export function stopTokenAutoReissue(): void {
  if (initialTimeoutId) {
    clearTimeout(initialTimeoutId);
    initialTimeoutId = null;
  }

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  if (storageHandler) {
    window.removeEventListener("storage", storageHandler);
    storageHandler = null;
  }

  console.log("[Auth-reissue] 중지됨");
}

export function isTokenAutoReissueRunning(): boolean {
  return intervalId !== null;
}
