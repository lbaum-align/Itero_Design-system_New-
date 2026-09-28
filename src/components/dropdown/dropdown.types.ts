import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

/** Figma "Size" (X- Large / Large / Medium / Small). */
export type DropdownSize = 'x-large' | 'large' | 'medium' | 'small';

/** Figma "Type": Single → one value, Multi → several values shown as tags. */
export type DropdownType = 'single' | 'multi';

/**
 * Figma "State" values that can be forced via `data-state` (Storybook / visual tests).
 * Enabled is the default; Disabled, Error and Skeleton have their own props.
 */
export type DropdownForcedState = 'hovered' | 'focused';

/** One option of the menu (rendered as a `_SelectMenuItem`). */
export interface DropdownOption {
  /** Unique value. */
  value: string;
  /** Text shown in the menu, in the field (Single) and in the tag (Multi). */
  label: string;
  /** Option can't be selected. */
  disabled?: boolean;
  /** `_Select menu Item` "Show headline" — group headline rendered above this option. */
  headline?: string;
  /** `_Select menu Item` "Show subtext". */
  subtext?: ReactNode;
  /** `_Select menu Item` "Show divider" — divider below this option. */
  divider?: boolean;
}

/** Props shared by Dropdown and Combobox. */
export interface SelectFieldBaseProps {
  /** Figma "Size". Default `'x-large'`. */
  size?: DropdownSize;
  /** Figma "Layer set": 1 → Set 01 (`background-layer-01`), 2 → Set 02 (`background-layer-02`). */
  layer?: 1 | 2;
  /** Menu options. */
  options: DropdownOption[];
  /** Figma "Label text value". Omit for "Show label: False". */
  label?: string;
  /** Figma "Helper text value". Omit for "Show helper: False". Replaced by `errorText` in error state. */
  helperText?: string;
  /** Figma "Error text value" — shown when `error` is true. */
  errorText?: string;
  /** Figma State=Error — error stroke, error message and `aria-invalid`. */
  error?: boolean;
  /** Figma "Required field". */
  required?: boolean;
  /** Figma "Show explainer" — tooltip content for the explainer icon next to the label. */
  tooltip?: string;
  /** Figma "Placeholder text value". Default `'Select an option'`. */
  placeholder?: string;
  /** Figma State=Disabled. */
  disabled?: boolean;
  /** Figma State=Skeleton — loading placeholder. */
  skeleton?: boolean;
  /** Menu open state (controlled). */
  open?: boolean;
  /** Initial menu open state (uncontrolled). */
  defaultOpen?: boolean;
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Maximum menu height (number = px). The menu scrolls (Select menu "Scroll") beyond it. */
  menuMaxHeight?: CSSProperties['maxHeight'];
  /** Form field name — renders hidden input(s) with the selected value(s). */
  name?: string;
  /** Force a visual state on the field for screenshots / Storybook. */
  'data-state'?: DropdownForcedState;
  /** Class names for the root wrapper. */
  className?: string;
  /** Inline styles for the root wrapper. */
  style?: CSSProperties;
}

/** Figma Type=Single. */
export interface SelectFieldSingleProps {
  /** Figma "Type". */
  type?: 'single';
  /** Selected value (controlled). `null` = nothing selected (Figma "Selected: False"). */
  value?: string | null;
  /** Initially selected value (uncontrolled). */
  defaultValue?: string | null;
  /** Called with the new value. */
  onChange?: (value: string | null) => void;
}

/** Figma Type=Multi — selected values are shown as tags. */
export interface SelectFieldMultiProps {
  /** Figma "Type". */
  type: 'multi';
  /** Selected values (controlled). Empty = Figma "Selected: False". */
  value?: string[];
  /** Initially selected values (uncontrolled). */
  defaultValue?: string[];
  /** Called with the new list of values. */
  onChange?: (value: string[]) => void;
}

type TriggerAttributes = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'value' | 'defaultValue' | 'onChange' | 'children' | 'className' | 'style' | 'name' | 'disabled'
>;

export type DropdownProps = TriggerAttributes &
  SelectFieldBaseProps &
  (SelectFieldSingleProps | SelectFieldMultiProps);
