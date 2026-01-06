import type { ReactNode } from "react";

export type TooltipPosition = "top" | "bottom" | "left" | "right";
export type TooltipIconType =
  | "info"
  | "question"
  | "warning"
  | "error"
  | "success";

export interface TooltipProps {
  /** 툴팁 팝오버에 표시될 내용 (150자 내외 권장) */
  content: string | ReactNode;
  /** 툴팁을 트리거하는 요소 */
  children: ReactNode;
  /** 툴팁의 표시 위치 (기본값: "top") */
  position?: TooltipPosition;
  /** 활성화 시 추가 CSS 클래스 */
  className?: string;
  /** 팝오버 활성화 지연 시간 (ms) */
  delayShow?: number;
  /** 팝오버 비활성화 지연 시간 (ms) */
  delayHide?: number;
  /** 터치 환경에서 동작 허용 여부 */
  enableTouch?: boolean;
}
