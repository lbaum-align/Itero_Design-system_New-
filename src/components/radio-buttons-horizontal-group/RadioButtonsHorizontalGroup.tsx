import { forwardRef } from 'react';
import { RadioGroupBase } from '../radio-buttons-vertical-group/RadioGroupBase';
import type { RadioButtonsHorizontalGroupProps } from './radio-buttons-horizontal-group.types';

/**
 * Scanner RadioButtonsHorizontalGroup — a labelled set of mutually exclusive options laid out in a row.
 *
 * Figma: "03 Radio buttons horizontal group" (node 27986:67760).
 * Figma props → React: Show label → `showLabel`, Label text value → `label`,
 * Show explainer → `tooltipContent`, Required → `required`.
 *
 * Keyboard: Tab focuses the selected (or first) radio; arrow keys move the selection; Space selects.
 *
 * @example
 * <RadioButtonsHorizontalGroup
 *   label="Select an option"
 *   value={selected}
 *   onChange={setSelected}
 *   options={[
 *     { label: 'Option A', value: 'a' },
 *     { label: 'Option B', value: 'b' },
 *   ]}
 * />
 */
export const RadioButtonsHorizontalGroup = forwardRef<HTMLDivElement, RadioButtonsHorizontalGroupProps>(
  ({ options, ...props }, ref) => (
    <RadioGroupBase ref={ref} options={options} orientation="horizontal" {...props} />
  ),
);

RadioButtonsHorizontalGroup.displayName = 'RadioButtonsHorizontalGroup';
