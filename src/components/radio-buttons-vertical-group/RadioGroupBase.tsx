import { forwardRef, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { cn } from '../../utils/cn';
import { RadioButtonItem } from '../radio-button-item';
import { IconTriggerTooltip } from '../icon-trigger-tooltip';
import type { RadioGroupSharedProps, RadioOption } from './radio-buttons-vertical-group.types';

/*
 * Internal base for "02 Radio buttons vertical group" (25:1188) and
 * "03 Radio buttons horizontal group" (27986:67760). Not exported from the package.
 *
 * Figma layout (both): Label row (Label 01 text-secondary · 4px gap · explainer · required "*",
 * 8px bottom padding) above the items. Every item row is 60px tall (28px value + 16px above/below):
 * vertical rows stack with an 8px gap, horizontal items sit side by side with a 16px gap.
 *
 * Keyboard (Figma docs + WAI-ARIA radio group): Tab / Shift+Tab enter and leave the group on the
 * selected (or first enabled) radio — roving tabindex; arrow keys move focus *and* selection
 * between enabled radios, wrapping at the ends; Space selects the focused radio.
 */

export interface RadioGroupBaseProps extends RadioGroupSharedProps {
  options: RadioOption[];
  orientation: 'vertical' | 'horizontal';
}

const NEXT_KEYS = ['ArrowDown', 'ArrowRight'];
const PREV_KEYS = ['ArrowUp', 'ArrowLeft'];

export const RadioGroupBase = forwardRef<HTMLDivElement, RadioGroupBaseProps>(
  (
    {
      options,
      orientation,
      label,
      showLabel = true,
      tooltipContent,
      tooltipPosition = 'top',
      required = false,
      helperText,
      error = false,
      disabled = false,
      skeleton = false,
      name,
      value,
      defaultValue,
      onChange,
      className,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      ...rest
    },
    ref,
  ) => {
    const baseId = useId();
    const groupName = name ?? `${baseId}-radio`;
    const labelId = `${baseId}-label`;
    const helperId = `${baseId}-helper`;

    const [internalValue, setInternalValue] = useState(defaultValue ?? '');
    const selectedValue = value ?? internalValue;
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const isEnabled = (option: RadioOption) => !disabled && !option.disabled;
    const selectedIndex = options.findIndex((o) => o.value === selectedValue && isEnabled(o));
    const tabStop = selectedIndex >= 0 ? selectedIndex : options.findIndex(isEnabled);

    const select = (option: RadioOption) => {
      if (!isEnabled(option)) return;
      if (value === undefined) setInternalValue(option.value);
      if (option.value !== selectedValue) onChange?.(option.value);
    };

    const handleKeyDown = (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
      const step = NEXT_KEYS.includes(event.key) ? 1 : PREV_KEYS.includes(event.key) ? -1 : 0;
      if (!step) return;
      event.preventDefault();
      for (let i = 1; i <= options.length; i++) {
        const target = (index + step * i + options.length) % options.length;
        if (isEnabled(options[target])) {
          inputRefs.current[target]?.focus();
          select(options[target]);
          return;
        }
      }
    };

    const isVertical = orientation === 'vertical';
    const hasVisibleLabel = showLabel && !!label;
    const itemsLayout = isVertical
      ? 'flex flex-col items-start gap-[var(--scanner-spacing-3)]'
      : 'flex flex-row flex-wrap items-start gap-x-[var(--scanner-spacing-5)]';
    /* Each item row: 16px above + 28px value + 16px below = 60px (Figma) */
    const itemRow = 'py-[var(--scanner-spacing-5)]';

    /* ── Label row ── */
    const labelRow = hasVisibleLabel && (
      <div className="flex items-start gap-[var(--scanner-spacing-2)] pb-[var(--scanner-spacing-3)]">
        {skeleton ? (
          <span
            data-slot="skeleton-label"
            className="scanner-text-label-01 animate-pulse bg-[var(--scanner-bg-highlight-gray)]"
          >
            <span className="invisible">{label}</span>
          </span>
        ) : (
          <>
            <span id={labelId} className="scanner-text-label-01 text-[color:var(--scanner-text-secondary)]">
              {label}
            </span>
            {tooltipContent && <IconTriggerTooltip content={tooltipContent} position={tooltipPosition} alignment="start" />}
            {required && (
              <span
                aria-hidden="true"
                className={cn(
                  'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
                  'text-[length:var(--scanner-text-xs)] leading-[var(--scanner-leading-xs)]',
                  'text-[color:var(--scanner-text-error)]',
                )}
              >
                *
              </span>
            )}
          </>
        )}
      </div>
    );

    /* ── Skeleton ── */
    if (skeleton) {
      return (
        <div
          ref={ref}
          aria-hidden="true"
          data-skeleton=""
          data-orientation={orientation}
          className={cn('flex flex-col items-start', className)}
          {...rest}
        >
          {labelRow}
          <div className={itemsLayout}>
            {options.map((option) => (
              <RadioButtonItem
                key={option.value}
                skeleton
                label={option.label}
                selected={option.value === selectedValue}
                className={itemRow}
              />
            ))}
          </div>
        </div>
      );
    }

    const describedBy = [ariaDescribedBy, helperText ? helperId : undefined].filter(Boolean).join(' ') || undefined;

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-labelledby={hasVisibleLabel ? labelId : undefined}
        aria-label={hasVisibleLabel ? undefined : (ariaLabel ?? label)}
        aria-describedby={describedBy}
        aria-invalid={error || undefined}
        aria-required={required || undefined}
        aria-disabled={disabled || undefined}
        data-orientation={orientation}
        className={cn('flex flex-col items-start', className)}
        {...rest}
      >
        {labelRow}

        <div className={itemsLayout}>
          {options.map((option, index) => (
            <RadioButtonItem
              key={option.value}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              name={groupName}
              value={option.value}
              label={option.label}
              selected={option.value === selectedValue}
              disabled={disabled || option.disabled}
              required={required}
              tabIndex={index === tabStop ? 0 : -1}
              onChange={() => select(option)}
              onKeyDown={handleKeyDown(index)}
              className={itemRow}
            />
          ))}
        </div>

        {helperText && (
          <p
            id={helperId}
            className={cn(
              'm-0 font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
              'text-[length:var(--scanner-text-xs)] leading-[var(--scanner-leading-xs)]',
              error ? 'text-[color:var(--scanner-text-error)]' : 'text-[color:var(--scanner-text-secondary)]',
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

RadioGroupBase.displayName = 'RadioGroupBase';
