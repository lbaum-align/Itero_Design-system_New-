import type { ReactNode } from 'react';

export interface HorizontalCheckboxGroupProps {
  /** Group label text */
  label?: string;
  /** Show or hide the label (default: true) */
  showLabel?: boolean;
  /** Mark the group as required — renders an asterisk next to the label */
  required?: boolean;
  /** Tooltip content shown via the explainer icon beside the label */
  tooltipContent?: string;
  /** Helper text displayed below the checkbox items */
  helperText?: string;
  /** Error state — `true` for visual styling only, or a string to display as error message */
  error?: boolean | string;
  /** Disables all checkbox items in the group */
  disabled?: boolean;
  /** CheckboxItem elements rendered horizontally */
  children: ReactNode;
  /** Additional CSS class names on the outer wrapper */
  className?: string;
}
