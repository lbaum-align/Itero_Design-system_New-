export type StepperItemState = 'not-started' | 'in-progress' | 'completed' | 'error' | 'skeleton';

export interface HorizontalStepperItemsProps {
  /** Current state of this step */
  state?: StepperItemState;
  /** Step label text */
  label?: string;
  /** Step number (1–8), used for the counter indicator */
  step?: number;
  /** Whether to show the connecting line before this step */
  showLine?: boolean;
  /** Additional CSS class names */
  className?: string;
}
