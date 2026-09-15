import { forwardRef } from 'react';
import type { KeyboardEvent } from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../button';
import type { ButtonSize } from '../button';
import { PaginationItem } from '../_pagination-item';
import type { PaginationItemSize } from '../_pagination-item';
import { Icon } from '../../icons';
import { getVisiblePages } from './pagination-range';
import type { PaginationProps, PaginationSize } from './pagination.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Pagination (node 34178:41697, page 34178:39970)
 * Size: X-Large, Large, Medium, Small = 4 variants.
 *
 * Anatomy: Previous (01 Button Secondary icon-only, "Caret left") · _Pagination items · "Over" (More horizontal)
 * · last page · Next (01 Button Secondary icon-only, "Caret right").
 * Figma resizes the Button instances to the item size (60 / 44 / 36 / 28) with a 24px (X-Large) or 20px caret.
 */

const sizeConfig: Record<
  PaginationSize,
  { gap: string; box: string; icon: string; ellipsis: string; radius: string; button: ButtonSize; item: PaginationItemSize }
> = {
  'x-large': {
    gap: 'gap-[var(--scanner-spacing-3)]', // 8
    box: 'size-[var(--scanner-pagination-item-size-xl)]',
    icon: 'size-[var(--scanner-pagination-icon-size-xl)]',
    ellipsis: 'h-[var(--scanner-pagination-item-size-xl)] w-[var(--scanner-pagination-ellipsis-width-xl)]',
    radius: 'rounded-[var(--scanner-radius-md)]',
    button: 'large',
    item: 'x-large',
  },
  large: {
    gap: 'gap-[var(--scanner-spacing-3)]',
    box: 'size-[var(--scanner-pagination-item-size-lg)]',
    icon: 'size-[var(--scanner-pagination-icon-size)]',
    ellipsis: 'h-[var(--scanner-pagination-item-size-lg)] w-[var(--scanner-pagination-ellipsis-width)]',
    radius: 'rounded-[var(--scanner-radius-md)]',
    button: 'large',
    item: 'large',
  },
  medium: {
    gap: 'gap-[var(--scanner-spacing-3)]',
    box: 'size-[var(--scanner-pagination-item-size-md)]',
    icon: 'size-[var(--scanner-pagination-icon-size)]',
    ellipsis: 'h-[var(--scanner-pagination-item-size-md)] w-[var(--scanner-pagination-ellipsis-width)]',
    radius: 'rounded-[var(--scanner-radius-md)]',
    button: 'medium',
    item: 'medium',
  },
  small: {
    gap: 'gap-[var(--scanner-spacing-2)]', // 4
    box: 'size-[var(--scanner-pagination-item-size-sm)]',
    icon: 'size-[var(--scanner-pagination-icon-size)]',
    ellipsis: 'h-[var(--scanner-pagination-item-size-sm)] w-[var(--scanner-pagination-ellipsis-width)]',
    radius: 'rounded-[var(--scanner-radius-sm)]',
    button: 'small',
    item: 'small',
  },
};

/** Squeezes the Button to the pagination box: fixed square, no padding / min sizes, block icon. */
const navButtonReset = 'min-h-0 min-w-0 p-0 [&_svg]:mx-auto [&_svg]:block';

/**
 * Pagination — navigation between pages of content.
 *
 * Renders a `nav` landmark with previous/next buttons (Button, Secondary, icon-only), page items
 * (`aria-current="page"` on the current one) and "…" when there are more than 7 pages.
 *
 * Keyboard: Tab moves between buttons, Enter/Space activates; ArrowLeft/ArrowRight anywhere inside
 * the pagination go to the previous/next page.
 *
 * @example
 * <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
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
      onKeyDown,
      'aria-label': ariaLabel = 'Pagination',
      ...rest
    },
    ref,
  ) => {
    const cfg = sizeConfig[size];
    const pages = getVisiblePages(currentPage, totalPages);
    const isFirst = currentPage <= 1;
    const isLast = currentPage >= totalPages;

    const goTo = (page: number) => {
      if (disabled || !onPageChange || page < 1 || page > totalPages || page === currentPage) return;
      onPageChange(page);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || disabled) return;
      if (e.key === 'ArrowLeft' && !isFirst) {
        e.preventDefault();
        goTo(currentPage - 1);
      } else if (e.key === 'ArrowRight' && !isLast) {
        e.preventDefault();
        goTo(currentPage + 1);
      }
    };

    if (skeleton) {
      /* No Figma skeleton — placeholder boxes with the same footprint as the real control */
      const box = cn(cfg.box, cfg.radius, 'animate-pulse bg-[var(--scanner-bg-highlight-gray)]');
      return (
        <div aria-hidden="true" data-skeleton="" className={cn('inline-flex items-start', cfg.gap, className)}>
          <div className={box} />
          {pages.map((entry, i) =>
            entry === 'ellipsis' ? (
              <div key={`e${i}`} className={cfg.ellipsis} />
            ) : (
              <div key={entry} className={box} />
            ),
          )}
          <div className={box} />
        </div>
      );
    }

    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        className={cn('inline-flex items-start', cfg.gap, className)}
        {...rest}
      >
        <Button
          emphasis="secondary"
          size={cfg.button}
          aria-label="Previous page"
          disabled={disabled || isFirst}
          onClick={() => goTo(currentPage - 1)}
          className={cn(navButtonReset, cfg.box)}
        >
          <Icon name="caret-left" size={24} className={cfg.icon} />
        </Button>

        {pages.map((entry, i) =>
          entry === 'ellipsis' ? (
            <span
              key={`ellipsis-${i}`}
              aria-hidden="true"
              data-part="ellipsis"
              className={cn('inline-flex shrink-0 items-center justify-center text-[color:var(--scanner-icon-disabled)]', cfg.ellipsis)}
            >
              <Icon name="more-horizontal" size={20} className="size-[var(--scanner-pagination-icon-size)]" />
            </span>
          ) : (
            <PaginationItem
              key={entry}
              page={entry}
              size={cfg.item}
              selected={entry === currentPage}
              disabled={disabled}
              onClick={() => goTo(entry)}
            />
          ),
        )}

        <Button
          emphasis="secondary"
          size={cfg.button}
          aria-label="Next page"
          disabled={disabled || isLast}
          onClick={() => goTo(currentPage + 1)}
          className={cn(navButtonReset, cfg.box)}
        >
          <Icon name="caret-right" size={24} className={cfg.icon} />
        </Button>
      </nav>
    );
  },
);

Pagination.displayName = 'Pagination';
