import type { HTMLAttributes } from 'react';

/** Figma "Size" (X-Large / Large / Medium / Small). */
export type PaginationSize = 'x-large' | 'large' | 'medium' | 'small';

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** The currently active page (1-indexed). Rendered as the Selected `_Pagination item`. */
  currentPage: number;
  /** Total number of pages. More than 7 pages collapse into "…" (Figma "Over") slots. */
  totalPages: number;
  /** Called when the user selects a different page. */
  onPageChange?: (page: number) => void;
  /** Figma "Size". Default `'x-large'`. */
  size?: PaginationSize;
  /** Disable all interaction (not a Figma variant). */
  disabled?: boolean;
  /** Show a skeleton loading placeholder (not a Figma variant). */
  skeleton?: boolean;
  /** Accessible name of the `nav` landmark. Default `'Pagination'`. */
  'aria-label'?: string;
  /** Additional CSS class names. */
  className?: string;
}
