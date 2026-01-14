import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  isAuthenticated,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from "@xquare/utils";

interface UseGuestGuardOptions {
  redirectPath?: string;
  checkIntervalMs?: number;
}

export function useGuestGuard(options?: UseGuestGuardOptions) {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  const redirectPath = options?.redirectPath ?? "/";
  const checkIntervalMs = options?.checkIntervalMs ?? 60 * 1000;

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    const ensureGuestOnly = () => {
      if (isAuthenticated()) {
        console.warn(
          "[useGuestGuard] 인증된 사용자 접근 감지. 리다이렉트 수행:",
          redirectPath
        );
        navigateRef.current(redirectPath, { replace: true });
      }
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (
        event.key === ACCESS_TOKEN_KEY ||
        event.key === REFRESH_TOKEN_KEY ||
        event.key === null
      ) {
        ensureGuestOnly();
      }
    };

    ensureGuestOnly();
    window.addEventListener("storage", handleStorageChange);

    const intervalId = window.setInterval(() => {
      ensureGuestOnly();
    }, checkIntervalMs);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.clearInterval(intervalId);
    };
  }, [redirectPath, checkIntervalMs]);
}
