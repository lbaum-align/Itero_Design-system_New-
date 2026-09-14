import type { TextareaHTMLAttributes } from 'react';

export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> {
  /** Label displayed above the textarea */
  label?: string;
  /** Helper text displayed below the textarea (hidden when error is active) */
  helperText?: string;
  /** Error message displayed below the textarea when `error` is true */
  errorText?: string;
  /** Tooltip content shown via help icon next to the label */
  tooltipContent?: string;
  /** Whether the field is in an error state */
  error?: boolean;
  /** Whether to render a loading skeleton placeholder */
  skeleton?: boolean;
  /** Show a character counter below the label (requires `maxLength`) */
  showCounter?: boolean;
  /**
   * Layer set — controls the field background.
   * - `1` (default): `--scanner-bg-primary`
   * - `2`: `--scanner-bg-secondary`
   */
  layer?: 1 | 2;
  /** Callback when the clear button is clicked (only shown when textarea has content) */
  onClear?: () => void;
}
