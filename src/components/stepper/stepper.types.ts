import type { OlHTMLAttributes } from 'react';
import type { StepperItemState } from '../_step-counter';

export type StepperOrientation = 'horizontal' | 'vertical';

/** Figma "Position" values, as React literals. */
export type StepperPosition = StepperOrientation;

/** Figma stepper item "State". */
export type StepState = StepperItemState;

export interface StepItem {
  /** "Step name" */
  label: string;
  /** Explicit state for this step; overrides the state derived from `currentStep` / `error` / `skeleton`. */
  state?: StepState;
}

export interface StepperProps extends OlHTMLAttributes<HTMLOListElement> {
  /** Steps to display (Figma supports up to 8; extra steps are not rendered). */
  steps: StepItem[];
  /**
   * Zero-based index of the current step: earlier steps are Completed, this one In progress,
   * later ones Not started. Use `steps.length` for "all completed".
   * @default 0
   */
  currentStep?: number;
  /** Layout (Figma "Position": Horizontal stepper / Vertical). @default 'horizontal' */
  orientation?: StepperOrientation;
  /** Alias of `orientation` using the Figma property name. Takes precedence. */
  position?: StepperPosition;
  /** The current step shows the Error state instead of In progress. */
  error?: boolean;
  /** Every step renders the Skeleton state. */
  skeleton?: boolean;
  /**
   * Visually hidden status announced after each label.
   * @default { 'not-started': 'not started', 'in-progress': 'current step', completed: 'completed', error: 'error' }
   */
  statusLabels?: Partial<Record<Exclude<StepState, 'skeleton'>, string>>;
  /** Additional CSS class names */
  className?: string;
}
