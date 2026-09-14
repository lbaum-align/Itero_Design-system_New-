import { forwardRef, useCallback, useId } from 'react';
import { cn } from '../../utils/cn';
import type { CheckboxItemProps, CheckboxSelection } from './checkbox-item.types';

/** Normalise the `checked` prop to a canonical CheckboxSelection value. */
function normaliseChecked(checked: CheckboxSelection | boolean | undefined): CheckboxSelection {
  if (checked === true) return 'selected';
  if (checked === false) return 'unselected';
  return checked ?? 'unselected';
}

/**
 * Scanner CheckboxItem — a labelled checkbox with unselected / selected / indeterminate states.
 *
 * @example
 * <CheckboxItem label="Accept terms" checked="selected" onChange={setAccepted} />
 * <CheckboxItem label="Mixed" checked="indeterminate" />
 */
export const CheckboxItem = forwardRef<HTMLInputElement, CheckboxItemProps>(
  (
    {
      checked,
      label,
      showLabel = true,
      disabled = false,
      skeleton = false,
      onChange,
      name,
      value,
      className,
      'aria-label': ariaLabel,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = `checkbox-${generatedId}`;
    const selection = normaliseChecked(checked);
    const isSelected = selection === 'selected';
    const isIndeterminate = selection === 'indeterminate';

    const handleChange = useCallback(() => {
      if (!disabled && !skeleton) {
        // Clicking an indeterminate checkbox resolves to selected.
        onChange?.(isIndeterminate ? true : !isSelected);
      }
    }, [disabled, skeleton, onChange, isSelected, isIndeterminate]);

    /* ------------------------------------------------------------------ */
    /* Skeleton state                                                        */
    /* ------------------------------------------------------------------ */
    if (skeleton) {
      return (
        <div
          className={cn(
            'flex items-center gap-2 py-4',
            className
          )}
          aria-hidden="true"
        >
          {/* Indicator placeholder */}
          <div className="flex h-7 w-7 shrink-0 items-center justify-center">
            <div className="h-5 w-5 animate-pulse rounded-[4px] bg-[var(--scanner-gray-alpha-10)]" />
          </div>
          {/* Label placeholder */}
          {showLabel && (
            <div className="h-4 w-24 animate-pulse rounded bg-[var(--scanner-gray-alpha-10)]" />
          )}
        </div>
      );
    }

    /* ------------------------------------------------------------------ */
    /* Normal state                                                          */
    /* ------------------------------------------------------------------ */
    return (
      <div
        className={cn(
          'flex items-center gap-2 py-4',
          disabled && 'cursor-not-allowed',
          className
        )}
        data-state={selection}
      >
        {/* Hidden native input for form semantics */}
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          name={name}
          value={value}
          checked={isSelected || isIndeterminate}
          disabled={disabled}
          aria-checked={isIndeterminate ? 'mixed' : isSelected}
          aria-label={!showLabel || !label ? ariaLabel ?? label : undefined}
          onChange={handleChange}
          className="sr-only"
          {...rest}
        />

        {/* Visual indicator — 28×28 container around a 20×20 box */}
        <label
          htmlFor={inputId}
          className={cn(
            'flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center',
            'rounded-[4px]',
            // Focus ring applied to the label when the hidden input is focused
            'has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2',
            'has-[:focus-visible]:outline-[var(--scanner-focus-ring)]',
            disabled && 'cursor-not-allowed'
          )}
          aria-hidden={showLabel && label ? 'true' : undefined}
        >
          {/* 20×20 visible box */}
          <div
            className={cn(
              'relative flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px]',
              // Selected / indeterminate: filled brand background
              (isSelected || isIndeterminate) && 'bg-[var(--scanner-action-primary)]',
              // Unselected: white fill, interactive border
              !isSelected && !isIndeterminate && [
                'bg-white',
                'ring-2 ring-inset ring-[var(--scanner-border-interactive)]',
              ],
              // Disabled: reduce opacity
              disabled && 'opacity-[0.23]'
            )}
          >
            {/* Unselected: border path rendered as SVG stroke */}
            {!isSelected && !isIndeterminate && (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="absolute inset-0"
              >
                <path
                  d="M1 4C1 2.34 2.34 1 4 1H16C17.66 1 19 2.34 19 4V16C19 17.66 17.66 19 16 19H4C2.34 19 1 17.66 1 16V4Z"
                  stroke="var(--scanner-border-interactive)"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            )}

            {/* Selected: checkmark */}
            {isSelected && (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M4 10L8 14L16 6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}

            {/* Indeterminate: minus line */}
            {isIndeterminate && (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M5 10H15"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>
        </label>

        {/* Label text */}
        {showLabel && label && (
          <label
            htmlFor={inputId}
            className={cn(
              'cursor-pointer select-none font-["Roboto",sans-serif] text-[18px] leading-[28px]',
              disabled
                ? 'cursor-not-allowed text-[var(--scanner-text-disabled)]'
                : 'text-[var(--scanner-text-primary)]'
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

CheckboxItem.displayName = 'CheckboxItem';
