import type { InputHTMLAttributes } from 'react';

/** Figma "Size" (X- Large / Large / Medium / Small). */
export type TextInputSize = 'x-large' | 'large' | 'medium' | 'small';

/**
 * Figma "State" values that can be forced via `data-state` (Storybook / visual tests).
 * Enabled is the default; Disabled, Error and Skeleton have their own props.
 */
export type TextInputForcedState = 'focused';

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Figma "Size". Default `'x-large'`. */
  size?: TextInputSize;
  /** Figma "Layer set": 1 → Set 01 (`background-layer-01`), 2 → Set 02 (`background-layer-02`). */
  layer?: 1 | 2;
  /** Figma "Label text value". Omit for "Show label: False". */
  label?: string;
  /** Figma "Helper text value". Omit for "Show helper: False". Replaced by `errorText` in error state. */
  helperText?: string;
  /** Figma "Error text value" — shown when `error` is true. */
  errorText?: string;
  /** Figma State=Error — error stroke, error message and `aria-invalid`. */
  error?: boolean;
  /** Figma "Show explainer" — tooltip content for the explainer icon next to the label. */
  tooltip?: string;
  /** Figma "Counter value" (e.g. `"0/12"`). Setting it shows the counter. */
  counter?: string;
  /** Figma "Show counter" — renders `{length}/{maxLength}` automatically when `counter` is not given. */
  showCounter?: boolean;
  /** Figma "Clearable" — shows a clear (×) button while the field has a value. Escape also clears. */
  clearable?: boolean;
  /** Called after the clear button (or Escape) empties the field. `onChange` also fires with an empty value. */
  onClear?: () => void;
  /** Figma State=Skeleton — loading placeholder. */
  skeleton?: boolean;
  /** Force a visual state on the field for screenshots / Storybook. */
  'data-state'?: TextInputForcedState;
  /** Class names for the root wrapper. */
  className?: string;
}
