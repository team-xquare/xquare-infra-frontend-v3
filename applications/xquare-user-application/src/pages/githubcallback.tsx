import { useEffect } from "react";
import styled from "@emotion/styled";

const GithubCallback = () => {
  useEffect(() => {
    document.title = "XQUARE | GitHub OAuth";
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");

    if (error) {
      console.error("[GithubCallback] OAuth error:", error);
      if (window.opener) {
        window.opener.postMessage(
          { type: "github-oauth-error", error },
          window.location.origin
        );
      }
      window.close();
      return;
    }

    if (code) {
      // console.log("[GithubCallback] OAuth code received:", code);
      if (window.opener) {
        window.opener.postMessage(
          { type: "github-oauth-code", code },
          window.location.origin
        );
      }
      setTimeout(() => {
        window.close();
      }, 100);
    } else {
      console.error("[GithubCallback] No code or error in URL");
    }
  }, []);

  return (
    <Container>
      <Message>GitHub 연동 중...</Message>
      <SubMessage>잠시만 기다려주세요.</SubMessage>
    </Container>
  );
};

export default GithubCallback;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f8f9fa;
`;

const Message = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
`;

const SubMessage = styled.div`
  font-size: 16px;
  color: #666;
`;
