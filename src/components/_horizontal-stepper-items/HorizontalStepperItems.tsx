import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import { StepCounter } from '../_step-counter';
import type { HorizontalStepperItemsProps } from './horizontal-stepper-items.types';

/**
 * _HorizontalStepperItems — a single step in a horizontal stepper layout.
 *
 * PRIVATE sub-component. Not exported from the package barrel.
 *
 * Renders: optional connecting line + step indicator + label.
 *
 * Maps to Figma component "_Horizontal stepper items" with variants:
 *   State: "Not started" | "In progress" | "Completed" | "Error" | "Skeleton"
 */
export const HorizontalStepperItems = forwardRef<HTMLDivElement, HorizontalStepperItemsProps>(
  (
    {
      state = 'not-started',
      label = 'Step name',
      step = 1,
      showLine = true,
      className,
      ...rest
    },
    ref,
  ) => {
    const isInProgress = state === 'in-progress';
    const isCompleted = state === 'completed';
    const isError = state === 'error';
    const isSkeleton = state === 'skeleton';

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-[var(--scanner-spacing-3)]',
          className,
        )}
        {...rest}
      >
        {/* Connecting line */}
        {showLine && (
          <div className="flex h-[20px] w-[36px] shrink-0 items-center">
            <div className="h-px w-full border-t border-solid border-[var(--scanner-border-subtle)]" />
          </div>
        )}

        {/* Content: indicator + label */}
        <div className="flex items-center gap-[var(--scanner-spacing-3)]">
          {/* Indicator */}
          {(state === 'not-started' || isInProgress || isSkeleton) && (
            <StepCounter
              state={isInProgress ? 'in-progress' : 'not-started'}
              step={step}
            />
          )}
          {isCompleted && (
            <span className="inline-flex size-[24px] shrink-0 items-center justify-center text-[color:var(--scanner-icon-success)]">
              <Icon name="checkmark" size={24} />
            </span>
          )}
          {isError && (
            <span className="inline-flex size-[24px] shrink-0 items-center justify-center text-[color:var(--scanner-icon-error)]">
              <Icon name="error" size={24} />
            </span>
          )}

          {/* Label or skeleton placeholder */}
          {isSkeleton ? (
            <div
              className="h-[16px] w-[78px] rounded-[var(--scanner-radius-sm)] bg-[var(--scanner-bg-hover)]"
              aria-hidden="true"
            />
          ) : (
            <span
              className={cn(
                'truncate font-[family-name:var(--scanner-font-sans)]',
                'text-[length:18px] leading-[var(--scanner-leading-lg)]',
                'font-[number:var(--scanner-font-regular)]',
                isInProgress
                  ? 'text-[color:var(--scanner-text-primary)]'
                  : 'text-[color:var(--scanner-text-secondary)]',
              )}
            >
              {label}
            </span>
          )}
        </div>
      </div>
    );
  },
);

HorizontalStepperItems.displayName = 'HorizontalStepperItems';
