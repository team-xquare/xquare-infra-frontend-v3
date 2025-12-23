const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

interface TokenPair {
  accessToken: string | null;
  refreshToken: string | null;
}

// 메모리 캐시
let tokenCache: TokenPair = {
  accessToken: null,
  refreshToken: null,
};

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

/* 토큰 쌍 설정 */
export const setTokens = (accessToken: string, refreshToken: string): void => {
  if (!accessToken || !refreshToken) {
    console.warn("[Token] 유효한 토큰이 필요합니다.");
    return;
  }

  tokenCache = { accessToken, refreshToken };
  saveToStorage(tokenCache);
};

/* 액세스 토큰만 갱신 */
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
  // 메모리 캐시 확인
  if (tokenCache.accessToken) {
    return tokenCache.accessToken;
  }

  // 캐시 없으면 localStorage에서 로드
  const storage = getFromStorage();
  if (storage.accessToken) {
    tokenCache.accessToken = storage.accessToken;
    return storage.accessToken;
  }

  return null;
};

/* 리프레시 토큰 조회 */
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

/* 모든 토큰 삭제 (로그아웃) */
export const clearAllTokens = (): void => {
  tokenCache = { accessToken: null, refreshToken: null };
  saveToStorage(tokenCache);
};

/* 액세스 토큰 존재 여부 */
export const hasAccessToken = (): boolean => {
  return !!getAccessToken();
};

/* 리프레시 토큰 존재 여부 */
export const hasRefreshToken = (): boolean => {
  return !!getRefreshToken();
};

/* 인증 상태 확인 */
export const isAuthenticated = (): boolean => {
  return hasAccessToken() && hasRefreshToken();
};

/* 인증 체크 및 리다이렉트 */
export const requireAuth = (): boolean => {
  const authenticated = isAuthenticated();

  if (!authenticated) {
    console.warn("[Token] 인증되지 않음. 로그인 페이지로 이동");
    window.location.href = "/login";
    return false;
  }

  return true;
};
