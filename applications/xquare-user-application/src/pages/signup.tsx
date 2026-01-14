import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useGuestGuard, useRegister } from "@xquare/hooks"; // 훅 import
import type { RegisterRequest } from "@xquare/utils"; // 타입 import
import { setTokens, startTokenAutoReissue } from "@xquare/utils"; // 토큰 저장 유틸
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import {
  Logo,
  Input_text,
  Typography,
  Button_square,
  Xquare_colors,
  ErrorMessage,
} from "@xquare/user-interfaces";

const SignupPage: React.FC = () => {
  useGuestGuard();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "XQUARE | Sign Up";
  }, []);

  // 현재 단계 상태
  const [step, setStep] = useState(1);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // 상태
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const studentIdRef = useRef<HTMLInputElement | null>(null);

  // 회원가입 훅 연결
  const { register, loading, error } = useRegister();

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidUsername = (value: string) =>
    value.length >= 4 && value.length <= 15;
  const isValidPassword = (value: string) =>
    value.length >= 8 && value.length <= 20 && /[^A-Za-z0-9]/.test(value);
  const isValidStudentId = (value: string) => /^\d{4}$/.test(value);

  const handleStudentIdChange = (value: string) => {
    const sanitized = value.replace(/\D/g, "").slice(0, 4);
    setStudentId(sanitized);
    if (tokenError) setTokenError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 3) return;

    if (!isValidStudentId(studentId)) {
      setTokenError("학번은 숫자 4자리로 입력해주세요.");
      studentIdRef.current?.focus();
      return;
    }

    const payload: RegisterRequest = {
      username,
      password,
      studentNumber: Number(studentId),
      name,
      email,
    };

    const res = await register(payload);
    if (res) {
      // console.log("[Auth-register] Sign up successful", res);

      if (res.data?.accessToken && res.data?.refreshToken) {
        setTokens(res.data.accessToken, res.data.refreshToken);
        // 토큰 자동 재발급 시작
        startTokenAutoReissue();
        setTokenError(null);
        navigate("/");
      } else {
        const tokenErrorMsg = "토큰 가져오기 실패: 응답에 토큰이 없습니다.";
        console.error("[Auth-register]", tokenErrorMsg, error);
        setTokenError(tokenErrorMsg);
      }
    } else {
      const registerErrorMsg = error || "회원가입 실패: 다시 시도해주세요.";
      console.error("[Auth-register] Sign up failed", registerErrorMsg);
      setTokenError(registerErrorMsg);
    }
  };

  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (isFading) return;

    const focusTargets: Record<
      number,
      React.MutableRefObject<HTMLInputElement | null>
    > = {
      1: emailRef,
      2: passwordRef,
      3: studentIdRef,
    };

    focusTargets[step]?.current?.focus();
  }, [step, isFading]);

  const changeStepSmooth = (nextStep: number) => {
    setIsFading(true);
    setTimeout(() => {
      setStep(nextStep);
      setIsFading(false);
    }, 180);
  };

  const handleNext = () => {
    if (step < 3) changeStepSmooth(step + 1);
    // console.log("[SignupPage] handleNext, 현재 step:", step + 1);
  };

  const handlePrev = () => {
    if (step > 1) changeStepSmooth(step - 1);
    // console.log("[SignupPage] handlePrev, step:", step - 1);
  };

  return (
    <Container>
      <Helmet>
        <title>XQUARE | Sign Up</title>
      </Helmet>
      <Left>
        <LogoImg src={Logo} alt="Xquare logo" />
      </Left>

      <Right aria-label="회원가입 영역">
        <FormCard onSubmit={handleSubmit}>
          <Typography size="10x" weight="extraBold" align="center">
            XQUARE SIGNUP
          </Typography>
          {tokenError && <ErrorMessage message={tokenError} />}

          <Inputs className={isFading ? "fade-out" : "fade-in"}>
            {step === 1 && (
              <>
                <Input_text
                  ref={emailRef}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력해주세요"
                  title={
                    email && !isValidEmail(email)
                      ? "이메일이 유효하지 않습니다."
                      : ""
                  }
                  titleColor={String(Xquare_colors.red[500])}
                  type="email"
                />
                <Input_text
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="사용할 아이디를 입력해주세요"
                  title={
                    username && !isValidUsername(username)
                      ? "아이디는 4자 이상 15자 이하로 입력해주세요."
                      : ""
                  }
                  titleColor={String(Xquare_colors.red[500])}
                  type="text"
                />
              </>
            )}

            {step === 2 && (
              <>
                <Input_text
                  ref={passwordRef}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력해주세요"
                  title={
                    password && !isValidPassword(password)
                      ? "비밀번호는 8~20자이며 특수문자를 포함해야 합니다."
                      : ""
                  }
                  titleColor={String(Xquare_colors.red[500])}
                  type="password"
                />
                <Input_text
                  value={passwordCheck}
                  onChange={(e) => setPasswordCheck(e.target.value)}
                  placeholder="비밀번호를 다시 입력해주세요"
                  title={
                    password && passwordCheck && password !== passwordCheck
                      ? "비밀번호가 일치하지 않습니다."
                      : ""
                  }
                  titleColor={String(Xquare_colors.red[500])}
                  type="password"
                />
              </>
            )}

            {step === 3 && (
              <>
                <Input_text
                  ref={studentIdRef}
                  value={studentId}
                  onChange={(e) => handleStudentIdChange(e.target.value)}
                  placeholder="학번을 입력해주세요"
                  title={
                    studentId && !isValidStudentId(studentId)
                      ? "학번은 숫자 4자리로 입력해주세요."
                      : ""
                  }
                  titleColor={String(Xquare_colors.red[500])}
                  type="text"
                />
                <Input_text
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력해주세요"
                  title={""}
                  titleColor={String(Xquare_colors.red[500])}
                  type="text"
                />
              </>
            )}
          </Inputs>

          <FormActions>
            {step < 3 ? (
              <Button_square
                type="button"
                onClick={handleNext}
                disabled={
                  (step === 1 &&
                    (!username ||
                      !email ||
                      !isValidEmail(email) ||
                      !isValidUsername(username))) ||
                  (step === 2 &&
                    (!password ||
                      !passwordCheck ||
                      password !== passwordCheck ||
                      !isValidPassword(password)))
                }
              >
                다음으로
              </Button_square>
            ) : (
              <Button_square
                type="submit"
                disabled={loading || !name || !isValidStudentId(studentId)}
              >
                {loading ? "가입 중..." : "회원가입 완료"}
              </Button_square>
            )}

            {error && (
              <Typography size="2x" weight="regular" color="red">
                {error}
              </Typography>
            )}

            {step > 1 && (
              <LinkRow>
                <Typography size="2x" weight="regular">
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
  cursor: default;

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
  cursor: default;

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

  &.fade-in {
    opacity: 1;
    transform: translateY(0);
    transition:
      opacity 0.18s ease,
      transform 0.18s ease;
  }

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

  a {
    display: flex;
    height: 1.8rem;
    align-items: center;
    justify-content: center;
  }
`;

export default SignupPage;
