import { setTokens, getRefreshToken, clearAllTokens } from "./token";
import { fetchWithTimeout } from "../fetch";

//========================================
// 토큰 재발급 설정
//========================================

/* 토큰 재발급 간격 설정 */
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

/* localStorage 키 (마지막 재발급 시간) */
const LAST_REISSUE_TIME_KEY = "lastReissueTime";

/* CustomEvent 타입 */
export const AUTH_RELOGIN_EVENT = "auth:relogin";

/* 토큰 재발급 API 응답 인터페이스 */
interface TokenReissueResponse {
  success: boolean;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  } | null;
}

//========================================
// TokenReissuer 클래스
//========================================

export interface TokenReissuerOptions {
  // 401 응답(토큰 만료)시 호출될 콜백 함수
  onUnauthorized?: () => void;
  // 실패 시 최대 재시도 횟수 (기본값: 3)
  maxRetries?: number;
  // 기본 지연 시간 (밀리초, 기본값: 1000ms)
  baseDelay?: number;
}

export class TokenReissuer {
  // 재발급 진행 중 여부 (중복 요청 방지)
  private isReissuing = false;
  // 첫 번째 재발급 지연 타이머 ID
  private intervalId: number | null = null;
  // 주기적 재발급 인터벌 타이머 ID
  private initialTimeoutId: number | null = null;
  // 다른 탭의 localStorage 변경 감시 핸들러
  private storageHandler: ((event: StorageEvent) => void) | null = null;
  // 사용자가 제공한 옵션
  private options: TokenReissuerOptions;
  // 재시도 횟수
  private readonly maxRetries: number;
  // 지수 백오프 기본 지연 시간
  private readonly baseDelay: number;

  constructor(options: TokenReissuerOptions = {}) {
    this.options = options;
    this.maxRetries = options.maxRetries ?? 3;
    this.baseDelay = options.baseDelay ?? 1000;
  }

  private async sleep(attempt: number): Promise<void> {
    const exponentialDelay = this.baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 0.3 * exponentialDelay;
    const totalDelay = exponentialDelay + jitter;
    /* console.log(
      `[Auth-reissue] 재시도 대기 중: ${Math.round(totalDelay)}ms (시도 ${attempt + 1})`
    ); */
    return new Promise((resolve) => setTimeout(resolve, totalDelay));
  }

  /* 토큰 재발급 네트워크 요청 (재시도 없이)
   * @returns { success: 요청 성공 여부, shouldRetry: 재시도 가능 여부, data: 응답 데이터 }
   * 401은 shouldRetry=false로 즉시 중단, 다른 에러는 shouldRetry=true로 재시도 수행
   */
  private async attemptReissue(refreshToken: string): Promise<{
    success: boolean;
    shouldRetry: boolean;
    data?: TokenReissueResponse & {
      data: { accessToken: string; refreshToken: string };
    };
  }> {
    try {
      const response = await fetchWithTimeout(getReissueEndpoint(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // 401은 재시도하지 않음
          console.error("[Auth-reissue] 실패: 리프레시 토큰 만료 (401)");
          clearAllTokens();
          this.stop();

          window.dispatchEvent(new CustomEvent(AUTH_RELOGIN_EVENT));

          if (this.options.onUnauthorized) {
            this.options.onUnauthorized();
          }
          return { success: false, shouldRetry: false };
        }

        // 다른 HTTP 오류는 재시도
        console.error(`[Auth-reissue] 실패: HTTP ${response.status}`);
        return { success: false, shouldRetry: true };
      }

      const data = (await response.json()) as TokenReissueResponse;

      if (!data?.success) {
        console.error("[Auth-reissue] 실패: success 필드가 false", data);
        return { success: false, shouldRetry: true };
      }

      if (!data.data?.accessToken || !data.data?.refreshToken) {
        console.error("[Auth-reissue] 실패: 응답 데이터 없음", data);
        return { success: false, shouldRetry: true };
      }

      // 위의 검증으로 accessToken과 refreshToken이 존재함을 확인
      const validData = data as TokenReissueResponse & {
        data: { accessToken: string; refreshToken: string };
      };
      return { success: true, shouldRetry: false, data: validData };
    } catch (error) {
      // 네트워크 오류는 재시도 가능
      console.error(
        "[Auth-reissue] 네트워크 오류:",
        error instanceof Error ? error.message : "알 수 없는 오류"
      );
      return { success: false, shouldRetry: true };
    }
  }

  /* 액세스 토큰 재발급 (재시도 로직 포함)
   * 최대 maxRetries+1 회까지 재시도하며, 각 실패 후 exponential backoff 대기
   * 401 응답은 즉시 중단하고 로그아웃 처리
   * @returns 재발급 성공 여부
   */
  async reissueAccessToken(): Promise<boolean> {
    if (this.isReissuing) {
      // console.log("[Auth-reissue] 재발급 진행 중, 중복 방지");
      return false;
    }

    this.isReissuing = true;

    try {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        console.error("[Auth-reissue] 실패: refreshToken 없음");
        this.stop();
        return false;
      }

      /* console.log(
        `[Auth-reissue] 시도: 시간=${new Date().toLocaleTimeString()}`
      ); */

      // 재시도 로직
      for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
        if (attempt > 0) {
          await this.sleep(attempt - 1);
        }

        /* console.log(
          `[Auth-reissue] 시도 ${attempt + 1}/${this.maxRetries + 1}`
        ); */

        const result = await this.attemptReissue(refreshToken);

        if (result.success && result.data) {
          setTokens(
            result.data.data.accessToken,
            result.data.data.refreshToken
          );
          localStorage.setItem(LAST_REISSUE_TIME_KEY, String(Date.now()));

          /* console.log(
            `[Auth-reissue] 성공: 시간=${new Date().toLocaleTimeString()}`
          ); */
          return true;
        }

        if (!result.shouldRetry) {
          // console.log("[Auth-reissue] 재시도 불가능한 오류, 중단");
          return false;
        }

        if (attempt < this.maxRetries) {
          /* console.log(
            `[Auth-reissue] 재시도 예정 (남은 시도: ${this.maxRetries - attempt})`
          ); */
        } else {
          console.error(
            `[Auth-reissue] 모든 재시도 실패 (총 ${this.maxRetries + 1}회 시도)`
          );
        }
      }

      return false;
    } finally {
      this.isReissuing = false;
    }
  }

  /* 토큰 자동 재발급 시작 */
  start(): void {
    if (this.intervalId || this.initialTimeoutId) {
      // console.log("[Auth-reissue] 이미 실행 중, 중복 방지");
      return;
    }

    // 기존 리스너 제거 (중복 등록 방지)
    if (this.storageHandler) {
      window.removeEventListener("storage", this.storageHandler);
      this.storageHandler = null;
    }

    const lastReissueTime = parseInt(
      localStorage.getItem(LAST_REISSUE_TIME_KEY) || "0",
      10
    );
    const now = Date.now();
    const elapsed = now - lastReissueTime;
    const remaining = Math.max(REISSUE_INTERVAL - elapsed, 0);

    /* console.log(
      `[Auth-reissue] 시작: ${Math.round(remaining / 1000)}초 후 첫 재발급`
    ); */

    // 초기 재발급 (첫 토큰 갱신)
    this.initialTimeoutId = window.setTimeout(async () => {
      try {
        const success = await this.reissueAccessToken();

        if (success) {
          this.intervalId = window.setInterval(
            () => this.reissueAccessToken(),
            REISSUE_INTERVAL
          );
          /* console.log(
            `[Auth-reissue] 주기 설정: ${Math.round(REISSUE_INTERVAL / 60000)}분 간격`
          ); */
        } else {
          console.error(
            "[Auth-reissue] 초기 재발급 실패: 주기적 재발급을 시작하지 않습니다."
          );
        }
      } catch (error) {
        console.error(
          "[Auth-reissue] 초기 재발급 오류:",
          error instanceof Error ? error.message : "알 수 없는 오류"
        );
      } finally {
        this.initialTimeoutId = null;
      }
    }, remaining);

    // 다른 탭에서의 토큰 변경 감지 리스너
    this.storageHandler = (event: StorageEvent) => {
      if (event.key === LAST_REISSUE_TIME_KEY && event.newValue) {
        // console.log("[Auth-reissue] 다른 탭에서 재발급 감지, 동기화");

        if (this.initialTimeoutId) {
          clearTimeout(this.initialTimeoutId);
          this.initialTimeoutId = null;
        }
        if (this.intervalId) {
          clearInterval(this.intervalId);
          this.intervalId = null;
        }

        // 기존 핸들러 제거 후 재시작 (중복 리스너 방지)
        if (this.storageHandler) {
          window.removeEventListener("storage", this.storageHandler);
          this.storageHandler = null;
        }

        this.start();
      }
    };

    window.addEventListener("storage", this.storageHandler);
  }

  /* 토큰 자동 재발급 중지 (로그아웃 시 호출)
   * 모든 타이머와 이벤트 리스너 정리
   */
  stop(): void {
    if (this.initialTimeoutId) {
      clearTimeout(this.initialTimeoutId);
      this.initialTimeoutId = null;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.storageHandler) {
      window.removeEventListener("storage", this.storageHandler);
      this.storageHandler = null;
    }

    // console.log("[Auth-reissue] 중지됨");
  }

  /* 현재 재발급 실행 여부
   * 초기 timeout 또는 주기 interval 중 하나라도 실행 중이면 true
   */
  isRunning(): boolean {
    return this.intervalId !== null || this.initialTimeoutId !== null;
  }
}

//========================================
// 싱글톤 인스턴스 (하위 호환성)
//========================================

let defaultInstance: TokenReissuer | null = null;

const getDefaultInstance = (): TokenReissuer => {
  if (!defaultInstance) {
    defaultInstance = new TokenReissuer();
  }
  return defaultInstance;
};

/* 액세스 토큰 재발급 (기본 인스턴스 사용) */
export async function reissueAccessToken(): Promise<boolean> {
  return getDefaultInstance().reissueAccessToken();
}

/* 토큰 자동 재발급 시작 (기본 인스턴스 사용) */
export function startTokenAutoReissue(): void {
  getDefaultInstance().start();
}

/* 토큰 자동 재발급 중지 (기본 인스턴스 사용) */
export function stopTokenAutoReissue(): void {
  getDefaultInstance().stop();
}

/* 실행 중 여부 확인 (기본 인스턴스 사용) */
export function isTokenAutoReissueRunning(): boolean {
  return getDefaultInstance().isRunning();
}

/* 새 인스턴스 생성 (테스트 및 격리된 상태 필요 시) */
export function createTokenReissuer(): TokenReissuer {
  return new TokenReissuer();
}
