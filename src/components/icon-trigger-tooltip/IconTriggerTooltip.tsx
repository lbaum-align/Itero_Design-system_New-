import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import { Tooltip } from '../tooltip';
import type { IconTriggerTooltipProps } from './icon-trigger-tooltip.types';

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * IconTriggerTooltip — a help / info icon that shows a tooltip on hover.
 *
 * Renders a 16 px icon (default: help) wrapped in a `Tooltip`.
 * Commonly used next to form labels to provide additional context.
 *
 * @example
 * <IconTriggerTooltip content="Enter your legal first name" />
 * <IconTriggerTooltip content="Details" iconName="info" position="right" />
 */
export const IconTriggerTooltip = forwardRef<HTMLDivElement, IconTriggerTooltipProps>(
  (
    { content, position = 'bottom', iconName = 'help', className, ...rest },
    ref,
  ) => {
    return (
      <Tooltip ref={ref} content={content} position={position} className={className} {...rest}>
        <button
          type="button"
          className={cn(
            'inline-flex items-center justify-center',
            'size-[16px] shrink-0',
            'cursor-pointer rounded-full',
            'text-[color:var(--scanner-icon-secondary)]',
            // Focus ring
            'focus-visible:outline-2 focus-visible:outline-offset-2',
            'focus-visible:outline-[var(--scanner-focus-ring)]',
          )}
          tabIndex={0}
          aria-label={`Help: ${content}`}
        >
          <Icon name={iconName} size={16} />
        </button>
      </Tooltip>
    );
  },
);

IconTriggerTooltip.displayName = 'IconTriggerTooltip';
