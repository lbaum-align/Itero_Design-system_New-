import type { InputHTMLAttributes, MouseEvent } from 'react';

/**
 * Figma "State" values that can be forced via `data-state` (Storybook / visual tests).
 * Enabled is the default; Disabled, Error and Skeleton have their own props.
 */
export type PasswordInputForcedState = 'focused';

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Figma "Label text value". Default "Password". */
  label?: string;
  /** Figma "Show label". Default true. */
  showLabel?: boolean;
  /** Figma "Helper text value". Default "Optional helper text". Replaced by `errorText` in error state. */
  helperText?: string;
  /** Figma "Show helper". Default true. */
  showHelper?: boolean;
  /** Figma "Error text value" — shown when `error` is true. Default "Error text message". */
  errorText?: string;
  /** Figma State=Error — error stroke, error message and `aria-invalid`. */
  error?: boolean;
  /** Figma "Show link" (e.g. "Forgot password?"). Default true. */
  showLink?: boolean;
  /** Link text. Default "Forgot password?". */
  linkText?: string;
  /** Link URL. */
  linkHref?: string;
  /** Link click handler. */
  onLinkClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  /** Figma "Show explainer". */
  showExplainer?: boolean;
  /** Tooltip content for the explainer icon. */
  explainerContent?: string;
  /** Figma "Layer set": 1 → Set 01 (`background-layer-01`), 2 → Set 02 (`background-layer-02`). Default 1. */
  layer?: 1 | 2;
  /** Figma State=Skeleton — loading placeholder. */
  skeleton?: boolean;
  /** Figma "Visible" — controlled password visibility. */
  passwordVisible?: boolean;
  /** Initial visibility when uncontrolled. Default false. */
  defaultPasswordVisible?: boolean;
  /** Called whenever the visibility toggle is pressed. */
  onPasswordVisibleChange?: (visible: boolean) => void;
  /** Force a visual state on the field for screenshots / Storybook. */
  'data-state'?: PasswordInputForcedState;
  /** Class names for the root wrapper. */
  className?: string;
}
