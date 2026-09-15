import type { HTMLAttributes } from 'react';
import type { StepperItemState } from '../_step-counter';

export type { StepperItemState };

export interface HorizontalStepperItemsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Figma "State". @default 'not-started' */
  state?: StepperItemState;
  /** "Step name" text. @default 'Step name' */
  label?: string;
  /** Step number (1–8) for the counter indicator. @default 1 */
  step?: number;
  /** Show the progress line before the step (hidden for the first step in Stepper). @default true */
  showLine?: boolean;
  /** Visually hidden status appended to the label for screen readers (set by Stepper). */
  statusLabel?: string;
  /** Additional CSS class names */
  className?: string;
}
