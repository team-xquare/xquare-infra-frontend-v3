export interface GithubTokenRequest {
  code: string;
}

export interface GithubTokenData {
  accessToken: string;
  tokenType: string;
  scope: string;
  expiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
}

export interface GithubTokenResponse {
  success: boolean;
  data: GithubTokenData;
}
