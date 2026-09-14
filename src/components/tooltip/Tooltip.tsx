import {
  forwardRef,
  useState,
  useRef,
  useCallback,
  useEffect,
  useId,
} from 'react';
import { cn } from '../../utils/cn';
import { TooltipContainer } from '../_tooltip-container';
import type { TooltipPosition } from '../_tooltip-container';
import type { TooltipProps } from './tooltip.types';

/* ------------------------------------------------------------------ */
/*  Positioning classes                                                */
/* ------------------------------------------------------------------ */

/**
 * CSS classes that position the `TooltipContainer` relative to its trigger.
 *
 * Each placement is:
 *  - anchored to the opposite edge of the trigger (`top-full`, etc.)
 *  - centered along the perpendicular axis (`left-1/2 -translate-x-1/2`)
 *  - offset by 8 px (6 px arrow + 2 px visual gap) via margin
 *  - elevated above surrounding content with `z-50`
 */
const positionClasses: Record<TooltipPosition, string> = {
  top: 'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50',
  bottom: 'absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50',
  left: 'absolute right-full top-1/2 -translate-y-1/2 mr-2 z-50',
  right: 'absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50',
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Tooltip — behavioural wrapper around `_TooltipContainer`.
 *
 * Shows an informational tooltip on hover / focus of the trigger
 * element (passed as `children`). The tooltip is rendered inline
 * using CSS positioning (no portal).
 *
 * @example
 * <Tooltip content="Helpful hint" position="top">
 *   <button>Hover me</button>
 * </Tooltip>
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    { children, content, position = 'top', delay = 0, className, ...rest },
    ref,
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const tooltipId = useId();

    /* ---- Show / hide helpers ---- */

    const show = useCallback(() => {
      if (delay > 0) {
        timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
      } else {
        setIsVisible(true);
      }
    }, [delay]);

    const hide = useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsVisible(false);
    }, []);

    /* ---- Dismiss on Escape ---- */

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Escape' && isVisible) {
          hide();
        }
      },
      [isVisible, hide],
    );

    /* ---- Cleanup on unmount ---- */

    useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex', className)}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onKeyDown={handleKeyDown}
        aria-describedby={isVisible ? tooltipId : undefined}
        {...rest}
      >
        {children}

        {isVisible && (
          <TooltipContainer
            id={tooltipId}
            position={position}
            className={positionClasses[position]}
          >
            {content}
          </TooltipContainer>
        )}
      </div>
    );
  },
);

Tooltip.displayName = 'Tooltip';
