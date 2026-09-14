import { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';
import { IconTriggerTooltip } from '../icon-trigger-tooltip';
import type { DateInputProps, DateInputSize } from './date-input.types';

/* ------------------------------------------------------------------ */
/*  Size config                                                       */
/* ------------------------------------------------------------------ */

const sizeConfig: Record<
  DateInputSize,
  {
    fieldPx: string;
    fieldPy: string;
    fieldH?: string;
    skeletonH: string;
  }
> = {
  large: {
    fieldPx: 'px-[var(--scanner-spacing-5)]',     // 16px
    fieldPy: 'py-[var(--scanner-spacing-5)]',      // 16px
    skeletonH: 'h-[60px]',
  },
  medium: {
    fieldPx: 'px-[var(--scanner-spacing-4)]',      // 12px
    fieldPy: 'py-[var(--scanner-spacing-5)]',      // 16px
    skeletonH: 'h-[60px]',
  },
  small: {
    fieldPx: 'px-[var(--scanner-spacing-3)]',      // 8px
    fieldPy: 'py-[var(--scanner-spacing-2)]',      // 4px
    fieldH: 'h-[52px]',
    skeletonH: 'h-[52px]',
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

/**
 * Scanner DateInput — a date text input with label, helper/error text,
 * and optional explainer tooltip.
 *
 * Supports 3 sizes (large/medium/small), 2 layer sets, and
 * 5 visual states (enabled/focused/disabled/error/skeleton).
 *
 * @example
 * <DateInput label="Start date" placeholder="mm / dd / yyyy" />
 * <DateInput label="Due date" error errorText="Invalid date" />
 * <DateInput label="Birth date" size="small" layer={2} />
 */
export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      size = 'large',
      layer = 1,
      error = false,
      skeleton = false,
      label = 'Label',
      showLabel = true,
      required = false,
      helperText = 'Optional helper text',
      errorText = 'Error text message',
      showHelper = true,
      showExplainer = false,
      explainerText = '',
      disabled = false,
      className,
      id: idProp,
      'aria-describedby': ariaDescribedByProp,
      placeholder = 'mm / dd / yyyy',
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const inputId = idProp ?? autoId;
    const helperId = `${inputId}-helper`;
    const cfg = sizeConfig[size];
    const bgToken =
      layer === 2
        ? 'bg-[var(--scanner-bg-secondary)]'
        : 'bg-[var(--scanner-bg-primary)]';

    /* ── Skeleton ── */
    if (skeleton) {
      return (
        <div
          className={cn('flex w-full flex-col items-start', className)}
          aria-hidden="true"
        >
          {/* Label skeleton */}
          {showLabel && (
            <div className="flex w-full pb-[var(--scanner-spacing-3)]">
              <div className="h-[8px] w-[40px] animate-pulse bg-[var(--scanner-bg-disabled)]" />
            </div>
          )}

          {/* Field skeleton */}
          <div
            className={cn(
              'w-full animate-pulse rounded-[var(--scanner-radius-md)]',
              'bg-[var(--scanner-bg-disabled)]',
              cfg.skeletonH,
            )}
          />

          {/* Helper skeleton */}
          {showHelper && (
            <div className="flex w-full pt-[var(--scanner-spacing-3)]">
              <div className="h-[8px] w-[40px] animate-pulse bg-[var(--scanner-bg-disabled)]" />
            </div>
          )}
        </div>
      );
    }

    /* ── Derived states ── */
    const showError = error && !disabled;
    const describedBy =
      ariaDescribedByProp ?? (showHelper ? helperId : undefined);

    return (
      <div
        className={cn('flex w-full flex-col items-start', className)}
        data-layer={layer}
      >
        {/* ── Label row ── */}
        {showLabel && (
          <div className="flex w-full items-start gap-[var(--scanner-spacing-2)] pb-[var(--scanner-spacing-3)]">
            <label
              htmlFor={inputId}
              className={cn(
                'font-[family-name:var(--scanner-font-sans)]',
                'text-[length:var(--scanner-text-md)]',
                'leading-[var(--scanner-leading-md)]',
                'font-[var(--scanner-font-regular)]',
                disabled
                  ? 'text-[var(--scanner-text-disabled)]'
                  : 'text-[var(--scanner-text-secondary)]',
              )}
            >
              {label}
            </label>

            {required && (
              <span
                aria-hidden="true"
                className={cn(
                  'font-[family-name:var(--scanner-font-sans)]',
                  'text-[length:var(--scanner-text-xs)]',
                  'leading-[var(--scanner-leading-xs)]',
                  'font-[var(--scanner-font-regular)]',
                  'text-[var(--scanner-text-error)]',
                )}
              >
                *
              </span>
            )}

            {showExplainer && (
              <IconTriggerTooltip
                content={explainerText}
                iconName="help"
                position="bottom"
              />
            )}
          </div>
        )}

        {/* ── Field ── */}
        <div
          className={cn(
            'flex w-full items-center gap-[var(--scanner-spacing-3)]',
            'rounded-[var(--scanner-radius-md)]',
            'overflow-clip transition-colors duration-150',
            bgToken,
            cfg.fieldPx,
            cfg.fieldPy,
            cfg.fieldH,

            /* Borders — always 1px to prevent layout shift */
            'border',
            showError
              ? 'border-[var(--scanner-border-error)]'
              : 'border-transparent',

            /* Focus-within border */
            !disabled &&
              !showError &&
              'focus-within:border-[var(--scanner-border-focus)]',

            /* Disabled cursor */
            disabled && 'cursor-not-allowed',
          )}
          data-state={
            disabled
              ? undefined
              : showError
                ? 'error'
                : undefined
          }
        >
          <input
            ref={ref}
            id={inputId}
            type="text"
            disabled={disabled}
            aria-disabled={disabled || undefined}
            required={required}
            placeholder={placeholder}
            aria-invalid={showError || undefined}
            aria-describedby={describedBy}
            className={cn(
              'min-w-0 flex-1 bg-transparent outline-none',
              'font-[family-name:var(--scanner-font-sans)]',
              'text-[length:var(--scanner-text-md)]',
              'leading-[var(--scanner-leading-lg)]',
              'font-[var(--scanner-font-regular)]',
              disabled
                ? 'cursor-not-allowed text-[var(--scanner-text-disabled)] placeholder:text-[var(--scanner-text-disabled)]'
                : 'text-[var(--scanner-text-primary)] placeholder:text-[var(--scanner-text-tertiary)]',
            )}
            {...rest}
          />
        </div>

        {/* ── Helper / Error text ── */}
        {showHelper && (
          <div className="flex w-full items-center pt-[var(--scanner-spacing-3)]">
            <p
              id={helperId}
              className={cn(
                'min-w-0 flex-1',
                'font-[family-name:var(--scanner-font-sans)]',
                'text-[length:var(--scanner-text-md)]',
                'leading-[var(--scanner-leading-md)]',
                'font-[var(--scanner-font-regular)]',
                showError
                  ? 'text-[var(--scanner-text-error)]'
                  : disabled
                    ? 'text-[var(--scanner-text-disabled)]'
                    : 'text-[var(--scanner-text-secondary)]',
              )}
            >
              {showError ? errorText : helperText}
            </p>
          </div>
        )}
      </div>
    );
  },
);

DateInput.displayName = 'DateInput';
