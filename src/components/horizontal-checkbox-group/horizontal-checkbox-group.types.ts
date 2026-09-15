import type { HTMLAttributes, ReactNode } from 'react';

export interface HorizontalCheckboxGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Figma "Label text" */
  label?: string;
  /** Figma "Show label" (default `true`) */
  showLabel?: boolean;
  /** Figma "Required" — shows a red asterisk after the label */
  required?: boolean;
  /** Figma "Show explainer" — explainer text shown in an IconTriggerTooltip next to the label */
  tooltipContent?: string;
  /** Helper text below the items (not in Figma) */
  helperText?: string;
  /** Error state (not in Figma) — `true` for styling only, or a string to show as the error message */
  error?: boolean | string;
  /** Disables every CheckboxItem in the group */
  disabled?: boolean;
  /** Renders the label and every CheckboxItem as skeletons */
  skeleton?: boolean;
  /** CheckboxItem elements, laid out in a row with a 16px gap */
  children: ReactNode;
}
