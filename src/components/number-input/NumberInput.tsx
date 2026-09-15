import { forwardRef, useId, useImperativeHandle, useRef, useState } from 'react';
import type { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent } from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../button';
import { FieldHeader, FieldMessage } from '../text-input/field-parts';
import {
  fieldBackground,
  fieldRoot,
  fieldStroke,
  placeholderText,
  skeletonFill,
  typeBody02,
  typeLabel01,
  typeSm,
  typeXs,
  valueText,
} from '../text-input/field-styles';
import { Icon } from '../../icons';
import type { NumberInputProps, NumberInputSize } from './number-input.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Number input (node 36634:12646, page 15305:6746)
 * 2 Layer sets × 5 States (Enabled, Focused, Disabled, Error, Skeleton) × 4 Sizes = 40 variants.
 *
 * Anatomy: Label (+ Explainer) · Field (value + Subtract | divider | Add ghost buttons) · Helper / Error.
 * The label/helper/error parts and field styling are shared with TextInput / TextArea / PasswordInput.
 */

const sizeConfig: Record<
  NumberInputSize,
  { label: string; field: string; input: string; control: string; icon: string; skeleton: string }
> = {
  'x-large': {
    label: typeLabel01, // 16/24 (label, helper, error)
    field:
      'h-[var(--scanner-number-input-height-xl)] py-[var(--scanner-spacing-5)] pl-[var(--scanner-spacing-5)] pr-[var(--scanner-spacing-3)]', // 60 · 16 / 8 / 16 / 16
    input: typeBody02, // 18/28
    control: 'size-[var(--scanner-number-input-control-size-xl)]', // 32
    icon: 'size-[var(--scanner-number-input-icon-size-xl)]', // 24
    skeleton: 'h-[var(--scanner-number-input-height-xl)]',
  },
  large: {
    label: typeXs, // 12/16
    field:
      'h-[var(--scanner-number-input-height-lg)] py-[var(--scanner-spacing-3)] pl-[var(--scanner-spacing-5)] pr-[var(--scanner-spacing-3)]', // 44 · 8 / 8 / 8 / 16
    input: typeSm, // 14/20
    control: 'size-[var(--scanner-number-input-control-size)]', // 28
    icon: 'size-[var(--scanner-number-input-icon-size)]', // 20
    skeleton: 'h-[var(--scanner-number-input-height-lg)]',
  },
  medium: {
    label: typeXs,
    field:
      'h-[var(--scanner-number-input-height-md)] py-[var(--scanner-spacing-2)] pl-[var(--scanner-spacing-4)] pr-[var(--scanner-spacing-2)]', // 36 · 4 / 4 / 4 / 12
    input: typeSm,
    control: 'size-[var(--scanner-number-input-control-size)]',
    icon: 'size-[var(--scanner-number-input-icon-size)]',
    skeleton: 'h-[var(--scanner-number-input-height-md)]',
  },
  small: {
    label: typeXs,
    field:
      'h-[var(--scanner-number-input-height-sm)] py-[var(--scanner-spacing-2)] pl-[var(--scanner-spacing-3)] pr-0', // 28 · 4 / 0 / 4 / 8
    input: typeSm,
    control: 'size-[var(--scanner-number-input-control-size)]',
    icon: 'size-[var(--scanner-number-input-icon-size)]',
    skeleton: 'h-[var(--scanner-number-input-height-sm)]',
  },
};

/** Squeezes the ghost Button to the Figma control box: fixed square, no padding / min sizes, block icon. */
const controlReset = 'min-h-0 min-w-0 p-0 [&_svg]:mx-auto [&_svg]:block';

const skeletonBar =
  'h-[var(--scanner-number-input-skeleton-bar-height)] w-[var(--scanner-number-input-skeleton-bar-width)]';

/** Characters accepted while typing: optional minus, digits, one decimal point. */
const PARTIAL_NUMBER = /^-?\d*\.?\d*$/;

const decimals = (n: number) => {
  if (!Number.isFinite(n)) return 0;
  const s = String(n);
  const i = s.indexOf('.');
  return i === -1 ? 0 : s.length - i - 1;
};

const parse = (raw: string): number | undefined => {
  const trimmed = raw.trim();
  if (trimmed === '' || trimmed === '-' || trimmed === '.' || trimmed === '-.') return undefined;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : undefined;
};

/**
 * Scanner NumberInput — numeric entry with Subtract / Add controls.
 *
 * Figma props → React: Size → `size`, Layer set → `layer`, State → `:focus-within` (forceable via
 * `data-state="focused"`) / `disabled` / `error` / `skeleton`, Show label/helper → `label` / `helperText`,
 * Show controls → `showControls`, Show explainer → `showExplainer` + `explainerText`, Number value → `value`.
 *
 * Keyboard (`role="spinbutton"`): Tab focuses the field; ArrowUp/ArrowDown step by `step`, PageUp/PageDown by
 * 10 × `step`, Home/End jump to `min`/`max`; Enter commits typed text. The controls are not in the tab order.
 *
 * @example
 * <NumberInput label="Quantity" min={0} max={100} />
 * <NumberInput value={qty} onChange={setQty} error errorText="Out of range" />
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      min,
      max,
      step = 1,
      size = 'large',
      layer = 1,
      label,
      helperText,
      errorText,
      error = false,
      disabled = false,
      readOnly = false,
      skeleton = false,
      showControls = true,
      showExplainer = false,
      explainerText,
      decrementLabel = 'Decrement',
      incrementLabel = 'Increment',
      className,
      id: externalId,
      onBlur,
      onKeyDown,
      'aria-describedby': ariaDescribedBy,
      'data-state': dataState,
      ...inputProps
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = externalId ?? `number-input-${generatedId}`;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;
    const cfg = sizeConfig[size];

    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState<number>(defaultValue ?? 0);
    const currentValue = isControlled ? value : internalValue;
    /** Text being typed; `null` when the field shows the committed value. */
    const [draft, setDraft] = useState<string | null>(null);

    const clamp = (n: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));
    const inRange = (n: number) => (min === undefined || n >= min) && (max === undefined || n <= max);

    const commit = (next: number) => {
      const clamped = clamp(next);
      if (!isControlled) setInternalValue(clamped);
      if (clamped !== currentValue) onChange?.(clamped);
    };

    const interactive = !disabled && !readOnly;

    const stepBy = (multiplier: number) => {
      if (!interactive) return;
      const typed = draft !== null ? parse(draft) : undefined;
      const base = typed ?? currentValue;
      const precision = Math.max(decimals(step), decimals(base));
      setDraft(null);
      commit(Number((base + step * multiplier).toFixed(precision)));
    };

    const commitDraft = () => {
      if (draft === null) return;
      const typed = parse(draft);
      setDraft(null);
      if (typed !== undefined) commit(typed); // empty / invalid text reverts to the last value
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      if (!PARTIAL_NUMBER.test(raw.trim())) return;
      setDraft(raw);
      const typed = parse(raw);
      if (typed !== undefined && inRange(typed)) commit(typed);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      commitDraft();
      onBlur?.(e);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || !interactive) return;
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          stepBy(1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          stepBy(-1);
          break;
        case 'PageUp':
          e.preventDefault();
          stepBy(10);
          break;
        case 'PageDown':
          e.preventDefault();
          stepBy(-10);
          break;
        case 'Home':
          if (min !== undefined) {
            e.preventDefault();
            setDraft(null);
            commit(min);
          }
          break;
        case 'End':
          if (max !== undefined) {
            e.preventDefault();
            setDraft(null);
            commit(max);
          }
          break;
        case 'Enter':
          commitDraft();
          break;
      }
    };

    /** Pressing the field container (not a control) focuses the input — Figma interaction docs. */
    const focusFromContainer = (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget && inputRef.current && !disabled) {
        e.preventDefault();
        inputRef.current.focus();
      }
    };

    /** Keep focus in the input when a control is pressed with the mouse. */
    const keepFocus = (e: MouseEvent<HTMLButtonElement>) => e.preventDefault();

    if (skeleton) {
      /* Figma skeleton: label box · field box · helper box */
      return (
        <div aria-hidden="true" data-skeleton="" data-layer={layer} className={cn(fieldRoot, className)}>
          {label && (
            <div className="flex w-full items-start pb-[var(--scanner-spacing-3)]">
              <div className={cn(skeletonBar, skeletonFill)} />
            </div>
          )}
          <div className={cn('w-full rounded-[var(--scanner-radius-md)]', cfg.skeleton, skeletonFill)} />
          {(helperText || (error && errorText)) && (
            <div className="flex w-full items-start pt-[var(--scanner-spacing-3)]">
              <div className={cn(skeletonBar, skeletonFill)} />
            </div>
          )}
        </div>
      );
    }

    const showError = error && !!errorText;
    const showHelper = !showError && !!helperText;
    const describedBy =
      [ariaDescribedBy, showError && errorId, showHelper && helperId].filter(Boolean).join(' ') || undefined;

    const atMin = min !== undefined && currentValue <= min;
    const atMax = max !== undefined && currentValue >= max;

    return (
      <div data-layer={layer} className={cn(fieldRoot, className)}>
        <FieldHeader
          htmlFor={inputId}
          label={label}
          explainer={showExplainer ? explainerText : undefined}
          disabled={disabled}
          labelClassName={cfg.label}
        />

        <div
          data-part="field"
          data-state={dataState}
          onMouseDown={focusFromContainer}
          className={cn(
            'flex w-full items-center gap-[var(--scanner-spacing-3)] overflow-clip rounded-[var(--scanner-radius-md)]',
            'transition-shadow duration-150',
            cfg.field,
            fieldBackground[layer],
            fieldStroke({ error, disabled }),
            disabled ? 'cursor-not-allowed' : 'cursor-text',
          )}
        >
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            role="spinbutton"
            inputMode="decimal"
            autoComplete="off"
            value={draft ?? String(currentValue)}
            disabled={disabled}
            readOnly={readOnly}
            aria-valuenow={currentValue}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-invalid={error || undefined}
            aria-disabled={disabled || undefined}
            aria-describedby={describedBy}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={cn(
              'm-0 min-w-0 flex-1 border-none bg-transparent p-0 outline-none',
              'text-ellipsis',
              cfg.input,
              valueText(disabled),
              placeholderText(disabled),
              disabled && 'cursor-not-allowed',
            )}
            {...inputProps}
          />

          {showControls && (
            <div data-part="controls" className="flex shrink-0 items-center gap-[var(--scanner-spacing-2)]">
              <Button
                emphasis="ghost"
                size="small"
                tabIndex={-1}
                aria-label={decrementLabel}
                aria-controls={inputId}
                disabled={!interactive || atMin}
                onMouseDown={keepFocus}
                onClick={() => stepBy(-1)}
                className={cn(controlReset, cfg.control)}
              >
                <Icon name="subtract-empty" size={24} className={cfg.icon} />
              </Button>
              <span
                aria-hidden="true"
                className="h-[var(--scanner-number-input-divider-height)] w-px shrink-0 bg-[var(--scanner-border-subtle)]"
              />
              <Button
                emphasis="ghost"
                size="small"
                tabIndex={-1}
                aria-label={incrementLabel}
                aria-controls={inputId}
                disabled={!interactive || atMax}
                onMouseDown={keepFocus}
                onClick={() => stepBy(1)}
                className={cn(controlReset, cfg.control)}
              >
                <Icon name="add-empty" size={24} className={cfg.icon} />
              </Button>
            </div>
          )}
        </div>

        {showError && (
          <FieldMessage id={errorId} tone="error" className={cfg.label}>
            {errorText}
          </FieldMessage>
        )}
        {showHelper && (
          <FieldMessage id={helperId} tone="helper" disabled={disabled} className={cfg.label}>
            {helperText}
          </FieldMessage>
        )}
      </div>
    );
  },
);

NumberInput.displayName = 'NumberInput';
