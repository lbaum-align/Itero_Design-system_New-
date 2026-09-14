import { forwardRef, useCallback, useId, useMemo } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import { IconTriggerTooltip } from '../icon-trigger-tooltip';
import type { TextAreaProps } from './text-area.types';

/* ------------------------------------------------------------------ */
/*  TextArea                                                            */
/* ------------------------------------------------------------------ */

/**
 * Scanner TextArea — a multi-line text input with label, helper text,
 * error state, character counter, tooltip, and skeleton support.
 *
 * @example
 * <TextArea label="Description" placeholder="Enter a description..." />
 * <TextArea label="Notes" helperText="Max 500 characters" maxLength={500} showCounter />
 * <TextArea label="Comment" error errorText="This field is required" />
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      helperText,
      errorText,
      tooltipContent,
      error = false,
      skeleton = false,
      showCounter = false,
      layer = 1,
      onClear,
      className,
      disabled = false,
      required = false,
      maxLength,
      value,
      defaultValue,
      id: idProp,
      'aria-describedby': ariaDescribedByProp,
      ...rest
    },
    ref,
  ) => {
    /* ---- IDs for a11y linkage ---- */
    const autoId = useId();
    const id = idProp ?? autoId;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;

    /* ---- Derived state ---- */
    const isFilled = value !== undefined
      ? String(value).length > 0
      : defaultValue !== undefined && String(defaultValue).length > 0;

    const charCount = value !== undefined ? String(value).length : 0;

    const counterText = useMemo(() => {
      if (!showCounter || maxLength === undefined) return undefined;
      return `${charCount}/${maxLength}`;
    }, [showCounter, maxLength, charCount]);

    /* ---- aria-describedby ---- */
    const describedBy = useMemo(() => {
      const ids: string[] = [];
      if (ariaDescribedByProp) ids.push(ariaDescribedByProp);
      if (error && errorText) ids.push(errorId);
      else if (helperText) ids.push(helperId);
      return ids.length > 0 ? ids.join(' ') : undefined;
    }, [ariaDescribedByProp, error, errorText, errorId, helperText, helperId]);

    /* ---- Clear handler ---- */
    const handleClear = useCallback(() => {
      onClear?.();
    }, [onClear]);

    /* ---- Skeleton ---- */
    if (skeleton) {
      return (
        <div
          className={cn('flex w-full flex-col', className)}
          aria-hidden="true"
          data-layer={layer}
        >
          {/* Label skeleton */}
          {label !== undefined && (
            <div className="flex items-start pb-[var(--scanner-spacing-3)]">
              <div className="h-2 w-10 rounded-sm bg-[var(--scanner-bg-disabled)]" />
              {showCounter && maxLength !== undefined && (
                <div className="ml-auto h-2 w-7 rounded-sm bg-[var(--scanner-bg-disabled)]" />
              )}
            </div>
          )}
          {/* Field skeleton */}
          <div className="h-[124px] w-full rounded-[var(--scanner-radius-md)] bg-[var(--scanner-bg-disabled)]" />
          {/* Helper skeleton */}
          {(helperText !== undefined || errorText !== undefined) && (
            <div className="flex items-start pt-[var(--scanner-spacing-3)]">
              <div className="h-2 w-10 rounded-sm bg-[var(--scanner-bg-disabled)]" />
            </div>
          )}
        </div>
      );
    }

    /* ---- Field background & border classes ---- */
    const fieldBg =
      layer === 2
        ? 'bg-[var(--scanner-bg-secondary)]'
        : 'bg-[var(--scanner-bg-primary)]';

    const fieldBorder = error
      ? 'border border-solid border-[var(--scanner-border-error)]'
      : disabled
        ? 'border border-solid border-transparent'
        : 'border border-solid border-[var(--scanner-border-subtle)]';

    const fieldHoverBorder =
      'hover:border-[var(--scanner-border-hover)]';
    const fieldFocusBorder =
      'focus-within:border-[var(--scanner-border-focus)]';

    return (
      <div
        className={cn('flex w-full flex-col', className)}
        data-layer={layer}
      >
        {/* ---- Label row ---- */}
        {(label !== undefined || (showCounter && maxLength !== undefined)) && (
          <div className="flex items-start pb-[var(--scanner-spacing-3)]">
            {/* Label + required + tooltip */}
            {label !== undefined && (
              <div className="flex min-w-0 flex-1 items-start gap-[var(--scanner-spacing-2)]">
                <label
                  htmlFor={id}
                  className={cn(
                    'scanner-text-body-02 shrink-0 whitespace-nowrap',
                    disabled
                      ? 'text-[color:var(--scanner-text-disabled)]'
                      : 'text-[color:var(--scanner-text-secondary)]',
                  )}
                >
                  {label}
                </label>
                {required && (
                  <span
                    className="scanner-text-body-01 shrink-0 text-[color:var(--scanner-text-error)]"
                    aria-hidden="true"
                  >
                    *
                  </span>
                )}
                {tooltipContent && !disabled && (
                  <IconTriggerTooltip
                    content={tooltipContent}
                    className="shrink-0"
                  />
                )}
              </div>
            )}
            {/* Counter */}
            {counterText !== undefined && (
              <div
                className={cn(
                  'scanner-text-body-01 shrink-0 pl-[var(--scanner-spacing-3)] text-right',
                  disabled
                    ? 'text-[color:var(--scanner-text-disabled)]'
                    : 'text-[color:var(--scanner-text-secondary)]',
                )}
                aria-live="polite"
                aria-atomic="true"
              >
                {counterText}
              </div>
            )}
          </div>
        )}

        {/* ---- Field container ---- */}
        <div
          className={cn(
            'relative flex min-h-[80px] w-full items-start gap-[var(--scanner-spacing-3)]',
            'overflow-hidden rounded-[var(--scanner-radius-md)]',
            'px-[var(--scanner-spacing-5)] py-[var(--scanner-spacing-4)]',
            fieldBg,
            fieldBorder,
            !disabled && !error && fieldHoverBorder,
            !disabled && fieldFocusBorder,
            'transition-colors duration-150',
          )}
        >
          {/* Native textarea */}
          <textarea
            ref={ref}
            id={id}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            value={value}
            defaultValue={defaultValue}
            aria-invalid={error || undefined}
            aria-describedby={describedBy}
            aria-required={required || undefined}
            className={cn(
              'scanner-text-body-03 min-h-[56px] min-w-0 flex-1 resize-y bg-transparent',
              'outline-none',
              'placeholder:text-[color:var(--scanner-text-tertiary)]',
              disabled
                ? 'cursor-not-allowed text-[color:var(--scanner-text-disabled)] placeholder:text-[color:var(--scanner-text-disabled)]'
                : 'text-[color:var(--scanner-text-primary)]',
            )}
            {...rest}
          />

          {/* Clear button — visible when textarea has content & not disabled */}
          {isFilled && !disabled && onClear && (
            <button
              type="button"
              onClick={handleClear}
              tabIndex={-1}
              className={cn(
                'inline-flex shrink-0 items-center justify-center',
                'size-6 cursor-pointer rounded-full',
                'text-[color:var(--scanner-icon-tertiary)]',
                'hover:text-[color:var(--scanner-icon-secondary)]',
                'focus-visible:outline-2 focus-visible:outline-offset-2',
                'focus-visible:outline-[var(--scanner-focus-ring)]',
              )}
              aria-label="Clear textarea"
            >
              <Icon name="close-empty" size={24} />
            </button>
          )}
        </div>

        {/* ---- Helper / Error text ---- */}
        {error && errorText && (
          <p
            id={errorId}
            className="scanner-text-body-02 pt-[var(--scanner-spacing-3)] text-[color:var(--scanner-text-error)]"
            role="alert"
          >
            {errorText}
          </p>
        )}
        {!error && helperText && (
          <p
            id={helperId}
            className={cn(
              'scanner-text-body-02 pt-[var(--scanner-spacing-3)]',
              disabled
                ? 'text-[color:var(--scanner-text-disabled)]'
                : 'text-[color:var(--scanner-text-secondary)]',
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';
