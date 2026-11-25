import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { NavItem, type ButtonProps } from "./navitem";
import { Xquare_colors } from "../../styles/colors";

const meta = {
  title: "Components/Navigation/NavItem",
  component: NavItem,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "탭 형태의 내비게이션 항목입니다. 배포 상세 페이지의 Summary / Deployment / Secret / Routes / Log 탭에 사용합니다. 선택 상태는 부모가 `active`로 관리합니다.",
      },
    },
  },
  argTypes: {
    children: {
      control: "text",
      description: "탭 라벨",
    },
    active: {
      control: "boolean",
      description: "선택된 탭이면 연보라 배경과 보라색 테두리로 표시됩니다.",
      table: { defaultValue: { summary: "false" } },
    },
  },
  args: {
    children: "Summary",
    onClick: fn(),
  },
} satisfies Meta<typeof NavItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Summary" }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Active: Story = {
  args: {
    active: true,
  },
};

const DEPLOYMENT_TABS = ["Summary", "Deployment", "Secret", "Routes", "Log"];

const NavTabs = ({ onClick }: Pick<ButtonProps, "onClick">) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        height: 35,
        borderRadius: 12,
        border: `2px solid ${Xquare_colors.gray[500]}`,
        backgroundColor: Xquare_colors.white as string,
      }}
    >
      {DEPLOYMENT_TABS.map((label, index) => (
        <NavItem
          key={label}
          active={activeTab === index}
          onClick={() => {
            setActiveTab(index);
            onClick?.();
          }}
        >
          {label}
        </NavItem>
      ))}
    </div>
  );
};

/** 배포 상세 페이지의 탭 바 예시입니다. 탭을 클릭하면 선택 상태가 바뀝니다. */
export const DeploymentTabs: Story = {
  render: (args) => <NavTabs onClick={args.onClick} />,
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Secret" }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
