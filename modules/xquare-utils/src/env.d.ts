/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_FRONTEND_URL: string;
  readonly VITE_GITHUB_CLIENT_ID: string;
  readonly VITE_GITHUB_APP_SLUG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}