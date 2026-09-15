import type { RadioGroupSharedProps, RadioOption } from '../radio-buttons-vertical-group/radio-buttons-vertical-group.types';

/** A single option within the horizontal radio group. */
export type RadioButtonOption = RadioOption;

export interface RadioButtonsHorizontalGroupProps extends RadioGroupSharedProps {
  /** Radio options, rendered left to right (wrapping to a new row when space runs out) */
  options: RadioButtonOption[];
}
