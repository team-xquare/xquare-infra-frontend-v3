import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import {
  Logo,
  Input_text,
  Typography,
  Button_square,
  Xquare_colors,
  ErrorMessage,
} from "@xquare/user-interfaces";
import {
  useRecoveryPasswordEmailSend,
  useRecoveryPasswordEmailVerify,
  useResetPassword,
} from "@xquare/hooks";
import type {
  RecoveryPasswordEmailSendRequest,
  RecoveryPasswordEmailVerifyRequest,
} from "@xquare/utils";

const EMAIL_PATTERN = /^[^\s@]+@dsm\.hs\.kr$/;
const USERNAME_PATTERN = /^[A-Za-z0-9_-]+$/;
const VERIFY_CODE_PATTERN = /^\d{6}$/;
const STUDENT_NUMBER_PATTERN = /^\d{4}$/;
const NAME_PATTERN = /^[가-힣]+$/;
const PASSWORD_SPECIAL_PATTERN = /[!@#$%^&*(),.?":{}|<>]/;
const LAST_STEP = 3;

const isValidUsername = (value: string) =>
  value.length >= 4 && value.length <= 15 && USERNAME_PATTERN.test(value);
const isValidStudentNumber = (value: string) =>
  STUDENT_NUMBER_PATTERN.test(value) &&
  Number(value) >= 1000 &&
  Number(value) <= 3999;
const isValidName = (value: string) => NAME_PATTERN.test(value);
const isValidEmail = (value: string) => EMAIL_PATTERN.test(value);
const isValidVerifyCode = (value: string) => VERIFY_CODE_PATTERN.test(value);
const isValidPassword = (value: string) =>
  value.length >= 8 &&
  value.length <= 20 &&
  PASSWORD_SPECIAL_PATTERN.test(value);

const Findpassword: React.FC = () => {
  const navigate = useNavigate();
  const { sendHandler, loading: emailVerifyLoading } =
    useRecoveryPasswordEmailSend();
  const { verifyHandler, loading: emailVerifySubmitLoading } =
    useRecoveryPasswordEmailVerify();
  const { resetPassword, loading: resetLoading } = useResetPassword();

  const [step, setStep] = useState(1);
  const [isFading, setIsFading] = useState(false);
  const [username, setUsername] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [showVerifyInput, setShowVerifyInput] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCheck, setNewPasswordCheck] = useState("");
  const [passwordResetToken, setPasswordResetToken] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const studentNumberRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const passwordCheckRef = useRef<HTMLInputElement | null>(null);
  const verifyCodeRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isFading) return;
    const focusMap = {
      1: usernameRef,
      2: emailRef,
      3: passwordRef,
    };
    focusMap[step as keyof typeof focusMap].current?.focus();
  }, [step, isFading]);

  const changeStepSmooth = (nextStep: number) => {
    setErrorMsg(null);
    setIsFading(true);
    window.setTimeout(() => {
      setStep(nextStep);
      setIsFading(false);
    }, 180);
  };

  const handleEmailVerifySend = async () => {
    setErrorMsg(null);
    const payload: RecoveryPasswordEmailSendRequest = {
      username,
      studentNumber: Number(studentNumber),
      name,
      email,
    };
    const res = await sendHandler(payload);
    if (!res?.success) {
      setErrorMsg("인증코드 발송 실패: 입력한 정보를 확인해주세요.");
      return;
    }
    setShowVerifyInput(true);
    window.setTimeout(() => verifyCodeRef.current?.focus(), 0);
  };

  const handleEmailVerifySubmit = async () => {
    setErrorMsg(null);
    const payload: RecoveryPasswordEmailVerifyRequest = {
      username,
      studentNumber: Number(studentNumber),
      name,
      email,
      otp: verifyCode,
    };
    const res = await verifyHandler(payload);
    if (!res?.success) {
      setErrorMsg("인증코드가 올바르지 않습니다. 다시 확인해주세요.");
      return;
    }
    setPasswordResetToken(res.data.passwordResetToken);
    changeStepSmooth(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!isValidUsername(username)) return;
      if (!isValidStudentNumber(studentNumber)) {
        window.setTimeout(() => studentNumberRef.current?.focus(), 0);
        return;
      }
      if (!isValidName(name)) {
        window.setTimeout(() => nameRef.current?.focus(), 0);
        return;
      }
      changeStepSmooth(2);
      return;
    }
    if (step === 2) {
      if (!showVerifyInput) {
        if (isValidEmail(email) && !emailVerifyLoading) {
          await handleEmailVerifySend();
        }
      } else if (isValidVerifyCode(verifyCode) && !emailVerifySubmitLoading) {
        await handleEmailVerifySubmit();
      }
      return;
    }
    if (step !== LAST_STEP) return;
    if (!isValidPassword(newPassword) || newPassword !== newPasswordCheck) {
      setErrorMsg(
        newPassword !== newPasswordCheck
          ? "비밀번호가 일치하지 않습니다."
          : "비밀번호는 8~20자이며 특수문자를 포함해야 합니다.",
      );
      return;
    }
    const res = await resetPassword({ passwordResetToken, newPassword });
    if (!res?.success) {
      setErrorMsg("비밀번호 변경 실패: 다시 시도해주세요.");
      return;
    }
    navigate("/login");
  };

  const isStepValid = {
    1:
      isValidUsername(username) &&
      isValidStudentNumber(studentNumber) &&
      isValidName(name),
    2: showVerifyInput
      ? isValidEmail(email) && isValidVerifyCode(verifyCode)
      : isValidEmail(email),
    3: isValidPassword(newPassword) && newPassword === newPasswordCheck,
  }[step];

  const isEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || e.nativeEvent.isComposing) return false;
    e.preventDefault();
    return true;
  };

  const handleUsernameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isEnterKey(e) && isValidUsername(username)) {
      studentNumberRef.current?.focus();
    }
  };

  const handleStudentNumberKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (isEnterKey(e) && isValidStudentNumber(studentNumber)) {
      nameRef.current?.focus();
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isEnterKey(e) && isValidName(name)) changeStepSmooth(2);
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isEnterKey(e) && isValidEmail(email) && !emailVerifyLoading) {
      void handleEmailVerifySend();
    }
  };

  const handleVerifyCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      isEnterKey(e) &&
      isValidVerifyCode(verifyCode) &&
      !emailVerifySubmitLoading
    ) {
      void handleEmailVerifySubmit();
    }
  };

  const handlePasswordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isEnterKey(e) && isValidPassword(newPassword)) {
      passwordCheckRef.current?.focus();
    }
  };

  const handlePasswordCheckKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      isEnterKey(e) &&
      isValidPassword(newPassword) &&
      newPassword === newPasswordCheck
    ) {
      e.currentTarget.form?.requestSubmit();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Input_text
              ref={usernameRef}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrorMsg(null);
              }}
              placeholder="아이디를 입력해주세요"
              title={
                username && !isValidUsername(username)
                  ? "아이디는 4~15자의 영문, 숫자, -, _만 허용합니다."
                  : ""
              }
              titleColor={String(Xquare_colors.red[500])}
              type="text"
              onKeyDown={handleUsernameKeyDown}
            />
            {isValidUsername(username) && (
              <RevealInput>
                <Input_text
                  ref={studentNumberRef}
                  value={studentNumber}
                  onChange={(e) => {
                    setStudentNumber(
                      e.target.value.replace(/\D/g, "").slice(0, 4),
                    );
                    setErrorMsg(null);
                  }}
                  placeholder="학번을 입력해주세요"
                  title={
                    studentNumber && !isValidStudentNumber(studentNumber)
                      ? "학번은 1000~3999의 숫자 4자리로 입력해주세요."
                      : ""
                  }
                  titleColor={String(Xquare_colors.red[500])}
                  type="text"
                  onKeyDown={handleStudentNumberKeyDown}
                />
              </RevealInput>
            )}
            {isValidStudentNumber(studentNumber) && (
              <RevealInput>
                <Input_text
                  ref={nameRef}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="이름을 입력해주세요"
                  title={
                    name && !isValidName(name)
                      ? "이름을 다시 확인해주세요."
                      : ""
                  }
                  titleColor={String(Xquare_colors.red[500])}
                  type="text"
                  onKeyDown={handleNameKeyDown}
                />
              </RevealInput>
            )}
          </>
        );
      case 2:
        return (
          <>
            <Input_text
              ref={emailRef}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setVerifyCode("");
                setShowVerifyInput(false);
                setPasswordResetToken("");
                setErrorMsg(null);
              }}
              placeholder="이메일을 입력해주세요"
              title={
                email && !isValidEmail(email)
                  ? "유효한 학교 이메일(@dsm.hs.kr)을 입력하세요."
                  : ""
              }
              titleColor={String(Xquare_colors.red[500])}
              type="email"
              disabled={showVerifyInput}
              onKeyDown={handleEmailKeyDown}
            />
            {showVerifyInput && (
              <RevealInput>
                <Input_text
                  ref={verifyCodeRef}
                  value={verifyCode}
                  onChange={(e) => {
                    setVerifyCode(
                      e.target.value.replace(/\D/g, "").slice(0, 6),
                    );
                    setErrorMsg(null);
                  }}
                  placeholder="인증코드를 입력해주세요 (6자리)"
                  title={
                    verifyCode && !isValidVerifyCode(verifyCode)
                      ? "6자리 숫자를 입력해주세요."
                      : ""
                  }
                  titleColor={String(Xquare_colors.red[500])}
                  type="text"
                  onKeyDown={handleVerifyCodeKeyDown}
                />
              </RevealInput>
            )}
          </>
        );
      case 3:
        return (
          <>
            <Input_text
              ref={passwordRef}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrorMsg(null);
              }}
              placeholder="새 비밀번호를 입력해주세요"
              title={
                newPassword && !isValidPassword(newPassword)
                  ? "비밀번호는 8~20자이며 특수문자를 포함해야 합니다."
                  : ""
              }
              titleColor={String(Xquare_colors.red[500])}
              type="password"
              onKeyDown={handlePasswordKeyDown}
            />
            <Input_text
              ref={passwordCheckRef}
              value={newPasswordCheck}
              onChange={(e) => {
                setNewPasswordCheck(e.target.value);
                setErrorMsg(null);
              }}
              placeholder="새 비밀번호를 다시 입력해주세요"
              title={
                newPasswordCheck && newPassword !== newPasswordCheck
                  ? "비밀번호가 일치하지 않습니다."
                  : ""
              }
              titleColor={String(Xquare_colors.red[500])}
              type="password"
              onKeyDown={handlePasswordCheckKeyDown}
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
        <title>XQUARE | Find Password</title>
      </Helmet>
      <Left>
        <LogoImg src={Logo} alt="Xquare logo" />
      </Left>
      <Right aria-label="비밀번호 찾기 영역">
        <FormCard onSubmit={handleSubmit}>
          <Typography size="10x" weight="extraBold" align="center">
            FIND PASSWORD
          </Typography>
          {errorMsg && <ErrorMessage message={errorMsg} />}
          <Inputs className={isFading ? "fade-out" : "fade-in"}>
            {renderStep()}
          </Inputs>
          <FormActions>
            {step === 1 && (
              <Button_square type="submit" disabled={!isStepValid}>
                다음으로
              </Button_square>
            )}
            {step === 2 && (
              <Button_square
                type="button"
                onClick={
                  showVerifyInput
                    ? handleEmailVerifySubmit
                    : handleEmailVerifySend
                }
                disabled={
                  !isStepValid || emailVerifyLoading || emailVerifySubmitLoading
                }
              >
                {showVerifyInput
                  ? emailVerifySubmitLoading
                    ? "검증 중..."
                    : "인증코드 검증"
                  : emailVerifyLoading
                    ? "발송 중..."
                    : "인증코드 발송"}
              </Button_square>
            )}
            {step === 3 && (
              <Button_square
                type="submit"
                disabled={!isStepValid || resetLoading}
              >
                {resetLoading ? "변경 중..." : "완료하기"}
              </Button_square>
            )}
            {step > 1 && step < LAST_STEP && (
              <LinkRow>
                <Typography size="2x" weight="regular">
                  잘못 입력하셨나요?
                </Typography>
                <Typography
                  size="2x"
                  weight="regular"
                  color={String(Xquare_colors.blue[500])}
                  onClick={() => changeStepSmooth(step - 1)}
                  style={{ cursor: "pointer" }}
                >
                  뒤로가기
                </Typography>
              </LinkRow>
            )}
            {step === 1 && (
              <LinkRow>
                <Typography size="2x" weight="regular">
                  비밀번호가 기억나시나요?
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
  min-height: 8.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  align-items: center;
  margin-bottom: 6rem;
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
const FormActions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  align-items: center;
`;
const RevealInput = styled.div`
  width: fit-content;
  max-width: 100%;
  animation: reveal 0.22s ease;

  @keyframes reveal {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
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

export default Findpassword;
