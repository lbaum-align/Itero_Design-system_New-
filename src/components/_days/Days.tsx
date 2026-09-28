import { forwardRef } from 'react';
import type { MouseEvent } from 'react';
import { cn } from '../../utils/cn';
import type { DaysProps } from './days.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → _Days (node 6607:12895, page Date picker 15305:6737)
 * State (Enabled, Hovered, Pressed, Focused, Selected, In range, Disabled) × Today = 7 variants + boolean.
 *
 * Anatomy: 52px-high cell (4px vertical padding, "Range left" / "Range right" flexible spacers) holding a
 * 50×50 "Picker" square (radius medium). The label sits 2px below centre to leave room for the today indicator.
 * The cell is the click target; state fills and the 1px focus stroke are drawn on the picker.
 */

/** Picker fill + label colour for the resting / hover / pressed states. */
const pickerInteractive = cn(
  'group-hover:bg-[var(--scanner-bg-hover)] group-data-[state=hovered]:bg-[var(--scanner-bg-hover)]',
  'group-active:bg-[var(--scanner-bg-active)] group-data-[state=pressed]:bg-[var(--scanner-bg-active)]',
);

const pickerInRange = cn(
  'bg-[var(--scanner-bg-layer-selected)]',
  'group-hover:bg-[var(--scanner-bg-layer-selected-hover)] group-data-[state=hovered]:bg-[var(--scanner-bg-layer-selected-hover)]',
  'group-active:bg-[var(--scanner-bg-layer-selected-active)] group-data-[state=pressed]:bg-[var(--scanner-bg-layer-selected-active)]',
);

/** Figma Focused: 1px `border-focus` stroke inside the picker. */
const pickerFocus =
  'group-focus-visible:shadow-[inset_0_0_0_1px_var(--scanner-border-focus)] group-data-[state=focused]:shadow-[inset_0_0_0_1px_var(--scanner-border-focus)]';

/**
 * _Days — private calendar cell used by `Calendar` for days, months and years.
 *
 * Figma props → React: State → `:hover` / `:active` / `:focus-visible` (forceable via `data-state`),
 * `selected`, `inRange`, `disabled`; Today → `today` (`aria-current="date"`).
 *
 * @example
 * <Days today>8</Days>
 * <Days selected aria-label="July 12, 2024">12</Days>
 */
export const Days = forwardRef<HTMLButtonElement, DaysProps>(
  (
    {
      children,
      selected = false,
      inRange = false,
      today = false,
      disabled = false,
      focusableWhenDisabled = false,
      className,
      onClick,
      'aria-current': ariaCurrent,
      ...rest
    },
    ref,
  ) => {
    const nativeDisabled = disabled && !focusableWhenDisabled;

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    const picker = disabled
      ? ''
      : selected
        ? 'bg-[var(--scanner-bg-brand)]'
        : inRange
          ? pickerInRange
          : pickerInteractive;

    const label = disabled
      ? 'text-[color:var(--scanner-text-disabled)]'
      : selected
        ? 'text-[color:var(--scanner-text-on-color)]'
        : 'text-[color:var(--scanner-text-primary)]';

    return (
      <button
        ref={ref}
        type="button"
        disabled={nativeDisabled}
        aria-disabled={disabled || undefined}
        aria-current={ariaCurrent ?? (today ? 'date' : undefined)}
        data-selected={selected || undefined}
        data-in-range={inRange || undefined}
        onClick={handleClick}
        className={cn(
          'group flex h-[var(--scanner-days-cell-height)] w-full min-w-0 items-center justify-center',
          'm-0 border-none bg-transparent px-0 py-[var(--scanner-spacing-2)] outline-none select-none',
          'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          className,
        )}
        {...rest}
      >
        <span data-part="range-left" aria-hidden="true" className="h-full min-w-px flex-1" />
        <span
          data-part="picker"
          className={cn(
            'relative flex size-[var(--scanner-days-picker-size)] max-w-full shrink-0 items-center justify-center',
            'rounded-[var(--scanner-radius-md)] transition-[background-color,box-shadow] duration-150',
            /* label centre sits 2px below the picker centre (Figma top: calc(50% - 10px)) */
            'pt-[var(--scanner-spacing-2)]',
            picker,
            !disabled && pickerFocus,
          )}
        >
          <span
            className={cn(
              'whitespace-nowrap text-center',
              'text-[length:var(--scanner-text-base)] leading-[var(--scanner-leading-md)]',
              label,
            )}
          >
            {children}
          </span>
          {today && !disabled && (
            <span
              data-part="today-indicator"
              aria-hidden="true"
              className={cn(
                'absolute left-1/2 -translate-x-1/2 bottom-[var(--scanner-days-today-offset)]',
                'h-[var(--scanner-days-today-height)] w-[var(--scanner-days-today-width)] rounded-[var(--scanner-radius-full)]',
                selected ? 'bg-[var(--scanner-border-on-color-strong)]' : 'bg-[var(--scanner-border-interactive)]',
              )}
            />
          )}
        </span>
        <span data-part="range-right" aria-hidden="true" className="h-full min-w-px flex-1" />
      </button>
    );
  },
);

Days.displayName = 'Days';
