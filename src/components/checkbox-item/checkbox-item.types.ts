import type { InputHTMLAttributes } from 'react';

/** Figma "Selected": Unselected · Selected · Indeterminate */
export type CheckboxSelection = 'unselected' | 'selected' | 'indeterminate';

export interface CheckboxItemProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'checked' | 'defaultChecked' | 'onChange' | 'size' | 'children'
  > {
  /**
   * Figma "Selected". Boolean `true` maps to `selected`, `false` to `unselected`.
   * Omit to let the checkbox manage its own state (see `defaultChecked`).
   */
  checked?: CheckboxSelection | boolean;
  /** Initial state when `checked` is not controlled */
  defaultChecked?: CheckboxSelection | boolean;
  /** Figma "Text value" — the value text next to the checkbox */
  label?: string;
  /** Figma "Show value" — show or hide the value text (default `true`) */
  showLabel?: boolean;
  /** Figma State=Disabled. Also inherited from a disabled checkbox group. */
  disabled?: boolean;
  /** Figma State=Skeleton — loading placeholder */
  skeleton?: boolean;
  /** Called with the next checked value. Toggling an indeterminate checkbox selects it. */
  onChange?: (checked: boolean) => void;
  /** Accessible label (used when the value text is hidden or absent) */
  'aria-label'?: string;
  /** Force a visual state for Storybook/screenshots (Figma State=Focused) */
  'data-state'?: 'focused';
}
