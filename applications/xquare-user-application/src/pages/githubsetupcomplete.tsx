import { useEffect } from "react";
import { Xquare_colors } from "@xquare/user-interfaces";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

const GithubSetupComplete = () => {
  useEffect(() => {
    document.title = "XQUARE | GitHub 연동 완료";
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  console.warn(
    `[Pagenotfound] 존재하지 않는 페이지 접근: ${location.pathname}`
  );
  // console.log(location);

  // 이동까지 남은 시간 (초)
  const [count, setCount] = useState(2); // 2초 → 0되면 이동

  useEffect(() => {
    document.title = "XQUARE | Not Found";
  }, []);

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
    <>
      <Helmet>
        <title>XQUARE | Not Found</title>
      </Helmet>
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "0 20px",
          backgroundColor: "#0d1117",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "45px",
            fontWeight: 800,
            marginBottom: "17px",
            color: String(Xquare_colors.white),
          }}
        >
          XQUARE
        </h1>

        <h1
          style={{
            fontSize: "100px",
            fontWeight: 800,
            marginBottom: "18px",
            color: String(Xquare_colors.purple[400]),
          }}
        >
          200 OK
        </h1>

        <p
          style={{
            fontSize: "27px",
            color: String(Xquare_colors.white),
            fontWeight: 700,
            maxWidth: "520px",
            lineHeight: "1.4",
            whiteSpace: "pre-line",
          }}
        >
          {`GitHub 연동이 완료되었습니다.`}
        </p>

        <p
          style={{
            fontSize: "19px",
            fontWeight: 500,
            color: String(Xquare_colors.gray[500]),
            lineHeight: "2",
          }}
        >
          {``}
        </p>

        <p
          style={{
            fontSize: "19px",
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
    </>
  );
}


export default GithubSetupComplete;