import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import {
  Logo,
  Input_text,
  Typography,
  Button_square,
  Xquare_colors,
} from "@xquare/user-interfaces";

const SignupPage: React.FC = () => {
  const [step, setStep] = useState(1);

  // 상태
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 3) return;

    // TODO: 로직 연결

    e.preventDefault();
    console.log({
      studentId,
      name,
      username,
      email,
      password,
    });
  };

  const [isFading, setIsFading] = useState(false);

  const changeStepSmooth = (nextStep: number) => {
    setIsFading(true);
    setTimeout(() => {
      setStep(nextStep);
      setIsFading(false);
    }, 180); // fade-out 시간
  };

  const handleNext = () => {
    if (step < 3) changeStepSmooth(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) changeStepSmooth(step - 1);
  };

  return (
    <Container>
      <Left>
        <LogoImg src={Logo} alt="Xquare logo" />
      </Left>

      <Right aria-label="회원가입 영역">
        <FormCard onSubmit={handleSubmit}>
          <Typography size="10x" weight="extraBold" align="center">
            XQUARE SIGNUP
          </Typography>

          {/* ------------------ PAGE NATION ------------------ */}
          <Inputs className={isFading ? "fade-out" : "fade-in"}>
            {step === 1 && (
              <>
                <Input_text
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력해주세요"
                  title={
                    email && !isValidEmail(email)
                      ? "이메일이 유효하지 않습니다."
                      : "error message"
                  }
                  titleColor={
                    email && !isValidEmail(email)
                      ? String(Xquare_colors.red[500])
                      : "white"
                  }
                  type="email"
                />
                <Input_text
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="사용할 아이디를 입력해주세요"
                  title="error message"
                  titleColor="white"
                  type="text"
                />
              </>
            )}

            {step === 2 && (
              <>
                <Input_text
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력해주세요"
                  title="error message"
                  titleColor="white"
                  type="password"
                />
                <Input_text
                  value={passwordCheck}
                  onChange={(e) => setPasswordCheck(e.target.value)}
                  placeholder="비밀번호를 다시 입력해주세요"
                  title={
                    password && passwordCheck && password !== passwordCheck
                      ? "비밀번호가 일치하지 않습니다."
                      : "error message"
                  }
                  titleColor={
                    password && passwordCheck && password !== passwordCheck
                      ? String(Xquare_colors.red[500])
                      : "white"
                  }
                  type="password"
                />
              </>
            )}

            {step === 3 && (
              <>
                <Input_text
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="학번을 입력해주세요"
                  title="error message"
                  titleColor="white"
                  type="text"
                />
                <Input_text
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력해주세요"
                  title="error message"
                  titleColor="white"
                  type="text"
                />
              </>
            )}
          </Inputs>

          {/* ------------------ ACTIONS ------------------ */}
          <FormActions>
            {step < 3 ? (
              <Button_square
                type="button"
                onClick={handleNext}
                disabled={
                  (step === 1 &&
                    (!username || !email || !isValidEmail(email))) ||
                  (step === 2 &&
                    (!password || !passwordCheck || password !== passwordCheck))
                }
              >
                다음으로
              </Button_square>
            ) : (
              <Button_square type="submit" disabled={!studentId || !name}>
                회원가입 완료
              </Button_square>
            )}

            {step > 1 && (
              <LinkRow>
                <Typography size="2x" weight="regular" align="center">
                  잘못입력하셨나요?
                </Typography>

                <Typography
                  size="2x"
                  weight="regular"
                  color={String(Xquare_colors.blue[500])}
                  onClick={handlePrev}
                  style={{ cursor: "pointer" }}
                >
                  뒤로가기
                </Typography>
              </LinkRow>
            )}

            {step === 1 && (
              <LinkRow>
                <Typography size="2x" weight="regular">
                  XQUARE계정이 있으신가요?
                </Typography>

                <Link
                  to="/login"
                  style={{ textDecoration: "none", height: "1.8rem" }}
                >
                  <Typography
                    size="2x"
                    weight="regular"
                    color={String(Xquare_colors.blue[500])}
                  >
                    로그인하기
                  </Typography>
                </Link>
              </LinkRow>
            )}
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
  gap: 0.1rem;
  align-items: center;
  margin-bottom: 9.8rem;

  /* 기본: 부드러운 등장 */
  &.fade-in {
    opacity: 1;
    transform: translateY(0);
    transition:
      opacity 0.18s ease,
      transform 0.18s ease;
  }

  /* 사라지는 중 */
  &.fade-out {
    opacity: 0;
    transform: translateY(10px);
    transition:
      opacity 0.18s ease,
      transform 0.18s ease;
  }
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

export default SignupPage;
