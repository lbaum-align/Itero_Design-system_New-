import type { HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import type { DataTableContentItemProps, DataTableContentType } from '../_data-table-content-item';
import type { DataTableHeaderItemProps } from '../_data-table-header-item';
import type { DataTablePaginationProps } from '../_data-table-pagination';
import type { DataTableToolbarsProps } from '../_data-table-toolbars';

/**
 * Figma "Size" — Large (1 line) = 52px rows, X-large (2 lines) = 72px, 2x-large (3 lines) = 92px.
 * The header row is always 52px.
 */
export type DataTableSize = 'large' | 'x-large' | '2x-large';

/** Element the title is rendered as. */
export type DataTableTitleElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';

/** Value a column can be sorted by (`DataTableColumn.sortAccessor`). */
export type DataTableSortValue = string | number | boolean | null | undefined;

/** Active sort. `null` = unsorted (Figma header item "Sorted=None"). */
export interface DataTableSortState {
  /** `DataTableColumn.id` of the sorted column. */
  columnId: string;
  /** Figma "Sorted" — also written to `aria-sort` on the `<th>`. */
  direction: 'ascending' | 'descending';
}

/** One column of the table — a header cell plus how every row renders its cell. */
export interface DataTableColumn<Row> {
  /** Stable id — React key, sort target and `data-column`. */
  id: string;
  /** Header label (Figma "Header text"). */
  header?: ReactNode;
  /**
   * Column width. A number is px. Omit to share the remaining space equally
   * (the table is `table-layout: fixed`).
   */
  width?: number | string;
  /** Figma content item "Content" for every cell of this column. @default 'text' */
  content?: DataTableContentType;
  /** Shorthand for the cell's primary text (Figma "Cell item text"). */
  accessor?: (row: Row, index: number) => ReactNode;
  /** Full control over the cell — merged over `{ size, content, text: accessor(row) }`. */
  cell?: (row: Row, index: number) => Partial<DataTableContentItemProps>;
  /** Figma header item: make the label a sort button. Implied by `sortAccessor`. */
  sortable?: boolean;
  /**
   * Value the column sorts by. When present (and `manualSorting` is off) `DataTable` sorts the
   * rows itself; without it the table only reports `onSortChange` and keeps the given order.
   */
  sortAccessor?: (row: Row) => DataTableSortValue;
  /** Figma header item "Filterable" — shows the filter button. */
  filterable?: boolean;
  /** Called when the header filter button is activated. */
  onFilterClick?: () => void;
  /** Figma header item "Show divider" — 1×28 rule at the trailing edge of the header cell. */
  showDivider?: boolean;
  /** Escape hatch for anything else on the `_DataTableHeaderItem`. */
  headerProps?: Partial<DataTableHeaderItemProps>;
}

/** Payload of `onRowReorder` (Figma "Draggable"). */
export interface DataTableRowReorder<Row> {
  /** Id of the row that moved. */
  rowId: string;
  /** The row that moved. */
  row: Row;
  /** Its index in `rows` before the move. */
  from: number;
  /** Its index in `rows` after the move. */
  to: number;
  /** `rows` with the move applied — assign it to your state. */
  rows: Row[];
}

export interface DataTableProps<Row>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onChange' | 'onSelect'> {
  /* ── Data ── */
  /** Column definitions, left to right (after the leading drag / expansion / selection columns). */
  columns: DataTableColumn<Row>[];
  /** Rows to render. With `manualPagination` these are the rows of the current page only. */
  rows: Row[];
  /** Stable id per row — used as React key and for selection / expansion state. */
  getRowId: (row: Row, index: number) => string;
  /** Figma "Size" — row height. @default 'large' */
  size?: DataTableSize;

  /* ── Title (Figma "Show title") ── */
  /** Title above the toolbar (Figma "Data table title"). */
  title?: ReactNode;
  /** Figma "Show title". @default `title !== undefined` */
  showTitle?: boolean;
  /** Element the title renders as. @default 'h2' */
  titleAs?: DataTableTitleElement;
  /** Content after the title (the Figma frame is a 4px-gap row). */
  titleTrailing?: ReactNode;

  /* ── Toolbar (Figma "Show toolbar") ── */
  /** Figma "Show toolbar". @default `toolbarProps !== undefined` */
  showToolbar?: boolean;
  /**
   * Props for `_DataTableToolbars`. `selectedCount` and `onCancel` are filled in from the table's
   * selection unless you set them yourself, so the bulk-actions bar appears as soon as a row is selected.
   */
  toolbarProps?: DataTableToolbarsProps;

  /* ── Pagination (Figma "Show pagnation") ── */
  /** Figma "Show pagnation" (sic). @default false */
  showPagination?: boolean;
  /** Current page, 1-based (controlled). */
  page?: number;
  /** Initial page when uncontrolled. @default 1 */
  defaultPage?: number;
  /** Rows per page (controlled). */
  pageSize?: number;
  /** Initial rows per page when uncontrolled. @default first `pageSizeOptions` entry */
  defaultPageSize?: number;
  /** Figma "Items per page" options. @default [10, 20, 50, 100] */
  pageSizeOptions?: number[];
  /** Called with the new 1-based page. */
  onPageChange?: (page: number) => void;
  /** Called with the new page size. */
  onPageSizeChange?: (pageSize: number) => void;
  /**
   * Total number of rows across all pages. Set it for server-side paging: `rows` is then treated as
   * the current page and is not sliced. @default `rows.length`
   */
  totalItems?: number;
  /** Don't slice `rows` — you page them yourself. @default `totalItems !== undefined` */
  manualPagination?: boolean;
  /** Anything else for `_DataTablePagination` (labels, `disabled`, `menuMaxHeight`…). */
  paginationProps?: Omit<
    DataTablePaginationProps,
    'page' | 'pageSize' | 'totalItems' | 'onPageChange' | 'onPageSizeChange' | 'pageSizeOptions'
  >;

  /* ── Selection (Figma "Selection") ── */
  /** Figma "Selection" ≠ None — adds the checkbox column. @default false */
  selectable?: boolean;
  /** Selected row ids (controlled). */
  selectedRowIds?: string[];
  /** Initially selected row ids when uncontrolled. @default [] */
  defaultSelectedRowIds?: string[];
  /** Called with the next selection. */
  onSelectedRowIdsChange?: (selectedRowIds: string[]) => void;
  /** Accessible name of the select-all checkbox. @default 'Select all rows' */
  selectAllLabel?: string;
  /** Accessible name of a row checkbox. @default 'Select row' */
  getRowSelectLabel?: (row: Row, index: number) => string;

  /* ── Expansion (Figma row "Expansion") ── */
  /** Adds the expander column. Rows that can't expand get Figma's "Indend" spacer. @default false */
  expandable?: boolean;
  /** Which rows can expand. @default all of them */
  isRowExpandable?: (row: Row, index: number) => boolean;
  /** Content of an expanded row (Figma "Expandable content"). */
  renderExpandedContent?: (row: Row, index: number) => ReactNode;
  /** Expanded row ids (controlled). */
  expandedRowIds?: string[];
  /** Initially expanded row ids when uncontrolled. @default [] */
  defaultExpandedRowIds?: string[];
  /** Called with the next expansion. */
  onExpandedRowIdsChange?: (expandedRowIds: string[]) => void;

  /* ── Drag (Figma "Draggable") ── */
  /** Figma "Draggable" — shows the drag-handle column. @default false */
  draggable?: boolean;
  /**
   * Called when a row is moved. Pointer drag-and-drop is left to the app (spread your DnD
   * library's listeners with `getRowProps`); the built-in keyboard reordering calls this too.
   */
  onRowReorder?: (reorder: DataTableRowReorder<Row>) => void;
  /** Accessible name of a drag handle. @default 'Drag to reorder row' */
  getRowDragLabel?: (row: Row, index: number) => string;

  /* ── Sorting ── */
  /** Active sort (controlled). `null` = unsorted. */
  sort?: DataTableSortState | null;
  /** Initial sort when uncontrolled. @default null */
  defaultSort?: DataTableSortState | null;
  /** Called with the next sort (none → ascending → descending → none). */
  onSortChange?: (sort: DataTableSortState | null) => void;
  /** Never sort `rows` internally — you sort them yourself. @default false */
  manualSorting?: boolean;

  /* ── Scroll (Figma "Show horizontal scroll" / "Show vertical scroll") ── */
  /** Figma "Show horizontal scroll". @default false */
  showHorizontalScroll?: boolean;
  /** Figma "Show vertical scroll". @default false */
  showVerticalScroll?: boolean;
  /** Minimum table width — with `showHorizontalScroll` it is what makes the table overflow. */
  minWidth?: number | string;
  /** Max height of the scroll viewport. @default the header + 10 rows Figma shows */
  maxHeight?: number | string;
  /** Keep the header row visible while the body scrolls. @default `showVerticalScroll` */
  stickyHeader?: boolean;

  /* ── States ── */
  /** Replace the rows with skeleton placeholders and mark the table busy. @default false */
  loading?: boolean;
  /** Number of skeleton rows while `loading`. @default 5 */
  skeletonRowCount?: number;
  /** Shown instead of the rows when there are none. @default the `emptyStateLabel` text */
  emptyState?: ReactNode;
  /** Default empty-state text. @default 'No data to display' */
  emptyStateLabel?: ReactNode;

  /* ── Rows ── */
  /** Makes rows activatable (click, Enter or Space). */
  onRowClick?: (row: Row, index: number, event: MouseEvent | KeyboardEvent) => void;

  /* ── a11y ── */
  /** Visually hidden `<caption>` for the table. */
  caption?: ReactNode;
  /** Accessible name of the table. Falls back to `caption`, then the title. */
  'aria-label'?: string;
}
