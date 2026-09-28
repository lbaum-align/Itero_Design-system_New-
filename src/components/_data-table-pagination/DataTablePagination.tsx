import { forwardRef, useMemo, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../button';
import { Dropdown } from '../dropdown';
import type { DropdownOption } from '../dropdown';
import type { DataTablePaginationProps } from './data-table-pagination.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Bars / Data table pagination (node 33899:18446, page "Data table")
 * Single component (no variants). Private — composed by DataTable ("Show pagination").
 *
 * Row (space-between, gap 16, items centered):
 * - "Items control" (gap 24, padding-right 16):
 *   "Control" (gap 16, padding-right 24, dashed 1px border-subtle right edge): "Items per page" 16/24 text-primary + Dropdown ("10")
 *   · "1–10 of 104 items" 16/24 text-tertiary.
 * - "Pages control" (gap 24):
 *   "Pages" (gap 16, padding-right 24, dashed right edge): Dropdown ("1") + "of 10 pages" 16/24 text-primary
 *   · "Actions" (gap 8): Button Brand/Secondary/Large/Icon only — Caret left (Disabled on page 1), Caret right.
 * The Figma Dropdown instances are 60px tall (padding 18, no stroke) although set to Size=Large (48px in the current
 * Dropdowm set); X-Large (60px) is used so they line up with the Large buttons — see sign-off.
 */

const text16 = 'whitespace-nowrap text-[length:var(--scanner-text-base)] leading-[var(--scanner-leading-md)]';

const dashedDividerRight = cn(
  'pointer-events-none absolute inset-y-0 right-0 w-[var(--scanner-data-table-bars-divider-width)]',
  'bg-[image:repeating-linear-gradient(to_bottom,var(--scanner-border-subtle)_0_var(--scanner-data-table-bars-divider-dash),transparent_var(--scanner-data-table-bars-divider-dash)_var(--scanner-data-table-bars-divider-period))]',
);

const DEFAULT_PAGE_SIZES = [10, 20, 50, 100];

const defaultRangeLabel = (start: number, end: number, total: number) => `${start}–${end} of ${total} items`;
const defaultPagesLabel = (totalPages: number) => `of ${totalPages} ${totalPages === 1 ? 'page' : 'pages'}`;

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

/**
 * Data table pagination bar — rows per page, visible range, page picker and previous / next buttons.
 *
 * Controlled (`page` / `pageSize` + `onPageChange` / `onPageSizeChange`) or uncontrolled (`defaultPage` / `defaultPageSize`).
 * Pages are 1-based. Changing the page size keeps the first visible row on screen.
 *
 * Accessibility: `nav` landmark; both dropdowns are labelled comboboxes; previous / next are icon buttons with
 * `aria-label`s and are disabled at the ends (focus moves to the other button); the range text is a polite live region.
 *
 * @example
 * <DataTablePagination
 *   page={page} pageSize={pageSize} totalItems={104}
 *   onPageChange={setPage} onPageSizeChange={setPageSize}
 * />
 */
export const DataTablePagination = forwardRef<HTMLElement, DataTablePaginationProps>(
  (
    {
      page: pageProp,
      defaultPage = 1,
      pageSize: pageSizeProp,
      defaultPageSize,
      totalItems,
      onPageChange,
      onPageSizeChange,
      pageSizeOptions = DEFAULT_PAGE_SIZES,
      itemsPerPageLabel = 'Items per page',
      rangeLabel = defaultRangeLabel,
      pagesLabel = defaultPagesLabel,
      pageLabel = 'Page',
      previousLabel = 'Previous page',
      nextLabel = 'Next page',
      'aria-label': ariaLabel = 'Pagination',
      disabled = false,
      menuMaxHeight = 'var(--scanner-data-table-pagination-menu-max-height)',
      className,
      ...rest
    },
    ref,
  ) => {
    const [pageState, setPageState] = useState(defaultPage);
    const [pageSizeState, setPageSizeState] = useState(defaultPageSize ?? pageSizeOptions[0] ?? 10);
    const pageSize = Math.max(1, pageSizeProp ?? pageSizeState);
    const total = Math.max(0, totalItems);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const page = clamp(Math.floor(pageProp ?? pageState), 1, totalPages);

    const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);
    const isFirst = page <= 1;
    const isLast = page >= totalPages;

    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    const sizeOptions = useMemo<DropdownOption[]>(() => {
      const sizes = pageSizeOptions.includes(pageSize) ? pageSizeOptions : [...pageSizeOptions, pageSize].sort((a, b) => a - b);
      return sizes.map((s) => ({ value: String(s), label: String(s) }));
    }, [pageSizeOptions, pageSize]);

    const pageOptions = useMemo<DropdownOption[]>(
      () => Array.from({ length: totalPages }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })),
      [totalPages],
    );

    const goTo = (next: number) => {
      const target = clamp(next, 1, totalPages);
      if (target === page) return;
      if (pageProp === undefined) setPageState(target);
      onPageChange?.(target);
    };

    const handlePrevious = () => {
      /* The previous button disables on page 1 — keep keyboard focus in the bar */
      if (page - 1 <= 1) nextRef.current?.focus();
      goTo(page - 1);
    };

    const handleNext = () => {
      if (page + 1 >= totalPages) prevRef.current?.focus();
      goTo(page + 1);
    };

    const handlePageSize = (value: string | null) => {
      const nextSize = Number(value);
      if (!value || !Number.isFinite(nextSize) || nextSize <= 0 || nextSize === pageSize) return;
      if (pageSizeProp === undefined) setPageSizeState(nextSize);
      onPageSizeChange?.(nextSize);
      /* Keep the first visible row on screen */
      const nextTotalPages = Math.max(1, Math.ceil(total / nextSize));
      const target = clamp(Math.floor(((page - 1) * pageSize) / nextSize) + 1, 1, nextTotalPages);
      if (target !== page) {
        if (pageProp === undefined) setPageState(target);
        onPageChange?.(target);
      }
    };

    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        className={cn(
          'flex w-full items-center justify-between gap-[var(--scanner-spacing-5)]',
          'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
          className,
        )}
        {...rest}
      >
        {/* Items control */}
        <div data-part="items-control" className="flex items-center gap-[var(--scanner-spacing-7)] pr-[var(--scanner-spacing-5)]">
          <div className="relative flex items-center gap-[var(--scanner-spacing-5)] pr-[var(--scanner-spacing-7)]">
            <span aria-hidden="true" className={cn(text16, 'text-[color:var(--scanner-text-primary)]')}>
              {itemsPerPageLabel}
            </span>
            <Dropdown
              size="x-large"
              aria-label={itemsPerPageLabel}
              options={sizeOptions}
              value={String(pageSize)}
              onChange={handlePageSize}
              disabled={disabled}
              menuMaxHeight={menuMaxHeight}
              className="w-auto"
            />
            <span aria-hidden="true" className={dashedDividerRight} />
          </div>
          <span
            data-part="range"
            aria-live="polite"
            className={cn(text16, disabled ? 'text-[color:var(--scanner-text-disabled)]' : 'text-[color:var(--scanner-text-tertiary)]')}
          >
            {rangeLabel(start, end, total)}
          </span>
        </div>

        {/* Pages control */}
        <div data-part="pages-control" className="flex items-center gap-[var(--scanner-spacing-7)]">
          <div className="relative flex items-center gap-[var(--scanner-spacing-5)] pr-[var(--scanner-spacing-7)]">
            <Dropdown
              size="x-large"
              aria-label={pageLabel}
              options={pageOptions}
              value={String(page)}
              onChange={(v) => v && goTo(Number(v))}
              disabled={disabled}
              menuMaxHeight={menuMaxHeight}
              className="w-auto"
            />
            <span className={cn(text16, 'text-[color:var(--scanner-text-primary)]')}>{pagesLabel(totalPages)}</span>
            <span aria-hidden="true" className={dashedDividerRight} />
          </div>
          <div data-part="actions" className="flex items-center gap-[var(--scanner-spacing-3)]">
            <Button
              ref={prevRef}
              size="large"
              emphasis="secondary"
              iconName="caret-left"
              iconOnly
              aria-label={previousLabel}
              disabled={disabled || isFirst}
              onClick={handlePrevious}
            />
            <Button
              ref={nextRef}
              size="large"
              emphasis="secondary"
              iconName="caret-right"
              iconOnly
              aria-label={nextLabel}
              disabled={disabled || isLast}
              onClick={handleNext}
            />
          </div>
        </div>
      </nav>
    );
  },
);

DataTablePagination.displayName = 'DataTablePagination';
