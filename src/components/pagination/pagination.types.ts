export type PaginationSize = 'x-large' | 'large' | 'medium' | 'small';

export interface PaginationProps {
  /** The currently active page (1-indexed). */
  currentPage: number;
  /** Total number of pages. */
  totalPages: number;
  /** Called when the user selects a different page. */
  onPageChange?: (page: number) => void;
  /** Size variant matching the Figma size property. */
  size?: PaginationSize;
  /** Disable all interaction. */
  disabled?: boolean;
  /** Show skeleton loading placeholder. */
  skeleton?: boolean;
  /** Additional CSS class names. */
  className?: string;
}
