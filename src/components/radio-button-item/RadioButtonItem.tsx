import { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';
import type { RadioButtonItemProps } from './radio-button-item.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → 01 Radio button item (node 1223:1419)
 * Selected (True, False) × State (Enabled, Focused, Disabled, Skeleton) = 8 variants.
 *
 * Structure: 24px "Indicator" column (as tall as the 28px value line, so the control
 * stays top-aligned when the value wraps) · 8px gap · Body 02 value (max 320px).
 * Visual state follows the native input via `peer-*` variants, so the item works
 * both controlled (`selected`) and uncontrolled (native radio group).
 */

/**
 * Radio glyph from Figma: 23px ring (1.64px stroke) + 13.1px dot, drawn in `currentColor`.
 * Geometry is expressed in the 23-unit viewBox.
 */
const RadioGlyph = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 23 23" fill="none" aria-hidden="true" focusable="false" className={className}>
    <circle cx="11.5" cy="11.5" r="10.68" stroke="currentColor" strokeWidth="1.64" />
    <circle
      data-slot="radio-dot"
      cx="11.5"
      cy="11.5"
      r="6.57"
      fill="currentColor"
      className="opacity-[var(--radio-dot-opacity,0)]"
    />
  </svg>
);

/**
 * Scanner RadioButtonItem — a single radio option with a value label.
 * Use inside `RadioButtonsVerticalGroup` / `RadioButtonsHorizontalGroup` for keyboard support.
 *
 * Figma props → React: Selected → `selected`, Show value → `showLabel`, Text value → `label`,
 * State → `:focus-visible` (forceable via `data-state="focused"`), `disabled`, `skeleton`.
 *
 * @example
 * <RadioButtonItem name="plan" value="basic" label="Basic" selected={plan === 'basic'} onChange={() => setPlan('basic')} />
 */
export const RadioButtonItem = forwardRef<HTMLInputElement, RadioButtonItemProps>(
  (
    {
      selected,
      defaultSelected,
      label,
      showLabel = true,
      disabled = false,
      skeleton = false,
      onChange,
      id,
      className,
      style,
      'aria-label': ariaLabel,
      'data-state': dataState,
      ...inputProps
    },
    ref,
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const hasLabel = showLabel && label !== undefined && label !== null && label !== '';
    const forcedFocus = dataState === 'focused';

    /* ── Skeleton ── */
    if (skeleton) {
      return (
        <div
          aria-hidden="true"
          data-skeleton=""
          className={cn('inline-flex items-start gap-[var(--scanner-spacing-3)] align-top', className)}
          style={style}
        >
          <span
            className={cn(
              'flex h-[var(--scanner-leading-lg)] w-[var(--scanner-radio-indicator-box)] shrink-0 items-center justify-center',
              'text-[color:var(--scanner-icon-disabled)]',
              selected && '[--radio-dot-opacity:1]',
            )}
          >
            <RadioGlyph className="size-[var(--scanner-radio-indicator-size)]" />
          </span>
          {hasLabel && (
            <span className="flex h-[var(--scanner-leading-lg)] py-[var(--scanner-spacing-1)]">
              <span
                data-slot="skeleton-value"
                className={cn(
                  'block h-full max-w-[var(--scanner-radio-value-max-width)] overflow-hidden animate-pulse',
                  'bg-[var(--scanner-bg-highlight-gray)]',
                )}
              >
                {/* Invisible value keeps the placeholder as wide as the real text */}
                <span className="scanner-text-body-02 invisible block whitespace-nowrap">{label}</span>
              </span>
            </span>
          )}
        </div>
      );
    }

    const accessibleLabel = ariaLabel ?? (!hasLabel && typeof label === 'string' ? label : undefined);

    return (
      <label
        htmlFor={inputId}
        data-state={dataState}
        data-disabled={disabled ? '' : undefined}
        className={cn(
          'inline-flex items-start gap-[var(--scanner-spacing-3)] align-top',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          className,
        )}
        style={style}
      >
        <input
          ref={ref}
          id={inputId}
          type="radio"
          checked={selected}
          defaultChecked={selected === undefined ? defaultSelected : undefined}
          disabled={disabled}
          aria-disabled={disabled || undefined}
          aria-label={accessibleLabel}
          onChange={(event) => onChange?.(event.target.checked, event)}
          className="peer sr-only"
          {...inputProps}
        />

        {/* ── Indicator column ── */}
        <span
          data-slot="radio-indicator"
          className={cn(
            'relative flex h-[var(--scanner-leading-lg)] w-[var(--scanner-radio-indicator-box)] shrink-0 items-center justify-center',
            'peer-checked:[--radio-dot-opacity:1]',
            disabled
              ? 'text-[color:var(--scanner-icon-disabled)]'
              : 'text-[color:var(--scanner-icon-primary)] peer-checked:text-[color:var(--scanner-icon-link)]',
            /* Focused: glyph shrinks to 21px, 1px focus ring with a 1px gap */
            'peer-focus-visible:[--radio-glyph-size:var(--scanner-radio-indicator-size-focused)] peer-focus-visible:[--radio-focus-display:block]',
            forcedFocus &&
              '[--radio-glyph-size:var(--scanner-radio-indicator-size-focused)] [--radio-focus-display:block]',
          )}
        >
          <RadioGlyph className="size-[var(--radio-glyph-size,var(--scanner-radio-indicator-size))]" />
          <span
            aria-hidden="true"
            data-slot="radio-focus-ring"
            className={cn(
              'pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
              '[display:var(--radio-focus-display,none)] size-[var(--scanner-radio-focus-ring-size)] rounded-[var(--scanner-radius-full)]',
              'border-[length:var(--scanner-radio-focus-ring-width)] border-solid border-[color:var(--scanner-border-focus)]',
            )}
          />
        </span>

        {/* ── Value ── */}
        {hasLabel && (
          <span
            className={cn(
              'scanner-text-body-02 min-w-0 max-w-[var(--scanner-radio-value-max-width)] select-none break-words',
              disabled ? 'text-[color:var(--scanner-text-disabled)]' : 'text-[color:var(--scanner-text-primary)]',
            )}
          >
            {label}
          </span>
        )}
      </label>
    );
  },
);

RadioButtonItem.displayName = 'RadioButtonItem';
