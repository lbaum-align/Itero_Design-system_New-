export type StepCounterState = 'not-started' | 'in-progress';

export interface StepCounterProps {
  /** Current state of the step counter */
  state?: StepCounterState;
  /** Step number (1–8) */
  step?: number;
  /** Additional CSS class names */
  className?: string;
}
