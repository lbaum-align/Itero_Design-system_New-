import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { StepIndicator, StepLabel } from '../_step-counter';
import type { HorizontalStepperItemsProps } from './horizontal-stepper-items.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → _Horizontal stepper items (node 34201:2302)
 * State: Not started, In progress, Completed, Error, Skeleton.
 * Row, gap 8, centred: "Line wrapper" (36×20, 1px border-subtle line) + "Content" row (gap 8):
 * 24px indicator + Body 02 step name.
 */

/**
 * _HorizontalStepperItems — private: one step of a horizontal Stepper.
 *
 * @example
 * <HorizontalStepperItems state="in-progress" step={2} label="Address" />
 */
export const HorizontalStepperItems = forwardRef<HTMLDivElement, HorizontalStepperItemsProps>(
  ({ state = 'not-started', label = 'Step name', step = 1, showLine = true, statusLabel, className, ...rest }, ref) => (
    <div
      ref={ref}
      data-state={state}
      className={cn('flex min-w-0 items-center gap-[var(--scanner-spacing-3)]', className)}
      {...rest}
    >
      {showLine && (
        <span
          aria-hidden="true"
          data-line=""
          className="flex h-[var(--scanner-stepper-line-wrapper-height)] w-[var(--scanner-stepper-line-length)] shrink-0 items-center"
        >
          <span className="h-[var(--scanner-stepper-line-width)] w-full bg-[var(--scanner-border-subtle)]" />
        </span>
      )}

      <div className="flex min-w-0 items-center gap-[var(--scanner-spacing-3)]">
        <StepIndicator state={state} step={step} />
        <StepLabel
          state={state}
          label={label}
          statusLabel={statusLabel}
          skeletonClassName="w-[var(--scanner-stepper-skeleton-width-horizontal)]"
        />
      </div>
    </div>
  ),
);

HorizontalStepperItems.displayName = 'HorizontalStepperItems';
