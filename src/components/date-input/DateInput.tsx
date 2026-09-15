import { forwardRef, useId, useImperativeHandle, useRef } from 'react';
import type { MouseEvent } from 'react';
import { cn } from '../../utils/cn';
import { FieldHeader, FieldMessage } from '../text-input/field-parts';
import {
  fieldBackground,
  fieldRoot,
  fieldStroke,
  placeholderText,
  skeletonFill,
  typeBody02,
  typeLabel01,
  valueText,
} from '../text-input/field-styles';
import type { DateInputProps, DateInputSize } from './date-input.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Date input (node 25493:22854, page 25493:21708)
 * 2 Layer sets × Filled (False/True) × 5 States (Enabled, Focused, Disabled, Error, Skeleton) × 3 Sizes = 60 variants.
 *
 * Filled is derived from the value: the placeholder (text-tertiary) shows until a date is typed (text-primary).
 * Label / helper / error are 16/24 and the value 18/28 at every size; sizes only change the field box.
 */

const sizeConfig: Record<DateInputSize, { field: string; skeleton: string }> = {
  large: {
    field: 'h-[var(--scanner-date-input-height-lg)] p-[var(--scanner-spacing-5)]', // 60 · 16 all sides
    skeleton: 'h-[var(--scanner-date-input-height-lg)]',
  },
  medium: {
    field: 'h-[var(--scanner-date-input-height-md)] px-[var(--scanner-spacing-4)] py-[var(--scanner-spacing-5)]', // 60 · 16 / 12
    skeleton: 'h-[var(--scanner-date-input-height-md)]',
  },
  small: {
    field: 'h-[var(--scanner-date-input-height-sm)] px-[var(--scanner-spacing-3)] py-[var(--scanner-spacing-2)]', // 52 · 4 / 8
    skeleton: 'h-[var(--scanner-date-input-height-sm)]',
  },
};

const skeletonBar =
  'h-[var(--scanner-date-input-skeleton-bar-height)] w-[var(--scanner-date-input-skeleton-bar-width)]';

/**
 * Scanner DateInput — manual date entry (no calendar) with label, required indicator, explainer,
 * helper/error text and skeleton state. Use the placeholder to show the expected format.
 *
 * Figma props → React: Size → `size`, Layer set → `layer`, Filled → derived from the value,
 * State → `:focus-within` (forceable via `data-state="focused"`) / `disabled` / `error` / `skeleton`,
 * Show label → `showLabel` + `label`, Required field → `required`, Show helper → `showHelper` + `helperText`/`errorText`,
 * Show explainer → `showExplainer` + `explainerText`, Date value → `value`/`defaultValue`.
 *
 * Keyboard: Tab focuses the field; native text editing (Ctrl/Opt + arrows move by word / to start or end).
 *
 * @example
 * <DateInput label="Date of birth" placeholder="mm / dd / yyyy" helperText="Format: MM/DD/YYYY" />
 * <DateInput label="Due date" required error errorText="Enter a valid date" />
 */
export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      size = 'large',
      layer = 1,
      error = false,
      skeleton = false,
      label,
      showLabel = true,
      required = false,
      helperText,
      errorText,
      showHelper = true,
      showExplainer = false,
      explainerText,
      disabled = false,
      className,
      id: externalId,
      placeholder = 'mm / dd / yyyy',
      'aria-describedby': ariaDescribedBy,
      'data-state': dataState,
      ...inputProps
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = externalId ?? `date-input-${generatedId}`;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;
    const cfg = sizeConfig[size];

    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);

    const hasLabel = showLabel && !!label;

    if (skeleton) {
      /* Figma skeleton: label box · field box · helper box */
      return (
        <div aria-hidden="true" data-skeleton="" data-layer={layer} className={cn(fieldRoot, className)}>
          {hasLabel && (
            <div className="flex w-full items-start pb-[var(--scanner-spacing-3)]">
              <div className={cn(skeletonBar, skeletonFill)} />
            </div>
          )}
          <div className={cn('w-full rounded-[var(--scanner-radius-md)]', cfg.skeleton, skeletonFill)} />
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

    /** Clicking the field container focuses the input — Figma interaction docs. */
    const focusFromContainer = (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget && inputRef.current && !disabled) {
        e.preventDefault();
        inputRef.current.focus();
      }
    };

    return (
      <div data-layer={layer} className={cn(fieldRoot, className)}>
        <FieldHeader
          htmlFor={inputId}
          label={hasLabel ? label : undefined}
          required={required}
          explainer={showExplainer ? explainerText : undefined}
          disabled={disabled}
          labelClassName={typeLabel01}
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
            autoComplete="off"
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-required={required || undefined}
            aria-invalid={error || undefined}
            aria-disabled={disabled || undefined}
            aria-describedby={describedBy}
            className={cn(
              'm-0 min-w-0 flex-1 border-none bg-transparent p-0 outline-none',
              'text-ellipsis',
              typeBody02,
              valueText(disabled),
              placeholderText(disabled),
              disabled && 'cursor-not-allowed',
            )}
            {...inputProps}
          />
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
  },
);

DateInput.displayName = 'DateInput';
