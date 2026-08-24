import { useEffect, useRef } from "react";
import type React from "react";
import { Input_text, Xquare_colors } from "@xquare/user-interfaces";
import { RevealInput } from "./styles";
import type { FindPasswordForm, FindPasswordStep } from "./useFindPasswordForm";
import {
  isValidEmail,
  isValidName,
  isValidPassword,
  isValidStudentNumber,
  isValidUsername,
  isValidVerifyCode,
} from "./validation";

interface FindPasswordFieldsProps {
  form: FindPasswordForm;
}

const errorColor = String(Xquare_colors.red[500]);

export const FindPasswordFields = ({ form }: FindPasswordFieldsProps) => {
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const studentNumberRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const verifyCodeRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const passwordCheckRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (form.isFading) return;
    const focusMap: Record<
      FindPasswordStep,
      React.RefObject<HTMLInputElement | null>
    > = { 1: usernameRef, 2: emailRef, 3: passwordRef };
    focusMap[form.step].current?.focus();
  }, [form.step, form.isFading]);

  useEffect(() => {
    if (form.showVerifyInput) verifyCodeRef.current?.focus();
  }, [form.showVerifyInput]);

  const isEnterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || event.nativeEvent.isComposing) return false;
    event.preventDefault();
    return true;
  };

  switch (form.step) {
    case 1:
      return (
        <>
          <Input_text
            ref={usernameRef}
            value={form.username}
            onChange={(event) => {
              form.setUsername(event.target.value);
              form.setErrorMsg(null);
            }}
            placeholder="아이디를 입력해주세요"
            title={
              form.username && !isValidUsername(form.username)
                ? "아이디는 4~15자의 영문, 숫자, -, _만 허용합니다."
                : ""
            }
            titleColor={errorColor}
            type="text"
            onKeyDown={(event) => {
              if (isEnterKey(event) && isValidUsername(form.username)) {
                studentNumberRef.current?.focus();
              }
            }}
          />
          {isValidUsername(form.username) && (
            <RevealInput>
              <Input_text
                ref={studentNumberRef}
                value={form.studentNumber}
                onChange={(event) => {
                  form.setStudentNumber(
                    event.target.value.replace(/\D/g, "").slice(0, 4),
                  );
                  form.setErrorMsg(null);
                }}
                placeholder="학번을 입력해주세요"
                title={
                  form.studentNumber &&
                  !isValidStudentNumber(form.studentNumber)
                    ? "학번은 1000~3999의 숫자 4자리로 입력해주세요."
                    : ""
                }
                titleColor={errorColor}
                type="text"
                onKeyDown={(event) => {
                  if (
                    isEnterKey(event) &&
                    isValidStudentNumber(form.studentNumber)
                  ) {
                    nameRef.current?.focus();
                  }
                }}
              />
            </RevealInput>
          )}
          {isValidStudentNumber(form.studentNumber) && (
            <RevealInput>
              <Input_text
                ref={nameRef}
                value={form.name}
                onChange={(event) => {
                  form.setName(event.target.value);
                  form.setErrorMsg(null);
                }}
                placeholder="이름을 입력해주세요"
                title={
                  form.name && !isValidName(form.name)
                    ? "이름을 다시 확인해주세요."
                    : ""
                }
                titleColor={errorColor}
                type="text"
                onKeyDown={(event) => {
                  if (isEnterKey(event) && isValidName(form.name)) {
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
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
            value={form.email}
            onChange={(event) => {
              form.setEmail(event.target.value);
              form.setVerifyCode("");
              form.setShowVerifyInput(false);
              form.setPasswordResetToken("");
              form.setErrorMsg(null);
            }}
            placeholder="이메일을 입력해주세요"
            title={
              form.email && !isValidEmail(form.email)
                ? "유효한 학교 이메일(@dsm.hs.kr)을 입력하세요."
                : ""
            }
            titleColor={errorColor}
            type="email"
            disabled={form.showVerifyInput || form.emailVerifyLoading}
            onKeyDown={(event) => {
              if (
                isEnterKey(event) &&
                isValidEmail(form.email) &&
                !form.emailVerifyLoading
              ) {
                void form.handleEmailVerifySend();
              }
            }}
          />
          {form.showVerifyInput && (
            <RevealInput>
              <Input_text
                ref={verifyCodeRef}
                value={form.verifyCode}
                onChange={(event) => {
                  form.setVerifyCode(
                    event.target.value.replace(/\D/g, "").slice(0, 6),
                  );
                  form.setErrorMsg(null);
                }}
                placeholder="인증코드를 입력해주세요 (6자리)"
                title={
                  form.verifyCode && !isValidVerifyCode(form.verifyCode)
                    ? "6자리 숫자를 입력해주세요."
                    : ""
                }
                titleColor={errorColor}
                type="text"
                onKeyDown={(event) => {
                  if (
                    isEnterKey(event) &&
                    isValidVerifyCode(form.verifyCode) &&
                    !form.emailVerifySubmitLoading
                  ) {
                    void form.handleEmailVerifySubmit();
                  }
                }}
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
            value={form.newPassword}
            onChange={(event) => {
              form.setNewPassword(event.target.value);
              form.setErrorMsg(null);
            }}
            placeholder="새 비밀번호를 입력해주세요"
            title={
              form.newPassword && !isValidPassword(form.newPassword)
                ? "비밀번호는 8~20자이며 특수문자를 포함해야 합니다."
                : ""
            }
            titleColor={errorColor}
            type="password"
            onKeyDown={(event) => {
              if (isEnterKey(event) && isValidPassword(form.newPassword)) {
                passwordCheckRef.current?.focus();
              }
            }}
          />
          <Input_text
            ref={passwordCheckRef}
            value={form.newPasswordCheck}
            onChange={(event) => {
              form.setNewPasswordCheck(event.target.value);
              form.setErrorMsg(null);
            }}
            placeholder="새 비밀번호를 다시 입력해주세요"
            title={
              form.newPasswordCheck &&
              form.newPassword !== form.newPasswordCheck
                ? "비밀번호가 일치하지 않습니다."
                : ""
            }
            titleColor={errorColor}
            type="password"
            onKeyDown={(event) => {
              if (
                isEnterKey(event) &&
                isValidPassword(form.newPassword) &&
                form.newPassword === form.newPasswordCheck &&
                !form.resetLoading
              ) {
                event.currentTarget.form?.requestSubmit();
              }
            }}
          />
        </>
      );
    default:
      return null;
  }
};
