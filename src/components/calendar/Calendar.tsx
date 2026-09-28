import { forwardRef, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import type { IconName } from '../../icons';
import { Days } from '../_days';
import { fieldAction } from '../text-input/field-styles';
import {
  addDays,
  addMonths,
  addYears,
  clampDay,
  compareDays,
  daysInMonth,
  endOfWeek,
  getMonthWeeks,
  isOutOfBounds,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  toDayKey,
} from './date-utils';
import type { CalendarProps, CalendarView, DateRange } from './calendar.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → 02 Calendar (node 20628:32152, page Date picker 15305:6737)
 * Content = Day, Month, Year (3 variants). Cells are `_Days` instances (node 6607:12895).
 *
 * Panel: 375px wide (min 324), background-elevated, radius medium, shadow "Depth 01".
 * Header: 16/12 padding, 8 gap, 1px border-subtle bottom stroke (inside), title 18/28 medium.
 * Day view: chevron left · "July 2024" + caret down · chevron right; weekday row (16/24 text-tertiary, 4px padding)
 * then 52px week rows. Month / Year views: centred title, 4-column grid of 90px cells; the Year view scrolls.
 */

const EMPTY_RANGE: DateRange = { start: null, end: null };
const PERIOD_COLUMNS = 4;

/** Intl formatters for the current locale. */
function useFormatters(locale: string | undefined) {
  return useMemo(
    () => ({
      monthYear: new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }),
      year: new Intl.DateTimeFormat(locale, { year: 'numeric' }),
      monthShort: new Intl.DateTimeFormat(locale, { month: 'short' }),
      monthLong: new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }),
      weekdayShort: new Intl.DateTimeFormat(locale, { weekday: 'short' }),
      weekdayLong: new Intl.DateTimeFormat(locale, { weekday: 'long' }),
      dayNumber: new Intl.DateTimeFormat(locale, { day: 'numeric' }),
      fullDate: new Intl.DateTimeFormat(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    }),
    [locale],
  );
}

/** Figma "Chevron left/right" — bare 24px icon in `icon-secondary`, made a button. */
function HeaderIconButton({
  iconName,
  label,
  disabled,
  onClick,
}: {
  iconName: IconName;
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      onClick={onClick}
      className={cn(
        fieldAction,
        'm-0 size-[var(--scanner-spacing-7)] border-none bg-transparent p-0',
        disabled
          ? 'cursor-not-allowed text-[color:var(--scanner-icon-disabled)]'
          : 'cursor-pointer text-[color:var(--scanner-icon-secondary)] hover:bg-[var(--scanner-bg-hover)] active:bg-[var(--scanner-bg-active)]',
      )}
    >
      <Icon name={iconName} size={24} />
    </button>
  );
}

/**
 * Scanner Calendar — month grid for picking a date or a date range, with month and year views.
 * Used inside `DatePicker`; can also be embedded on its own.
 *
 * Figma props → React: Content → `view` / `defaultView` (`'day' | 'month' | 'year'`).
 * Selection: `mode="single"` (`value: Date | null`) or `mode="range"` (`value: { start, end }`).
 * Constraints: `min`, `max`, `isDateDisabled`. Localisation: `locale` (Intl) and `weekStartsOn`.
 *
 * Keyboard (WAI-ARIA date grid): Tab moves between the header buttons and the grid; arrows move by day / week;
 * Home / End go to the start / end of the week; PageUp / PageDown change month, Shift + PageUp / PageDown change year;
 * Enter / Space select. In the Month and Year views arrows move by one / one row and Escape returns to the Day view.
 *
 * @example
 * <Calendar defaultValue={new Date(2024, 6, 12)} onChange={setDate} />
 * <Calendar mode="range" value={range} onChange={setRange} min={new Date()} />
 */
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>((props, ref) => {
  const {
    mode: _mode,
    value: _value,
    defaultValue: _defaultValue,
    onChange: _onChange,
    month: monthProp,
    defaultMonth,
    onMonthChange,
    view: viewProp,
    defaultView = 'day',
    onViewChange,
    min,
    max,
    isDateDisabled,
    today: todayProp,
    locale,
    weekStartsOn = 0,
    yearRange,
    autoFocus = false,
    previousMonthLabel = 'Previous month',
    nextMonthLabel = 'Next month',
    switchViewLabel = 'Choose month and year',
    className,
    onKeyDown,
    ...rest
  } = props;

  const isRange = props.mode === 'range';
  const fmt = useFormatters(locale);
  const titleId = useId();
  const todayTime = todayProp ? startOfDay(todayProp).getTime() : startOfDay(new Date()).getTime();
  const today = useMemo(() => new Date(todayTime), [todayTime]);

  /* ── Selection (controlled / uncontrolled) ── */
  const [singleInternal, setSingleInternal] = useState<Date | null>(() =>
    props.mode === 'range' ? null : (props.defaultValue ?? null),
  );
  const [rangeInternal, setRangeInternal] = useState<DateRange>(() =>
    props.mode === 'range' ? (props.defaultValue ?? EMPTY_RANGE) : EMPTY_RANGE,
  );
  const selectedDate: Date | null =
    props.mode === 'range' ? null : props.value !== undefined ? props.value : singleInternal;
  const range: DateRange =
    props.mode === 'range' ? (props.value !== undefined ? props.value : rangeInternal) : EMPTY_RANGE;

  /* ── Visible month ── */
  const [monthInternal, setMonthInternal] = useState<Date>(() =>
    startOfMonth(clampDay(defaultMonth ?? selectedDate ?? range.start ?? today, min, max)),
  );
  const visibleMonth = monthProp ? startOfMonth(monthProp) : monthInternal;

  /* ── View (Figma "Content") ── */
  const [viewInternal, setViewInternal] = useState<CalendarView>(defaultView);
  const view = viewProp ?? viewInternal;

  /* ── Roving focus ── */
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const focusRequest = useRef(autoFocus);
  const gridRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isDisabledDay = (d: Date) => isOutOfBounds(d, min, max) || !!isDateDisabled?.(d);

  /* ── Years listed in the Year view ── */
  const years = useMemo(() => {
    const from = yearRange?.[0] ?? (min ? min.getFullYear() : today.getFullYear() - 100);
    const to = yearRange?.[1] ?? (max ? max.getFullYear() : today.getFullYear() + 50);
    const list: number[] = [];
    for (let y = from; y <= to; y++) list.push(y);
    return list;
  }, [yearRange, min, max, today]);

  /** Active (tabbable) day inside the visible month. */
  const activeDate = useMemo(() => {
    if (focusedDate && isSameMonth(focusedDate, visibleMonth)) return focusedDate;
    const candidates = [selectedDate, range.start, range.end, today];
    const inMonth = candidates.find((d) => d && isSameMonth(d, visibleMonth));
    return clampDay(inMonth ?? visibleMonth, min, max);
  }, [focusedDate, visibleMonth, selectedDate, range.start, range.end, today, min, max]);

  const setView = (next: CalendarView) => {
    if (next === view) return;
    if (viewProp === undefined) setViewInternal(next);
    onViewChange?.(next);
  };

  const setVisibleMonth = (next: Date) => {
    const m = startOfMonth(next);
    if (isSameMonth(m, visibleMonth)) return;
    if (!monthProp) setMonthInternal(m);
    onMonthChange?.(m);
  };

  /** Moves the active day (keeping it in bounds) and shows its month. */
  const moveFocus = (next: Date) => {
    const target = clampDay(next, min, max);
    setFocusedDate(target);
    setVisibleMonth(target);
    if (isRange && range.start && !range.end) setHoverDate(target);
    focusRequest.current = true;
  };

  /** Shows another month, keeping the active day-of-month where possible. */
  const goToMonth = (month: Date) => {
    const day = Math.min(activeDate.getDate(), daysInMonth(month.getFullYear(), month.getMonth()));
    const target = clampDay(new Date(month.getFullYear(), month.getMonth(), day), min, max);
    setFocusedDate(target);
    setVisibleMonth(target);
  };

  useEffect(() => {
    if (!focusRequest.current) return;
    focusRequest.current = false;
    gridRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.focus();
  });

  /* Keep the active year in view when the Year view opens */
  useLayoutEffect(() => {
    if (view !== 'year') return;
    const container = scrollRef.current;
    const el = container?.querySelector<HTMLElement>('[data-active="true"]');
    if (container && el) container.scrollTop = el.offsetTop - container.clientHeight / 2 + el.offsetHeight / 2;
  }, [view]);

  /* ── Selection handlers ── */
  const selectDay = (day: Date) => {
    if (isDisabledDay(day)) return;
    setFocusedDate(day);
    if (props.mode === 'range') {
      let next: DateRange;
      if (!range.start || range.end) next = { start: day, end: null };
      else if (compareDays(day, range.start) < 0) next = { start: day, end: range.start };
      else next = { start: range.start, end: day };
      if (props.value === undefined) setRangeInternal(next);
      setHoverDate(null);
      props.onChange?.(next);
    } else {
      if (props.value === undefined) setSingleInternal(day);
      props.onChange?.(day);
    }
  };

  /* ── Bounds for navigation ── */
  const minMonth = min ? startOfMonth(min) : null;
  const maxMonth = max ? startOfMonth(max) : null;
  const prevDisabled = !!minMonth && compareDays(visibleMonth, minMonth) <= 0;
  const nextDisabled = !!maxMonth && compareDays(visibleMonth, maxMonth) >= 0;

  /* ── Keyboard ── */
  const handleDayKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    let next: Date | null = null;
    switch (e.key) {
      case 'ArrowLeft':
        next = addDays(activeDate, -1);
        break;
      case 'ArrowRight':
        next = addDays(activeDate, 1);
        break;
      case 'ArrowUp':
        next = addDays(activeDate, -7);
        break;
      case 'ArrowDown':
        next = addDays(activeDate, 7);
        break;
      case 'Home':
        next = startOfWeek(activeDate, weekStartsOn);
        break;
      case 'End':
        next = endOfWeek(activeDate, weekStartsOn);
        break;
      case 'PageUp':
        next = e.shiftKey ? addYears(activeDate, -1) : addMonths(activeDate, -1);
        break;
      case 'PageDown':
        next = e.shiftKey ? addYears(activeDate, 1) : addMonths(activeDate, 1);
        break;
      default:
        return;
    }
    e.preventDefault();
    moveFocus(next);
  };

  const handlePeriodKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const unit = view === 'month' ? addMonths : addYears;
    const index = view === 'month' ? visibleMonth.getMonth() : visibleMonth.getFullYear() - years[0];
    const col = index % PERIOD_COLUMNS;
    let next: Date | null = null;
    switch (e.key) {
      case 'ArrowLeft':
        next = unit(visibleMonth, -1);
        break;
      case 'ArrowRight':
        next = unit(visibleMonth, 1);
        break;
      case 'ArrowUp':
        next = unit(visibleMonth, -PERIOD_COLUMNS);
        break;
      case 'ArrowDown':
        next = unit(visibleMonth, PERIOD_COLUMNS);
        break;
      case 'Home':
        next = unit(visibleMonth, -col);
        break;
      case 'End':
        next = unit(visibleMonth, PERIOD_COLUMNS - 1 - col);
        break;
      case 'PageUp':
        if (view === 'month') next = addYears(visibleMonth, -1);
        break;
      case 'PageDown':
        if (view === 'month') next = addYears(visibleMonth, 1);
        break;
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        setView('day');
        focusRequest.current = true;
        return;
      default:
        return;
    }
    if (!next) return;
    e.preventDefault();
    if (view === 'year' && (next.getFullYear() < years[0] || next.getFullYear() > years[years.length - 1])) return;
    const m = startOfMonth(next);
    if ((minMonth && compareDays(m, minMonth) < 0) || (maxMonth && compareDays(m, maxMonth) > 0)) {
      if (view === 'month') return;
      goToMonth(clampDay(m, minMonth, maxMonth));
    } else {
      goToMonth(m);
    }
    focusRequest.current = true;
  };

  /* ── Render helpers ── */
  const monthTitle = fmt.monthYear.format(visibleMonth);
  const selectionDates = isRange ? [range.start, range.end] : [selectedDate];

  const headerClass = cn(
    'flex w-full shrink-0 items-center gap-[var(--scanner-spacing-3)] px-[var(--scanner-spacing-5)] py-[var(--scanner-spacing-4)]',
    'shadow-[inset_0_-1px_0_0_var(--scanner-border-subtle)]',
  );
  const titleClass = cn(
    'text-center text-[length:var(--scanner-text-scanner-md)] leading-[var(--scanner-leading-lg)]',
    'font-[number:var(--scanner-font-medium)] text-[color:var(--scanner-text-primary)]',
  );

  let header: ReactNode;
  let body: ReactNode;

  if (view === 'day') {
    const weeks = getMonthWeeks(visibleMonth, weekStartsOn);
    const weekdays = Array.from({ length: 7 }, (_, i) => new Date(2023, 0, 1 + ((weekStartsOn + i) % 7))); // 2023-01-01 is a Sunday
    const previewEnd = range.end ?? (range.start && hoverDate ? hoverDate : null);
    const [lo, hi] =
      range.start && previewEnd
        ? compareDays(range.start, previewEnd) <= 0
          ? [range.start, previewEnd]
          : [previewEnd, range.start]
        : [null, null];

    header = (
      <div className={headerClass} data-part="header">
        <HeaderIconButton
          iconName="chevron-left"
          label={previousMonthLabel}
          disabled={prevDisabled}
          onClick={() => goToMonth(addMonths(visibleMonth, -1))}
        />
        <div className="flex min-w-0 flex-1 justify-center">
          <button
            type="button"
            aria-label={`${monthTitle}, ${switchViewLabel}`}
            onClick={() => {
              setView('year');
              focusRequest.current = true;
            }}
            className={cn(
              fieldAction,
              'm-0 gap-[var(--scanner-spacing-3)] border-none bg-transparent p-0 cursor-pointer',
            )}
          >
            <span id={titleId} className={titleClass} aria-live="polite">
              {monthTitle}
            </span>
            <Icon name="caret-down" size={24} className="text-[color:var(--scanner-icon-secondary)]" />
          </button>
        </div>
        <HeaderIconButton
          iconName="chevron-right"
          label={nextMonthLabel}
          disabled={nextDisabled}
          onClick={() => goToMonth(addMonths(visibleMonth, 1))}
        />
      </div>
    );

    body = (
      <div className="flex w-full flex-col p-[var(--scanner-spacing-3)]" data-part="dates">
        <div
          ref={gridRef}
          role="grid"
          aria-labelledby={titleId}
          aria-multiselectable={isRange || undefined}
          onKeyDown={handleDayKeyDown}
          onMouseLeave={() => setHoverDate(null)}
          className="flex w-full flex-col"
        >
          <div role="row" className="grid w-full grid-cols-7">
            {weekdays.map((d) => (
              <div
                key={d.getDay()}
                role="columnheader"
                aria-label={fmt.weekdayLong.format(d)}
                className={cn(
                  'overflow-hidden p-[var(--scanner-spacing-2)] text-center',
                  'text-[length:var(--scanner-text-base)] leading-[var(--scanner-leading-md)] text-[color:var(--scanner-text-tertiary)]',
                )}
              >
                <span aria-hidden="true">{fmt.weekdayShort.format(d)}</span>
              </div>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div role="row" key={wi} className="grid w-full grid-cols-7">
              {week.map((day, di) => {
                if (!day) return <div role="gridcell" key={di} />;
                const disabled = isDisabledDay(day);
                const selected = selectionDates.some((s) => isSameDay(s, day));
                const inRange = !!lo && !!hi && compareDays(day, lo) > 0 && compareDays(day, hi) < 0;
                const inCommittedRange =
                  !!range.start && !!range.end && compareDays(day, range.start) > 0 && compareDays(day, range.end) < 0;
                const active = isSameDay(day, activeDate);
                return (
                  <div role="gridcell" key={di} aria-selected={selected || inCommittedRange} className="min-w-0">
                    <Days
                      data-date={toDayKey(day)}
                      data-active={active || undefined}
                      tabIndex={active ? 0 : -1}
                      aria-label={fmt.fullDate.format(day)}
                      selected={selected}
                      inRange={!selected && inRange}
                      today={isSameDay(day, today)}
                      disabled={disabled}
                      focusableWhenDisabled
                      onClick={() => selectDay(day)}
                      onMouseEnter={() => {
                        if (isRange && range.start && !range.end && !disabled) setHoverDate(day);
                      }}
                      onFocus={() => {
                        if (!isSameDay(focusedDate, day)) setFocusedDate(day);
                      }}
                    >
                      {fmt.dayNumber.format(day)}
                    </Days>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    const isMonthView = view === 'month';
    const title = isMonthView ? monthTitle : fmt.year.format(visibleMonth);
    const year = visibleMonth.getFullYear();
    const items = isMonthView
      ? Array.from({ length: 12 }, (_, m) => new Date(year, m, 1))
      : years.map((y) => new Date(y, visibleMonth.getMonth(), 1));
    const rows: Date[][] = [];
    for (let i = 0; i < items.length; i += PERIOD_COLUMNS) rows.push(items.slice(i, i + PERIOD_COLUMNS));

    const periodDisabled = (d: Date) => {
      const first = isMonthView ? d : new Date(d.getFullYear(), 0, 1);
      const last = isMonthView
        ? new Date(d.getFullYear(), d.getMonth(), daysInMonth(d.getFullYear(), d.getMonth()))
        : new Date(d.getFullYear(), 11, 31);
      return (!!max && compareDays(first, max) > 0) || (!!min && compareDays(last, min) < 0);
    };
    const samePeriod = (a: Date | null, b: Date) =>
      !!a && (isMonthView ? isSameMonth(a, b) : a.getFullYear() === b.getFullYear());

    header = (
      <div className={headerClass} data-part="header">
        <span id={titleId} className={cn(titleClass, 'min-w-0 flex-1')} aria-live="polite">
          {title}
        </span>
      </div>
    );

    body = (
      <div
        ref={scrollRef}
        data-part="dates"
        className={cn(
          'relative flex min-h-0 w-full flex-1 flex-col p-[var(--scanner-spacing-3)]',
          !isMonthView && [
            'overflow-y-auto overscroll-contain',
            '[&::-webkit-scrollbar]:w-[var(--scanner-calendar-scrollbar-width)]',
            '[&::-webkit-scrollbar-track]:my-[var(--scanner-spacing-3)] [&::-webkit-scrollbar-track]:rounded-[var(--scanner-radius-full)] [&::-webkit-scrollbar-track]:bg-[var(--scanner-border-subtle)]',
            '[&::-webkit-scrollbar-thumb]:rounded-[var(--scanner-radius-full)] [&::-webkit-scrollbar-thumb]:bg-[var(--scanner-border-subtle)]',
          ],
        )}
      >
        <div ref={gridRef} role="grid" aria-labelledby={titleId} onKeyDown={handlePeriodKeyDown} className="flex w-full flex-col">
          {rows.map((row, ri) => (
            <div role="row" key={ri} className="grid w-full grid-cols-4">
              {row.map((d) => {
                const active = samePeriod(visibleMonth, d);
                const selected = selectionDates.some((s) => samePeriod(s, d));
                const label = isMonthView ? fmt.monthShort.format(d) : fmt.year.format(d);
                return (
                  <div role="gridcell" key={d.getTime()} aria-selected={selected} className="min-w-0">
                    <Days
                      className="h-[var(--scanner-calendar-period-cell-height)]"
                      data-active={active || undefined}
                      data-value={isMonthView ? d.getMonth() : d.getFullYear()}
                      tabIndex={active ? 0 : -1}
                      aria-label={isMonthView ? fmt.monthLong.format(d) : label}
                      selected={selected}
                      today={samePeriod(today, d)}
                      disabled={periodDisabled(d)}
                      focusableWhenDisabled
                      onClick={() => {
                        goToMonth(clampDay(d, minMonth, max ?? null));
                        setView(isMonthView ? 'day' : 'month');
                        focusRequest.current = true;
                      }}
                    >
                      {label}
                    </Days>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      role="group"
      aria-labelledby={titleId}
      data-view={view}
      onKeyDown={onKeyDown}
      className={cn(
        'flex flex-col items-start overflow-hidden rounded-[var(--scanner-radius-md)]',
        'bg-[var(--scanner-bg-elevated)] shadow-[var(--scanner-shadow-depth-01)]',
        'w-[var(--scanner-calendar-width)] min-w-[var(--scanner-calendar-min-width)] max-w-full',
        'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
        view === 'day'
          ? 'min-h-[var(--scanner-calendar-min-height)]'
          : 'h-[var(--scanner-calendar-max-height)]',
        className,
      )}
      {...rest}
    >
      {header}
      {body}
    </div>
  );
});

Calendar.displayName = 'Calendar';
