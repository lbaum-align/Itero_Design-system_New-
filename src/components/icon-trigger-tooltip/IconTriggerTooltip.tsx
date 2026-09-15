import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import { Tooltip } from '../tooltip';
import type { IconTriggerTooltipProps } from './icon-trigger-tooltip.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → 02 Icon trigger tooltip (node 33957:20415)
 * Placement (Left, Right, Top, Bottom) × Alignment (Start, Middle, End) = 12 variants, + Show tooltip.
 * Trigger: 16×16 "Help outline" in `icon-secondary`; tooltip = 01 Tooltip, caret 4px from the icon.
 */

/** Figma "Help outline / Size=16x16". */
const ICON_SIZE = 16;

/**
 * IconTriggerTooltip — a 16px help icon that reveals a tooltip on hover or keyboard focus.
 * Used as the "explainer" next to form labels.
 *
 * Figma props → React: Placement → `placement` (legacy `position`), Alignment → `alignment`,
 * Show tooltip → `open`.
 * Keyboard: Tab focuses the icon (tooltip shows), Escape hides it.
 *
 * @example
 * <IconTriggerTooltip content="Enter your legal first name" />
 * <IconTriggerTooltip content="Details" placement="top" alignment="start" />
 */
export const IconTriggerTooltip = forwardRef<HTMLDivElement, IconTriggerTooltipProps>(
  (
    {
      content,
      placement,
      position = 'bottom',
      alignment = 'middle',
      iconName = 'help',
      open,
      onOpenChange,
      delay,
      disabled = false,
      triggerLabel,
      'data-state': dataState,
      className,
      ...rest
    },
    ref,
  ) => (
    <Tooltip
      ref={ref}
      content={content}
      placement={placement ?? position}
      alignment={alignment}
      open={open}
      onOpenChange={onOpenChange}
      delay={delay}
      disabled={disabled}
      className={cn('shrink-0', className)}
      {...rest}
    >
      <button
        type="button"
        aria-label={triggerLabel ?? `Help: ${content}`}
        disabled={disabled}
        aria-disabled={disabled || undefined}
        data-state={dataState}
        className={cn(
          'group relative inline-flex shrink-0 items-center justify-center',
          'size-[var(--scanner-tooltip-trigger-icon-size)] border-0 bg-transparent p-0 outline-none',
          disabled
            ? 'cursor-not-allowed text-[color:var(--scanner-icon-disabled)]'
            : 'cursor-pointer text-[color:var(--scanner-icon-secondary)]',
        )}
      >
        <Icon name={iconName} size={ICON_SIZE} />
        {/* Focus stroke — 1px border-focus, 2px outside the icon */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute hidden rounded-[var(--scanner-radius-sm)]',
            'inset-[calc(var(--scanner-tooltip-trigger-focus-offset)*-1)]',
            'shadow-[inset_0_0_0_1px_var(--scanner-border-focus)]',
            'group-focus-visible:block group-data-[state=focused]:block',
          )}
        />
      </button>
    </Tooltip>
  ),
);

IconTriggerTooltip.displayName = 'IconTriggerTooltip';
