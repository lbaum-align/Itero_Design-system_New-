import type { TextareaHTMLAttributes } from 'react';

/**
 * Figma "State" values that can be forced via `data-state` (Storybook / visual tests).
 * Enabled is the default; Disabled, Error and Skeleton have their own props.
 */
export type TextAreaForcedState = 'focused';

export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> {
  /** Figma "Label text value". Omit for "Show label: False". */
  label?: string;
  /** Figma "Helper text value". Omit for "Show helper: False". Replaced by `errorText` in error state. */
  helperText?: string;
  /** Figma "Error text value" — shown when `error` is true. */
  errorText?: string;
  /** Figma "Show explainer" — tooltip content for the explainer icon next to the label. */
  tooltipContent?: string;
  /** Figma State=Error — error stroke, error message and `aria-invalid`. */
  error?: boolean;
  /** Figma State=Skeleton — loading placeholder. */
  skeleton?: boolean;
  /** Figma "Show counter" — renders `{length}/{maxLength}` (requires `maxLength`, or pass `counter`). */
  showCounter?: boolean;
  /** Figma "Counter value" — explicit counter text; overrides the automatic `{length}/{maxLength}`. */
  counter?: string;
  /**
   * Figma "Layer set": 1 → Set 01 (`background-layer-01`), 2 → Set 02 (`background-layer-02`).
   */
  layer?: 1 | 2;
  /**
   * Show the clear (×) button while the field has a value (Figma shows it on every enabled/focused/error Filled variant).
   * Default `true`.
   */
  clearable?: boolean;
  /** Called after the clear button empties the field. `onChange` also fires with an empty value. */
  onClear?: () => void;
  /** Force a visual state on the field for screenshots / Storybook. */
  'data-state'?: TextAreaForcedState;
}
