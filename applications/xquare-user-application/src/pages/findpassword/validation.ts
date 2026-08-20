const EMAIL_PATTERN = /^[^\s@]+@dsm\.hs\.kr$/;
const USERNAME_PATTERN = /^[A-Za-z0-9_-]+$/;
const VERIFY_CODE_PATTERN = /^\d{6}$/;
const STUDENT_NUMBER_PATTERN = /^\d{4}$/;
const NAME_PATTERN = /^[가-힣]+$/;
const PASSWORD_SPECIAL_PATTERN = /[!@#$%^&*(),.?":{}|<>]/;

export const isValidUsername = (value: string) =>
  value.length >= 4 && value.length <= 15 && USERNAME_PATTERN.test(value);

export const isValidStudentNumber = (value: string) =>
  STUDENT_NUMBER_PATTERN.test(value) &&
  Number(value) >= 1000 &&
  Number(value) <= 3999;

export const isValidName = (value: string) => NAME_PATTERN.test(value);
export const isValidEmail = (value: string) => EMAIL_PATTERN.test(value);
export const isValidVerifyCode = (value: string) =>
  VERIFY_CODE_PATTERN.test(value);

export const isValidPassword = (value: string) =>
  value.length >= 8 &&
  value.length <= 20 &&
  PASSWORD_SPECIAL_PATTERN.test(value);
