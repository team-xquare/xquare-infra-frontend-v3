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

export {
  checkUser,
  getCachedUserName,
  USERNAME_CACHE_KEY,
} from "./src/user/check";

export { formatDate } from "./src/formatDate";

export type { TokenReissuerOptions } from "./src/auth/tokenReissue";

export { listNotices } from "./src/notice/list";
export type { NoticeSummary, ListNoticesParams } from "./src/notice/list";

export { getNoticeDetail } from "./src/notice/detail";
export type { NoticeDetail } from "./src/notice/detail";

export { getTeamAddons } from "./src/teams/addons";
export type { TeamAddon } from "./src/teams/addons";

export { getTeams } from "./src/teams/list";
export type { Team, TeamMember } from "./src/teams/list";

export {
  saveSelectedTeam,
  getSelectedTeam,
  getSelectedTeamId,
  clearSelectedTeam,
} from "./src/teams/storage";
export type { SelectedTeamInfo } from "./src/teams/storage";
