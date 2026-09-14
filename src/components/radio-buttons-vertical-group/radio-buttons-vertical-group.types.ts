/** A single option within the radio button group. */
export interface RadioOption {
  /** Display label for the radio item */
  label: string;
  /** Unique value for the radio item */
  value: string;
  /** Disable this individual option */
  disabled?: boolean;
}

export interface RadioButtonsVerticalGroupProps {
  /** Group label text (mirrors Figma "Label text value") */
  label?: string;
  /** Show or hide the group label (mirrors Figma "Show label") */
  showLabel?: boolean;
  /** Tooltip content shown next to the label via IconTriggerTooltip (mirrors Figma "Show explainer") */
  tooltipContent?: string;
  /** Show a red asterisk required indicator (mirrors Figma "Required") */
  required?: boolean;
  /** Helper or error message displayed below the items */
  helperText?: string;
  /** Marks the group as having an error — changes helperText color */
  error?: boolean;
  /** Disables all radio items in the group */
  disabled?: boolean;
  /** Renders skeleton loading placeholders */
  skeleton?: boolean;
  /** Shared HTML name attribute for all radio inputs */
  name: string;
  /** Currently selected value (controlled) */
  value?: string;
  /** Called when the selected value changes */
  onChange?: (value: string) => void;
  /** Radio options to render as RadioButtonItem children */
  items: RadioOption[];
  /** Additional CSS class names */
  className?: string;
}
