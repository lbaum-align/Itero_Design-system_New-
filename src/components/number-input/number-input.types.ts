import type { InputHTMLAttributes } from 'react';

/** Figma "Size" (X- Large / Large / Medium / Small). */
export type NumberInputSize = 'small' | 'medium' | 'large' | 'x-large';

/**
 * Figma "State" values that can be forced via `data-state` (Storybook / visual tests).
 * Enabled is the default; Disabled, Error and Skeleton have their own props.
 */
export type NumberInputForcedState = 'focused';

export interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'size'> {
  /** Figma "Number value" — current value (controlled). */
  value?: number;
  /** Initial value (uncontrolled). Default `0`. */
  defaultValue?: number;
  /**
   * Called with the new value when it changes via the controls, the keyboard, or typing.
   * Values are always within `min`/`max`: out-of-range typing is clamped on blur.
   */
  onChange?: (value: number) => void;
  /** Minimum allowed value. */
  min?: number;
  /** Maximum allowed value. */
  max?: number;
  /** Step for the controls and ArrowUp/ArrowDown (PageUp/PageDown use 10 × step). Default `1`. */
  step?: number;
  /** Figma "Size". Default `'large'`. */
  size?: NumberInputSize;
  /** Figma "Layer set": 1 → Set 01 (`background-layer-01`), 2 → Set 02 (`background-layer-02`). */
  layer?: 1 | 2;
  /** Figma "Label text value". Omit for "Show label: False". */
  label?: string;
  /** Figma "Helper text value". Omit for "Show helper: False". Replaced by `errorText` in error state. */
  helperText?: string;
  /** Figma "Error text value" — shown below the field when `error` is true. */
  errorText?: string;
  /** Figma State=Error — error stroke, error message and `aria-invalid`. */
  error?: boolean;
  /** Figma State=Skeleton — loading placeholder. */
  skeleton?: boolean;
  /** Figma "Show controls" — Subtract / Add buttons. Default `true`. */
  showControls?: boolean;
  /** Figma "Show explainer" — shows the explainer icon next to the label (needs `explainerText`). */
  showExplainer?: boolean;
  /** Tooltip content for the explainer icon. */
  explainerText?: string;
  /** Accessible label of the Subtract button. Default `'Decrement'`. */
  decrementLabel?: string;
  /** Accessible label of the Add button. Default `'Increment'`. */
  incrementLabel?: string;
  /** Force a visual state on the field for screenshots / Storybook. */
  'data-state'?: NumberInputForcedState;
  /** Class names for the root wrapper. */
  className?: string;
}
