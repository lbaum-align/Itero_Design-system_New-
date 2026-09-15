import type { HTMLAttributes, ReactNode } from 'react';

export interface VerticalCheckboxGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Figma "Label text" */
  label?: string;
  /** Figma "Show label" (default `true`) */
  showLabel?: boolean;
  /** Figma "Show explainer" — explainer text shown in an IconTriggerTooltip next to the label */
  tooltipContent?: string;
  /** Figma "Required" — shows a red asterisk after the label */
  required?: boolean;
  /** Helper text below the items (not in Figma) */
  helperText?: string;
  /** Error styling for the helper text (not in Figma) */
  error?: boolean;
  /** Error message — replaces helper text when `error` is true (not in Figma) */
  errorMessage?: string;
  /** Disables every CheckboxItem in the group */
  disabled?: boolean;
  /** Renders the label and every CheckboxItem as skeletons */
  skeleton?: boolean;
  /**
   * Figma "Levels".
   * - `1`: flat vertical list of checkbox items (default)
   * - `2`: the first child is the parent item; the rest are nested 32px below it
   */
  levels?: 1 | 2;
  /** CheckboxItem elements */
  children: ReactNode;
}
