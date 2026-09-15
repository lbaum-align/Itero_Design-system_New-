import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { PaginationItemProps, PaginationItemSize } from './pagination-item.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → _Pagination item (node 34178:41733, page 34178:39970)
 * 4 Sizes × 4 States (Enabled, Hovered, Focused, Selected) = 16 variants.
 *
 * The 1px stroke sits inside the box in Figma, so it is drawn as an inset box-shadow (like Button).
 */

const sizeConfig: Record<PaginationItemSize, { box: string; padding: string; radius: string; focusRadius: string; type: string }> = {
  'x-large': {
    box: 'h-[var(--scanner-pagination-item-size-xl)] min-w-[var(--scanner-pagination-item-size-xl)]', // 60
    padding: 'p-[var(--scanner-spacing-4)]', // 12
    radius: 'rounded-[var(--scanner-radius-md)]', // 8
    focusRadius: 'rounded-[var(--scanner-radius-lg)]', // 12
    type: 'text-[length:var(--scanner-text-base)] leading-[var(--scanner-leading-md)]', // Code/$tp-code-01 16/24
  },
  large: {
    box: 'h-[var(--scanner-pagination-item-size-lg)] min-w-[var(--scanner-pagination-item-size-lg)]', // 44
    padding: 'p-[var(--scanner-spacing-4)]', // 12
    radius: 'rounded-[var(--scanner-radius-md)]',
    focusRadius: 'rounded-[var(--scanner-radius-lg)]',
    type: 'text-[length:var(--scanner-text-sm)] leading-[var(--scanner-leading-sm)]', // 14/20
  },
  medium: {
    box: 'h-[var(--scanner-pagination-item-size-md)] min-w-[var(--scanner-pagination-item-size-md)]', // 36
    padding: 'p-[var(--scanner-spacing-3)]', // 8
    radius: 'rounded-[var(--scanner-radius-md)]',
    focusRadius: 'rounded-[var(--scanner-radius-lg)]',
    type: 'text-[length:var(--scanner-text-sm)] leading-[var(--scanner-leading-sm)]',
  },
  small: {
    box: 'h-[var(--scanner-pagination-item-size-sm)] min-w-[var(--scanner-pagination-item-size-sm)]', // 28
    padding: 'p-[var(--scanner-spacing-2)]', // 4
    radius: 'rounded-[var(--scanner-radius-sm)]', // 4
    focusRadius: 'rounded-[var(--scanner-radius-md)]', // 8
    type: 'text-[length:var(--scanner-text-sm)] leading-[var(--scanner-leading-sm)]',
  },
};

const strokeEnabled = cn(
  'shadow-[inset_0_0_0_1px_var(--scanner-border-subtle)]',
  'hover:shadow-[inset_0_0_0_1px_var(--scanner-border-subtle-hover)] data-[state=hovered]:shadow-[inset_0_0_0_1px_var(--scanner-border-subtle-hover)]',
);
const strokeSelected = 'shadow-[inset_0_0_0_1px_var(--scanner-border-interactive)]';
const strokeDisabled = 'shadow-[inset_0_0_0_1px_var(--scanner-border-disabled)]';

/**
 * _PaginationItem — a single page-number button used within Pagination.
 *
 * Figma props → React: Size → `size`, State → `:hover` / `:focus-visible` (forceable via `data-state`)
 * / `selected`.
 *
 * @private Not exported from the package barrel.
 *
 * @example
 * <PaginationItem page={1} />
 * <PaginationItem page={3} selected />
 */
export const PaginationItem = forwardRef<HTMLButtonElement, PaginationItemProps>(
  (
    { page, selected = false, disabled = false, onClick, size = 'medium', className, 'aria-label': ariaLabel, ...rest },
    ref,
  ) => {
    const cfg = sizeConfig[size];

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        aria-disabled={disabled || undefined}
        aria-current={selected ? 'page' : undefined}
        aria-label={ariaLabel ?? `Page ${page}`}
        onClick={onClick}
        className={cn(
          'group relative inline-flex shrink-0 items-center justify-center',
          'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)] text-center',
          'select-none outline-none transition-shadow duration-150',
          cfg.box,
          cfg.padding,
          cfg.radius,
          cfg.type,
          disabled
            ? cn(strokeDisabled, 'cursor-not-allowed text-[color:var(--scanner-text-disabled)]')
            : cn(selected ? strokeSelected : strokeEnabled, 'cursor-pointer text-[color:var(--scanner-text-primary)]'),
          className,
        )}
        {...rest}
      >
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">{page}</span>

        {/* Focus ring — 2px border-focus, 4px outside the item */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute hidden',
            'inset-[calc(var(--scanner-pagination-focus-offset)*-1)]',
            'border-[length:var(--scanner-pagination-focus-width)] border-solid border-[color:var(--scanner-border-focus)]',
            cfg.focusRadius,
            'group-focus-visible:block group-data-[state=focused]:block',
          )}
        />
      </button>
    );
  },
);

PaginationItem.displayName = 'PaginationItem';
