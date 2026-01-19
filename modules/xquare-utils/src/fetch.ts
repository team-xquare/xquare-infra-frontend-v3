import { clearAllTokens } from "./auth/token";
import { AUTH_RELOGIN_EVENT } from "./auth/events";

const TIMEOUT_MS = 15000; // 15 seconds

export interface FetchOptions extends RequestInit {
  timeout?: number;
  autoLogoutOnUnauthorized?: boolean;
}

let unauthorizedLogoutInProgress = false;

const handleUnauthorizedLogout = () => {
  if (unauthorizedLogoutInProgress) {
    return;
  }

  unauthorizedLogoutInProgress = true;

  try {
    console.warn("[fetchWithTimeout] 401 응답 감지, 로그아웃 처리 시작");
    clearAllTokens();

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(AUTH_RELOGIN_EVENT));
    }
  } catch (error) {
    console.error("[fetchWithTimeout] 로그아웃 처리 중 오류", error);
  } finally {
    unauthorizedLogoutInProgress = false;
  }
};

/**
 * @param url - The URL to fetch
 * @param options - Fetch options (can include custom timeout in ms)
 * @returns Promise with Response
 * @throws Error if timeout or network error occurs
 */
export const fetchWithTimeout = async (
  url: string,
  options: FetchOptions = {},
): Promise<Response> => {
  const {
    timeout: timeoutOption,
    autoLogoutOnUnauthorized = true,
    signal: userSignal,
    ...restOptions
  } = options;

  const timeout = timeoutOption ?? TIMEOUT_MS;
  const controller = new AbortController();
  let timedOut = false;

  const onUserAbort = () => {
    controller.abort();
  };

  if (userSignal?.aborted) {
    controller.abort();
  } else if (userSignal) {
    userSignal.addEventListener("abort", onUserAbort);
  }

  const timeoutId = setTimeout(() => {
    console.error("[fetchWithTimeout] timeout", {
      url,
      timeout,
      method: options.method || "GET",
    });
    timedOut = true;
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      ...restOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    if (userSignal) {
      userSignal.removeEventListener("abort", onUserAbort);
    }

    if (response.status === 401 && autoLogoutOnUnauthorized) {
      handleUnauthorizedLogout();
    }
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (userSignal) {
      userSignal.removeEventListener("abort", onUserAbort);
    }

    if (error instanceof Error && error.name === "AbortError") {
      if (timedOut) {
        const errorMsg = `요청 타임아웃 (${timeout}ms): ${url}`;
        console.error("[fetchWithTimeout] aborted (timeout)", {
          url,
          timeout,
          method: options.method || "GET",
        });
        throw new Error(errorMsg);
      }
      throw error;
    }

    throw error;
  }
};
