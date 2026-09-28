import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import type { ChangeEvent, CSSProperties, FocusEvent, KeyboardEvent, MouseEvent } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import { Calendar } from '../calendar';
import type { DateRange } from '../calendar';
import { formatDatePattern, isOutOfBounds, parseDatePattern } from '../calendar/date-utils';
import { FieldHeader, FieldMessage } from '../text-input/field-parts';
import {
  fieldAction,
  fieldBackground,
  fieldRoot,
  fieldStroke,
  placeholderText,
  skeletonFill,
  typeBody02,
  typeLabel01,
  valueText,
} from '../text-input/field-styles';
import type { DatePickerProps } from './date-picker.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → 01 Date picker (node 7014:14260, page Date picker 15305:6737)
 * Layer set (Set 01, Set 02) × Type (Single, Ranged) × Selected (False, True)
 * × State (Enabled, Hovered, Focused, Disabled, Error, Skeleton) = 48 variants.
 *
 * Field: 60px high, 12/16 padding, 8 gap, radius medium, layer background, 18/28 value (placeholder text-tertiary),
 * 24px "Calendar" icon (icon-tertiary; icon-primary on hover; icon-disabled when disabled).
 * Ranged: "first → second" with the arrow in text-tertiary. Focused: 1px border-focus stroke; Error: border-error.
 * Label / required / explainer / helper / error use the shared field parts (16/24).
 * Skeleton: 12px label box · 60px field box · 12px helper box.
 * The calendar panel (02 Calendar) opens below the field.
 */

const EMPTY_RANGE: DateRange = { start: null, end: null };

const skeletonBar =
  'h-[var(--scanner-date-picker-skeleton-bar-height)] w-[var(--scanner-date-picker-skeleton-bar-width)] max-w-full';

/** Figma Hovered: only the calendar icon darkens. */
const iconColor = (disabled: boolean) =>
  disabled
    ? 'text-[color:var(--scanner-icon-disabled)]'
    : cn(
        'text-[color:var(--scanner-icon-tertiary)]',
        'group-hover/field:text-[color:var(--scanner-icon-primary)] group-data-[state=hovered]/field:text-[color:var(--scanner-icon-primary)]',
      );

type Part = 'start' | 'end';

/**
 * Scanner DatePicker — date field with a calendar panel, for a single date or a date range.
 *
 * Figma props → React: Layer set → `layer`, Type → `type` (`'single' | 'ranged'`), Selected → derived from `value`,
 * State → `:hover` / `:focus-within` (forceable via `data-state`) / `disabled` / `error` / `skeleton`,
 * Show label → `showLabel` + `label`, Required → `required`, Show helper → `showHelper` + `helperText`/`errorText`,
 * Show explainer → `showExplainer` + `explainerText`, Placeholder text → `placeholder`,
 * Date value / First date value / Second date value → `value` / `defaultValue`.
 *
 * Mouse: clicking the field or the calendar icon opens the calendar; clicking outside closes it.
 * Keyboard: Tab focuses the input (type a date in `format`); Enter or ArrowDown opens the calendar and moves focus
 * into it (see `Calendar` for grid keys); Escape closes it and returns focus to the field.
 * The ref points to the root element.
 *
 * @example
 * <DatePicker label="Appointment" value={date} onChange={setDate} />
 * <DatePicker type="ranged" label="Period" value={range} onChange={setRange} min={new Date()} />
 */
export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>((props, ref) => {
  const {
    type: _type,
    value: _value,
    defaultValue: _defaultValue,
    onChange: _onChange,
    layer = 1,
    error = false,
    disabled = false,
    skeleton = false,
    label,
    showLabel = true,
    required = false,
    helperText,
    errorText,
    showHelper = true,
    showExplainer = false,
    explainerText,
    format = 'mm.dd.yyyy',
    placeholder,
    allowTyping = true,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    min,
    max,
    isDateDisabled,
    today,
    locale,
    weekStartsOn,
    openCalendarLabel = 'Open calendar',
    startDateLabel = 'start date',
    endDateLabel = 'end date',
    id: externalId,
    'data-state': dataState,
    'aria-describedby': ariaDescribedBy,
    className,
    onKeyDown,
    onBlur,
    ...rest
  } = props;

  const isRanged = props.type === 'ranged';
  const generatedId = useId();
  const inputId = externalId ?? `date-picker-${generatedId}`;
  const endInputId = `${inputId}-end`;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const panelId = `${inputId}-calendar`;
  const placeholderValue = placeholder ?? format;

  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);
  const lastInput = useRef<Part>('start');
  const focusCalendarRequest = useRef(false);
  useImperativeHandle(ref, () => rootRef.current as HTMLDivElement, []);

  /* ── Value (controlled / uncontrolled) ── */
  const [singleInternal, setSingleInternal] = useState<Date | null>(() =>
    props.type === 'ranged' ? null : (props.defaultValue ?? null),
  );
  const [rangeInternal, setRangeInternal] = useState<DateRange>(() =>
    props.type === 'ranged' ? (props.defaultValue ?? EMPTY_RANGE) : EMPTY_RANGE,
  );
  const single: Date | null = props.type === 'ranged' ? null : props.value !== undefined ? props.value : singleInternal;
  const range: DateRange =
    props.type === 'ranged' ? (props.value !== undefined ? props.value : rangeInternal) : EMPTY_RANGE;

  const commitSingle = (date: Date | null) => {
    if (props.type === 'ranged') return;
    if (props.value === undefined) setSingleInternal(date);
    props.onChange?.(date);
  };
  const commitRange = (next: DateRange) => {
    if (props.type !== 'ranged') return;
    if (props.value === undefined) setRangeInternal(next);
    props.onChange?.(next);
  };

  /* ── Typed text drafts (shown while editing; cleared on blur) ── */
  const [drafts, setDrafts] = useState<Partial<Record<Part, string>>>({});
  const partValue = (part: Part) => (isRanged ? (part === 'start' ? range.start : range.end) : single);
  const displayText = (part: Part) => {
    const draft = drafts[part];
    if (draft !== undefined) return draft;
    const date = partValue(part);
    return date ? formatDatePattern(date, format) : '';
  };

  /* ── Open state ── */
  const [openInternal, setOpenInternal] = useState(defaultOpen);
  const open = !disabled && !skeleton && (openProp ?? openInternal);
  const setOpen = (next: boolean) => {
    if (next === open) return;
    if (openProp === undefined) setOpenInternal(next);
    onOpenChange?.(next);
  };

  const focusInput = (part: Part = lastInput.current) => {
    (part === 'end' ? endInputRef : startInputRef).current?.focus();
  };

  /* Move focus into the calendar after it renders (keyboard open) */
  useEffect(() => {
    if (!open || !focusCalendarRequest.current) return;
    focusCalendarRequest.current = false;
    panelRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.focus();
  });

  /* Outside click closes the panel */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  });

  /* ── Handlers ── */
  const isAllowed = (date: Date) => !isOutOfBounds(date, min, max) && !isDateDisabled?.(date);

  const handleInputChange = (part: Part) => (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setDrafts((d) => ({ ...d, [part]: text }));
    const parsed = text.trim() === '' ? null : parseDatePattern(text, format);
    if (text.trim() !== '' && (!parsed || !isAllowed(parsed))) return;
    if (isRanged) commitRange(part === 'start' ? { ...range, start: parsed } : { ...range, end: parsed });
    else commitSingle(parsed);
  };

  const clearDraft = (part: Part) =>
    setDrafts((d) => {
      if (d[part] === undefined) return d;
      const next = { ...d };
      delete next[part];
      return next;
    });

  const openFromKeyboard = () => {
    focusCalendarRequest.current = true;
    if (open) panelRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.focus();
    else setOpen(true);
  };

  const handleInputKeyDown = (part: Part) => (e: KeyboardEvent<HTMLInputElement>) => {
    lastInput.current = part;
    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault();
      clearDraft(part);
      openFromKeyboard();
    }
  };

  const handleRootKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.key === 'Escape' && open && !e.defaultPrevented) {
      e.preventDefault();
      setOpen(false);
      focusInput();
    }
  };

  const handleRootBlur = (e: FocusEvent<HTMLDivElement>) => {
    onBlur?.(e);
    const next = e.relatedTarget as Node | null;
    if (open && next && rootRef.current && !rootRef.current.contains(next)) setOpen(false);
  };

  const handleFieldMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.target === e.currentTarget) {
      e.preventDefault();
      focusInput();
    }
  };

  const handleSingleSelect = (date: Date) => {
    commitSingle(date);
    clearDraft('start');
    setOpen(false);
    focusInput('start');
  };

  const handleRangeSelect = (next: DateRange) => {
    commitRange(next);
    setDrafts({});
    if (next.start && next.end) {
      setOpen(false);
      focusInput();
    }
  };

  /* ── Skeleton ── */
  const hasLabel = showLabel && !!label;

  if (skeleton) {
    return (
      <div
        ref={rootRef}
        aria-hidden="true"
        data-skeleton=""
        data-layer={layer}
        className={cn(fieldRoot, className)}
        {...rest}
      >
        {hasLabel && (
          <div className="flex w-full items-start pb-[var(--scanner-spacing-3)]">
            <div className={cn(skeletonBar, skeletonFill)} />
          </div>
        )}
        <div
          className={cn('h-[var(--scanner-date-picker-field-height)] w-full rounded-[var(--scanner-radius-md)]', skeletonFill)}
        />
        {showHelper && (helperText || (error && errorText)) && (
          <div className="flex w-full items-start pt-[var(--scanner-spacing-3)]">
            <div className={cn(skeletonBar, skeletonFill)} />
          </div>
        )}
      </div>
    );
  }

  const showError = showHelper && error && !!errorText;
  const showHelperText = showHelper && !showError && !!helperText;
  const describedBy =
    [ariaDescribedBy, showError && errorId, showHelperText && helperId].filter(Boolean).join(' ') || undefined;

  const inputClass = cn(
    'm-0 min-w-0 border-none bg-transparent p-0 outline-none text-ellipsis',
    typeBody02,
    valueText(disabled),
    placeholderText(disabled),
    disabled ? 'cursor-not-allowed' : 'cursor-pointer',
  );

  const renderInput = (part: Part) => (
    <input
      ref={part === 'start' ? startInputRef : endInputRef}
      id={part === 'start' ? inputId : endInputId}
      type="text"
      role="combobox"
      autoComplete="off"
      inputMode="numeric"
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={open ? panelId : undefined}
      aria-label={isRanged ? [label, part === 'start' ? startDateLabel : endDateLabel].filter(Boolean).join(', ') : undefined}
      aria-required={required || undefined}
      aria-invalid={error || undefined}
      aria-disabled={disabled || undefined}
      aria-describedby={describedBy}
      required={required}
      disabled={disabled}
      readOnly={!allowTyping}
      placeholder={placeholderValue}
      value={displayText(part)}
      data-part={isRanged ? `${part}-input` : 'input'}
      onChange={handleInputChange(part)}
      onKeyDown={handleInputKeyDown(part)}
      onFocus={() => {
        lastInput.current = part;
      }}
      onBlur={() => clearDraft(part)}
      onClick={() => {
        lastInput.current = part;
        setOpen(true);
      }}
      /*
       * Ranged inputs hug their text like Figma's "Date" frame (CSS field-sizing where supported, otherwise a
       * character-count width) and shrink when the field is narrow.
       */
      style={isRanged ? ({ '--date-picker-input-width': `${Math.max(placeholderValue.length, format.length)}ch` } as CSSProperties) : undefined}
      className={cn(
        inputClass,
        isRanged
          ? 'shrink w-[var(--date-picker-input-width)] supports-[field-sizing:content]:w-auto supports-[field-sizing:content]:[field-sizing:content]'
          : 'flex-1',
      )}
    />
  );

  return (
    <div
      ref={rootRef}
      data-layer={layer}
      data-open={open || undefined}
      onKeyDown={handleRootKeyDown}
      onBlur={handleRootBlur}
      className={cn(fieldRoot, className)}
      {...rest}
    >
      <FieldHeader
        htmlFor={inputId}
        label={hasLabel ? label : undefined}
        required={required}
        explainer={showExplainer ? explainerText : undefined}
        disabled={disabled}
        labelClassName={typeLabel01}
      />

      <div className="relative w-full">
        <div
          data-part="field"
          data-state={dataState}
          onMouseDown={handleFieldMouseDown}
          onClick={(e) => {
            if (!disabled && e.target === e.currentTarget) setOpen(true);
          }}
          className={cn(
            'group/field flex w-full items-center gap-[var(--scanner-spacing-3)] overflow-clip rounded-[var(--scanner-radius-md)]',
            'h-[var(--scanner-date-picker-field-height)] px-[var(--scanner-spacing-5)] py-[var(--scanner-spacing-4)]',
            'transition-shadow duration-150',
            fieldBackground[layer],
            fieldStroke({ error, disabled }),
            open && !error && 'shadow-[inset_0_0_0_1px_var(--scanner-border-focus)]',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          )}
        >
          {isRanged ? (
            <div className="flex min-w-0 flex-1 items-center" data-part="date">
              {renderInput('start')}
              <span
                aria-hidden="true"
                className={cn(
                  'shrink-0 whitespace-pre',
                  typeBody02,
                  disabled ? 'text-[color:var(--scanner-text-disabled)]' : 'text-[color:var(--scanner-text-tertiary)]',
                )}
              >
                {' → '}
              </span>
              {renderInput('end')}
            </div>
          ) : (
            renderInput('start')
          )}

          <button
            type="button"
            tabIndex={-1}
            aria-label={openCalendarLabel}
            aria-expanded={open}
            aria-controls={open ? panelId : undefined}
            disabled={disabled}
            onClick={() => {
              setOpen(!open);
              focusInput();
            }}
            className={cn(
              fieldAction,
              'm-0 border-none bg-transparent p-0',
              iconColor(disabled),
              disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            )}
          >
            <Icon name="calendar" size={24} />
          </button>
        </div>

        {open && (
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-label={label ?? openCalendarLabel}
            data-part="panel"
            className={cn(
              'absolute left-0 top-full z-[var(--scanner-date-picker-panel-z)]',
              'mt-[var(--scanner-date-picker-panel-offset)]',
            )}
          >
            {props.type === 'ranged' ? (
              <Calendar
                mode="range"
                value={range}
                onChange={handleRangeSelect}
                min={min}
                max={max}
                isDateDisabled={isDateDisabled}
                today={today}
                locale={locale}
                weekStartsOn={weekStartsOn}
              />
            ) : (
              <Calendar
                value={single}
                onChange={handleSingleSelect}
                min={min}
                max={max}
                isDateDisabled={isDateDisabled}
                today={today}
                locale={locale}
                weekStartsOn={weekStartsOn}
              />
            )}
          </div>
        )}
      </div>

      {showError && (
        <FieldMessage id={errorId} tone="error" className={typeLabel01}>
          {errorText}
        </FieldMessage>
      )}
      {showHelperText && (
        <FieldMessage id={helperId} tone="helper" disabled={disabled} className={typeLabel01}>
          {helperText}
        </FieldMessage>
      )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';
