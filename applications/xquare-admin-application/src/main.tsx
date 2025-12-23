import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Hide console logs/errors in production
if (import.meta.env && import.meta.env.PROD) {
  const noop = () => {};
  console.log = noop;
  console.error = noop;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
