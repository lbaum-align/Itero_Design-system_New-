import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Tooltip } from '../tooltip';
import type { TextTriggerTooltipProps } from './text-trigger-tooltip.types';

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * TextTriggerTooltip — underlined text that shows a tooltip on hover.
 *
 * Renders a dotted-underline text span that reveals a tooltip on
 * hover / focus. Commonly used for inline definitions or glossary terms.
 * Only top and bottom positions are supported (matching Figma).
 *
 * @example
 * <TextTriggerTooltip content="A unique patient identifier">
 *   Patient ID
 * </TextTriggerTooltip>
 */
export const TextTriggerTooltip = forwardRef<HTMLDivElement, TextTriggerTooltipProps>(
  ({ children, content, position = 'bottom', className, ...rest }, ref) => {
    return (
      <Tooltip ref={ref} content={content} position={position} className={className} {...rest}>
        <span
          className={cn(
            'inline cursor-pointer',
            // Typography: Figma Body/$tp-body-02 → 14px / 20px regular
            'font-[family-name:var(--scanner-font-sans)]',
            'text-[length:var(--scanner-text-sm)] leading-[var(--scanner-leading-sm)]',
            'font-[number:var(--scanner-font-regular)]',
            // Color
            'text-[color:var(--scanner-text-primary)]',
            // Dotted underline
            'underline decoration-dotted decoration-from-font underline-offset-2',
            // Focus ring
            'focus-visible:outline-2 focus-visible:outline-offset-2',
            'focus-visible:outline-[var(--scanner-focus-ring)]',
            'rounded-[var(--scanner-radius-sm)]',
          )}
          role="term"
          tabIndex={0}
        >
          {children}
        </span>
      </Tooltip>
    );
  },
);

TextTriggerTooltip.displayName = 'TextTriggerTooltip';
