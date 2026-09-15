import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { TooltipContainerProps } from './tooltip-container.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → _Tooltip container (node 24150:41017)
 * One variant: the dark bubble that holds the tooltip text. No caret, no shadow —
 * the caret belongs to `01 Tooltip` (see `TooltipBubble`).
 */

/**
 * _TooltipContainer — private visual shell of a tooltip (bubble + text).
 *
 * - `background-inverse` fill, 8px padding, radius medium (8px)
 * - Body 01 (16/24) in `text-inverse-primary`
 * - Hugs its content between 44px and 320px; long words wrap
 *
 * Positioning, caret and show/hide behaviour live in `Tooltip`.
 *
 * @example
 * <TooltipContainer>Text message</TooltipContainer>
 */
export const TooltipContainer = forwardRef<HTMLDivElement, TooltipContainerProps>(
  ({ children, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex shrink-0 items-start justify-center overflow-hidden',
        'min-w-[var(--scanner-tooltip-min-width)] max-w-[var(--scanner-tooltip-max-width)]',
        'gap-[var(--scanner-spacing-3)] p-[var(--scanner-spacing-3)]',
        'rounded-[var(--scanner-radius-md)] bg-[var(--scanner-bg-inverse)]',
        className,
      )}
      {...rest}
    >
      <div
        className={cn(
          'min-w-[var(--scanner-tooltip-text-min-width)] flex-1 [word-break:break-word]',
          'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
          'text-[length:var(--scanner-text-base)] leading-[var(--scanner-leading-md)]',
          'text-[color:var(--scanner-text-inverse)]',
        )}
      >
        {children}
      </div>
    </div>
  ),
);

TooltipContainer.displayName = 'TooltipContainer';
