import type { HTMLAttributes } from 'react';

/**
 * Visual status (Figma "Progress"):
 * - `default` — 0% / 25% / 50% / 75%: `border-interactive` fill at the current value
 * - `success` — 100%: full `border-success` fill + "Checkmark fill" icon (automatic when value reaches max)
 * - `error` — Error: full `border-error` fill, "Error" icon, optional "Try again" link and error text
 */
export type ProgressBarStatus = 'default' | 'success' | 'error';

export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Current value, any number between 0 and `max` (clamped). Figma shows 0/25/50/75/100% as examples.
   * Ignored when `indeterminate`.
   * @default 0
   */
  value?: number;
  /** Value that means complete. @default 100 */
  max?: number;
  /** Status override. Omit to get `success` automatically at `max`. */
  status?: ProgressBarStatus;
  /** Figma "Label text value". @default 'Label' */
  label?: string;
  /** Figma "Show label". @default true */
  showLabel?: boolean;
  /** Figma "Helper text value". @default 'Optional helper text' */
  helperText?: string;
  /** Figma "Show helper text". @default true */
  showHelperText?: boolean;
  /** Figma "Error text message" — replaces the helper text when `status="error"`. @default 'Error text message' */
  errorText?: string;
  /** Shows the "Try again" link in the error state and is called when it is activated. */
  onRetry?: () => void;
  /** Retry link text (Figma Link "Text value"). @default 'Try again' */
  retryLabel?: string;
  /**
   * Animated bar for unknown duration. Not a Figma variant — Figma recommends a Spinner for
   * indeterminate loading; kept for backwards compatibility.
   */
  indeterminate?: boolean;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
}
