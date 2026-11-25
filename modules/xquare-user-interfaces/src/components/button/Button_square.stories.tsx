import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { Button_square } from "./Button_square";

const meta = {
  title: "Components/Button/Button_square",
  component: Button_square,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "모서리가 둥근 사각형(border-radius 15px) 버튼입니다. 생성 폼의 취소·생성 버튼이나 폼 안의 보조 액션에 사용합니다. 기본 크기는 300×60px이며, hover 시 보라색, 누르는 동안 연보라 배경으로 바뀝니다.",
      },
    },
  },
  argTypes: {
    children: {
      control: "text",
      description: "버튼 라벨",
    },
    disabled: {
      control: "boolean",
      table: { defaultValue: { summary: "false" } },
    },
    width: {
      control: "text",
      description: "CSS 너비 값",
      table: { defaultValue: { summary: '"300px"' } },
    },
    height: {
      control: "text",
      description: "CSS 높이 값",
      table: { defaultValue: { summary: '"60px"' } },
    },
    type: {
      control: "inline-radio",
      options: ["button", "submit", "reset"],
      table: { defaultValue: { summary: '"button"' } },
    },
    // ButtonProps를 공유하지만 Button_square는 variant를 사용하지 않습니다.
    variant: {
      table: { disable: true },
    },
  },
  args: {
    children: "생성",
    onClick: fn(),
  },
} satisfies Meta<typeof Button_square>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "생성" }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

/** 폼 입력이 유효하지 않거나 요청 중일 때 사용합니다. */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "생성" });
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

/** 폼 안의 보조 액션처럼 작은 크기로 쓸 때의 예시입니다. */
export const Small: Story = {
  args: {
    children: "불러오기",
    width: "100px",
    height: "36px",
  },
};

/** 생성 페이지 하단의 취소·생성 버튼 조합입니다. */
export const FormActions: Story = {
  args: {
    width: "120px",
    height: "50px",
  },
  render: (args) => (
    <div style={{ display: "flex", gap: 12 }}>
      <Button_square {...args}>취소</Button_square>
      <Button_square {...args}>생성</Button_square>
    </div>
  ),
};
