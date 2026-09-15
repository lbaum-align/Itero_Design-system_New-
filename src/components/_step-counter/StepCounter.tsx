import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { NumberIcon } from './step-icons';
import { clampStep } from './step-utils';
import type { StepCounterProps } from './step-counter.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → _Step counter (node 34201:2238)
 * State (Not started, In progress) × Step (1–8) = 16 variants.
 * Each variant is a 24×24 icon: "Number outline / N" in icon-secondary, or "Number filled / N" in icon-link.
 */

/**
 * _StepCounter — private step-number indicator used by the stepper items.
 * Decorative (`aria-hidden`); the step's position and state are announced by `Stepper`.
 *
 * @example
 * <StepCounter state="in-progress" step={2} />
 */
export const StepCounter = forwardRef<HTMLSpanElement, StepCounterProps>(
  ({ state = 'not-started', step = 1, className, ...rest }, ref) => {
    const isInProgress = state === 'in-progress';
    return (
      <span
        ref={ref}
        aria-hidden="true"
        data-state={state}
        data-step={clampStep(step)}
        className={cn(
          'inline-flex size-[var(--scanner-stepper-indicator-size)] shrink-0 items-center justify-center',
          isInProgress ? 'text-[color:var(--scanner-icon-link)]' : 'text-[color:var(--scanner-icon-secondary)]',
          className,
        )}
        {...rest}
      >
        <NumberIcon step={step} filled={isInProgress} className="size-full" />
      </span>
    );
  },
);

StepCounter.displayName = 'StepCounter';
