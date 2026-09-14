import type { InputHTMLAttributes } from 'react';

/* ------------------------------------------------------------------ */
/*  Size                                                                */
/* ------------------------------------------------------------------ */

/**
 * Input size variants.
 *
 * Figma uses "X- Large" as the default, normalised here to kebab-case.
 */
export type TextInputSize = 'x-large' | 'large' | 'medium' | 'small';

/* ------------------------------------------------------------------ */
/*  Props                                                               */
/* ------------------------------------------------------------------ */

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input field size. Default: `'x-large'`. */
  size?: TextInputSize;

  /** Layer set for background styling (1 = primary, 2 = secondary). */
  layer?: 1 | 2;

  /** Label text shown above the field. */
  label?: string;

  /** Helper text shown below the field (hidden when `error` is true). */
  helperText?: string;

  /** Error text shown below the field when `error` is true. */
  errorText?: string;

  /** Whether the field is in error state. */
  error?: boolean;

  /** Tooltip content for the label explainer (help) icon. */
  tooltip?: string;

  /** Character counter display (e.g., `"0/12"`). */
  counter?: string;

  /** Whether the input shows a clear button when filled. */
  clearable?: boolean;

  /** Callback fired when the clear button is clicked. */
  onClear?: () => void;

  /** Whether to render a skeleton loading placeholder. */
  skeleton?: boolean;

  /** Additional CSS class names on the root wrapper. */
  className?: string;
}
