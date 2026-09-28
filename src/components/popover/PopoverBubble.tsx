import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { PopoverAlignment, PopoverBubbleProps, PopoverPlacement } from './popover.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Popover (node 33048:29710, page "Popover" 24156:42899)
 * Placement (Left, Right, Top, Bottom) × Alignment (Start, Middle, End) = 12 variants, + Show carret.
 *
 * Auto layout per placement (same structure as 01 Tooltip): Bottom = caret above the container, Top = below,
 * Right = caret left of it, Left = caret right of it. Caret "Carret": 8×4 triangle in `background-elevated`,
 * centred in a 52px frame with 12px padding → 22px from the container edge (Start/End) or centred (Middle).
 * Container "Tooltip": `background-elevated`, padding spacing-04 (16px), gap 16px, radius medium (8px),
 * hugs content between 44px and 320px, no shadow or stroke.
 */

const direction: Record<PopoverPlacement, string> = {
  bottom: 'flex-col',
  top: 'flex-col-reverse',
  right: 'flex-row',
  left: 'flex-row-reverse',
};

const crossAlign: Record<PopoverAlignment, string> = {
  start: 'items-start',
  middle: 'items-center',
  end: 'items-end',
};

/** Triangle pointing back at the trigger. */
const caretShape: Record<PopoverPlacement, string> = {
  bottom:
    'mx-[var(--scanner-popover-caret-inset)] h-[var(--scanner-popover-caret-height)] w-[var(--scanner-popover-caret-width)] [clip-path:polygon(50%_0,100%_100%,0_100%)]',
  top: 'mx-[var(--scanner-popover-caret-inset)] h-[var(--scanner-popover-caret-height)] w-[var(--scanner-popover-caret-width)] [clip-path:polygon(0_0,100%_0,50%_100%)]',
  right:
    'my-[var(--scanner-popover-caret-inset)] h-[var(--scanner-popover-caret-width)] w-[var(--scanner-popover-caret-height)] [clip-path:polygon(100%_0,100%_100%,0_50%)]',
  left: 'my-[var(--scanner-popover-caret-inset)] h-[var(--scanner-popover-caret-width)] w-[var(--scanner-popover-caret-height)] [clip-path:polygon(0_0,100%_50%,0_100%)]',
};

/**
 * PopoverBubble — the visual popover (container + caret) without a trigger.
 * Used by `Popover`; render it directly only for static layouts and documentation.
 *
 * @example
 * <PopoverBubble placement="bottom" alignment="start"><SlotContent /></PopoverBubble>
 */
export const PopoverBubble = forwardRef<HTMLDivElement, PopoverBubbleProps>(
  (
    {
      children,
      placement = 'bottom',
      alignment = 'start',
      showCaret = true,
      containerClassName,
      className,
      ...rest
    },
    ref,
  ) => (
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
          className={cn('block shrink-0 bg-[var(--scanner-bg-elevated)]', caretShape[placement])}
        />
      )}
      <div
        data-popover-container=""
        className={cn(
          'relative flex shrink-0 flex-col items-center overflow-clip',
          'min-w-[var(--scanner-popover-min-width)] max-w-[var(--scanner-popover-max-width)]',
          'gap-[var(--scanner-spacing-5)] p-[var(--scanner-spacing-5)] rounded-[var(--scanner-radius-md)]',
          'bg-[var(--scanner-bg-elevated)] shadow-[var(--scanner-popover-shadow)]',
          'font-[family-name:var(--scanner-font-sans)] text-[color:var(--scanner-text-primary)]',
          containerClassName,
        )}
      >
        {children}
      </div>
    </div>
  ),
);

PopoverBubble.displayName = 'PopoverBubble';
