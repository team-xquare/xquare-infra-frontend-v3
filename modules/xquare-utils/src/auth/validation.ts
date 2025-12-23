/* 인증 응답 검증 함수 및 타입 정의
 * /auth/login, /auth/register 모두에서 사용되는 공통 응답 검증 로직
 */

export interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  data: AuthResponseData;
}

/**
 * 인증 응답 데이터 검증
 * @param data - 검증할 응답 데이터
 * @param context - 오류 메시지에 사용될 컨텍스트 (예: "login", "register")
 * @throws {Error} 검증 실패 시 구체적인 오류 발생
 */
export function validateAuthResponse(data: unknown, context = "auth"): void {
  const typedData = data as AuthResponse;

  if (typeof typedData.success !== "boolean") {
    throw new Error(
      `[${context}] 잘못된 응답 형식: success 필드가 boolean이 아닙니다.`
    );
  }

  if (!typedData.data || typeof typedData.data !== "object") {
    throw new Error(
      `[${context}] 잘못된 응답 형식: data 필드가 없거나 객체가 아닙니다.`
    );
  }

  if (
    typeof typedData.data.accessToken !== "string" ||
    typedData.data.accessToken.trim() === ""
  ) {
    throw new Error(
      `[${context}] 잘못된 응답 형식: accessToken이 없거나 비어있는 문자열입니다.`
    );
  }

  if (
    typeof typedData.data.refreshToken !== "string" ||
    typedData.data.refreshToken.trim() === ""
  ) {
    throw new Error(
      `[${context}] 잘못된 응답 형식: refreshToken이 없거나 비어있는 문자열입니다.`
    );
  }
}
