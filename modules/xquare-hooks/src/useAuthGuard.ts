import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@xquare/utils";

/* 인증되지 않은 경우 로그인 페이지로 리다이렉트 */
export function useAuthGuard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      console.warn("[useAuthGuard] 인증되지 않음. 로그인 페이지로 이동");
      navigate("/login", { replace: true });
    }
  }, [navigate]);
}
