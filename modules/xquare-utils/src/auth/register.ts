const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface RegisterRequest {
  username: string;
  password: string;
  studentNumber: number;
  name: string;
  email: string;
}

export interface RegisterResponseData {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  success: boolean;
  data: RegisterResponseData;
}

export async function registerUser(
  payload: RegisterRequest
): Promise<RegisterResponse> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "회원가입 실패");
  }

  const data: RegisterResponse = await res.json();
  return data;
}
