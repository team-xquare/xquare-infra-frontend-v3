import React, { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";

import {
  useGuestGuard,
  useRegister,
  useEmailVerifySend,
  useEmailVerifySubmit,
} from "@xquare/hooks";
import type {
  EmailVerifySendRequest,
  EmailVerifySubmitRequest,
  RegisterRequest,
} from "@xquare/utils";
import { setTokens, startTokenAutoReissue } from "@xquare/utils";

import {
  Logo,
  Input_text,
  Typography,
  Button_square,
  Xquare_colors,
  ErrorMessage,
} from "@xquare/user-interfaces";

const EMAIL_REGX = /^[^\s@]+@dsm\.hs\.kr$/;
const USERNAME_REGX = /^[A-Za-z0-9_-]+$/;
const PASSWORD_SPECIAL_REGX = /[!@#$%^&*(),.?":{}|<>]/;
const STUDENT_ID_REGX = /^\d{4}$/;
const VERIFY_CODE_REGX = /^\d{6}$/;
const NAME_REGX = /^[가-힣]+$/;

const USERNAME_MIN_LENGTH = 4;
const USERNAME_MAX_LENGTH = 15;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 20;

const STUDENT_ID_MIN = 1000;
const STUDENT_ID_MAX = 3999;
const STUDENT_ID_MAX_DIGITS = 4;

const PAGE_DEEP = 4;

const sanitizeStudentId = (value: string) =>
  value.replace(/\D/g, "").slice(0, STUDENT_ID_MAX_DIGITS);

const SignupPage: React.FC = () => {
  useGuestGuard();

  const navigate = useNavigate();

  const { register, loading, error } = useRegister();
  const { emailVerifySendHandler, loading: emailVerifyLoading } =
    useEmailVerifySend();
  const { emailVerifySubmitHandler, loading: emailVerifySubmitLoading } =
    useEmailVerifySubmit();

  const [step, setStep] = useState(1);

  const [showVerifyInput, setShowVerifyInput] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailVerifiedToken, setEmailVerifiedToken] = useState("");

  const [tokenError, setTokenError] = useState<string | null>(null);

  const [isFading, setIsFading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    verifyCode: "",
    username: "",
    password: "",
    passwordCheck: "",
    studentId: "",
    name: "",
  });

  const emailRef = useRef<HTMLInputElement | null>(null);
  const studentIdRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    document.title = "XQUARE | Sign Up";
  }, []);

  const validations = useMemo(() => {
    const email = EMAIL_REGX.test(form.email);

    const verifyCode = VERIFY_CODE_REGX.test(form.verifyCode);

    const username =
      form.username.length >= USERNAME_MIN_LENGTH &&
      form.username.length <= USERNAME_MAX_LENGTH &&
      USERNAME_REGX.test(form.username);

    const password =
      form.password.length >= PASSWORD_MIN_LENGTH &&
      form.password.length <= PASSWORD_MAX_LENGTH &&
      PASSWORD_SPECIAL_REGX.test(form.password);

    const passwordMatch =
      form.password.length > 0 && form.password === form.passwordCheck;

    const studentId =
      STUDENT_ID_REGX.test(form.studentId) &&
      Number(form.studentId) >= STUDENT_ID_MIN &&
      Number(form.studentId) <= STUDENT_ID_MAX;

    const name = NAME_REGX.test(form.name);

    return {
      email,
      verifyCode,
      username,
      password,
      passwordMatch,
      studentId,
      name,
    };
  }, [form]);

  const isNextDisabled = {
    1: !validations.email || (showVerifyInput && !validations.verifyCode),

    2: !validations.studentId || !validations.name,

    3: !validations.username,

    4: loading || !validations.password || !validations.passwordMatch,
  }[step];

  const handleChange =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      if (key === "email") {
        setShowVerifyInput(false);
        setIsEmailVerified(false);
        setEmailVerifiedToken("");
      }

      if (key === "studentId") {
        value = sanitizeStudentId(value);
      }

      setForm((prev) => ({
        ...prev,
        [key]: value,
        ...(key === "email" ? { verifyCode: "" } : {}),
      }));

      if (tokenError) {
        setTokenError(null);
      }
    };

  useEffect(() => {
    if (isFading) return;

    const focusMap = {
      1: emailRef,
      2: studentIdRef,
      4: passwordRef,
    };

    focusMap[step as keyof typeof focusMap]?.current?.focus();
  }, [step, isFading]);

  const changeStepSmooth = (nextStep: number) => {
    setIsFading(true);

    setTimeout(() => {
      setStep(nextStep);
      setIsFading(false);
    }, 180);
  };

  const handleNext = () => {
    if (step < PAGE_DEEP) {
      changeStepSmooth(step + 1);
    }
  };

  const handlePrev = () => {
    if (step <= 1) return;

    if (step === 2 && isEmailVerified) return;

    changeStepSmooth(step - 1);
  };

  const handleNextOrSend = () => {
    if (step === 1 && !showVerifyInput) {
      setShowVerifyInput(true);
      return;
    }

    if (step === 1 && showVerifyInput) {
      setIsEmailVerified(true);
    }

    handleNext();
  };

  const handleEmailVerifySend = async (payload: EmailVerifySendRequest) => {
    const res = await emailVerifySendHandler(payload);

    if (!res) {
      setTokenError("인증코드 발송 실패: 다시 시도해주세요.");
      return;
    }

    if (res.success) {
      setShowVerifyInput(true);
    } else {
      setTokenError("인증코드 발송 실패: 다시 시도해주세요.");
    }
  };

  const handleEmailVerifySubmit = async (payload: EmailVerifySubmitRequest) => {
    const res = await emailVerifySubmitHandler(payload);

    if (!res) {
      setTokenError("인증코드 검증 실패: 다시 시도해주세요.");
      return;
    }

    if (res.success) {
      setEmailVerifiedToken(res.data.emailVerifiedToken);
      setIsEmailVerified(true);
      handleNext();
    } else {
      setTokenError("인증코드 검증 실패: 다시 시도해주세요.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (step !== PAGE_DEEP) return;

    const payload: RegisterRequest = {
      username: form.username,
      password: form.password,
      studentNumber: Number(form.studentId),
      name: form.name,
      email: form.email,
      emailVerifiedToken: emailVerifiedToken,
    };

    const res = await register(payload);

    if (!res) {
      setTokenError(error || "회원가입 실패: 다시 시도해주세요.");
      return;
    }

    const accessToken = res.data?.accessToken;
    const refreshToken = res.data?.refreshToken;

    if (!accessToken || !refreshToken) {
      setTokenError("토큰 가져오기 실패: 응답에 토큰이 없습니다.");
      return;
    }

    setTokens(accessToken, refreshToken);

    startTokenAutoReissue();

    navigate("/");
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Input_text
              ref={emailRef}
              value={form.email}
              onChange={handleChange("email")}
              placeholder="이메일을 입력해주세요"
              type="email"
              title={
                form.email && !validations.email
                  ? "유효한 학교 이메일(@dsm.hs.kr)을 입력하세요."
                  : ""
              }
              titleColor={String(Xquare_colors.red[500])}
            />

            <VerifyInputWrap className={showVerifyInput ? "show" : "hide"}>
              <Input_text
                value={form.verifyCode}
                onChange={handleChange("verifyCode")}
                placeholder="인증코드를 입력해주세요"
                type="text"
                disabled={!showVerifyInput}
                title={
                  form.verifyCode && !validations.verifyCode
                    ? "유효한 인증코드를 입력하세요."
                    : ""
                }
                titleColor={String(Xquare_colors.red[500])}
              />
            </VerifyInputWrap>
          </>
        );

      case 2:
        return (
          <>
            <Input_text
              ref={studentIdRef}
              value={form.studentId}
              onChange={handleChange("studentId")}
              placeholder="학번을 입력해주세요"
              type="text"
              title={
                form.studentId && !validations.studentId
                  ? "학번은 1000~3999의 숫자 4자리로 입력해주세요."
                  : ""
              }
              titleColor={String(Xquare_colors.red[500])}
            />

            <Input_text
              value={form.name}
              onChange={handleChange("name")}
              placeholder="이름을 입력해주세요"
              type="text"
              title={
                form.name && !validations.name
                  ? "이름을 다시 한번 확인해주세요."
                  : ""
              }
              titleColor={String(Xquare_colors.red[500])}
            />
          </>
        );

      case 3:
        return (
          <>
            <Input_text
              onChange={handleChange("email")}
              value={form.email}
              disabled
              placeholder="이메일을 입력해주세요"
              type="email"
            />

            <Input_text
              value={form.username}
              onChange={handleChange("username")}
              placeholder="사용할 아이디를 입력해주세요"
              type="text"
              title={
                form.username && !validations.username
                  ? "아이디는 4~15자의 영문, 숫자, -, _만 허용 합니다."
                  : ""
              }
              titleColor={String(Xquare_colors.red[500])}
            />
          </>
        );

      case 4:
        return (
          <>
            <Input_text
              ref={passwordRef}
              value={form.password}
              onChange={handleChange("password")}
              placeholder="비밀번호를 입력해주세요"
              type="password"
              title={
                form.password && !validations.password
                  ? "비밀번호는 8~20자이며 특수문자를 포함해야 합니다."
                  : ""
              }
              titleColor={String(Xquare_colors.red[500])}
            />

            <Input_text
              value={form.passwordCheck}
              onChange={handleChange("passwordCheck")}
              placeholder="비밀번호를 다시 입력해주세요"
              type="password"
              title={
                form.password &&
                form.passwordCheck &&
                !validations.passwordMatch
                  ? "비밀번호가 일치하지 않습니다."
                  : ""
              }
              titleColor={String(Xquare_colors.red[500])}
            />
          </>
        );

      default:
        return null;
    }
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
            {renderStep()}
          </Inputs>

          <FormActions>
            {step < PAGE_DEEP ? (
              step === 1 && !showVerifyInput ? (
                <Button_square
                  type="button"
                  onClick={() => handleEmailVerifySend({ email: form.email })}
                  disabled={!validations.email || emailVerifyLoading}
                >
                  {emailVerifyLoading ? "인증코드 발송 중..." : "인증코드 발송"}
                </Button_square>
              ) : step === 1 ? (
                <Button_square
                  type="button"
                  onClick={() =>
                    handleEmailVerifySubmit({
                      email: form.email,
                      otp: form.verifyCode,
                    })
                  }
                  disabled={
                    !validations.email ||
                    !validations.verifyCode ||
                    emailVerifySubmitLoading
                  }
                >
                  {emailVerifySubmitLoading ? "검증 중..." : "인증코드 검증"}
                </Button_square>
              ) : (
                <Button_square
                  type="button"
                  onClick={handleNextOrSend}
                  disabled={isNextDisabled}
                >
                  다음으로
                </Button_square>
              )
            ) : (
              <Button_square type="submit" disabled={isNextDisabled}>
                {loading ? "가입 중..." : "회원가입 완료"}
              </Button_square>
            )}

            {step > 1 && !(step === 2 && isEmailVerified) && (
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
                  style={{
                    textDecoration: "none",
                    height: "1.8rem",
                  }}
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

  @media (max-width: 650px) {
    width: 100%;
    padding: 0.7rem 0;
    max-height: 30vh;
  }
`;

const LogoImg = styled.img`
  width: 55%;
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

  @media (max-width: 650px) {
    margin-bottom: 3rem;
  }
`;

const VerifyInputWrap = styled.div`
  width: fit-content;
  max-width: 100%;

  align-self: center;

  opacity: 0;
  transform: translateY(-4px);

  transition:
    opacity 0.22s ease,
    transform 0.22s ease;

  &.show {
    opacity: 1;
    transform: translateY(0);
  }

  &.hide {
    pointer-events: none;
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
    align-items: center;
    justify-content: center;
  }
`;

export default SignupPage;
