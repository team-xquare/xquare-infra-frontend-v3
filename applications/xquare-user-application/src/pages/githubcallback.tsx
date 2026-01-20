import { useEffect } from "react";
import styled from "@emotion/styled";
import { Xquare_colors } from "@xquare/user-interfaces";

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
          window.location.origin,
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
          window.location.origin,
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
      <XquareTitle>XQUARE</XquareTitle>
      <MainTitle>GitHub 연동 중...</MainTitle>
      <Description>잠시만 기다려주세요.</Description>
    </Container>
  );
};

export default GithubCallback;

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #0d1117;
  text-align: center;
  padding: 0 20px;
`;

const XquareTitle = styled.h1`
  font-size: 45px;
  font-weight: 800;
  margin-bottom: 17px;
  color: ${Xquare_colors.white};
`;

const MainTitle = styled.h1`
  font-size: 38px;
  font-weight: 800;
  margin-bottom: 18px;
  color: ${Xquare_colors.purple[400]};
`;

const Description = styled.p`
  font-size: 20px;
  color: ${Xquare_colors.gray[500]};
  font-weight: 500;
  line-height: 1.6;
`;
