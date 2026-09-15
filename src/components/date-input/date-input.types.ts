import type { InputHTMLAttributes } from 'react';

/** Figma "Size" (Large / Medium / Small). */
export type DateInputSize = 'large' | 'medium' | 'small';

/**
 * Figma "State" values that can be forced via `data-state` (Storybook / visual tests).
 * Enabled is the default; Disabled, Error and Skeleton have their own props.
 */
export type DateInputForcedState = 'focused';

export interface DateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Figma "Size". Default `'large'`. */
  size?: DateInputSize;
  /** Figma "Layer set": 1 → Set 01 (`background-layer-01`), 2 → Set 02 (`background-layer-02`). */
  layer?: 1 | 2;
  /** Figma State=Error — error stroke, error message and `aria-invalid`. */
  error?: boolean;
  /** Figma State=Skeleton — loading placeholder. */
  skeleton?: boolean;
  /** Figma "Label text value". */
  label?: string;
  /** Figma "Show label". Default `true` (the label renders when `label` is set). */
  showLabel?: boolean;
  /** Figma "Helper text value". Replaced by `errorText` in error state. */
  helperText?: string;
  /** Figma "Error text value" — shown below the field when `error` is true. */
  errorText?: string;
  /** Figma "Show helper" — gates both helper and error text. Default `true`. */
  showHelper?: boolean;
  /** Figma "Show explainer" — shows the explainer icon next to the label (needs `explainerText`). */
  showExplainer?: boolean;
  /** Tooltip content for the explainer icon. */
  explainerText?: string;
  /** Force a visual state on the field for screenshots / Storybook. */
  'data-state'?: DateInputForcedState;
  /** Class names for the root wrapper. */
  className?: string;
}
