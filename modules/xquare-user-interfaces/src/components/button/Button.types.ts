// 타입 정의
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  width?: string;
  height?: string;
  type?: "button" | "submit" | "reset";
}
