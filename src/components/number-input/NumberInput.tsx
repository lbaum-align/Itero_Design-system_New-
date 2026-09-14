import { forwardRef, useCallback, useId, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import { IconTriggerTooltip } from '../icon-trigger-tooltip';
import type { NumberInputProps, NumberInputSize } from './number-input.types';

/* ------------------------------------------------------------------ */
/*  Size config                                                       */
/* ------------------------------------------------------------------ */

type SizeConfig = {
  /** Field height class */
  height: string;
  /** Padding-left */
  pl: string;
  /** Padding-right */
  pr: string;
  /** Padding-y */
  py: string;
  /** Font-size for the input value */
  fontSize: string;
  /** Line-height for the input value */
  lineHeight: string;
  /** Font-size for label / helper / error text */
  labelFontSize: string;
  /** Line-height for label / helper / error text */
  labelLineHeight: string;
};

const sizeConfig: Record<NumberInputSize, SizeConfig> = {
  small: {
    height: 'h-[28px]',
    pl: 'pl-[var(--scanner-spacing-3)]',           // 8px
    pr: '',                                         // no explicit pr (buttons flush)
    py: 'py-[var(--scanner-spacing-2)]',            // 4px
    fontSize: 'text-[length:var(--scanner-text-sm)]',       // 14px
    lineHeight: 'leading-[var(--scanner-leading-sm)]',      // 20px
    labelFontSize: 'text-[length:var(--scanner-text-xs)]',  // 12px
    labelLineHeight: 'leading-[var(--scanner-leading-xs)]', // 16px
  },
  medium: {
    height: 'h-[36px]',
    pl: 'pl-[var(--scanner-spacing-4)]',            // 12px
    pr: 'pr-[var(--scanner-spacing-2)]',            // 4px
    py: 'py-[var(--scanner-spacing-2)]',            // 4px
    fontSize: 'text-[length:var(--scanner-text-sm)]',
    lineHeight: 'leading-[var(--scanner-leading-sm)]',
    labelFontSize: 'text-[length:var(--scanner-text-xs)]',
    labelLineHeight: 'leading-[var(--scanner-leading-xs)]',
  },
  large: {
    height: 'h-[44px]',
    pl: 'pl-[var(--scanner-spacing-5)]',            // 16px
    pr: 'pr-[var(--scanner-spacing-3)]',            // 8px
    py: 'py-[var(--scanner-spacing-3)]',            // 8px
    fontSize: 'text-[length:var(--scanner-text-sm)]',
    lineHeight: 'leading-[var(--scanner-leading-sm)]',
    labelFontSize: 'text-[length:var(--scanner-text-xs)]',
    labelLineHeight: 'leading-[var(--scanner-leading-xs)]',
  },
  'x-large': {
    height: 'min-h-[44px] max-h-[60px]',
    pl: 'pl-[var(--scanner-spacing-5)]',            // 16px
    pr: 'pr-[var(--scanner-spacing-3)]',            // 8px
    py: 'py-[var(--scanner-spacing-5)]',            // 16px
    // X-Large uses 18px / 28px — no exact token match; see deviation notes
    fontSize: 'text-[18px]',
    lineHeight: 'leading-[var(--scanner-leading-lg)]',      // 28px
    // X-Large label/helper uses 16px / 24px
    labelFontSize: 'text-[16px]',
    labelLineHeight: 'leading-[var(--scanner-leading-md)]', // 24px
  },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function clampValue(val: number, min?: number, max?: number): number {
  let clamped = val;
  if (min !== undefined && clamped < min) clamped = min;
  if (max !== undefined && clamped > max) clamped = max;
  return clamped;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

/**
 * Scanner NumberInput — a numeric input field with optional stepper buttons.
 *
 * Supports 4 sizes (small / medium / large / x-large), 2 layer sets,
 * label, helper text, error state, skeleton, and explainer tooltip.
 *
 * @example
 * <NumberInput label="Quantity" min={0} max={100} step={1} />
 * <NumberInput value={42} onChange={(v) => setValue(v)} error errorText="Out of range" />
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onChange,
      min,
      max,
      step = 1,
      size = 'large',
      layer = 1,
      label,
      helperText,
      errorText = 'Error text message',
      error = false,
      disabled = false,
      skeleton = false,
      showControls = true,
      showExplainer = false,
      explainerText = '',
      className,
      id: idProp,
      'aria-describedby': ariaDescribedByProp,
      ...rest
    },
    ref,
  ) => {
    /* ── IDs ── */
    const autoId = useId();
    const inputId = idProp ?? `number-input-${autoId}`;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    /* ── Uncontrolled internal state ── */
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState<number>(
      defaultValue ?? 0,
    );
    const currentValue = isControlled ? controlledValue : internalValue;

    const inputRef = useRef<HTMLInputElement>(null);

    /* ── Value update ── */
    const updateValue = useCallback(
      (next: number) => {
        const clamped = clampValue(next, min, max);
        if (!isControlled) {
          setInternalValue(clamped);
        }
        onChange?.(clamped);
      },
      [isControlled, min, max, onChange],
    );

    const handleIncrement = useCallback(() => {
      if (disabled) return;
      updateValue(currentValue + step);
    }, [disabled, currentValue, step, updateValue]);

    const handleDecrement = useCallback(() => {
      if (disabled) return;
      updateValue(currentValue - step);
    }, [disabled, currentValue, step, updateValue]);

    /* ── Input change (direct typing) ── */
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        // Allow empty string while typing, minus sign, or numeric values
        if (raw === '' || raw === '-') return;
        const parsed = Number(raw);
        if (!Number.isNaN(parsed)) {
          updateValue(parsed);
        }
      },
      [updateValue],
    );

    /* ── Input blur → clamp ── */
    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const parsed = Number(raw);
        if (raw === '' || Number.isNaN(parsed)) {
          updateValue(defaultValue ?? min ?? 0);
        } else {
          updateValue(parsed);
        }
        rest.onBlur?.(e);
      },
      [updateValue, defaultValue, min, rest],
    );

    /* ── Keyboard navigation ── */
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            handleIncrement();
            break;
          case 'ArrowDown':
            e.preventDefault();
            handleDecrement();
            break;
          case 'Home':
            if (min !== undefined) {
              e.preventDefault();
              updateValue(min);
            }
            break;
          case 'End':
            if (max !== undefined) {
              e.preventDefault();
              updateValue(max);
            }
            break;
        }
        rest.onKeyDown?.(e);
      },
      [handleIncrement, handleDecrement, updateValue, min, max, rest],
    );

    /* ── Config ── */
    const cfg = sizeConfig[size];
    const layerBg =
      layer === 2
        ? 'bg-[var(--scanner-bg-secondary)]'
        : 'bg-[var(--scanner-bg-primary)]';

    /* ── aria-describedby ── */
    const describedBy = [
      ariaDescribedByProp,
      error ? errorId : undefined,
      helperText && !error ? helperId : undefined,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    const atMin = min !== undefined && currentValue <= min;
    const atMax = max !== undefined && currentValue >= max;

    /* ================================================================= */
    /*  Skeleton                                                         */
    /* ================================================================= */

    if (skeleton) {
      return (
        <div
          className={cn(
            'flex w-full flex-col items-start',
            className,
          )}
          data-layer={layer}
          aria-hidden="true"
        >
          {/* Label skeleton */}
          {label !== undefined && (
            <div className="flex w-full items-start gap-[var(--scanner-spacing-2)] pb-[var(--scanner-spacing-3)]">
              <div className="h-[8px] w-[40px] bg-[var(--scanner-bg-disabled)]" />
            </div>
          )}

          {/* Field skeleton */}
          <div
            className={cn(
              'w-full shrink-0 rounded-[var(--scanner-radius-md)] bg-[var(--scanner-bg-disabled)]',
              cfg.height,
            )}
          />

          {/* Helper skeleton */}
          <div className="flex w-full items-start pt-[var(--scanner-spacing-3)]">
            <div className="h-[8px] w-[40px] bg-[var(--scanner-bg-disabled)]" />
          </div>
        </div>
      );
    }

    /* ================================================================= */
    /*  Rendered component                                               */
    /* ================================================================= */

    const showLabel = label !== undefined;
    const showHelper = helperText && !error && !disabled;
    const showError = error && !disabled;
    const showDisabledHelper = disabled && helperText;

    return (
      <div
        className={cn('flex w-full flex-col items-start', className)}
        data-layer={layer}
      >
        {/* ── Label ── */}
        {showLabel && (
          <div className="flex w-full items-center gap-[var(--scanner-spacing-2)] pb-[var(--scanner-spacing-3)]">
            <label
              htmlFor={inputId}
              className={cn(
                'shrink-0 whitespace-nowrap',
                'font-[family-name:var(--scanner-font-sans)]',
                'font-[var(--scanner-font-regular)]',
                cfg.labelFontSize,
                cfg.labelLineHeight,
                disabled
                  ? 'text-[var(--scanner-text-disabled)]'
                  : 'text-[var(--scanner-text-secondary)]',
              )}
            >
              {label}
            </label>
            {showExplainer && explainerText && (
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
            'flex w-full items-center overflow-clip',
            'rounded-[var(--scanner-radius-md)]',
            'gap-[var(--scanner-spacing-3)]',
            cfg.height,
            cfg.pl,
            cfg.pr,
            cfg.py,
            layerBg,
            /* Border — always present (transparent default prevents layout shift) */
            'border border-solid',
            error && !disabled
              ? 'border-[var(--scanner-border-error)]'
              : 'border-transparent',
            /* Focus-within border */
            !error &&
              !disabled &&
              'focus-within:border-[var(--scanner-border-focus)]',
          )}
        >
          {/* Input */}
          <input
            ref={(node) => {
              // Merge forwarded ref + local ref
              (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
            }}
            id={inputId}
            type="text"
            inputMode="numeric"
            role="spinbutton"
            aria-valuenow={currentValue}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-invalid={error || undefined}
            aria-describedby={describedBy}
            disabled={disabled}
            value={String(currentValue)}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={cn(
              'min-w-0 flex-1 bg-transparent outline-none',
              'overflow-hidden text-ellipsis whitespace-nowrap',
              'font-[family-name:var(--scanner-font-sans)]',
              'font-[var(--scanner-font-regular)]',
              cfg.fontSize,
              cfg.lineHeight,
              disabled
                ? 'text-[var(--scanner-text-disabled)] cursor-not-allowed'
                : 'text-[var(--scanner-text-primary)]',
              'placeholder:text-[var(--scanner-text-tertiary)]',
            )}
            {...rest}
          />

          {/* Stepper buttons */}
          {showControls && (
            <div className="flex shrink-0 items-center gap-[var(--scanner-spacing-2)]">
              {/* Decrement */}
              <button
                type="button"
                tabIndex={-1}
                disabled={disabled || atMin}
                aria-label="Decrement"
                onClick={handleDecrement}
                className={cn(
                  'inline-flex shrink-0 items-center justify-center',
                  'rounded-[var(--scanner-radius-sm)]',
                  'p-[var(--scanner-spacing-2)]',
                  'transition-colors duration-150',
                  disabled || atMin
                    ? 'cursor-not-allowed text-[var(--scanner-icon-disabled)]'
                    : [
                        'cursor-pointer',
                        'text-[var(--scanner-icon-secondary)]',
                        'hover:bg-[var(--scanner-bg-hover)]',
                        'active:bg-[var(--scanner-bg-active)]',
                      ],
                  'focus-visible:outline-2 focus-visible:outline-offset-2',
                  'focus-visible:outline-[var(--scanner-focus-ring)]',
                )}
              >
                <Icon name="minus" size={20} />
              </button>

              {/* Divider */}
              <div
                className="h-[16px] w-px shrink-0 bg-[var(--scanner-border-subtle)]"
                aria-hidden="true"
              />

              {/* Increment */}
              <button
                type="button"
                tabIndex={-1}
                disabled={disabled || atMax}
                aria-label="Increment"
                onClick={handleIncrement}
                className={cn(
                  'inline-flex shrink-0 items-center justify-center',
                  'rounded-[var(--scanner-radius-sm)]',
                  'p-[var(--scanner-spacing-2)]',
                  'transition-colors duration-150',
                  disabled || atMax
                    ? 'cursor-not-allowed text-[var(--scanner-icon-disabled)]'
                    : [
                        'cursor-pointer',
                        'text-[var(--scanner-icon-secondary)]',
                        'hover:bg-[var(--scanner-bg-hover)]',
                        'active:bg-[var(--scanner-bg-active)]',
                      ],
                  'focus-visible:outline-2 focus-visible:outline-offset-2',
                  'focus-visible:outline-[var(--scanner-focus-ring)]',
                )}
              >
                <Icon name="add" size={20} />
              </button>
            </div>
          )}
        </div>

        {/* ── Helper text ── */}
        {showHelper && (
          <div
            id={helperId}
            className={cn(
              'flex w-full items-center pt-[var(--scanner-spacing-3)]',
            )}
          >
            <p
              className={cn(
                'min-w-0 flex-1',
                'font-[family-name:var(--scanner-font-sans)]',
                'font-[var(--scanner-font-regular)]',
                cfg.labelFontSize,
                cfg.labelLineHeight,
                'text-[var(--scanner-text-secondary)]',
              )}
            >
              {helperText}
            </p>
          </div>
        )}

        {/* ── Disabled helper text ── */}
        {showDisabledHelper && (
          <div
            id={helperId}
            className="flex w-full items-center pt-[var(--scanner-spacing-3)]"
          >
            <p
              className={cn(
                'min-w-0 flex-1',
                'font-[family-name:var(--scanner-font-sans)]',
                'font-[var(--scanner-font-regular)]',
                cfg.labelFontSize,
                cfg.labelLineHeight,
                'text-[var(--scanner-text-disabled)]',
              )}
            >
              {helperText}
            </p>
          </div>
        )}

        {/* ── Error text ── */}
        {showError && (
          <div
            id={errorId}
            className="flex w-full items-start pt-[var(--scanner-spacing-3)]"
          >
            <p
              className={cn(
                'min-w-0 flex-1',
                'font-[family-name:var(--scanner-font-sans)]',
                'font-[var(--scanner-font-regular)]',
                cfg.labelFontSize,
                cfg.labelLineHeight,
                'text-[var(--scanner-text-error)]',
              )}
            >
              {errorText}
            </p>
          </div>
        )}
      </div>
    );
  },
);

NumberInput.displayName = 'NumberInput';
