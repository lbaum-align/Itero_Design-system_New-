import { forwardRef, useCallback, useId, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import { IconTriggerTooltip } from '../icon-trigger-tooltip';
import type { TextInputProps, TextInputSize } from './text-input.types';

/* ------------------------------------------------------------------ */
/*  Size configuration                                                  */
/* ------------------------------------------------------------------ */

interface SizeConfig {
  /** Classes for the label text */
  label: string;
  /** Classes for the field wrapper (padding + radius) */
  field: string;
  /** Classes for the native input text */
  input: string;
  /** Classes for the helper / error text */
  helper: string;
  /** Classes for the counter text */
  counter: string;
  /** Height of the skeleton field placeholder */
  skeletonFieldH: string;
  /** Radius for the skeleton field */
  skeletonRadius: string;
}

const SIZE_CONFIG: Record<TextInputSize, SizeConfig> = {
  'x-large': {
    label: 'text-[16px] leading-[var(--scanner-leading-md)]',
    field: 'px-[var(--scanner-spacing-5)] py-[var(--scanner-spacing-5)] rounded-[var(--scanner-radius-md)]',
    input: 'text-[18px] leading-[var(--scanner-leading-lg)]',
    helper: 'text-[16px] leading-[var(--scanner-leading-md)]',
    counter: 'text-[length:var(--scanner-text-xs)] leading-[var(--scanner-leading-xs)]',
    skeletonFieldH: 'h-[60px]',
    skeletonRadius: 'rounded-[var(--scanner-radius-md)]',
  },
  large: {
    label: 'text-[length:var(--scanner-text-xs)] leading-[var(--scanner-leading-xs)]',
    field: 'px-[var(--scanner-spacing-5)] py-[var(--scanner-spacing-4)] rounded-[var(--scanner-radius-md)]',
    input: 'text-[length:var(--scanner-text-sm)] leading-[var(--scanner-leading-sm)] h-5',
    helper: 'text-[length:var(--scanner-text-xs)] leading-[var(--scanner-leading-xs)]',
    counter: 'text-[length:var(--scanner-text-xs)] leading-[var(--scanner-leading-xs)]',
    skeletonFieldH: 'h-[44px]',
    skeletonRadius: 'rounded-[var(--scanner-radius-md)]',
  },
  medium: {
    label: 'text-[18px] leading-[var(--scanner-leading-lg)]',
    field: 'px-[var(--scanner-spacing-4)] py-[var(--scanner-spacing-3)] rounded-[var(--scanner-radius-md)]',
    input: 'text-[18px] leading-[var(--scanner-leading-lg)] h-5',
    helper: 'text-[18px] leading-[var(--scanner-leading-lg)]',
    counter: 'text-[length:var(--scanner-text-xs)] leading-[var(--scanner-leading-xs)]',
    skeletonFieldH: 'h-[36px]',
    skeletonRadius: 'rounded-[var(--scanner-radius-md)]',
  },
  small: {
    label: 'text-[18px] leading-[var(--scanner-leading-lg)]',
    field: 'px-[var(--scanner-spacing-3)] py-[var(--scanner-spacing-2)] rounded-[var(--scanner-radius-sm)]',
    input: 'text-[18px] leading-[var(--scanner-leading-lg)] h-5',
    helper: 'text-[length:var(--scanner-text-xs)] leading-[var(--scanner-leading-xs)]',
    counter: 'text-[length:var(--scanner-text-xs)] leading-[var(--scanner-leading-xs)]',
    skeletonFieldH: 'h-[28px]',
    skeletonRadius: 'rounded-[var(--scanner-radius-sm)]',
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

/**
 * TextInput — a labelled single-line text field with helper / error text,
 * character counter, clearable action, tooltip explainer, and skeleton state.
 *
 * @example
 * <TextInput label="Email" placeholder="Enter email" helperText="We'll never share it." />
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
      clearable = false,
      onClear,
      skeleton = false,
      disabled = false,
      className,
      id: externalId,
      value: controlledValue,
      defaultValue,
      onChange,
      ...inputProps
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = externalId || `text-input-${generatedId}`;
    const helperId = `${inputId}-helper`;
    const errorMsgId = `${inputId}-error`;

    /* Track value internally for uncontrolled inputs (clear-button visibility) */
    const [internalValue, setInternalValue] = useState<string>(
      String(defaultValue ?? ''),
    );
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? String(controlledValue) : internalValue;
    const hasValue = currentValue.length > 0;

    /* Ref for focusing the input after clear */
    const internalRef = useRef<HTMLInputElement | null>(null);
    const setRefs = useCallback(
      (node: HTMLInputElement | null) => {
        internalRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      },
      [ref],
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) setInternalValue(e.target.value);
        onChange?.(e);
      },
      [isControlled, onChange],
    );

    const handleClear = useCallback(() => {
      if (!isControlled) setInternalValue('');
      onClear?.();
      internalRef.current?.focus();
    }, [isControlled, onClear]);

    /* Derived flags */
    const showLabel = !!label;
    const showHelper = !!helperText && !error;
    const showError = error && !!errorText;
    const showCounter = !!counter;
    const showClearBtn = clearable && hasValue && !disabled;

    const describedBy =
      [showError && errorMsgId, showHelper && helperId]
        .filter(Boolean)
        .join(' ') || undefined;

    const cfg = SIZE_CONFIG[size];

    /* -------------------------------------------------------------- */
    /* Skeleton state                                                    */
    /* -------------------------------------------------------------- */
    if (skeleton) {
      return (
        <div
          className={cn('flex w-full flex-col items-start', className)}
          aria-hidden="true"
          data-layer={layer}
        >
          {/* Field skeleton */}
          <div
            className={cn(
              'w-full bg-[var(--scanner-bg-disabled)]',
              cfg.skeletonFieldH,
              cfg.skeletonRadius,
            )}
          />
          {/* Helper skeleton bar */}
          <div className="flex w-full items-start pt-[var(--scanner-spacing-3)]">
            <div className="h-2 w-10 bg-[var(--scanner-bg-disabled)]" />
          </div>
        </div>
      );
    }

    /* -------------------------------------------------------------- */
    /* Normal render                                                     */
    /* -------------------------------------------------------------- */
    return (
      <div
        className={cn('flex w-full flex-col items-start', className)}
        data-layer={layer}
      >
        {/* ---- Label + Counter row ---- */}
        {(showLabel || showCounter) && (
          <div className="flex w-full items-start justify-between">
            {showLabel && (
              <div
                className={cn(
                  'flex min-w-0 flex-1 items-start',
                  'gap-[var(--scanner-spacing-2)] pb-[var(--scanner-spacing-3)]',
                )}
              >
                <label
                  htmlFor={inputId}
                  className={cn(
                    'shrink-0 whitespace-nowrap',
                    'font-[family-name:var(--scanner-font-sans)]',
                    'font-[var(--scanner-font-regular)]',
                    cfg.label,
                    disabled
                      ? 'text-[color:var(--scanner-text-disabled)]'
                      : 'text-[color:var(--scanner-text-secondary)]',
                  )}
                >
                  {label}
                </label>

                {required && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'shrink-0',
                      'font-[family-name:var(--scanner-font-sans)]',
                      'font-[var(--scanner-font-regular)]',
                      'text-[length:var(--scanner-text-xs)] leading-[var(--scanner-leading-xs)]',
                      'text-[color:var(--scanner-text-error)]',
                    )}
                  >
                    *
                  </span>
                )}

                {tooltip && (
                  <IconTriggerTooltip
                    content={tooltip}
                    iconName="help"
                    className="shrink-0"
                  />
                )}
              </div>
            )}

            {showCounter && (
              <div
                className={cn(
                  'flex shrink-0 items-center justify-center',
                  'pb-[var(--scanner-spacing-3)] pl-[var(--scanner-spacing-3)]',
                )}
              >
                <span
                  className={cn(
                    'whitespace-nowrap text-right',
                    'font-[family-name:var(--scanner-font-sans)]',
                    'font-[var(--scanner-font-regular)]',
                    cfg.counter,
                    disabled
                      ? 'text-[color:var(--scanner-text-disabled)]'
                      : 'text-[color:var(--scanner-text-secondary)]',
                  )}
                >
                  {counter}
                </span>
              </div>
            )}
          </div>
        )}

        {/* ---- Field ---- */}
        <div
          className={cn(
            'flex w-full items-center gap-[var(--scanner-spacing-3)] overflow-clip',
            cfg.field,
            /* Background based on layer */
            layer === 2
              ? 'bg-[var(--scanner-bg-secondary)]'
              : 'bg-[var(--scanner-bg-primary)]',
            /* Border: transparent by default to prevent layout shift */
            'border border-solid',
            error
              ? 'border-[var(--scanner-border-error)]'
              : 'border-transparent',
            /* Focus-within: show focus border (overrides transparent & error) */
            !error && 'focus-within:border-[var(--scanner-border-focus)]',
            /* Disabled: muted background */
            disabled && 'cursor-not-allowed',
          )}
          data-state={
            disabled ? 'disabled' : error ? 'error' : undefined
          }
        >
          <input
            ref={setRefs}
            id={inputId}
            type="text"
            disabled={disabled}
            required={required}
            value={isControlled ? controlledValue : undefined}
            defaultValue={isControlled ? undefined : defaultValue}
            aria-invalid={error || undefined}
            aria-describedby={describedBy}
            aria-required={required || undefined}
            onChange={handleChange}
            className={cn(
              'min-w-0 flex-1 bg-transparent outline-none',
              'font-[family-name:var(--scanner-font-sans)]',
              'font-[var(--scanner-font-regular)]',
              cfg.input,
              /* Text colour */
              disabled
                ? 'text-[color:var(--scanner-text-disabled)] cursor-not-allowed'
                : 'text-[color:var(--scanner-text-primary)]',
              /* Placeholder colour */
              disabled
                ? 'placeholder:text-[color:var(--scanner-text-disabled)]'
                : 'placeholder:text-[color:var(--scanner-text-tertiary)]',
            )}
            {...inputProps}
          />

          {showClearBtn && (
            <button
              type="button"
              onClick={handleClear}
              tabIndex={-1}
              aria-label="Clear input"
              className={cn(
                'inline-flex shrink-0 items-center justify-center',
                'size-5 cursor-pointer',
                'text-[color:var(--scanner-icon-tertiary)]',
                'hover:text-[color:var(--scanner-icon-secondary)]',
                'focus-visible:outline-2 focus-visible:outline-offset-2',
                'focus-visible:outline-[var(--scanner-focus-ring)]',
              )}
            >
              <Icon name="close-empty" size={20} />
            </button>
          )}
        </div>

        {/* ---- Error text ---- */}
        {showError && (
          <div
            id={errorMsgId}
            role="alert"
            className="flex w-full items-start pt-[var(--scanner-spacing-3)]"
          >
            <p
              className={cn(
                'min-w-0 flex-1',
                'font-[family-name:var(--scanner-font-sans)]',
                'font-[var(--scanner-font-regular)]',
                cfg.helper,
                'text-[color:var(--scanner-text-error)]',
              )}
            >
              {errorText}
            </p>
          </div>
        )}

        {/* ---- Helper text ---- */}
        {showHelper && (
          <div
            id={helperId}
            className="flex w-full items-center pt-[var(--scanner-spacing-3)]"
          >
            <p
              className={cn(
                'min-w-0 flex-1',
                'font-[family-name:var(--scanner-font-sans)]',
                'font-[var(--scanner-font-regular)]',
                cfg.helper,
                disabled
                  ? 'text-[color:var(--scanner-text-disabled)]'
                  : 'text-[color:var(--scanner-text-secondary)]',
              )}
            >
              {helperText}
            </p>
          </div>
        )}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';
