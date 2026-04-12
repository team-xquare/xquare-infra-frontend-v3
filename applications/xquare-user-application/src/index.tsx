import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { registerSW } from "virtual:pwa-register";
import App from "./App";

// console 로그/에러를 프로덕션에서 숨기기
if (import.meta.env && import.meta.env.PROD) {
  const noop = () => {};
  // console.log = noop;
  console.error = noop;
}

if ("serviceWorker" in navigator) {
  registerSW({
    onNeedRefresh() {
      console.log("새 버전 있음");
    },
    onOfflineReady() {
      console.log("오프라인 사용 가능");
    },
  });
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element");
}
const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
