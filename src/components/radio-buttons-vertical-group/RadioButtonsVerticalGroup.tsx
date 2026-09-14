import { forwardRef, useId, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { RadioButtonItem } from '../radio-button-item';
import { IconTriggerTooltip } from '../icon-trigger-tooltip';
import type { RadioButtonsVerticalGroupProps } from './radio-buttons-vertical-group.types';

/**
 * Scanner RadioButtonsVerticalGroup — a labelled group of radio buttons
 * stacked vertically, with optional tooltip, required indicator, and
 * helper / error text.
 *
 * Mirrors Figma component "02 Radio buttons vertical group".
 *
 * @example
 * <RadioButtonsVerticalGroup
 *   label="Preferred contact method"
 *   name="contact"
 *   value={selected}
 *   onChange={setSelected}
 *   items={[
 *     { label: 'Email', value: 'email' },
 *     { label: 'Phone', value: 'phone' },
 *     { label: 'SMS',   value: 'sms' },
 *   ]}
 * />
 */
export const RadioButtonsVerticalGroup = forwardRef<
  HTMLDivElement,
  RadioButtonsVerticalGroupProps
>(
  (
    {
      label,
      showLabel = true,
      tooltipContent,
      required = false,
      helperText,
      error = false,
      disabled = false,
      skeleton = false,
      name,
      value,
      onChange,
      items,
      className,
    },
    ref,
  ) => {
    const groupId = useId();
    const labelId = `${groupId}-label`;
    const helperId = `${groupId}-helper`;

    const handleItemChange = useCallback(
      (itemValue: string) => () => {
        if (!disabled) {
          onChange?.(itemValue);
        }
      },
      [disabled, onChange],
    );

    /* -------------------------------------------------------------- */
    /* Skeleton state                                                    */
    /* -------------------------------------------------------------- */
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
              <div className="h-[24px] w-[80px] animate-pulse rounded bg-[var(--scanner-gray-alpha-10)]" />
            </div>
          )}
          {/* Item skeletons */}
          <div className="flex w-full flex-col gap-[var(--scanner-spacing-3)]">
            {items.map((item) => (
              <div
                key={item.value}
                className="flex h-[60px] w-full items-center"
              >
                <RadioButtonItem
                  skeleton
                  label={item.label}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    /* -------------------------------------------------------------- */
    /* Normal render                                                     */
    /* -------------------------------------------------------------- */
    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-labelledby={showLabel && label ? labelId : undefined}
        aria-describedby={helperText ? helperId : undefined}
        aria-invalid={error || undefined}
        aria-required={required || undefined}
        className={cn('flex flex-col items-start', className)}
      >
        {/* ── Label row ── */}
        {showLabel && label && (
          <div
            className="flex items-start gap-[var(--scanner-spacing-2)] pb-[var(--scanner-spacing-3)]"
          >
            {/* Label text */}
            <span
              id={labelId}
              className={cn(
                'font-[family-name:var(--scanner-font-sans)]',
                'text-[16px] font-[var(--scanner-font-regular)] leading-[var(--scanner-leading-md)]',
                'text-[color:var(--scanner-text-secondary)]',
              )}
            >
              {label}
            </span>

            {/* Explainer tooltip */}
            {tooltipContent && (
              <IconTriggerTooltip content={tooltipContent} />
            )}

            {/* Required asterisk */}
            {required && (
              <span
                aria-hidden="true"
                className={cn(
                  'font-[family-name:var(--scanner-font-sans)]',
                  'text-[var(--scanner-text-xs)] font-[var(--scanner-font-regular)] leading-[var(--scanner-leading-xs)]',
                  'text-[color:var(--scanner-text-error)]',
                )}
              >
                *
              </span>
            )}
          </div>
        )}

        {/* ── Radio items ── */}
        <div className="flex w-full flex-col gap-[var(--scanner-spacing-3)]">
          {items.map((item) => (
            <div
              key={item.value}
              className="flex h-[60px] w-full items-center"
            >
              <RadioButtonItem
                name={name}
                value={item.value}
                label={item.label}
                selected={value === item.value}
                disabled={disabled || item.disabled}
                onChange={handleItemChange(item.value)}
              />
            </div>
          ))}
        </div>

        {/* ── Helper / error text ── */}
        {helperText && (
          <p
            id={helperId}
            className={cn(
              'pt-[var(--scanner-spacing-2)]',
              'font-[family-name:var(--scanner-font-sans)]',
              'text-[var(--scanner-text-xs)] font-[var(--scanner-font-regular)] leading-[var(--scanner-leading-xs)]',
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

RadioButtonsVerticalGroup.displayName = 'RadioButtonsVerticalGroup';
