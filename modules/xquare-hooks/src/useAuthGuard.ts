import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, AUTH_RELOGIN_EVENT } from "@xquare/utils";

/* 인증되지 않은 경우 로그인 페이지로 리다이렉트
 * 보호된 페이지의 최상단에서 호출하여 미인증 사용자 접근 방지
 */
export function useAuthGuard() {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    // 1. 초기 인증 확인 (컴포넌트 마운트 시 인증 상태 검증)
    const checkAuth = () => {
      if (!isAuthenticated()) {
        console.warn("[useAuthGuard] 인증되지 않음. 로그인 페이지로 이동");
        navigateRef.current("/login", { replace: true });
      }
    };

    checkAuth();

    // localStorage 변경 감지 (다른 탭에서의 로그아웃)
    const handleStorageChange = (event: StorageEvent) => {
      if (
        event.key === "accessToken" ||
        event.key === "refreshToken" ||
        event.key === null
      ) {
        // console.log("[useAuthGuard] 토큰 변경 감지, 인증 상태 재확인");
        checkAuth();
      }
    };

    // 토큰 재발급 실패 (401) 감지
    const handleReloginEvent = () => {
      console.warn(
        "[useAuthGuard] 토큰 재발급 실패 (401), 로그인 페이지로 이동"
      );
      navigateRef.current("/login", { replace: true });
    };

    // 주기적 인증 확인
    const intervalId = window.setInterval(
      () => {
        if (!isAuthenticated()) {
          console.warn(
            "[useAuthGuard] 인증 상태 확인: 인증 만료. 로그인 페이지로 이동"
          );
          navigateRef.current("/login", { replace: true });
        }
      },
      10 * 60 * 1000
    );

    // 이벤트 리스너 등록
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(AUTH_RELOGIN_EVENT, handleReloginEvent);

    // 클린업
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(AUTH_RELOGIN_EVENT, handleReloginEvent);
      clearInterval(intervalId);
    };
  }, []);
}
