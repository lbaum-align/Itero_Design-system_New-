import { forwardRef, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import { PaginationItem } from '../_pagination-item';
import type { PaginationItemSize } from '../_pagination-item';
import type { PaginationProps, PaginationSize } from './pagination.types';

/* ------------------------------------------------------------------ */
/*  Size configuration                                                 */
/* ------------------------------------------------------------------ */

type SizeConfig = {
  /** Gap between items */
  gap: string;
  /** Padding for nav buttons */
  navPad: string;
  /** Border radius for nav buttons */
  navRadius: string;
  /** Explicit size for nav buttons (if needed) */
  navSize: string;
  /** Icon size */
  iconSize: 16 | 20;
  /** Ellipsis wrapper vertical padding */
  ellipsisPy: string;
  /** Ellipsis wrapper extra styles */
  ellipsisExtra: string;
  /** PaginationItem size */
  itemSize: PaginationItemSize;
};

const sizeConfig: Record<PaginationSize, SizeConfig> = {
  'x-large': {
    gap: 'gap-[var(--scanner-spacing-3)]',
    navPad: 'p-[var(--scanner-spacing-4)]',
    navRadius: 'rounded-[var(--scanner-radius-md)]',
    navSize: 'size-[60px]',
    iconSize: 20,
    ellipsisPy: 'py-[var(--scanner-spacing-4)]',
    ellipsisExtra: 'h-[60px] w-[48px] items-center justify-center',
    itemSize: 'x-large',
  },
  large: {
    gap: 'gap-[var(--scanner-spacing-3)]',
    navPad: 'p-[var(--scanner-spacing-4)]',
    navRadius: 'rounded-[var(--scanner-radius-md)]',
    navSize: 'size-[44px]',
    iconSize: 20,
    ellipsisPy: 'py-[var(--scanner-spacing-4)]',
    ellipsisExtra: 'h-[44px] w-[20px] items-center justify-center',
    itemSize: 'large',
  },
  medium: {
    gap: 'gap-[var(--scanner-spacing-3)]',
    navPad: 'p-[var(--scanner-spacing-3)]',
    navRadius: 'rounded-[var(--scanner-radius-md)]',
    navSize: '',
    iconSize: 20,
    ellipsisPy: 'py-[var(--scanner-spacing-3)]',
    ellipsisExtra: 'items-start',
    itemSize: 'medium',
  },
  small: {
    gap: 'gap-[var(--scanner-spacing-2)]',
    navPad: 'p-[var(--scanner-spacing-2)]',
    navRadius: 'rounded-[var(--scanner-radius-sm)]',
    navSize: '',
    iconSize: 20,
    ellipsisPy: 'py-[var(--scanner-spacing-2)]',
    ellipsisExtra: 'items-start',
    itemSize: 'small',
  },
};

/* ------------------------------------------------------------------ */
/*  Pagination logic                                                   */
/* ------------------------------------------------------------------ */

type PageEntry = number | 'ellipsis';

/**
 * Compute which page numbers (and ellipsis markers) to render.
 *
 * - 7 or fewer pages → show all.
 * - Near the start → 1 2 3 4 5 … N
 * - Near the end   → 1 … N-4 N-3 N-2 N-1 N
 * - In the middle  → 1 … P-1 P P+1 … N
 */
function getVisiblePages(current: number, total: number): PageEntry[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', total];
  }

  if (current >= total - 3) {
    return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Pagination — navigational control for paged content.
 *
 * Renders previous/next arrows, numbered page items (via
 * `_PaginationItem`), and ellipsis indicators when needed.
 *
 * Supports 4 sizes: x-large, large, medium, and small.
 *
 * @example
 * <Pagination currentPage={1} totalPages={10} onPageChange={setPage} />
 * <Pagination currentPage={5} totalPages={20} size="small" />
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      size = 'x-large',
      disabled = false,
      skeleton = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const cfg = sizeConfig[size];
    const pages = getVisiblePages(currentPage, totalPages);
    const isFirst = currentPage <= 1;
    const isLast = currentPage >= totalPages;

    const handlePageChange = useCallback(
      (page: number) => {
        if (!disabled && onPageChange && page >= 1 && page <= totalPages) {
          onPageChange(page);
        }
      },
      [disabled, onPageChange, totalPages],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLElement>) => {
        if (disabled) return;
        if (e.key === 'ArrowLeft' && !isFirst) {
          e.preventDefault();
          handlePageChange(currentPage - 1);
        } else if (e.key === 'ArrowRight' && !isLast) {
          e.preventDefault();
          handlePageChange(currentPage + 1);
        }
      },
      [disabled, isFirst, isLast, currentPage, handlePageChange],
    );

    /* ── Skeleton ── */
    if (skeleton) {
      return (
        <div
          className={cn(
            'inline-flex animate-pulse items-start',
            cfg.gap,
            className,
          )}
          aria-hidden="true"
        >
          {/* Render placeholder boxes for prev + 5 pages + ellipsis + last + next */}
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              className={cn(
                'bg-[var(--scanner-bg-disabled)]',
                cfg.navRadius,
                cfg.navSize || 'size-5',
                cfg.navPad,
              )}
            />
          ))}
        </div>
      );
    }

    return (
      <nav
        ref={ref}
        aria-label="Pagination"
        className={cn('inline-flex items-start', cfg.gap, className)}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {/* ── Previous button ── */}
        <button
          type="button"
          aria-label="Previous page"
          disabled={disabled || isFirst}
          onClick={() => handlePageChange(currentPage - 1)}
          className={cn(
            'inline-flex shrink-0 items-center justify-center',
            'border border-solid',
            'transition-colors',
            'cursor-pointer select-none',
            cfg.navPad,
            cfg.navRadius,
            cfg.navSize,

            /* Disabled or at first page */
            disabled || isFirst
              ? 'cursor-not-allowed border-[var(--scanner-border-disabled)] text-[var(--scanner-icon-disabled)]'
              : [
                  'border-[var(--scanner-border-subtle)]',
                  'text-[var(--scanner-icon-secondary)]',
                  'hover:border-[var(--scanner-border-hover)]',
                ],

            /* Focus ring */
            'focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--scanner-border-focus)]',
          )}
        >
          <Icon name="chevron-left" size={cfg.iconSize} className="shrink-0" />
        </button>

        {/* ── Page entries ── */}
        {pages.map((entry, idx) => {
          if (entry === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${idx}`}
                aria-hidden="true"
                className={cn(
                  'inline-flex shrink-0',
                  cfg.ellipsisPy,
                  cfg.ellipsisExtra,
                  'text-[var(--scanner-icon-secondary)]',
                )}
              >
                <Icon name="more-horizontal" size={20} className="shrink-0" />
              </span>
            );
          }

          return (
            <PaginationItem
              key={entry}
              page={entry}
              selected={entry === currentPage}
              disabled={disabled}
              size={cfg.itemSize}
              onClick={() => handlePageChange(entry)}
            />
          );
        })}

        {/* ── Next button ── */}
        <button
          type="button"
          aria-label="Next page"
          disabled={disabled || isLast}
          onClick={() => handlePageChange(currentPage + 1)}
          className={cn(
            'inline-flex shrink-0 items-center justify-center',
            'border border-solid',
            'transition-colors',
            'cursor-pointer select-none',
            cfg.navPad,
            cfg.navRadius,
            cfg.navSize,

            /* Disabled or at last page */
            disabled || isLast
              ? 'cursor-not-allowed border-[var(--scanner-border-disabled)] text-[var(--scanner-icon-disabled)]'
              : [
                  'border-[var(--scanner-border-subtle)]',
                  'text-[var(--scanner-icon-secondary)]',
                  'hover:border-[var(--scanner-border-hover)]',
                ],

            /* Focus ring */
            'focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--scanner-border-focus)]',
          )}
        >
          <Icon name="chevron-right" size={cfg.iconSize} className="shrink-0" />
        </button>
      </nav>
    );
  },
);

Pagination.displayName = 'Pagination';
