import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { Button_round } from "./Button_round";

const meta = {
  title: "Components/Button/Button_round",
  component: Button_round,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "알약 모양(border-radius 24px)의 버튼입니다. 페이지 상단의 추가 버튼이나 저장·삭제 같은 액션에 사용합니다. 기본 크기는 120×40px이며, hover 시 `default`는 보라색, `danger`는 빨간색으로 바뀝니다.",
      },
    },
  },
  argTypes: {
    children: {
      control: "text",
      description: "버튼 라벨",
    },
    variant: {
      control: "inline-radio",
      options: ["default", "danger"],
      description: "`danger`는 삭제처럼 되돌릴 수 없는 동작에 사용합니다.",
      table: { defaultValue: { summary: '"default"' } },
    },
    disabled: {
      control: "boolean",
      table: { defaultValue: { summary: "false" } },
    },
    width: {
      control: "text",
      description: "CSS 너비 값",
      table: { defaultValue: { summary: '"120px"' } },
    },
    height: {
      control: "text",
      description: "CSS 높이 값",
      table: { defaultValue: { summary: '"40px"' } },
    },
    type: {
      control: "inline-radio",
      options: ["button", "submit", "reset"],
      table: { defaultValue: { summary: '"button"' } },
    },
  },
  args: {
    children: "저장하기",
    onClick: fn(),
  },
} satisfies Meta<typeof Button_round>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "저장하기" }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

/** 삭제처럼 위험한 동작에 사용합니다. hover 시 빨간색으로 강조됩니다. */
export const Danger: Story = {
  args: {
    children: "삭제하기",
    variant: "danger",
  },
};

/** 비활성화 상태에서는 클릭해도 `onClick`이 호출되지 않습니다. */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "저장하기" });
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

/** 라벨이 길면 `width`로 너비를 늘립니다. */
export const CustomWidth: Story = {
  args: {
    children: "+ 어플리케이션 추가",
    width: "180px",
  },
};

/** 애드온 상세 페이지처럼 삭제·저장 버튼을 나란히 둔 예시입니다. */
export const ActionRow: Story = {
  args: {
    width: "160px",
  },
  render: (args) => (
    <div style={{ display: "flex", gap: 12 }}>
      <Button_round {...args} variant="danger">
        삭제하기
      </Button_round>
      <Button_round {...args}>저장하기</Button_round>
    </div>
  ),
};
