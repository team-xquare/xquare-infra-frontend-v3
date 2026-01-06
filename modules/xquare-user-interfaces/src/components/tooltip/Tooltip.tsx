/** @jsxImportSource @emotion/react */
import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import * as S from "./Tooltip.styles";
import type { TooltipProps } from "./Tooltip.types";

type TimerId = ReturnType<typeof setTimeout>;

/**
 * Tooltip 컴포넌트
 *
 * ```tsx
 * <Tooltip content="이것은 도움말입니다">
 *   <button>도움말</button>
 * </Tooltip>
 *
 * <Tooltip content="복사되었습니다" position="top" iconType="success">
 *   <IconButton icon={<CopyIcon />} />
 * </Tooltip>
 * ```
 */
const Tooltip = ({
  content,
  children,
  position = "top",
  className,
  delayShow = 200,
  delayHide = 100,
  enableTouch = true,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [adjustedPosition, setAdjustedPosition] =
    useState<TooltipProps["position"]>(position);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<TimerId | null>(null);
  const hideTimeoutRef = useRef<TimerId | null>(null);

  const adjustPosition = useCallback(() => {
    if (!containerRef.current || !popoverRef.current) return;

    const popoverRect = popoverRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const offset = 16;

    let finalPosition = position;

    if (position === "top" || position === "bottom") {
      if (popoverRect.left < offset) {
        finalPosition = position;
      } else if (popoverRect.right > viewportWidth - offset) {
        finalPosition = position;
      }

      if (position === "top" && popoverRect.top < offset) {
        finalPosition = "bottom";
      } else if (
        position === "bottom" &&
        popoverRect.bottom > viewportHeight - offset
      ) {
        finalPosition = "top";
      }
    } else if (position === "left" || position === "right") {
      if (position === "left" && popoverRect.left < offset) {
        finalPosition = "right";
      } else if (
        position === "right" &&
        popoverRect.right > viewportWidth - offset
      ) {
        finalPosition = "left";
      }
    }

    setAdjustedPosition(finalPosition);
  }, [position]);

  const showTooltip = useCallback(() => {
    if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

    showTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      requestAnimationFrame(() => {
        adjustPosition();
      });
    }, delayShow);
  }, [delayShow, adjustPosition]);

  const hideTooltip = useCallback(() => {
    if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, delayHide);
  }, [delayHide]);

  const handleMouseEnter = () => {
    showTooltip();
  };

  const handleMouseLeave = () => {
    hideTooltip();
  };

  const handleFocus = () => {
    showTooltip();
  };

  const handleBlur = () => {
    hideTooltip();
  };

  const handleTouchStart = useCallback(() => {
    if (!enableTouch) return;

    setIsVisible((prev) => {
      const next = !prev;
      if (next) {
        requestAnimationFrame(() => {
          adjustPosition();
        });
      }
      return next;
    });
  }, [enableTouch, adjustPosition]);

  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  return (
    <S.TooltipContainer
      ref={containerRef}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      <S.TooltipTrigger
        onFocus={handleFocus}
        onBlur={handleBlur}
        type="button"
        tabIndex={0}
        aria-label={typeof content === "string" ? content : "추가 정보"}
        aria-describedby={isVisible ? "tooltip-content" : undefined}
      >
        {children}
      </S.TooltipTrigger>

      {isVisible && (
        <S.TooltipPopover
          ref={popoverRef}
          $position={adjustedPosition || position}
          $isVisible={isVisible}
          id="tooltip-content"
          role="tooltip"
        >
          <S.TooltipContent>
            <S.TooltipText>{content}</S.TooltipText>
          </S.TooltipContent>
        </S.TooltipPopover>
      )}
    </S.TooltipContainer>
  );
};

export { Tooltip };
export type { TooltipProps };
