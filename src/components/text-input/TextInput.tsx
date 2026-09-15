import { forwardRef, useId } from 'react';
import type { KeyboardEvent } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import { FieldCounter, FieldHeader, FieldMessage } from './field-parts';
import {
  fieldAction,
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
} from './field-styles';
import { useFieldValue } from './use-field-value';
import type { TextInputProps, TextInputSize } from './text-input.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Text input (node 28:1412, page 23885:185666)
 * 4 Sizes × 2 Layer sets × Filled (False/True) × 5 States (Enabled, Focused, Disabled, Error, Skeleton) = 80 variants.
 */

const sizeConfig: Record<
  TextInputSize,
  { label: string; message: string; field: string; radius: string; input: string; skeleton: string }
> = {
  'x-large': {
    label: typeLabel01, // 16/24
    message: typeLabel01, // 16/24
    field: 'h-[var(--scanner-text-input-height-xl)] px-[var(--scanner-spacing-5)] py-[var(--scanner-spacing-5)]', // 60 · 16/16
    radius: 'rounded-[var(--scanner-radius-md)]',
    input: cn('h-[var(--scanner-leading-lg)]', typeBody02), // 18/28
    skeleton: 'h-[var(--scanner-text-input-height-xl)]',
  },
  large: {
    label: typeXs, // 12/16
    message: typeXs, // 12/16
    field: 'h-[var(--scanner-text-input-height-lg)] px-[var(--scanner-spacing-5)] py-[var(--scanner-spacing-4)]', // 44 · 16/12
    radius: 'rounded-[var(--scanner-radius-md)]',
    input: cn('h-[var(--scanner-leading-sm)]', typeSm), // 14/20
    skeleton: 'h-[var(--scanner-text-input-height-lg)]',
  },
  medium: {
    label: typeBody02, // 18/28
    message: typeBody02, // 18/28
    field: 'h-[var(--scanner-text-input-height-md)] px-[var(--scanner-spacing-4)] py-[var(--scanner-spacing-3)]', // 36 · 12/8
    radius: 'rounded-[var(--scanner-radius-md)]',
    /* Figma: 18px text in a 20px-tall line box */
    input: 'h-[var(--scanner-leading-sm)] text-[length:var(--scanner-text-scanner-md)] leading-[var(--scanner-leading-sm)]',
    skeleton: 'h-[var(--scanner-text-input-height-md)]',
  },
  small: {
    label: typeBody02, // 18/28
    message: typeBody02, // 18/28 (majority of Small states)
    field: 'h-[var(--scanner-text-input-height-sm)] px-[var(--scanner-spacing-3)] py-[var(--scanner-spacing-2)]', // 28 · 8/4
    radius: 'rounded-[var(--scanner-radius-sm)]',
    input: 'h-[var(--scanner-leading-sm)] text-[length:var(--scanner-text-scanner-md)] leading-[var(--scanner-leading-sm)]',
    skeleton: 'h-[var(--scanner-text-input-height-sm)]',
  },
};

/**
 * Scanner TextInput — single-line free-form text entry with label, required indicator,
 * explainer tooltip, counter, clear action, helper/error text and skeleton state.
 *
 * Figma props → React: Size → `size`, Layer set → `layer`, Filled → derived from the value,
 * State → `:focus-within` (forceable via `data-state="focused"`) / `disabled` / `error` / `skeleton`,
 * Show label/helper/placeholder/counter/explainer → `label` / `helperText` / `placeholder` / `counter`|`showCounter` / `tooltip`,
 * Required → `required`, Clearable → `clearable`.
 *
 * Keyboard: Tab focuses the field; Escape clears it when `clearable`.
 *
 * @example
 * <TextInput label="Email" placeholder="you@example.com" helperText="We'll never share it." />
 * <TextInput label="Name" required error errorText="Name is required" />
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      size = 'x-large',
      layer = 1,
      label,
      helperText,
      errorText,
      error = false,
      required = false,
      tooltip,
      counter,
      showCounter = false,
      clearable = false,
      onClear,
      skeleton = false,
      disabled = false,
      className,
      id: externalId,
      value,
      defaultValue,
      onChange,
      onKeyDown,
      maxLength,
      'aria-describedby': ariaDescribedBy,
      'data-state': dataState,
      ...inputProps
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = externalId ?? `text-input-${generatedId}`;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;
    const cfg = sizeConfig[size];

    const { setRef, currentValue, hasValue, handleChange, clear, focusFromContainer } =
      useFieldValue<HTMLInputElement>({ value, defaultValue, onChange, ref });

    if (skeleton) {
      /* Figma skeleton: field box + helper bar (no label) */
      return (
        <div aria-hidden="true" data-skeleton="" data-layer={layer} className={cn(fieldRoot, className)}>
          <div className={cn('w-full', cfg.skeleton, cfg.radius, skeletonFill)} />
          {(helperText || errorText) && (
            <div className="flex w-full items-start pt-[var(--scanner-spacing-3)]">
              <div
                className={cn(
                  'h-[var(--scanner-text-input-skeleton-bar-height)] w-[var(--scanner-text-input-skeleton-bar-width)]',
                  skeletonFill,
                )}
              />
            </div>
          )}
        </div>
      );
    }

    const showError = error && !!errorText;
    const showHelper = !showError && !!helperText;
    const counterText =
      counter ?? (showCounter && maxLength !== undefined ? `${currentValue.length}/${maxLength}` : undefined);
    const showClear = clearable && hasValue && !disabled && !inputProps.readOnly;

    const describedBy =
      [ariaDescribedBy, showError && errorId, showHelper && helperId].filter(Boolean).join(' ') || undefined;

    const handleClear = () => {
      clear();
      onClear?.();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      if (!e.defaultPrevented && e.key === 'Escape' && showClear) {
        e.preventDefault();
        handleClear();
      }
    };

    return (
      <div data-layer={layer} className={cn(fieldRoot, className)}>
        <FieldHeader
          htmlFor={inputId}
          label={label}
          required={required}
          explainer={tooltip}
          disabled={disabled}
          labelClassName={cfg.label}
          trailing={counterText !== undefined ? <FieldCounter disabled={disabled}>{counterText}</FieldCounter> : undefined}
        />

        <div
          data-part="field"
          data-state={dataState}
          onMouseDown={focusFromContainer}
          className={cn(
            'flex w-full items-center gap-[var(--scanner-spacing-3)] overflow-clip',
            'transition-shadow duration-150',
            cfg.field,
            cfg.radius,
            fieldBackground[layer],
            fieldStroke({ error, disabled }),
            disabled ? 'cursor-not-allowed' : 'cursor-text',
          )}
        >
          <input
            ref={setRef}
            id={inputId}
            type="text"
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            value={value}
            defaultValue={defaultValue}
            aria-invalid={error || undefined}
            aria-required={required || undefined}
            aria-disabled={disabled || undefined}
            aria-describedby={describedBy}
            onChange={handleChange}
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

          {showClear && (
            <button
              type="button"
              aria-label="Clear input"
              aria-controls={inputId}
              onClick={handleClear}
              className={cn(fieldAction, 'size-[var(--scanner-spacing-6)] cursor-pointer text-[color:var(--scanner-icon-tertiary)]')}
            >
              <Icon name="close-empty" size={20} />
            </button>
          )}
        </div>

        {showError && (
          <FieldMessage id={errorId} tone="error" className={cfg.message}>
            {errorText}
          </FieldMessage>
        )}
        {showHelper && (
          <FieldMessage id={helperId} tone="helper" disabled={disabled} className={cfg.message}>
            {helperText}
          </FieldMessage>
        )}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';
