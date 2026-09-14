import { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';
import { RadioButtonItem } from '../radio-button-item';
import { IconTriggerTooltip } from '../icon-trigger-tooltip';
import type { RadioButtonsHorizontalGroupProps } from './radio-buttons-horizontal-group.types';

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Scanner RadioButtonsHorizontalGroup — a radio group that lays items
 * out in a horizontal (flex-row) direction.
 *
 * Renders a labelled radio group with optional tooltip, required marker,
 * and helper/error text. The horizontal layout is the key difference from
 * the vertical group variant.
 *
 * Figma: "03 Radio buttons horizontal group" (node 27986:67760)
 *
 * @example
 * <RadioButtonsHorizontalGroup
 *   label="Select an option"
 *   name="plan"
 *   value={selected}
 *   options={[
 *     { label: 'Option A', value: 'a' },
 *     { label: 'Option B', value: 'b' },
 *     { label: 'Option C', value: 'c' },
 *   ]}
 *   onChange={setSelected}
 * />
 */
export const RadioButtonsHorizontalGroup = forwardRef<
  HTMLDivElement,
  RadioButtonsHorizontalGroupProps
>(
  (
    {
      label,
      showLabel = true,
      tooltipContent,
      tooltipPosition = 'bottom',
      required = false,
      helperText,
      error = false,
      disabled = false,
      skeleton = false,
      name,
      value,
      options,
      onChange,
      className,
    },
    ref,
  ) => {
    const labelId = useId();
    const helperId = useId();

    const hasHelper = Boolean(helperText);
    const describedBy = hasHelper ? helperId : undefined;

    /* ── Skeleton ── */
    if (skeleton) {
      return (
        <div
          ref={ref}
          className={cn('flex flex-col items-start', className)}
          aria-hidden="true"
        >
          {/* Label skeleton */}
          {showLabel && (
            <div className="pb-[var(--scanner-spacing-3)]">
              <span className="inline-block h-[24px] w-[80px] animate-pulse rounded bg-[var(--scanner-gray-alpha-10)]" />
            </div>
          )}

          {/* Items skeleton row */}
          <div className="flex items-center gap-[var(--scanner-spacing-5)] py-[var(--scanner-spacing-5)]">
            {options.map((opt) => (
              <RadioButtonItem
                key={opt.value}
                skeleton
                label={opt.label}
              />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-labelledby={showLabel && label ? labelId : undefined}
        aria-describedby={describedBy}
        aria-invalid={error || undefined}
        aria-required={required || undefined}
        className={cn('flex flex-col items-start', className)}
      >
        {/* ── Label row ── */}
        {showLabel && label && (
          <div className="flex items-start gap-[var(--scanner-spacing-2)] pb-[var(--scanner-spacing-3)]">
            {/* Label text */}
            <span
              id={labelId}
              className={cn(
                'select-none whitespace-nowrap',
                'font-[family-name:var(--scanner-font-sans)]',
                'text-[16px] font-[var(--scanner-font-regular)] leading-[var(--scanner-leading-md)]',
                'text-[color:var(--scanner-text-secondary)]',
              )}
            >
              {label}
            </span>

            {/* Explainer tooltip */}
            {tooltipContent && (
              <IconTriggerTooltip
                content={tooltipContent}
                position={tooltipPosition}
              />
            )}

            {/* Required asterisk */}
            {required && (
              <span
                aria-hidden="true"
                className={cn(
                  'select-none whitespace-nowrap',
                  'font-[family-name:var(--scanner-font-sans)]',
                  'text-[length:var(--scanner-text-xs)] font-[var(--scanner-font-regular)] leading-[var(--scanner-leading-xs)]',
                  'text-[color:var(--scanner-text-error)]',
                )}
              >
                *
              </span>
            )}
          </div>
        )}

        {/* ── Items — horizontal flex row ── */}
        <div className="flex items-center gap-[var(--scanner-spacing-5)] py-[var(--scanner-spacing-5)]">
          {options.map((opt) => (
            <RadioButtonItem
              key={opt.value}
              name={name}
              value={opt.value}
              label={opt.label}
              selected={value === opt.value}
              disabled={disabled || opt.disabled}
              onChange={() => {
                if (!disabled && !opt.disabled) {
                  onChange?.(opt.value);
                }
              }}
            />
          ))}
        </div>

        {/* ── Helper / Error text ── */}
        {hasHelper && (
          <p
            id={helperId}
            className={cn(
              'select-none',
              'font-[family-name:var(--scanner-font-sans)]',
              'text-[length:var(--scanner-text-xs)] font-[var(--scanner-font-regular)] leading-[var(--scanner-leading-xs)]',
              error
                ? 'text-[color:var(--scanner-text-error)]'
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

RadioButtonsHorizontalGroup.displayName = 'RadioButtonsHorizontalGroup';
