export type { RegisterRequest, RegisterResponse } from "./src/auth/register";
export { registerUser } from "./src/auth/register";

export type { LoginRequest, LoginResponse } from "./src/auth/login";
export { loginUser } from "./src/auth/login";

export {
  setTokens,
  setAccessToken,
  getAccessToken,
  getRefreshToken,
  clearAllTokens,
  hasAccessToken,
  hasRefreshToken,
  isAuthenticated,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from "./src/auth/token";

export {
  TokenReissuer,
  reissueAccessToken,
  startTokenAutoReissue,
  stopTokenAutoReissue,
  isTokenAutoReissueRunning,
  createTokenReissuer,
  AUTH_RELOGIN_EVENT,
} from "./src/auth/tokenReissue";

export type { TokenReissuerOptions } from "./src/auth/tokenReissue";
