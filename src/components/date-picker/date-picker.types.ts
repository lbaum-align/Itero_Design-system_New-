import type { HTMLAttributes } from 'react';
import type { DateRange, WeekDay } from '../calendar/calendar.types';

export type { DateRange };

/** Figma "Type" (Single / Ranged). */
export type DatePickerType = 'single' | 'ranged';

/**
 * Figma "State" values that can be forced via `data-state` (Storybook / visual tests).
 * Enabled is the default; Disabled, Error and Skeleton have their own props.
 */
export type DatePickerForcedState = 'hovered' | 'focused';

interface DatePickerBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'placeholder'> {
  /** Figma "Layer set": 1 → Set 01 (`background-layer-01`), 2 → Set 02 (`background-layer-02`). */
  layer?: 1 | 2;
  /** Figma State=Error — error stroke, error message and `aria-invalid`. */
  error?: boolean;
  /** Figma State=Disabled. */
  disabled?: boolean;
  /** Figma State=Skeleton — loading placeholder. */
  skeleton?: boolean;
  /** Figma "Label text value". */
  label?: string;
  /** Figma "Show label". Default `true` (the label renders when `label` is set). */
  showLabel?: boolean;
  /** Figma "Required" — asterisk + `aria-required`. */
  required?: boolean;
  /** Figma "Helper text value". Replaced by `errorText` in error state. */
  helperText?: string;
  /** Figma "Error text value" — shown below the field when `error` is true. */
  errorText?: string;
  /** Figma "Show helper" — gates both helper and error text. Default `true`. */
  showHelper?: boolean;
  /** Figma "Show explainer" — explainer icon next to the label (needs `explainerText`). */
  showExplainer?: boolean;
  /** Tooltip content for the explainer icon. */
  explainerText?: string;
  /**
   * Figma "Placeholder text". Default: `format` (Figma `mm.dd.yyyy`). In Ranged pickers it is used for both inputs.
   */
  placeholder?: string;
  /** Typed / displayed date pattern built from `dd`, `mm`, `yyyy` and separators. Default `'mm.dd.yyyy'`. */
  format?: string;
  /** Let users type the date into the field (Figma "Filed container" docs). Default `true`; `false` makes the inputs read-only. */
  allowTyping?: boolean;
  /** Calendar panel open state (controlled). */
  open?: boolean;
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean;
  /** Called when the panel opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Earliest selectable day (inclusive). */
  min?: Date;
  /** Latest selectable day (inclusive). */
  max?: Date;
  /** Marks extra days as disabled. */
  isDateDisabled?: (date: Date) => boolean;
  /** Date shown with the today indicator. Default: the current date. */
  today?: Date;
  /** BCP 47 locale for the calendar's month / weekday names. */
  locale?: string;
  /** First day of the week in the calendar, 0 = Sunday. Default `0`. */
  weekStartsOn?: WeekDay;
  /** Accessible name of the calendar icon button. Default `'Open calendar'`. */
  openCalendarLabel?: string;
  /** Accessible suffix for the Ranged start input. Default `'start date'`. */
  startDateLabel?: string;
  /** Accessible suffix for the Ranged end input. Default `'end date'`. */
  endDateLabel?: string;
  /** `id` of the (first) input; the label points to it. */
  id?: string;
  /** Force a visual state on the field for screenshots / Storybook. */
  'data-state'?: DatePickerForcedState;
  /** Class names for the root wrapper. */
  className?: string;
}

export interface DatePickerSingleProps extends DatePickerBaseProps {
  /** Figma "Type". Default `'single'`. */
  type?: 'single';
  /** Figma "Date value" (controlled). `null` = empty (Figma Selected=False). */
  value?: Date | null;
  /** Initial date (uncontrolled). */
  defaultValue?: Date | null;
  /** Called when a date is picked, typed, or cleared (`null`). */
  onChange?: (date: Date | null) => void;
}

export interface DatePickerRangedProps extends DatePickerBaseProps {
  /** Figma "Type". */
  type: 'ranged';
  /** Figma "First date value" / "Second date value" (controlled). */
  value?: DateRange;
  /** Initial range (uncontrolled). */
  defaultValue?: DateRange;
  /** Called when either end of the range is picked, typed, or cleared. */
  onChange?: (range: DateRange) => void;
}

export type DatePickerProps = DatePickerSingleProps | DatePickerRangedProps;
