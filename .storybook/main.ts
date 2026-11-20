import type { StorybookConfig } from "@storybook/react-vite";

import { dirname, resolve } from "path";

import { fileURLToPath } from "url";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const configDir = dirname(fileURLToPath(import.meta.url));
const modulesDir = resolve(configDir, "../modules");

const config: StorybookConfig = {
  // 스토리는 컴포넌트 옆(colocation)에 작성합니다.
  stories: [
    "../modules/xquare-user-interfaces/src/**/*.mdx",
    "../modules/xquare-user-interfaces/src/**/*.stories.@(ts|tsx)",
  ],
  addons: [
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-vitest"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-docs"),
  ],
  framework: getAbsolutePath("@storybook/react-vite"),
  async viteFinal(viteConfig) {
    const { mergeConfig } = await import("vite");

    return mergeConfig(viteConfig, {
      // 앱(vite.config.ts)과 동일하게 워크스페이스 모듈을 소스 경로로 연결합니다.
      resolve: {
        alias: {
          "@xquare/hooks": resolve(modulesDir, "xquare-hooks/index.ts"),
          "@xquare/utils": resolve(modulesDir, "xquare-utils/index.ts"),
          "@xquare/user-interfaces": resolve(
            modulesDir,
            "xquare-user-interfaces/index.ts",
          ),
        },
      },
      // 루트에는 tsconfig가 없으므로 .storybook 파일도 automatic JSX 런타임을 쓰도록 지정합니다.
      esbuild: {
        jsx: "automatic",
      },
    });
  },
};
export default config;
