import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Xquare_colors } from "@xquare/user-interfaces";

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  // 이동까지 남은 시간 (초)
  const [count, setCount] = useState(2); // 2초 → 0되면 이동

  useEffect(() => {
    // 1초마다 countdown 감소
    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    // 2초 뒤 홈으로 이동
    const timeout = setTimeout(() => navigate("/", { replace: true }), 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "0 20px",
        backgroundColor: "white",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "55px",
          fontWeight: 800,
          marginBottom: "18px",
          color: String(Xquare_colors.purple[400]),
        }}
      >
        404. Page Not Found
      </h1>

      <p
        style={{
          fontSize: "29px",
          color: String(Xquare_colors.black),
          fontWeight: 600,
          maxWidth: "520px",
          lineHeight: "1.6",
          whiteSpace: "pre-line",
          marginBottom: "250px",
        }}
      >
        {`요청하신 페이지를 찾을 수 없습니다.
잘못된 경로: "${location.pathname}"`}
      </p>

      <p
        style={{
          fontSize: "27px",
          fontWeight: 500,
          color: String(Xquare_colors.gray[500]),
          lineHeight: "1.6",
        }}
      >
        {count > 0
          ? `홈으로 이동하기까지 ${count}초 남았습니다`
          : "잠시만 기다려 주세요..."}
      </p>
    </div>
  );
}
