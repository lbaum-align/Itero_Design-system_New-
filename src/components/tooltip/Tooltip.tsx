import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { FocusEvent, MouseEvent } from 'react';
import { cn } from '../../utils/cn';
import { TooltipBubble } from './TooltipBubble';
import type { TooltipAlignment, TooltipPlacement, TooltipProps } from './tooltip.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Tooltip page (15305:6754)
 * 01 Tooltip (34026:193415) placed next to a trigger, as in 02 Icon trigger tooltip (33957:20415)
 * and 03 Text trigger tooltip (31059:239): the caret tip is 4px (spacing-01) from the trigger edge
 * and always points at the trigger centre.
 *
 * Behaviour (Figma docs "States" / "Interactions"): hidden by default; appears on hover after a
 * brief delay or immediately on keyboard focus; stays open while the pointer is over the trigger
 * or the tooltip; hides on pointer leave, blur and Escape.
 */

/** Main axis: which side, with the 4px gap as padding so the pointer can cross it without closing. */
const placementClasses: Record<TooltipPlacement, string> = {
  bottom: 'top-full pt-[var(--scanner-spacing-2)]',
  top: 'bottom-full pb-[var(--scanner-spacing-2)]',
  right: 'left-full pl-[var(--scanner-spacing-2)]',
  left: 'right-full pr-[var(--scanner-spacing-2)]',
};

/** Cross axis: Start/End put the bubble edge 16px before/after the trigger centre (caret centre). */
const verticalAlignment: Record<TooltipAlignment, string> = {
  start: 'left-[calc(50%_-_var(--scanner-tooltip-anchor-offset))]',
  middle: 'left-1/2 -translate-x-1/2',
  end: 'right-[calc(50%_-_var(--scanner-tooltip-anchor-offset))]',
};

const horizontalAlignment: Record<TooltipAlignment, string> = {
  start: 'top-[calc(50%_-_var(--scanner-tooltip-anchor-offset))]',
  middle: 'top-1/2 -translate-y-1/2',
  end: 'bottom-[calc(50%_-_var(--scanner-tooltip-anchor-offset))]',
};

const DEFAULT_DELAY = 300;

/**
 * Tooltip — shows brief, non-essential information about its trigger on hover or keyboard focus.
 *
 * Figma props → React: Placement → `placement` (legacy `position`), Alignment → `alignment`,
 * Show carret → `showCaret`, Show tooltip → `open`, Text value → `content`.
 * The tooltip element has `role="tooltip"` and the trigger gets `aria-describedby`.
 *
 * @example
 * <Tooltip content="Helpful hint" placement="bottom" alignment="start">
 *   <button type="button">Hover me</button>
 * </Tooltip>
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      children,
      content,
      placement: placementProp,
      position = 'top',
      alignment = 'middle',
      showCaret = true,
      open,
      defaultOpen = false,
      onOpenChange,
      delay = DEFAULT_DELAY,
      disabled = false,
      tooltipClassName,
      className,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const placement = placementProp ?? position;
    const tooltipId = useId();
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isControlled = open !== undefined;
    const visible = !disabled && (isControlled ? open : internalOpen);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const visibleRef = useRef(visible);
    useLayoutEffect(() => {
      visibleRef.current = visible;
    }, [visible]);

    const clearTimer = useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }, []);

    const setOpen = useCallback(
      (next: boolean) => {
        clearTimer();
        if (next === visibleRef.current) return;
        if (!isControlled) setInternalOpen(next);
        onOpenChange?.(next);
      },
      [clearTimer, isControlled, onOpenChange],
    );

    /* ---- Pointer ---- */
    const handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
      onMouseEnter?.(e);
      if (disabled) return;
      clearTimer();
      if (delay > 0) timeoutRef.current = setTimeout(() => setOpen(true), delay);
      else setOpen(true);
    };

    const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
      onMouseLeave?.(e);
      setOpen(false);
    };

    /* ---- Keyboard focus ---- */
    const handleFocus = (e: FocusEvent<HTMLDivElement>) => {
      onFocus?.(e);
      if (!disabled) setOpen(true);
    };

    const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
      onBlur?.(e);
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
    };

    /* ---- Escape dismisses, wherever focus is (hover-opened tooltips too) ---- */
    useEffect(() => {
      if (!visible) return;
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      };
      document.addEventListener('keydown', onKeyDown);
      return () => document.removeEventListener('keydown', onKeyDown);
    }, [visible, setOpen]);

    useEffect(() => clearTimer, [clearTimer]);

    /* ---- aria-describedby on the trigger element when possible ---- */
    const describeTrigger = !disabled && isValidElement<{ 'aria-describedby'?: string }>(children);
    const trigger = describeTrigger
      ? cloneElement(children, {
          'aria-describedby': [children.props['aria-describedby'], tooltipId].filter(Boolean).join(' '),
        })
      : children;

    const isVertical = placement === 'top' || placement === 'bottom';

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex', className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-describedby={!describeTrigger && !disabled ? tooltipId : undefined}
        {...rest}
      >
        {trigger}

        {!disabled && (
          <div
            id={tooltipId}
            role="tooltip"
            hidden={!visible}
            data-placement={placement}
            data-alignment={alignment}
            className={cn(
              'absolute z-50 w-max',
              placementClasses[placement],
              isVertical ? verticalAlignment[alignment] : horizontalAlignment[alignment],
              tooltipClassName,
            )}
          >
            <TooltipBubble placement={placement} alignment={alignment} showCaret={showCaret}>
              {content}
            </TooltipBubble>
          </div>
        )}
      </div>
    );
  },
);

Tooltip.displayName = 'Tooltip';
