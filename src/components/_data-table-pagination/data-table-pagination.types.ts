import type { HTMLAttributes, ReactNode } from 'react';

export interface DataTablePaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Current page, 1-based (controlled). Clamped to `1…totalPages`. */
  page?: number;
  /** Initial page when uncontrolled. Default `1`. */
  defaultPage?: number;
  /** Rows per page (controlled). */
  pageSize?: number;
  /** Initial rows per page when uncontrolled. Default: first `pageSizeOptions` entry. */
  defaultPageSize?: number;
  /** Total number of rows across all pages. */
  totalItems: number;
  /** Called with the new 1-based page (previous / next buttons, page dropdown, or a page-size change). */
  onPageChange?: (page: number) => void;
  /**
   * Called with the new page size. The page then changes so the first row that was visible stays visible
   * (`onPageChange` fires when it differs).
   */
  onPageSizeChange?: (pageSize: number) => void;
  /** Figma "Items per page" dropdown options. Default `[10, 20, 50, 100]`. */
  pageSizeOptions?: number[];

  /* ── Text (Figma defaults, override for i18n) ── */
  /** Default `'Items per page'`. */
  itemsPerPageLabel?: string;
  /** Range text. Default `` `${start}–${end} of ${total} items` `` ("1–10 of 104 items"). */
  rangeLabel?: (start: number, end: number, total: number) => ReactNode;
  /** Text after the page dropdown. Default `` `of ${totalPages} pages` `` ("of 10 pages"). */
  pagesLabel?: (totalPages: number) => ReactNode;
  /** Accessible name of the page dropdown. Default `'Page'`. */
  pageLabel?: string;
  /** Accessible name of the previous button. Default `'Previous page'`. */
  previousLabel?: string;
  /** Accessible name of the next button. Default `'Next page'`. */
  nextLabel?: string;
  /** Accessible name of the `nav` landmark. Default `'Pagination'`. */
  'aria-label'?: string;

  /** Disable every control (not a Figma variant). */
  disabled?: boolean;
  /** Max height of both dropdown menus. Default `var(--scanner-data-table-pagination-menu-max-height)` (240px). */
  menuMaxHeight?: number | string;
}
