import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { StepIndicator, StepLabel } from '../_step-counter';
import type { VerticalStepperItemsProps } from './vertical-stepper-items.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → _Vertical stepper items (node 34201:2271)
 * State: Not started, In progress, Completed, Error, Skeleton.
 * Column, gap 8: "Line wrapper" (24px wide, 36px tall, 1px border-subtle line centred under the indicator)
 * + "Content" row (gap 8): 24px indicator + Body 02 step name.
 */

/**
 * _VerticalStepperItems — private: one step of a vertical Stepper.
 *
 * @example
 * <VerticalStepperItems state="completed" step={2} label="Address" />
 */
export const VerticalStepperItems = forwardRef<HTMLDivElement, VerticalStepperItemsProps>(
  ({ state = 'not-started', label = 'Step name', step = 1, showLine = true, statusLabel, className, ...rest }, ref) => (
    <div
      ref={ref}
      data-state={state}
      className={cn('flex min-w-0 flex-col items-start gap-[var(--scanner-spacing-3)]', className)}
      {...rest}
    >
      {showLine && (
        <span
          aria-hidden="true"
          data-line=""
          className="flex h-[var(--scanner-stepper-line-length)] w-[var(--scanner-stepper-indicator-size)] shrink-0 justify-center"
        >
          <span className="h-full w-[var(--scanner-stepper-line-width)] bg-[var(--scanner-border-subtle)]" />
        </span>
      )}

      <div className="flex min-w-0 max-w-full items-center gap-[var(--scanner-spacing-3)]">
        <StepIndicator state={state} step={step} />
        <StepLabel
          state={state}
          label={label}
          statusLabel={statusLabel}
          skeletonClassName="w-[var(--scanner-stepper-skeleton-width-vertical)]"
        />
      </div>
    </div>
  ),
);

VerticalStepperItems.displayName = 'VerticalStepperItems';
