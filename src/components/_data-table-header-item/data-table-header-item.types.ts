import type { ReactNode, ThHTMLAttributes } from 'react';

/** Figma "Size" — only Large (52px) exists for the header item. */
export type DataTableHeaderItemSize = 'large';

/** Figma "Sorted". Maps 1:1 to the `aria-sort` values of the `<th>`. */
export type DataTableSortDirection = 'none' | 'ascending' | 'descending';

/** Interactive states that can be forced via `data-state` (Storybook / visual tests). */
export type DataTableHeaderItemForcedState = 'hovered' | 'focused' | 'pressed';

export interface DataTableHeaderItemProps
  extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'children' | 'onChange'> {
  /** Column label (Figma "Header text"). */
  children?: ReactNode;
  /** Row height preset (Figma "Size"). @default 'large' */
  size?: DataTableHeaderItemSize;
  /** Figma "Sorted" — also written to `aria-sort` on the `<th>`. @default 'none' */
  sorted?: DataTableSortDirection;
  /**
   * Make the label a sort button. Implied by `onSortChange`.
   * A sortable column with `sorted="none"` shows no arrow, exactly like Figma.
   */
  sortable?: boolean;
  /** Called with the next direction when the label is activated (none → ascending → descending → none). */
  onSortChange?: (sorted: DataTableSortDirection) => void;
  /** Figma "Filterable" — shows the 20px filter button after the label. @default false */
  filterable?: boolean;
  /** Called when the filter button is activated. */
  onFilterClick?: () => void;
  /** Accessible name of the filter button. @default `Filter ${label}` */
  filterLabel?: string;
  /** Figma "Show divider" — 1px × 28px rule at the trailing edge of the cell. @default false */
  showDivider?: boolean;
  /** Disables the sort and filter buttons. */
  disabled?: boolean;
  /** Force a visual state for screenshots / Storybook. */
  'data-state'?: DataTableHeaderItemForcedState;
}
