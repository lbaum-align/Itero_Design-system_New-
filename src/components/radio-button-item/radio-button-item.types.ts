import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';

/** Figma "State" values that can be forced via `data-state` (Storybook / visual tests). */
export type RadioButtonItemForcedState = 'focused';

export interface RadioButtonItemProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'checked' | 'defaultChecked' | 'onChange' | 'size' | 'children'
  > {
  /** Figma "Selected". Controlled checked state. Omit for an uncontrolled radio (see `defaultSelected`). */
  selected?: boolean;
  /** Initial checked state when uncontrolled. */
  defaultSelected?: boolean;
  /** Figma "Text value". Longer values wrap under the first line (control stays top-aligned). */
  label?: ReactNode;
  /** Figma "Show value". When false the text is hidden — provide `aria-label`. @default true */
  showLabel?: boolean;
  /** Figma State=Disabled. */
  disabled?: boolean;
  /** Figma State=Skeleton — loading placeholder (not interactive). */
  skeleton?: boolean;
  /** Called with the new checked state (always `true` for radios) and the native event. */
  onChange?: (selected: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  /** Class names for the root `<label>`. */
  className?: string;
  /** Force Figma State=Focused for screenshots / Storybook. */
  'data-state'?: RadioButtonItemForcedState;
}
