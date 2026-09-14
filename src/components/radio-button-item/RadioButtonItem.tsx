import { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';
import type { RadioButtonItemProps } from './radio-button-item.types';

/**
 * Scanner RadioButtonItem — a radio button with an optional label.
 *
 * Uses a visually-hidden <input type="radio"> for semantics; all visual
 * states are driven by CSS peer selectors and token-based classes.
 *
 * @example
 * <RadioButtonItem selected={value === 'a'} value="a" name="group" label="Option A" onChange={...} />
 */
export const RadioButtonItem = forwardRef<HTMLInputElement, RadioButtonItemProps>(
  (
    {
      selected = false,
      label,
      showLabel = true,
      disabled = false,
      skeleton = false,
      onChange,
      name,
      value,
      className,
      'aria-label': ariaLabel,
    },
    ref
  ) => {
    const innerId = useId();

    // --- Skeleton state ---
    if (skeleton) {
      return (
        <div
          className={cn('inline-flex items-center gap-2', className)}
          aria-hidden="true"
        >
          {/* Circle placeholder */}
          <span className="h-6 w-6 shrink-0 animate-pulse rounded-full bg-[var(--scanner-gray-alpha-10)]" />
          {/* Text placeholder bar */}
          {showLabel && (
            <span className="h-[18px] w-[120px] animate-pulse rounded bg-[var(--scanner-gray-alpha-10)]" />
          )}
        </div>
      );
    }

    // When label is hidden or absent, the accessible name falls back to
    // the explicit ariaLabel or the label string itself.
    const computedAriaLabel =
      !showLabel || !label ? (ariaLabel ?? label) : ariaLabel;

    return (
      <label
        htmlFor={innerId}
        className={cn(
          'inline-flex items-center gap-2',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          className
        )}
        data-state={disabled ? 'disabled' : selected ? 'checked' : 'unchecked'}
      >
        {/* ── Visually-hidden radio input (semantics + focus source) ── */}
        <input
          ref={ref}
          id={innerId}
          type="radio"
          name={name}
          value={value}
          checked={selected}
          disabled={disabled}
          aria-label={computedAriaLabel}
          onChange={(e) => onChange?.(e.target.checked)}
          /* "peer" exposes focus state to the sibling indicator span */
          className="peer sr-only"
        />

        {/* ── Visual indicator — 24×24 container, 22×22 ring ── */}
        <span
          className={cn(
            'relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
            // Focus ring: appears when the peer input is keyboard-focused
            'peer-focus-visible:outline peer-focus-visible:outline-2',
            'peer-focus-visible:outline-offset-2',
            'peer-focus-visible:outline-[var(--scanner-focus-ring)]',
            // Reduce opacity when disabled
            disabled && 'opacity-40'
          )}
        >
          {/* Outer ring — 22×22, 2px border */}
          <span
            className={cn(
              'flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 transition-colors duration-150',
              disabled
                ? 'border-[var(--scanner-border-disabled)]'
                : 'border-[var(--scanner-border-interactive)]'
            )}
          >
            {/* Inner filled dot — 10×10, scales in when selected */}
            <span
              className={cn(
                'h-[10px] w-[10px] rounded-full bg-[var(--scanner-bg-brand)]',
                'transition-transform duration-150',
                selected ? 'scale-100' : 'scale-0'
              )}
            />
          </span>
        </span>

        {/* ── Label text ── */}
        {showLabel && label && (
          <span
            className={cn(
              'max-w-[320px] select-none',
              'font-[family-name:var(--scanner-font-sans)] text-[18px] font-normal leading-7',
              disabled
                ? 'text-[var(--scanner-text-disabled)]'
                : 'text-[var(--scanner-text-primary)]'
            )}
          >
            {label}
          </span>
        )}
      </label>
    );
  }
);

RadioButtonItem.displayName = 'RadioButtonItem';
