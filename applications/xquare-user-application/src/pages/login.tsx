import React, { useState } from "react";
import styled from "@emotion/styled";
import {
  Logo,
  Input_text,
  Typography,
  Button_square,
  Xquare_colors,
} from "@xquare/user-interfaces";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 인증 로직 연결
    console.log("submit", { username, password });
  };

  return (
    <Container>
      <Left>
        <LogoImg src={Logo} alt="Xquare logo" />
      </Left>

      <Right aria-label="로그인 영역">
        <FormCard onSubmit={handleSubmit} aria-label="로그인 폼">
          <Typography size="10x" weight="extraBold" align="center">
            XQUARE LOGIN
          </Typography>

          <Inputs>
            <Input_text
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디를 입력해주세요"
              title="error message"
              titleColor="white"
              type="text"
            />

            <Input_text
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해주세요"
              title="error message"
              titleColor="white"
              type="password"
            />
          </Inputs>

          <FormActions>
            <Button_square type="submit" disabled={!username || !password}>
              로그인
            </Button_square>

            <LinkRow>
              <Typography size="2x" weight="regular" align="center">
                XQUARE계정이 없으신가요?
              </Typography>

              <a
                href="/signup"
                style={{ textDecoration: "none", height: "1.8rem" }}
              >
                <Typography
                  size="2x"
                  weight="regular"
                  color={String(Xquare_colors.blue[500])}
                >
                  가입하기
                </Typography>
              </a>
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

  @media (max-width: 600px) {
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

  @media (max-width: 600px) {
    width: 100%;
    padding: 1.5rem 0;
  }
`;

const LogoImg = styled.img`
  width: 55%;
  height: auto;
  max-width: 360px;
`;

const Right = styled.div`
  display: flex;
  flex: 1 1 35%;
  margin-top: 15vh;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
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
`;

const FormActions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  align-items: center;
`;

const LinkRow = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: center;
`;

export default LoginPage;
