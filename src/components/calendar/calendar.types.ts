import type { HTMLAttributes } from 'react';
import type { WeekDay } from './date-utils';

/** Figma "Content" (Day / Month / Year). */
export type CalendarView = 'day' | 'month' | 'year';

/** Selection mode — `single` date or a `range` (start + end). */
export type CalendarMode = 'single' | 'range';

/** A date range. `end` is `null` while the second date hasn't been picked yet. */
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export type { WeekDay };

interface CalendarBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Visible month (controlled). Any day inside the month. */
  month?: Date;
  /** Initially visible month (uncontrolled). Defaults to the selected date, then `today` (clamped to min/max). */
  defaultMonth?: Date;
  /** Called when the visible month changes (arrows, keyboard, month/year views). */
  onMonthChange?: (month: Date) => void;
  /** Figma "Content" (controlled). */
  view?: CalendarView;
  /** Figma "Content" (uncontrolled). Default `'day'`. */
  defaultView?: CalendarView;
  /** Called when the view changes (caret button, picking a year or month, Escape). */
  onViewChange?: (view: CalendarView) => void;
  /** Earliest selectable day (inclusive). */
  min?: Date;
  /** Latest selectable day (inclusive). */
  max?: Date;
  /** Marks extra days as disabled (e.g. weekends). */
  isDateDisabled?: (date: Date) => boolean;
  /** Date shown with the today indicator. Default: the current date. */
  today?: Date;
  /** BCP 47 locale for month / weekday names. Default: the runtime locale. */
  locale?: string;
  /** First day of the week, 0 = Sunday (Figma) … 6 = Saturday. Default `0`. */
  weekStartsOn?: WeekDay;
  /** Years listed in the Year view, inclusive. Default: min/max years, else today −100 … +50. */
  yearRange?: [number, number];
  /** Move focus to the active cell on mount (used by DatePicker when opened from the keyboard). */
  autoFocus?: boolean;
  /** Accessible label for the previous-month button. Default `'Previous month'`. */
  previousMonthLabel?: string;
  /** Accessible label for the next-month button. Default `'Next month'`. */
  nextMonthLabel?: string;
  /** Accessible label for the month/year switch button. Default `'Choose month and year'`. */
  switchViewLabel?: string;
  /** Additional CSS class names for the root. */
  className?: string;
}

export interface CalendarSingleProps extends CalendarBaseProps {
  /** Selection mode. Default `'single'`. */
  mode?: 'single';
  /** Selected date (controlled). */
  value?: Date | null;
  /** Initially selected date (uncontrolled). */
  defaultValue?: Date | null;
  /** Called with the picked date. */
  onChange?: (date: Date) => void;
}

export interface CalendarRangeProps extends CalendarBaseProps {
  mode: 'range';
  /** Selected range (controlled). */
  value?: DateRange;
  /** Initially selected range (uncontrolled). */
  defaultValue?: DateRange;
  /**
   * Called on every pick: first with `{ start, end: null }`, then with the completed range
   * (dates are swapped when the second pick is before the first).
   */
  onChange?: (range: DateRange) => void;
}

export type CalendarProps = CalendarSingleProps | CalendarRangeProps;
