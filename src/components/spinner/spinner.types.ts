export type SpinnerSize = 'mini' | 'small' | 'medium' | 'large' | 'xl' | '2xl';

export interface SpinnerProps {
  /** Visual size of the spinner */
  size?: SpinnerSize;
  /** Use white color for on-color/inverse backgrounds */
  onColor?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Accessible label */
  'aria-label'?: string;
}
