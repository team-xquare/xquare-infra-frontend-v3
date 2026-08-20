import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { useGuestGuard, useLogin } from "@xquare/hooks";
import type { LoginRequest } from "@xquare/utils";
import { setTokens, startTokenAutoReissue } from "@xquare/utils";
import {
  Logo,
  Input_text,
  Typography,
  Button_square,
  Xquare_colors,
  ErrorMessage,
} from "@xquare/user-interfaces";

const LoginPage: React.FC = () => {
  useGuestGuard();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tokenError, setTokenError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "XQUARE | Login";
  }, []);

  const { login, loading, error } = useLogin();

  const getErrorType = (errorMsg: string | null) => {
    if (!errorMsg) return { type: "none", message: "" };

    const lowerError = errorMsg.toLowerCase();

    if (
      lowerError.includes("username") ||
      lowerError.includes("아이디") ||
      lowerError.includes("user not found")
    ) {
      return { type: "username", message: errorMsg };
    }

    if (
      lowerError.includes("password") ||
      lowerError.includes("비밀번호") ||
      lowerError.includes("invalid password")
    ) {
      return { type: "password", message: errorMsg };
    }

    return { type: "general", message: errorMsg };
  };

  const errorType = getErrorType(error);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: LoginRequest = {
      username,
      password,
    };

    const res = await login(payload);
    if (res) {
      // console.log("[Auth-login] 로그인 성공", res);

      if (res.data?.accessToken && res.data?.refreshToken) {
        setTokens(res.data.accessToken, res.data.refreshToken);
        // 토큰 자동 재발급 시작
        startTokenAutoReissue();
        setTokenError(null);
        navigate("/");
      } else {
        const tokenErrorMsg = "토큰 가져오기 실패: 응답에 토큰이 없습니다.";
        console.error("[Auth-login]", tokenErrorMsg, error);
        setTokenError(tokenErrorMsg);
      }
    } else {
      console.error("[Auth-login] 로그인 실패", error);
    }
  };

  return (
    <Container>
      <Helmet>
        <title>XQUARE | Login</title>
      </Helmet>
      <Left>
        <LogoImg src={Logo} alt="Xquare logo" />
      </Left>

      <Right aria-label="로그인 영역">
        <FormCard onSubmit={handleSubmit} aria-label="로그인 폼">
          <Typography size="10x" weight="extraBold" align="center">
            XQUARE LOGIN
          </Typography>

          <Inputs>
            {tokenError && <ErrorMessage message={tokenError} />}
            <Input_text
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디를 입력해주세요"
              title={errorType.type === "username" ? errorType.message : ""}
              titleColor={String(Xquare_colors.red[500])}
              type="text"
            />

            <Input_text
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해주세요"
              title={errorType.type === "password" ? errorType.message : ""}
              titleColor={String(Xquare_colors.red[500])}
              type="password"
            />
            <PasswordHelpLink to="/find-pwd">비밀번호 찾기</PasswordHelpLink>
          </Inputs>

          <FormActions>
            <Button_square
              type="submit"
              disabled={!username || !password || loading}
            >
              {loading ? "로그인 중..." : "로그인"}
            </Button_square>

            {errorType.type === "general" && error && (
              <Typography size="2x" weight="regular" color="red">
                {error}
              </Typography>
            )}

            <LinkRow>
              <Typography size="2x" weight="regular" align="center">
                XQUARE계정이 없으신가요?
              </Typography>

              <Link
                to="/signup"
                style={{ textDecoration: "none", height: "1.8rem" }}
              >
                <Typography
                  size="2x"
                  weight="regular"
                  color={String(Xquare_colors.blue[500])}
                >
                  가입하기
                </Typography>
              </Link>
            </LinkRow>
          </FormActions>
        </FormCard>
      </Right>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  width: 100vw;
  background-color: ${Xquare_colors.white};
  cursor: default;

  @media (max-width: 650px) {
    flex-direction: column;
  }
`;

const Left = styled.div`
  display: flex;
  flex: 1 1 65%;
  background-color: ${Xquare_colors.purple[400]};
  box-shadow: inset -4px 0 10px rgba(0, 0, 0, 0.35);
  align-items: center;
  justify-content: center;
  cursor: default;

  @media (max-width: 650px) {
    width: 100%;
    padding: 0.7rem 0;
    max-height: 30vh;
  }
`;

const LogoImg = styled.img`
  width: 55%;
  height: auto;
  max-width: 360px;

  @media (max-width: 650px) {
    width: 43%;
    max-height: 28vh;
  }
`;

const Right = styled.div`
  display: flex;
  flex: 1 1 35%;
  margin-top: 15vh;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  @media (max-width: 650px) {
    margin-top: 7vh;
  }
`;

const FormCard = styled.form`
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  align-items: center;
`;

const Inputs = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  align-items: center;
  margin-bottom: 9.8rem;

  @media (max-width: 650px) {
    margin-bottom: 3rem;
  }
`;

const FormActions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  align-items: center;
`;

const PasswordHelpLink = styled(Link)`
  width: 300px;
  color: ${Xquare_colors.gray[500]};
  font-size: 0.8rem;
  font-weight: 500;
  text-align: right;
  text-decoration: none;
`;

const LinkRow = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: center;

  a {
    display: flex;
    height: 1.8rem;
    align-items: center;
    justify-content: center;
  }
`;

export default LoginPage;
