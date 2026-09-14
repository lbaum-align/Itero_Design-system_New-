import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { PaginationItemProps, PaginationItemSize } from './pagination-item.types';

const sizeStyles: Record<PaginationItemSize, string> = {
  small: [
    'h-7 min-w-7',
    'p-[var(--scanner-spacing-2)]',
    'rounded-[var(--scanner-radius-sm)]',
    'text-sm leading-[var(--scanner-leading-sm)]',
  ].join(' '),
  medium: [
    'h-9 min-w-9',
    'p-[var(--scanner-spacing-3)]',
    'rounded-[var(--scanner-radius-md)]',
    'text-sm leading-[var(--scanner-leading-sm)]',
  ].join(' '),
};

/**
 * _PaginationItem — a single page-number button used within Pagination.
 *
 * @private This is a private sub-component; not exported from the package barrel.
 *
 * @example
 * <PaginationItem page={1} />
 * <PaginationItem page={3} selected />
 */
export const PaginationItem = forwardRef<HTMLButtonElement, PaginationItemProps>(
  ({ page, selected = false, disabled = false, onClick, size = 'medium', className, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        aria-current={selected ? 'page' : undefined}
        aria-label={`Page ${page}`}
        onClick={onClick}
        className={cn(
          // Base layout
          'relative inline-flex items-center justify-center',
          'border border-solid',
          'font-[family-name:var(--scanner-font-sans)] font-normal',
          'text-[var(--scanner-text-primary)] text-center',
          'cursor-pointer select-none',
          'transition-colors',

          // Size
          sizeStyles[size],

          // Selected vs default border
          selected
            ? 'border-[var(--scanner-border-interactive)]'
            : 'border-[var(--scanner-border-subtle)]',

          // Hover (non-selected, non-disabled)
          !selected && !disabled && 'hover:border-[var(--scanner-border-hover)]',

          // Disabled
          disabled && 'cursor-not-allowed text-[var(--scanner-text-disabled)] border-[var(--scanner-border-disabled)]',

          // Focus ring — 2px outline offset by 3px, matching Figma's -5px inset ring
          'focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--scanner-border-focus)]',

          className
        )}
        {...rest}
      >
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {page}
        </span>
      </button>
    );
  }
);

PaginationItem.displayName = 'PaginationItem';
