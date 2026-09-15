import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Tooltip } from '../tooltip';
import type { TextTriggerTooltipProps } from './text-trigger-tooltip.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → 03 Text trigger tooltip (node 31059:239)
 * Position (Top, Bottom) × Alignment (Start, Middle, End) = 6 variants, + Show tooltip, Text value.
 * Trigger: 14/20 regular `text-primary`, dotted underline, single line; tooltip caret points at the
 * text centre, 4px away.
 */

/**
 * TextTriggerTooltip — a definition tooltip on a word or short phrase.
 * Use it for terms in labels or paragraphs where an extra icon would clutter the UI.
 *
 * Figma props → React: Position → `position`, Alignment → `alignment`, Show tooltip → `open`,
 * Text value → `children`.
 * Keyboard: Tab focuses the term (tooltip shows), Escape hides it.
 *
 * @example
 * <TextTriggerTooltip content="A unique patient identifier">Patient ID</TextTriggerTooltip>
 */
export const TextTriggerTooltip = forwardRef<HTMLDivElement, TextTriggerTooltipProps>(
  (
    {
      children,
      content,
      position = 'bottom',
      alignment = 'middle',
      open,
      onOpenChange,
      delay,
      'data-state': dataState,
      className,
      ...rest
    },
    ref,
  ) => (
    <Tooltip
      ref={ref}
      content={content}
      placement={position}
      alignment={alignment}
      open={open}
      onOpenChange={onOpenChange}
      delay={delay}
      className={cn('align-baseline', className)}
      {...rest}
    >
      <button
        type="button"
        data-state={dataState}
        className={cn(
          'group relative inline cursor-pointer border-0 bg-transparent p-0 text-left outline-none',
          'whitespace-nowrap font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
          'text-[length:var(--scanner-text-sm)] leading-[var(--scanner-leading-sm)]',
          'text-[color:var(--scanner-text-primary)]',
          'underline decoration-dotted decoration-from-font [text-underline-position:from-font]',
        )}
      >
        {children}
        {/* Focus stroke — 1px border-focus, 2px outside the text (no Focused variant in Figma; matches IconTriggerTooltip) */}
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

TextTriggerTooltip.displayName = 'TextTriggerTooltip';
