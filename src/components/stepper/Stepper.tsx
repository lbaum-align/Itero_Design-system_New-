import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { HorizontalStepperItems } from '../_horizontal-stepper-items';
import { VerticalStepperItems } from '../_vertical-stepper-items';
import type { StepperProps, StepState } from './stepper.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Stepper (node 34201:2333)
 * Position: Horizontal stepper (row, gap 8) | Vertical (column, gap 8), up to 8 steps.
 * The first step hides its progress line.
 */

const MAX_STEPS = 8;

const defaultStatusLabels: Record<Exclude<StepState, 'skeleton'>, string> = {
  'not-started': 'not started',
  'in-progress': 'current step',
  completed: 'completed',
  error: 'error',
};

/**
 * Stepper — progress indicator for a linear multi-step task (form wizard, onboarding).
 * Not interactive. Use Breadcrumbs or Tabs for non-linear navigation.
 *
 * Figma props → React: Position → `orientation` / `position`; item State → derived from
 * `currentStep`, `error`, `skeleton`, or set per step with `steps[i].state`.
 * ARIA: an ordered list named "Progress"; the current step has `aria-current="step"` and every
 * label carries a visually hidden status.
 *
 * @example
 * <Stepper steps={[{ label: 'Personal info' }, { label: 'Address' }, { label: 'Review' }]} currentStep={1} />
 */
export const Stepper = forwardRef<HTMLOListElement, StepperProps>(
  (
    {
      steps,
      currentStep = 0,
      orientation = 'horizontal',
      position,
      error = false,
      skeleton = false,
      statusLabels,
      className,
      'aria-label': ariaLabel = 'Progress',
      ...rest
    },
    ref,
  ) => {
    const isVertical = (position ?? orientation) === 'vertical';
    const labels = { ...defaultStatusLabels, ...statusLabels };
    const visibleSteps = steps.slice(0, MAX_STEPS);

    const stateFor = (index: number): StepState => {
      if (skeleton) return 'skeleton';
      const explicit = visibleSteps[index].state;
      if (explicit) return explicit;
      if (index < currentStep) return 'completed';
      if (index === currentStep) return error ? 'error' : 'in-progress';
      return 'not-started';
    };

    const Item = isVertical ? VerticalStepperItems : HorizontalStepperItems;

    return (
      <ol
        ref={ref}
        aria-label={ariaLabel}
        aria-busy={skeleton || undefined}
        data-orientation={isVertical ? 'vertical' : 'horizontal'}
        className={cn(
          'm-0 flex list-none gap-[var(--scanner-spacing-3)] p-0',
          isVertical ? 'flex-col items-start' : 'flex-row items-center',
          className,
        )}
        {...rest}
      >
        {visibleSteps.map((step, index) => {
          const state = stateFor(index);
          return (
            <li
              key={index}
              className="flex min-w-0 max-w-full"
              aria-current={index === currentStep && !skeleton ? 'step' : undefined}
            >
              <Item
                state={state}
                label={step.label}
                step={index + 1}
                showLine={index > 0}
                statusLabel={state === 'skeleton' ? undefined : labels[state]}
              />
            </li>
          );
        })}
      </ol>
    );
  },
);

Stepper.displayName = 'Stepper';
