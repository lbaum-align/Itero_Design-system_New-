import type { HTMLAttributes } from 'react';

/** Figma "State". */
export type StepCounterState = 'not-started' | 'in-progress';

export interface StepCounterProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Figma "State": outline number (`icon-secondary`) or filled number (`icon-link`). @default 'not-started' */
  state?: StepCounterState;
  /** Figma "Step" (1–8; values outside are clamped). @default 1 */
  step?: number;
  /** Additional CSS class names */
  className?: string;
}
