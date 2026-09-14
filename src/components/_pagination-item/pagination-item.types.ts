export type PaginationItemSize = 'small' | 'medium' | 'large' | 'x-large';

export interface PaginationItemProps {
  /** Page number to display */
  page: number;
  /** Whether this page is the currently selected page */
  selected?: boolean;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Size variant */
  size?: PaginationItemSize;
  /** Additional CSS class names */
  className?: string;
}
