import type { HTMLAttributes } from 'react';

/** Visual status of the progress bar. */
export type ProgressBarStatus = 'default' | 'success' | 'error';

export interface ProgressBarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Current progress value (0–100).
   * Clamped internally. Ignored when `indeterminate` is true.
   */
  value?: number;

  /**
   * Visual status.
   * - `'default'` — blue fill (auto-resolves to `'success'` when value = 100)
   * - `'success'` — green fill with checkmark icon
   * - `'error'` — red fill with error icon and retry action
   */
  status?: ProgressBarStatus;

  /** Label text displayed above the bar. */
  label?: string;

  /** Whether to display the label row. @default true */
  showLabel?: boolean;

  /** Helper text displayed below the bar. */
  helperText?: string;

  /** Whether to display the helper text. @default true */
  showHelperText?: boolean;

  /** Error message displayed below the bar when `status` is `'error'`. */
  errorText?: string;

  /** Callback invoked when the "Try again" link is clicked in error state. */
  onRetry?: () => void;

  /** Text for the retry action link. @default 'Try again' */
  retryLabel?: string;

  /** When true, shows an animated indeterminate progress bar. */
  indeterminate?: boolean;

  /** Additional CSS class names merged onto the root element. */
  className?: string;
}
