import type { Decorator, Preview } from "@storybook/react-vite";
import { Global } from "@emotion/react";
import { MemoryRouter } from "react-router-dom";

import { Xquare_colors } from "../modules/xquare-user-interfaces/src/styles/colors";
// 앱과 같은 reset + Pretendard 폰트를 사용합니다.
import globalStyles from "../applications/xquare-user-application/src/styles/global";

/**
 * useNavigate, Link, useLocation을 쓰는 컴포넌트를 위해 모든 스토리를 MemoryRouter로 감쌉니다.
 * 스토리별 시작 경로는 `parameters.router.initialEntries`로 바꿀 수 있습니다.
 */
const withRouter: Decorator = (Story, { parameters }) => (
  <MemoryRouter initialEntries={parameters.router?.initialEntries ?? ["/"]}>
    <Story />
  </MemoryRouter>
);

const withGlobalStyles: Decorator = (Story) => (
  <>
    <Global styles={globalStyles} />
    <Story />
  </>
);

const preview: Preview = {
  tags: ["autodocs"],
  decorators: [withRouter, withGlobalStyles],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        white: { name: "White", value: Xquare_colors.white as string },
        gray: {
          name: "Gray 300",
          value: (Xquare_colors.gray as Record<number, string>)[300],
        },
        dark: {
          name: "Purple 700",
          value: (Xquare_colors.purple as Record<number, string>)[700],
        },
      },
    },
    options: {
      storySort: {
        order: ["Introduction", "Foundations", "Components", "*"],
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
    actions: {
      argTypesRegex: "^on[A-Z].*",
    },
  },
  initialGlobals: {
    backgrounds: { value: "white" },
  },
};

export default preview;
