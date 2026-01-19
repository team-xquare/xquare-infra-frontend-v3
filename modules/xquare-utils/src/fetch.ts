import { createElement, type CSSProperties } from "react";
import { createRoot, type Root } from "react-dom/client";
import { clearAllTokens } from "./auth/token";
import { AUTH_RELOGIN_EVENT } from "./auth/events";

const TIMEOUT_MS = 15000; // 15 seconds
const LOGOUT_OVERLAY_DELAY_MS = 1000;
const LOGOUT_OVERLAY_ID = "xquare-auth-logout-overlay";

const overlayBackdropStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(17, 24, 39, 0.45)",
  zIndex: 9999,
};

const overlayCardStyle: CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  padding: "24px",
  boxShadow: "0 20px 45px rgba(15, 23, 42, 0.25)",
  color: "#111827",
  fontSize: "16px",
  lineHeight: 1.5,
  maxWidth: "280px",
  textAlign: "center",
};

const overlayTitleStyle: CSSProperties = {
  margin: "0 0 8px",
  fontWeight: 600,
  fontSize: "18px",
};

const overlayDescriptionStyle: CSSProperties = {
  margin: 0,
  fontSize: "14px",
  color: "#4b5563",
};

const LogoutOverlay = () =>
  createElement(
    "div",
    { style: overlayBackdropStyle },
    createElement(
      "div",
      { style: overlayCardStyle },
      createElement(
        "h2",
        { style: overlayTitleStyle },
        "자동 로그아웃 중입니다",
      ),
      createElement(
        "p",
        { style: overlayDescriptionStyle },
        "안전한 로그인을 위해 잠시만 기다려주세요.",
      ),
    ),
  );

export interface FetchOptions extends RequestInit {
  timeout?: number;
  autoLogoutOnUnauthorized?: boolean;
}

let unauthorizedLogoutInProgress = false;
let logoutOverlayContainer: HTMLDivElement | null = null;
let logoutOverlayRoot: Root | null = null;

const mountLogoutOverlay = () => {
  if (typeof document === "undefined") {
    return;
  }

  if (!logoutOverlayContainer) {
    logoutOverlayContainer = document.createElement("div");
    logoutOverlayContainer.id = LOGOUT_OVERLAY_ID;
    document.body.appendChild(logoutOverlayContainer);
  }

  if (!logoutOverlayRoot) {
    logoutOverlayRoot = createRoot(logoutOverlayContainer);
  }

  logoutOverlayRoot.render(createElement(LogoutOverlay));
};

const unmountLogoutOverlay = () => {
  if (logoutOverlayRoot) {
    logoutOverlayRoot.unmount();
    logoutOverlayRoot = null;
  }

  if (logoutOverlayContainer?.parentElement) {
    logoutOverlayContainer.parentElement.removeChild(logoutOverlayContainer);
  }

  logoutOverlayContainer = null;
};

const handleUnauthorizedLogout = () => {
  if (unauthorizedLogoutInProgress) {
    return;
  }

  unauthorizedLogoutInProgress = true;
  console.warn("[fetchWithTimeout] 401 응답 감지, 로그아웃 처리 시작");

  if (typeof window === "undefined") {
    try {
      clearAllTokens();
    } catch (error) {
      console.error("[fetchWithTimeout] 로그아웃 처리 중 오류", error);
    } finally {
      unauthorizedLogoutInProgress = false;
    }
    return;
  }

  mountLogoutOverlay();

  window.setTimeout(() => {
    try {
      clearAllTokens();
      window.dispatchEvent(new CustomEvent(AUTH_RELOGIN_EVENT));
    } catch (error) {
      console.error("[fetchWithTimeout] 로그아웃 처리 중 오류", error);
    } finally {
      unmountLogoutOverlay();
      unauthorizedLogoutInProgress = false;
    }
  }, LOGOUT_OVERLAY_DELAY_MS);
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
