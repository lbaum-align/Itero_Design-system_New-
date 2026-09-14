export type StepperOrientation = 'horizontal' | 'vertical';

export type StepState = 'not-started' | 'in-progress' | 'completed' | 'error' | 'skeleton';

export interface StepItem {
  /** Label text for this step */
  label: string;
}

export interface StepperProps {
  /** Array of steps to display (max 8) */
  steps: StepItem[];
  /**
   * Zero-based index of the current (active) step.
   * Steps before this are "completed", this step is "in-progress",
   * and steps after are "not-started".
   * @default 0
   */
  currentStep?: number;
  /** Layout orientation */
  orientation?: StepperOrientation;
  /**
   * When true, the current step shows an error state
   * instead of the in-progress state.
   */
  error?: boolean;
  /** When true, all steps render in skeleton loading state. */
  skeleton?: boolean;
  /** Additional CSS class names */
  className?: string;
}
