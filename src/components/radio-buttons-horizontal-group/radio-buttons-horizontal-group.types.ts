import type { TooltipPosition } from '../_tooltip-container';

export interface RadioButtonOption {
  /** Display label for the radio button */
  label: string;
  /** Value identifier for this option */
  value: string;
  /** Disable this specific option */
  disabled?: boolean;
}

export interface RadioButtonsHorizontalGroupProps {
  /** Group label text */
  label?: string;
  /** Whether to show the group label (default: true) */
  showLabel?: boolean;
  /** Tooltip content shown via IconTriggerTooltip next to the label */
  tooltipContent?: string;
  /** Tooltip placement relative to the icon trigger */
  tooltipPosition?: TooltipPosition;
  /** Mark the field as required (shows asterisk) */
  required?: boolean;
  /** Helper text shown below the radio group */
  helperText?: string;
  /** Error state — when true, helperText renders in error color */
  error?: boolean;
  /** Disable all radio buttons in the group */
  disabled?: boolean;
  /** Skeleton loading state */
  skeleton?: boolean;
  /** HTML name attribute shared by all radio inputs in the group */
  name: string;
  /** Currently selected value (controlled) */
  value?: string;
  /** Available radio button options */
  options: RadioButtonOption[];
  /** Called when the selected value changes */
  onChange?: (value: string) => void;
  /** Additional CSS class names on the outer container */
  className?: string;
}
