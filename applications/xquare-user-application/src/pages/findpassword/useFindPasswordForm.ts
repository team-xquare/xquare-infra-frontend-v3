import { useState } from "react";
import type React from "react";
import { useNavigate } from "react-router-dom";
import {
  useRecoveryPasswordEmailSend,
  useRecoveryPasswordEmailVerify,
  useResetPassword,
} from "@xquare/hooks";
import type {
  RecoveryPasswordEmailSendRequest,
  RecoveryPasswordEmailVerifyRequest,
} from "@xquare/utils";
import {
  isValidEmail,
  isValidName,
  isValidPassword,
  isValidStudentNumber,
  isValidUsername,
  isValidVerifyCode,
} from "./validation";

export type FindPasswordStep = 1 | 2 | 3;

export const LAST_STEP: FindPasswordStep = 3;

export const useFindPasswordForm = () => {
  const navigate = useNavigate();
  const { sendHandler, loading: emailVerifyLoading } =
    useRecoveryPasswordEmailSend();
  const { verifyHandler, loading: emailVerifySubmitLoading } =
    useRecoveryPasswordEmailVerify();
  const { resetPassword, loading: resetLoading } = useResetPassword();

  const [step, setStep] = useState<FindPasswordStep>(1);
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

  const changeStepSmooth = (nextStep: FindPasswordStep) => {
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
    const response = await sendHandler(payload);
    if (!response?.success) {
      setErrorMsg("인증코드 발송 실패: 입력한 정보를 확인해주세요.");
      return;
    }
    setShowVerifyInput(true);
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
    const response = await verifyHandler(payload);
    if (!response?.success) {
      setErrorMsg("인증코드가 올바르지 않습니다. 다시 확인해주세요.");
      return;
    }
    setPasswordResetToken(response.data.passwordResetToken);
    changeStepSmooth(3);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (step === 1) {
      if (!isValidUsername(username)) return;
      if (!isValidStudentNumber(studentNumber)) return;
      if (!isValidName(name)) return;
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
    if (resetLoading) return;
    if (!isValidPassword(newPassword) || newPassword !== newPasswordCheck) {
      setErrorMsg(
        newPassword !== newPasswordCheck
          ? "비밀번호가 일치하지 않습니다."
          : "비밀번호는 8~20자이며 특수문자를 포함해야 합니다.",
      );
      return;
    }
    const response = await resetPassword({
      passwordResetToken,
      newPassword,
    });
    if (!response?.success) {
      setErrorMsg("비밀번호 변경 실패: 다시 시도해주세요.");
      return;
    }
    navigate("/login");
  };

  const handleBackToIdentity = () => {
    if (emailVerifyLoading || emailVerifySubmitLoading) return;
    setShowVerifyInput(false);
    setVerifyCode("");
    setPasswordResetToken("");
    changeStepSmooth(1);
  };

  const stepValidity: Record<FindPasswordStep, boolean> = {
    1:
      isValidUsername(username) &&
      isValidStudentNumber(studentNumber) &&
      isValidName(name),
    2: showVerifyInput
      ? isValidEmail(email) && isValidVerifyCode(verifyCode)
      : isValidEmail(email),
    3: isValidPassword(newPassword) && newPassword === newPasswordCheck,
  };
  const isStepValid = stepValidity[step];

  return {
    step,
    isFading,
    username,
    studentNumber,
    name,
    email,
    verifyCode,
    showVerifyInput,
    newPassword,
    newPasswordCheck,
    errorMsg,
    emailVerifyLoading,
    emailVerifySubmitLoading,
    resetLoading,
    isStepValid,
    setUsername,
    setStudentNumber,
    setName,
    setEmail,
    setVerifyCode,
    setShowVerifyInput,
    setNewPassword,
    setNewPasswordCheck,
    setPasswordResetToken,
    setErrorMsg,
    handleSubmit,
    handleBackToIdentity,
    handleEmailVerifySend,
    handleEmailVerifySubmit,
  };
};

export type FindPasswordForm = ReturnType<typeof useFindPasswordForm>;
