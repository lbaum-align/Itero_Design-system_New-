import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { TooltipContainer } from '../_tooltip-container';
import type { TooltipAlignment, TooltipBubbleProps, TooltipPlacement } from './tooltip.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → 01 Tooltip (node 34026:193415)
 * Placement (Left, Right, Top, Bottom) × Alignment (Start, Middle, End) = 12 variants, + Show carret.
 *
 * Auto layout per placement: Bottom = caret above the container, Top = caret below,
 * Right = caret left of it, Left = caret right of it. The caret is an 8×4 triangle
 * in `background-inverse`, 12px from the container edge (Start/End) or centred (Middle).
 */

const direction: Record<TooltipPlacement, string> = {
  bottom: 'flex-col',
  top: 'flex-col-reverse',
  right: 'flex-row',
  left: 'flex-row-reverse',
};

const crossAlign: Record<TooltipAlignment, string> = {
  start: 'items-start',
  middle: 'items-center',
  end: 'items-end',
};

/** Triangle pointing back at the trigger. */
const caretShape: Record<TooltipPlacement, string> = {
  bottom:
    'mx-[var(--scanner-tooltip-caret-inset)] h-[var(--scanner-tooltip-caret-height)] w-[var(--scanner-tooltip-caret-width)] [clip-path:polygon(50%_0,100%_100%,0_100%)]',
  top: 'mx-[var(--scanner-tooltip-caret-inset)] h-[var(--scanner-tooltip-caret-height)] w-[var(--scanner-tooltip-caret-width)] [clip-path:polygon(0_0,100%_0,50%_100%)]',
  right:
    'my-[var(--scanner-tooltip-caret-inset)] h-[var(--scanner-tooltip-caret-width)] w-[var(--scanner-tooltip-caret-height)] [clip-path:polygon(100%_0,100%_100%,0_50%)]',
  left: 'my-[var(--scanner-tooltip-caret-inset)] h-[var(--scanner-tooltip-caret-width)] w-[var(--scanner-tooltip-caret-height)] [clip-path:polygon(0_0,100%_50%,0_100%)]',
};

/**
 * TooltipBubble — the visual tooltip (container + caret) without a trigger.
 * Used by `Tooltip`; render it directly only for static documentation / onboarding layouts.
 *
 * @example
 * <TooltipBubble placement="bottom" alignment="start">Text message</TooltipBubble>
 */
export const TooltipBubble = forwardRef<HTMLDivElement, TooltipBubbleProps>(
  ({ children, placement = 'bottom', alignment = 'middle', showCaret = true, className, ...rest }, ref) => (
    <div
      ref={ref}
      data-placement={placement}
      data-alignment={alignment}
      className={cn('flex w-max', direction[placement], crossAlign[alignment], className)}
      {...rest}
    >
      {showCaret && (
        <span
          aria-hidden="true"
          data-caret=""
          className={cn('block shrink-0 bg-[var(--scanner-bg-inverse)]', caretShape[placement])}
        />
      )}
      <TooltipContainer>{children}</TooltipContainer>
    </div>
  ),
);

TooltipBubble.displayName = 'TooltipBubble';
