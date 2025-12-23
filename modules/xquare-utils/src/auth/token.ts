// 토큰 키 상수 (useAuthGuard에서도 동일하게 사용)
export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";

// 토큰 타입 정의
interface TokenPair {
  accessToken: string | null;
  refreshToken: string | null;
}

// 메모리 캐시: 빠른 조회를 위해 localStorage와 별도로 메모리에 토큰 유지
let tokenCache: TokenPair = {
  accessToken: null,
  refreshToken: null,
};

// localStorage에서 토큰 읽기 (다른 탭에서의 변경사항 감지용)
const getFromStorage = (): TokenPair => {
  try {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    return {
      accessToken: accessToken || null,
      refreshToken: refreshToken || null,
    };
  } catch (error) {
    console.error("[Token] localStorage 읽기 실패:", error);
    return { accessToken: null, refreshToken: null };
  }
};

const saveToStorage = (data: TokenPair): void => {
  // 메모리 캐시와 localStorage 동시 저장
  // 빈 값(null/undefined)일 시 localStorage에서 제거하여 상태 일관성 유지
  try {
    if (data.accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
      console.log("[Token] 액세스 토큰 저장됨");
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }

    if (data.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      console.log("[Token] 리프레시 토큰 저장됨");
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  } catch (error) {
    console.error("토큰 저장 실패:", error);
  }
};

/* 토큰 설정 */
export const setTokens = (accessToken: string, refreshToken: string): void => {
  if (!accessToken || !refreshToken) {
    console.warn("[Token] 유효한 토큰이 필요합니다.");
    return;
  }

  tokenCache = { accessToken, refreshToken };
  saveToStorage(tokenCache);
};

/* 액세스 토큰만 갱신 (토큰 재발급 시 호출) */
export const setAccessToken = (token: string): void => {
  if (!token) {
    console.warn("유효한 액세스 토큰이 필요합니다.");
    return;
  }

  tokenCache.accessToken = token;
  saveToStorage(tokenCache);
};

/* 액세스 토큰 조회 */
export const getAccessToken = (): string | null => {
  if (tokenCache.accessToken) {
    return tokenCache.accessToken;
  }

  const storage = getFromStorage();
  if (storage.accessToken) {
    tokenCache.accessToken = storage.accessToken;
    return storage.accessToken;
  }

  return null;
};

/* 리프레시 토큰 조회 (토큰 재발급 시에 사용) */
export const getRefreshToken = (): string | null => {
  // 메모리 캐시 확인
  if (tokenCache.refreshToken) {
    return tokenCache.refreshToken;
  }

  // 캐시 없으면 localStorage에서 로드
  const storage = getFromStorage();
  if (storage.refreshToken) {
    tokenCache.refreshToken = storage.refreshToken;
    return storage.refreshToken;
  }

  return null;
};

/* 모든 토큰 삭제 (로그아웃 시 호출) */
export const clearAllTokens = (): void => {
  tokenCache = { accessToken: null, refreshToken: null };
  saveToStorage(tokenCache);
  console.log("[Token] 모든 토큰이 삭제되었습니다.");
  console.log("[Token] 인증 상태 : 토큰 없음");
};

/* 액세스 토큰 존재 여부 확인 */
export const hasAccessToken = (): boolean => {
  return !!getAccessToken();
};

/* 리프레시 토큰 존재 여부 확인 */
export const hasRefreshToken = (): boolean => {
  return !!getRefreshToken();
};

/* 전체 인증 상태 확인 (accessToken + refreshToken 모두 필요) */
export const isAuthenticated = (): boolean => {
  return hasAccessToken() && hasRefreshToken();
};
