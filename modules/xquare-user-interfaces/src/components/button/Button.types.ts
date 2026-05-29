import type { ReactNode } from "react";

// 타입 정의
export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  width?: string;
  height?: string;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "danger";
}
