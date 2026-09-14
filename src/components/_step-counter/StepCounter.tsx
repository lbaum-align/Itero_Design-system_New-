import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { StepCounterProps } from './step-counter.types';

/**
 * _StepCounter — a circular indicator showing the step number.
 *
 * PRIVATE sub-component. Not exported from the package barrel.
 *
 * - "not-started": outlined circle with muted number
 * - "in-progress": filled brand-blue circle with white number
 *
 * Maps to Figma component "_Step counter" with variants:
 *   State: "Not started" | "In progress"
 *   Step: 1–8
 */
export const StepCounter = forwardRef<HTMLSpanElement, StepCounterProps>(
  ({ state = 'not-started', step = 1, className, ...rest }, ref) => {
    const displayStep = Math.min(Math.max(Math.round(step), 1), 8);
    const isInProgress = state === 'in-progress';

    return (
      <span
        ref={ref}
        className={cn(
          // Base: 24x24 circle, centered content
          'inline-flex size-[24px] shrink-0 items-center justify-center',
          'rounded-[var(--scanner-radius-full)]',
          'font-[family-name:var(--scanner-font-sans)]',
          'text-[length:var(--scanner-text-xs)] leading-[var(--scanner-leading-xs)]',
          'font-[number:var(--scanner-font-regular)]',
          'select-none',
          // State-specific styling
          isInProgress
            ? [
                'bg-[var(--scanner-bg-brand)]',
                'text-[color:var(--scanner-text-on-color)]',
              ]
            : [
                'border border-solid border-[var(--scanner-border-default)]',
                'bg-transparent',
                'text-[color:var(--scanner-text-secondary)]',
              ],
          className,
        )}
        aria-hidden="true"
        {...rest}
      >
        {displayStep}
      </span>
    );
  },
);

StepCounter.displayName = 'StepCounter';
