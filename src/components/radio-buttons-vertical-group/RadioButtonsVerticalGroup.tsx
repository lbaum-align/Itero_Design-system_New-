import { forwardRef } from 'react';
import { RadioGroupBase } from './RadioGroupBase';
import type { RadioButtonsVerticalGroupProps } from './radio-buttons-vertical-group.types';

/**
 * Scanner RadioButtonsVerticalGroup — a labelled set of mutually exclusive options, stacked vertically.
 *
 * Figma: "02 Radio buttons vertical group/Default" (node 25:1188).
 * Figma props → React: Show label → `showLabel`, Label text value → `label`,
 * Show explainer → `tooltipContent`, Required → `required`.
 *
 * Keyboard: Tab focuses the selected (or first) radio; arrow keys move the selection; Space selects.
 *
 * @example
 * <RadioButtonsVerticalGroup
 *   label="Preferred contact method"
 *   value={selected}
 *   onChange={setSelected}
 *   items={[
 *     { label: 'Email', value: 'email' },
 *     { label: 'Phone', value: 'phone' },
 *   ]}
 * />
 */
export const RadioButtonsVerticalGroup = forwardRef<HTMLDivElement, RadioButtonsVerticalGroupProps>(
  ({ items, ...props }, ref) => <RadioGroupBase ref={ref} options={items} orientation="vertical" {...props} />,
);

RadioButtonsVerticalGroup.displayName = 'RadioButtonsVerticalGroup';
