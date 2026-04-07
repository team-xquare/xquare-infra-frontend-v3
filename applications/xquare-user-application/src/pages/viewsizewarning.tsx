import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useAuthGuard } from "@xquare/hooks";

export default function ViewSizeWarning() {
  useAuthGuard();

  const location = useLocation();
  const [viewport, setViewport] = useState(() => ({
    width: typeof window === "undefined" ? 0 : window.innerWidth,
    height: typeof window === "undefined" ? 0 : window.innerHeight,
  }));

  const MIN_WIDTH = 950;
  const MIN_HEIGHT = 580;

  useEffect(() => {
    console.warn(`[ViewSizeWarning] 화면 크기 제한: ${location.pathname}`);

    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    document.title = "XQUARE | View Size Warning";

    return () => {
      window.removeEventListener("resize", updateViewport);
    };
  }, [location.pathname]);

  const isMobile = viewport.width && viewport.width <= 640;
  const isTablet =
    viewport.width && viewport.width > 640 && viewport.width <= 1100;

  const badgePadding = isMobile ? "8px 14px" : "10px 18px";
  const headingSize = isMobile ? "32px" : isTablet ? "40px" : "46px";
  const bodySize = isMobile ? "16px" : isTablet ? "18px" : "19px";
  const detailSize = isMobile ? "14px" : "15px";
  const layoutGap = isMobile ? "10px" : "12px";
  const containerPadding = isMobile ? "0 16px" : "0 24px";
  const bodyLineHeight = isMobile ? "1.55" : "1.7";
  const detailLineHeight = isMobile ? "1.5" : "1.6";
  const maxBodyWidth = isMobile ? "520px" : "720px";
  const bodyMessage = isMobile
    ? `화면 크기가 작아 안내 페이지가 표시됐습니다.
XQUARE는 데스크톱 환경을 권장합니다.`
    : `이 화면은 창 크기가 최소 권장 해상도(${MIN_WIDTH}px × ${MIN_HEIGHT}px)보다 작을 때 노출됩니다.
창을 키우거나 화면을 축소하여 권장 해상도 이상으로 만들어 주세요.`;

  return (
    <>
      <Helmet>
        <title>XQUARE | View Size Warning</title>
      </Helmet>
      <div
        style={{
          height: "100vh",
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: layoutGap,
          padding: containerPadding,
          background:
            "linear-gradient(145deg, #0d1117 0%, #0b1525 55%, #0d1117 100%)",
          textAlign: "center",
          wordBreak: isMobile ? "break-word" : "keep-all",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: badgePadding,
            borderRadius: "999px",
            backgroundColor: "rgba(164, 131, 255, 0.18)",
            color: "#f0eaff",
            fontWeight: 700,
            letterSpacing: "0.2px",
          }}
        >
          화면 크기 제한
        </div>

        <h1
          style={{
            fontSize: headingSize,
            fontWeight: 800,
            marginTop: "6px",
            marginBottom: "4px",
            color: "#e8eaf6",
            letterSpacing: "-0.6px",
          }}
        >
          화면이 너무 작아요
        </h1>

        <p
          style={{
            fontSize: bodySize,
            color: "#d6deff",
            fontWeight: 600,
            maxWidth: maxBodyWidth,
            lineHeight: bodyLineHeight,
            whiteSpace: "pre-line",
          }}
        >
          {bodyMessage}
        </p>

        <p
          style={{
            fontSize: detailSize,
            fontWeight: 500,
            color: "#b5c0d6",
            lineHeight: detailLineHeight,
            marginTop: "2px",
          }}
        >
          {`현재 화면 크기: ${viewport.width || "-"}px × ${viewport.height || "-"}px`}
        </p>
      </div>
    </>
  );
}
