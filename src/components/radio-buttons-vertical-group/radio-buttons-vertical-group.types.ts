import type { HTMLAttributes } from 'react';
import type { TooltipPosition } from '../_tooltip-container';

/** A single option within a radio button group. */
export interface RadioOption {
  /** Display label for the radio item (Figma "Text value") */
  label: string;
  /** Unique value for the radio item */
  value: string;
  /** Disable this individual option */
  disabled?: boolean;
}

/** Props shared by the vertical and horizontal radio groups. */
export interface RadioGroupSharedProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** Group label text (Figma "Label text value") */
  label?: string;
  /** Show or hide the group label (Figma "Show label"). When hidden, `label` becomes the group's aria-label. @default true */
  showLabel?: boolean;
  /** Explainer tooltip text; renders an IconTriggerTooltip next to the label (Figma "Show explainer") */
  tooltipContent?: string;
  /** Explainer tooltip placement. @default 'top' (Figma: Placement=Top) */
  tooltipPosition?: TooltipPosition;
  /** Show the red asterisk and set `aria-required` (Figma "Required") */
  required?: boolean;
  /** Helper or error message displayed below the items (code extension — not in Figma) */
  helperText?: string;
  /** Error state — helper text turns red and the group gets `aria-invalid` (code extension) */
  error?: boolean;
  /** Disables every radio item in the group */
  disabled?: boolean;
  /** Renders every item in Figma State=Skeleton */
  skeleton?: boolean;
  /** Shared HTML name for the radio inputs. Auto-generated when omitted. */
  name?: string;
  /** Selected value (controlled). Use `''` for "nothing selected". */
  value?: string;
  /** Initially selected value (uncontrolled). */
  defaultValue?: string;
  /** Called with the newly selected value (click, Space, or arrow keys). */
  onChange?: (value: string) => void;
}

export interface RadioButtonsVerticalGroupProps extends RadioGroupSharedProps {
  /** Radio options, rendered top to bottom */
  items: RadioOption[];
}
