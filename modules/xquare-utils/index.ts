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
  requireAuth,
} from "./src/auth/token";

export {
  reissueAccessToken,
  startTokenAutoReissue,
  stopTokenAutoReissue,
  isTokenAutoReissueRunning,
} from "./src/auth/tokenReissue";
