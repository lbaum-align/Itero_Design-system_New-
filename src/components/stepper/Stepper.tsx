import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { HorizontalStepperItems } from '../_horizontal-stepper-items';
import { VerticalStepperItems } from '../_vertical-stepper-items';
import type { StepperProps, StepState } from './stepper.types';

/**
 * Stepper — a progress indicator that guides users through a linear,
 * multi-step task and visually represents the current stage.
 *
 * PUBLIC component. Exported from the package barrel.
 *
 * Maps to Figma component "Stepper" with variants:
 *   Position: "Horizontal stepper" | "Vertical"
 *
 * @example
 * <Stepper
 *   steps={[
 *     { label: 'Personal info' },
 *     { label: 'Address' },
 *     { label: 'Payment' },
 *     { label: 'Review' },
 *   ]}
 *   currentStep={1}
 *   orientation="horizontal"
 * />
 */
export const Stepper = forwardRef<HTMLOListElement, StepperProps>(
  (
    {
      steps,
      currentStep = 0,
      orientation = 'horizontal',
      error = false,
      skeleton = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const isVertical = orientation === 'vertical';
    const clampedSteps = steps.slice(0, 8);

    const getStepState = (index: number): StepState => {
      if (skeleton) return 'skeleton';
      if (index < currentStep) return 'completed';
      if (index === currentStep) return error ? 'error' : 'in-progress';
      return 'not-started';
    };

    return (
      <ol
        ref={ref}
        className={cn(
          'flex list-none p-0 m-0',
          isVertical
            ? 'flex-col items-start gap-[var(--scanner-spacing-3)]'
            : 'items-center',
          className,
        )}
        aria-label="Progress"
        {...rest}
      >
        {clampedSteps.map((step, index) => {
          const state = getStepState(index);
          const isFirst = index === 0;

          return (
            <li
              key={index}
              className="contents"
              aria-current={state === 'in-progress' ? 'step' : undefined}
            >
              {isVertical ? (
                <VerticalStepperItems
                  state={state}
                  label={step.label}
                  step={index + 1}
                  showLine={!isFirst}
                />
              ) : (
                <HorizontalStepperItems
                  state={state}
                  label={step.label}
                  step={index + 1}
                  showLine={!isFirst}
                />
              )}
            </li>
          );
        })}
      </ol>
    );
  },
);

Stepper.displayName = 'Stepper';
