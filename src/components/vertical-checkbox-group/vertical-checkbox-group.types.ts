import type { ReactNode } from 'react';

export interface VerticalCheckboxGroupProps {
  /** Group label text */
  label?: string;
  /** Whether to show the group label */
  showLabel?: boolean;
  /** Tooltip content shown via IconTriggerTooltip next to the label */
  tooltipContent?: string;
  /** Whether the group is required (shows asterisk) */
  required?: boolean;
  /** Helper text displayed below the checkbox items */
  helperText?: string;
  /** Error state — shows error styling on helper text */
  error?: boolean;
  /** Error message — replaces helper text when error is true */
  errorMessage?: string;
  /** Disables all checkboxes in the group */
  disabled?: boolean;
  /** Shows skeleton loading state */
  skeleton?: boolean;
  /**
   * Nesting level from Figma.
   * - `1`: flat vertical list of checkbox items (default)
   * - `2`: first child is the "main" item, remaining are nested sub-items
   */
  levels?: 1 | 2;
  /** CheckboxItem elements to render in the group */
  children: ReactNode;
  /** Additional CSS class names */
  className?: string;
}
