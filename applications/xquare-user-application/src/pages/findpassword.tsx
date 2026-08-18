import React, { useState, useEffect, useRef } from "react";
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
const VERIFY_CODE_PATTERN = /^\d{6}$/;
const STUDENT_NUMBER_PATTERN = /^\d{4}$/; // 실제 학번 자리수에 맞게 조정하세요
const PASSWORD_SPECIAL_PATTERN = /[!@#$%^&*(),.?":{}|<>]/;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 20;

const isValidEmail = (value: string) => EMAIL_PATTERN.test(value);
const isValidVerifyCode = (value: string) => VERIFY_CODE_PATTERN.test(value);
const isValidStudentNumber = (value: string) =>
  STUDENT_NUMBER_PATTERN.test(value);
const isValidPassword = (value: string) => {
  const hasValidLength =
    value.length >= PASSWORD_MIN_LENGTH && value.length <= PASSWORD_MAX_LENGTH;
  return hasValidLength && PASSWORD_SPECIAL_PATTERN.test(value);
};

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

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCheck, setNewPasswordCheck] = useState("");

  const [showVerifyInput, setShowVerifyInput] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [passwordResetToken, setPasswordResetToken] = useState("");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const newPasswordRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isFading) return;
    const target =
      step === 1 ? usernameRef : step === 2 ? newPasswordRef : null;
    target?.current?.focus();
  }, [step, isFading]);

  const changeStepSmooth = (nextStep: number) => {
    setIsFading(true);
    setTimeout(() => {
      setStep(nextStep);
      setIsFading(false);
    }, 180);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setShowVerifyInput(false);
    setIsEmailVerified(false);
    setPasswordResetToken("");
    setVerifyCode("");
    setErrorMsg(null);
  };

  const isIdentityValid =
    username.trim().length > 0 &&
    isValidStudentNumber(studentNumber) &&
    name.trim().length > 0 &&
    isValidEmail(email);

  // 인증코드 발송
  const handleEmailVerifySend = async () => {
    setErrorMsg(null);
    const payload: RecoveryPasswordEmailSendRequest = {
      username,
      studentNumber: Number(studentNumber),
      name,
      email,
    };
    const res = await sendHandler(payload);

    if (!res || !res.success) {
      setErrorMsg("인증코드 발송 실패: 다시 시도해주세요.");
      return;
    }

    setShowVerifyInput(true);
  };

  // 인증코드 검증
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

    if (!res || !res.success) {
      setErrorMsg("인증코드가 올바르지 않습니다. 다시 확인해주세요.");
      return;
    }

    setPasswordResetToken(res.data.passwordResetToken);
    setIsEmailVerified(true);
    changeStepSmooth(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 2) return;

    if (!isValidPassword(newPassword)) {
      setErrorMsg("비밀번호는 8~20자이며 특수문자를 포함해야 합니다.");
      return;
    }
    if (newPassword !== newPasswordCheck) {
      setErrorMsg("비밀번호가 일치하지 않습니다.");
      return;
    }

    setErrorMsg(null);

    const res = await resetPassword({
      passwordResetToken,
      newPassword,
    });

    if (!res || !res.success) {
      setErrorMsg("비밀번호 변경 실패: 다시 시도해주세요.");
      return;
    }

    navigate("/login");
  };

  const isNewPasswordValid =
    isValidPassword(newPassword) && newPassword === newPasswordCheck;

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
            {step === 1 && (
              <>
                <Input_text
                  ref={usernameRef}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="아이디를 입력해주세요"
                  titleColor={String(Xquare_colors.red[500])}
                  type="text"
                  disabled={isEmailVerified}
                />

                <Input_text
                  value={studentNumber}
                  onChange={(e) => {
                    setStudentNumber(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="학번을 입력해주세요"
                  title={
                    studentNumber && !isValidStudentNumber(studentNumber)
                      ? "올바른 학번을 입력해주세요."
                      : ""
                  }
                  titleColor={String(Xquare_colors.red[500])}
                  type="text"
                  disabled={isEmailVerified}
                />

                <Input_text
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="이름을 입력해주세요"
                  titleColor={String(Xquare_colors.red[500])}
                  type="text"
                  disabled={isEmailVerified}
                />

                <Input_text
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="이메일을 입력해주세요"
                  title={
                    email && !isValidEmail(email)
                      ? "유효한 학교 이메일(@dsm.hs.kr)을 입력하세요."
                      : ""
                  }
                  titleColor={String(Xquare_colors.red[500])}
                  type="email"
                  disabled={isEmailVerified}
                />

                <VerifyInputWrap className={showVerifyInput ? "show" : "hide"}>
                  <Input_text
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    placeholder="인증코드를 입력해주세요 (6자리)"
                    title={
                      verifyCode && !isValidVerifyCode(verifyCode)
                        ? "6자리 숫자를 입력해주세요."
                        : ""
                    }
                    titleColor={String(Xquare_colors.red[500])}
                    type="text"
                    disabled={!showVerifyInput}
                  />
                </VerifyInputWrap>
              </>
            )}

            {step === 2 && (
              <>
                <Input_text
                  ref={newPasswordRef}
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
                />
                <Input_text
                  value={newPasswordCheck}
                  onChange={(e) => {
                    setNewPasswordCheck(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="다시 입력해주세요"
                  title={
                    newPasswordCheck && newPassword !== newPasswordCheck
                      ? "비밀번호가 일치하지 않습니다."
                      : ""
                  }
                  titleColor={String(Xquare_colors.red[500])}
                  type="password"
                />
              </>
            )}
          </Inputs>

          <FormActions>
            {step === 1 ? (
              !showVerifyInput ? (
                <Button_square
                  type="button"
                  onClick={handleEmailVerifySend}
                  disabled={!isIdentityValid || emailVerifyLoading}
                >
                  {emailVerifyLoading ? "발송 중..." : "인증코드 발송"}
                </Button_square>
              ) : (
                <Button_square
                  type="button"
                  onClick={handleEmailVerifySubmit}
                  disabled={
                    !isValidVerifyCode(verifyCode) || emailVerifySubmitLoading
                  }
                >
                  {emailVerifySubmitLoading ? "검증 중..." : "인증코드 검증"}
                </Button_square>
              )
            ) : (
              <Button_square
                type="submit"
                disabled={!isNewPasswordValid || resetLoading}
              >
                {resetLoading ? "변경 중..." : "완료하기"}
              </Button_square>
            )}

            {step > 1 && (
              <LinkRow>
                <Typography size="2x" weight="regular">
                  잘못 입력하셨나요?
                </Typography>
                <Typography
                  size="2x"
                  weight="regular"
                  color={String(Xquare_colors.blue[500])}
                  onClick={() => changeStepSmooth(1)}
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

export default Findpassword;
