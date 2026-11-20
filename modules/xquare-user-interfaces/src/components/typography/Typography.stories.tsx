import type { Meta, StoryObj } from "@storybook/react-vite";

import { Typography } from "./Typography";
import { fontSizes, fontWeights } from "./Typography.styles";
import { Xquare_colors } from "../../styles/colors";

type FontSize = keyof typeof fontSizes;
type FontWeight = keyof typeof fontWeights;

const sizeKeys = Object.keys(fontSizes) as FontSize[];
const weightKeys = Object.keys(fontWeights) as FontWeight[];

const SAMPLE_TEXT = "XQUARE 인프라로 쉽게 배포하세요";

const meta = {
  title: "Foundations/Typography",
  component: Typography,
  parameters: {
    docs: {
      description: {
        component:
          "Pretendard 기반 텍스트 컴포넌트입니다. `size`는 `fontSizes`(1x~11x), `weight`는 `fontWeights` 토큰을 사용합니다. 기본 태그는 `span`이며 `as`로 바꿀 수 있습니다.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: sizeKeys,
      description: "글자 크기 토큰",
      table: { defaultValue: { summary: '"3x" (14px)' } },
    },
    weight: {
      control: "select",
      options: weightKeys,
      description: "글자 굵기 토큰",
      table: { defaultValue: { summary: '"regular" (400)' } },
    },
    color: {
      control: "color",
      description: "글자 색상 (`Xquare_colors` 값 사용 권장)",
      table: { defaultValue: { summary: '"#000"' } },
    },
    align: {
      control: "inline-radio",
      options: ["left", "center", "right", "justify"],
      table: { defaultValue: { summary: '"left"' } },
    },
    underline: {
      control: "boolean",
      table: { defaultValue: { summary: "false" } },
    },
    as: {
      control: "select",
      options: ["span", "p", "h1", "h2", "h3", "label", "div"],
      description: "렌더링할 HTML 태그",
      table: { defaultValue: { summary: '"span"' } },
    },
    children: {
      control: "text",
    },
  },
  args: {
    children: SAMPLE_TEXT,
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controls 패널에서 모든 prop을 바꿔볼 수 있는 기본 스토리입니다. */
export const Default: Story = {
  args: {
    size: "3x",
    weight: "regular",
  },
};

/** 사용 가능한 크기 토큰 전체입니다. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {sizeKeys.map((size) => (
        <div
          key={size}
          style={{ display: "flex", alignItems: "baseline", gap: 16 }}
        >
          <code style={{ width: 96, flexShrink: 0, fontSize: 12 }}>
            {size} · {fontSizes[size]}
          </code>
          <Typography {...args} size={size} />
        </div>
      ))}
    </div>
  ),
};

/** 사용 가능한 굵기 토큰 전체입니다. */
export const Weights: Story = {
  args: {
    size: "6x",
  },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {weightKeys.map((weight) => (
        <div
          key={weight}
          style={{ display: "flex", alignItems: "baseline", gap: 16 }}
        >
          <code style={{ width: 128, flexShrink: 0, fontSize: 12 }}>
            {weight} · {fontWeights[weight]}
          </code>
          <Typography {...args} weight={weight} />
        </div>
      ))}
    </div>
  ),
};

/** `align`은 블록 요소일 때 의미가 있으므로 `as="p"`와 함께 사용합니다. */
export const Alignment: Story = {
  args: {
    as: "p",
  },
  render: (args) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: 360,
        border: `1px dashed ${Xquare_colors.gray[400]}`,
        padding: 8,
      }}
    >
      {(["left", "center", "right"] as const).map((align) => (
        <Typography key={align} {...args} align={align}>
          {align}
        </Typography>
      ))}
    </div>
  ),
};

export const Underline: Story = {
  args: {
    underline: true,
    color: Xquare_colors.purple[500] as string,
  },
};

/** 시맨틱 태그가 필요할 때는 `as`로 태그를 지정합니다. */
export const AsHeading: Story = {
  args: {
    as: "h1",
    size: "9x",
    weight: "bold",
  },
};
