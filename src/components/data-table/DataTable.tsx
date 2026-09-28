import { forwardRef, useCallback, useId, useMemo, useState } from 'react';
import type {
  CSSProperties,
  ForwardedRef,
  KeyboardEvent,
  ReactElement,
  ReactNode,
  RefAttributes,
} from 'react';
import { cn } from '../../utils/cn';
import { DataTableContentItem } from '../_data-table-content-item';
import { DataTableContentRow } from '../_data-table-content-row';
import { DataTableHeaderItem } from '../_data-table-header-item';
import { DataTableHeaderRow } from '../_data-table-header-row';
import { DataTablePagination } from '../_data-table-pagination';
import { DataTableToolbars } from '../_data-table-toolbars';
import { ScrollArea } from '../scroll';
import type { DataTableSortDirection } from '../_data-table-header-item';
import type {
  DataTableProps,
  DataTableSize,
  DataTableSortState,
  DataTableSortValue,
} from './data-table.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Data table (node 30943:10418, page "Data table")
 * Size (Large (1 line), X-large (2 lines), 2x-large (3 lines)) × Selection (None, Unselected,
 * Selected) × Draggable (False, True) = 18 variants, plus the booleans Show title, Show toolbar,
 * Show pagnation (sic), Show horizontal scroll, Show vertical scroll.
 *
 * Layout (Figma root: vertical auto-layout, 16px gap, children fill the width):
 *   "Header" (title, 24px, 4px gap) → "Toolbar" (_DataTableToolbars, 60px)
 *   → "Data table" (header row + rows; the vertical Scroll is pinned 8px inset to its right edge)
 *   → "Horizontal scroll" (Scroll, 4px) → "Bars / Data table pagination" (60px).
 * Both bars are full width and sit outside the table's rules — the table itself has no outer border;
 * only the 1px `border-subtle` rule under the header row and under every content row.
 *
 * The table is a real `<table>` with `table-layout: fixed` + `<colgroup>`, so the 16px inter-cell
 * gap the rows apply as cell padding still lines every column up.
 */

/* ------------------------------------------------------------------ */
/*  Config                                                            */
/* ------------------------------------------------------------------ */

const rowHeight: Record<DataTableSize, string> = {
  large: 'h-[var(--scanner-data-table-row-height-lg)]',
  'x-large': 'h-[var(--scanner-data-table-row-height-xl)]',
  '2x-large': 'h-[var(--scanner-data-table-row-height-2xl)]',
};

/** Figma keeps the 52px header + 10 rows visible and overflows the rest ("Show vertical scroll"). */
const viewportHeight: Record<DataTableSize, string> = {
  large: 'var(--scanner-data-table-viewport-height-lg)',
  'x-large': 'var(--scanner-data-table-viewport-height-xl)',
  '2x-large': 'var(--scanner-data-table-viewport-height-2xl)',
};

/** The rows feed their 16px gap to the cells through this variable; the first cell zeroes it. */
const rowGapStyle = {
  '--scanner-data-table-cell-gap': 'var(--scanner-spacing-5)',
} as CSSProperties;
const gapCells = '[&>*:first-child]:[--scanner-data-table-cell-gap:0px]';
const borderCells =
  '[&>*]:shadow-[inset_0_calc(var(--scanner-data-table-row-border-width)*-1)_0_0_var(--scanner-border-subtle)]';

const CONTROL_WIDTH = 'var(--scanner-data-table-control-width)';
const CELL_GAP = 'var(--scanner-spacing-5)';

const titleText = cn(
  'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-medium)]',
  'text-[length:var(--scanner-text-base)] leading-[var(--scanner-leading-md)]',
  'text-[color:var(--scanner-text-primary)]',
);

const bodyText = cn(
  'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
  'text-[length:var(--scanner-text-scanner-md)] leading-[var(--scanner-leading-lg)]',
);

/** Sticky header: the `th`/`td` elements stick, because a `tr` can't. */
const stickyHeaderCells =
  '[&>*]:sticky [&>*]:top-0 [&>*]:z-[1] [&>*]:bg-[var(--scanner-bg-layer-01)]';

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

/** Controlled when `value` is not `undefined`, uncontrolled otherwise. */
function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (next: T) => void) {
  const [internal, setInternal] = useState<T>(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : internal;
  const set = useCallback(
    (next: T) => {
      if (!controlled) setInternal(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [current, set] as const;
}

function compareValues(a: DataTableSortValue, b: DataTableSortValue): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return -1;
  if (b === null || b === undefined) return 1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

const toPx = (value: number | string | undefined) =>
  typeof value === 'number' ? `${value}px` : value;

/** The header item cycles none → ascending → descending → none; "none" clears the sort. */
const nextSortState = (
  columnId: string,
  direction: DataTableSortDirection,
): DataTableSortState | null => (direction === 'none' ? null : { columnId, direction });

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

function DataTableInner<Row>(props: DataTableProps<Row>, ref: ForwardedRef<HTMLDivElement>) {
  const {
    columns,
    rows,
    getRowId,
    size = 'large',

    title,
    showTitle = title !== undefined,
    titleAs: TitleTag = 'h2',
    titleTrailing,

    showToolbar = props.toolbarProps !== undefined,
    toolbarProps,

    showPagination = false,
    page,
    defaultPage = 1,
    pageSize,
    defaultPageSize,
    pageSizeOptions,
    onPageChange,
    onPageSizeChange,
    totalItems,
    manualPagination = totalItems !== undefined,
    paginationProps,

    selectable = false,
    selectedRowIds,
    defaultSelectedRowIds,
    onSelectedRowIdsChange,
    selectAllLabel = 'Select all rows',
    getRowSelectLabel,

    expandable = false,
    isRowExpandable,
    renderExpandedContent,
    expandedRowIds,
    defaultExpandedRowIds,
    onExpandedRowIdsChange,

    draggable = false,
    onRowReorder,
    getRowDragLabel,

    sort,
    defaultSort = null,
    onSortChange,
    manualSorting = false,

    showHorizontalScroll = false,
    showVerticalScroll = false,
    minWidth,
    maxHeight,
    stickyHeader = showVerticalScroll,

    loading = false,
    skeletonRowCount = 5,
    emptyState,
    emptyStateLabel = 'No data to display',

    onRowClick,

    caption,
    'aria-label': ariaLabel,
    className,
    style,
    ...rest
  } = props;

  const baseId = useId();
  const titleId = `${baseId}-title`;

  /* ── State ── */
  const [sortState, setSortState] = useControllable(sort, defaultSort, onSortChange);
  const [selected, setSelected] = useControllable<string[]>(
    selectedRowIds,
    defaultSelectedRowIds ?? [],
    onSelectedRowIdsChange,
  );
  const [expanded, setExpanded] = useControllable<string[]>(
    expandedRowIds,
    defaultExpandedRowIds ?? [],
    onExpandedRowIdsChange,
  );
  const [currentPage, setCurrentPage] = useControllable(page, defaultPage, onPageChange);
  const [currentPageSize, setCurrentPageSize] = useControllable(
    pageSize,
    defaultPageSize ?? pageSizeOptions?.[0] ?? 10,
    onPageSizeChange,
  );
  /** Row currently "picked up" with the keyboard (Space/Enter on the drag handle). */
  const [grabbedRowId, setGrabbedRowId] = useState<string | null>(null);
  const [reorderMessage, setReorderMessage] = useState('');

  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const expandedSet = useMemo(() => new Set(expanded), [expanded]);

  /** Row → id, so sorting and paging never change a row's identity. */
  const rowIds = useMemo(() => {
    const map = new Map<Row, string>();
    rows.forEach((row, index) => map.set(row, getRowId(row, index)));
    return map;
  }, [rows, getRowId]);
  const idOf = useCallback(
    (row: Row, index: number) => rowIds.get(row) ?? getRowId(row, index),
    [rowIds, getRowId],
  );

  /* ── Sorting ── */
  const sortedRows = useMemo(() => {
    if (manualSorting || !sortState) return rows;
    const column = columns.find((item) => item.id === sortState.columnId);
    if (!column?.sortAccessor) return rows;
    const accessor = column.sortAccessor;
    const direction = sortState.direction === 'ascending' ? 1 : -1;
    return [...rows].sort((a, b) => compareValues(accessor(a), accessor(b)) * direction);
  }, [rows, columns, sortState, manualSorting]);

  /* ── Pagination ── */
  const totalCount = totalItems ?? sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(currentPageSize, 1)));
  const activePage = Math.min(Math.max(currentPage, 1), totalPages);
  const pageOffset = manualPagination || !showPagination ? 0 : (activePage - 1) * currentPageSize;
  const pageRows = useMemo(
    () =>
      manualPagination || !showPagination
        ? sortedRows
        : sortedRows.slice(pageOffset, pageOffset + currentPageSize),
    [sortedRows, manualPagination, showPagination, pageOffset, currentPageSize],
  );

  const pageRowIds = useMemo(
    () => pageRows.map((row, index) => idOf(row, index)),
    [pageRows, idOf],
  );

  /* ── Selection ── */
  const allPageSelected =
    pageRowIds.length > 0 && pageRowIds.every((rowId) => selectedSet.has(rowId));
  const somePageSelected = pageRowIds.some((rowId) => selectedSet.has(rowId));
  const headerSelection = !selectable
    ? 'none'
    : allPageSelected
      ? 'selected'
      : somePageSelected
        ? 'indeterminate'
        : 'unselected';

  /** Select-all covers the rows currently on screen, like Figma's 2-of-10 indeterminate header. */
  const toggleAll = useCallback(
    (checked: boolean) => {
      const onPage = new Set(pageRowIds);
      setSelected(
        checked
          ? [...selected, ...pageRowIds.filter((rowId) => !selectedSet.has(rowId))]
          : selected.filter((rowId) => !onPage.has(rowId)),
      );
    },
    [pageRowIds, selected, selectedSet, setSelected],
  );

  const toggleRow = useCallback(
    (rowId: string, checked: boolean) =>
      setSelected(checked ? [...selected, rowId] : selected.filter((item) => item !== rowId)),
    [selected, setSelected],
  );

  const toggleExpanded = useCallback(
    (rowId: string, open: boolean) =>
      setExpanded(open ? [...expanded, rowId] : expanded.filter((item) => item !== rowId)),
    [expanded, setExpanded],
  );

  /* ── Keyboard reordering ── */
  const moveRow = useCallback(
    (row: Row, rowId: string, delta: number) => {
      const from = rows.indexOf(row);
      const to = from + delta;
      if (from < 0 || to < 0 || to >= rows.length) return;
      const next = rows.filter((_, index) => index !== from);
      next.splice(to, 0, row);
      setReorderMessage(`Row moved to position ${to + 1} of ${rows.length}.`);
      onRowReorder?.({ rowId, row, from, to, rows: next });
    },
    [rows, onRowReorder],
  );

  const handleRowKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTableRowElement>, row: Row, rowId: string, index: number) => {
      const target = event.target as HTMLElement;
      const inDragCell = !!target.closest?.('[data-data-table-item="drag"]');

      if (draggable && inDragCell && grabbedRowId === rowId) {
        if (event.key === 'Escape') {
          event.preventDefault();
          setGrabbedRowId(null);
          setReorderMessage('Reordering cancelled.');
          return;
        }
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          event.preventDefault();
          moveRow(row, rowId, event.key === 'ArrowUp' ? -1 : 1);
          return;
        }
      }

      if (onRowClick && target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        onRowClick(row, index, event);
      }
    },
    [draggable, grabbedRowId, moveRow, onRowClick],
  );

  /* ── Layout ── */
  const leadingColumns = (draggable ? 1 : 0) + (expandable ? 1 : 0) + (selectable ? 1 : 0);
  const columnCount = leadingColumns + columns.length;

  /** With `table-layout: fixed` the `<col>` width is the border box, so it carries the 16px gap. */
  const colWidth = (index: number, base: string | undefined) => {
    if (!base) return undefined;
    return index === 0 ? base : `calc(${base} + ${CELL_GAP})`;
  };

  const scrolls = showHorizontalScroll || showVerticalScroll;
  const orientation =
    showHorizontalScroll && showVerticalScroll
      ? 'both'
      : showHorizontalScroll
        ? 'horizontal'
        : 'vertical';

  /* ── Rows ── */
  const renderedRows: ReactNode[] = loading
    ? Array.from({ length: Math.max(skeletonRowCount, 1) }, (_, index) => (
        <tr
          key={`skeleton-${index}`}
          aria-hidden="true"
          data-skeleton=""
          style={rowGapStyle}
          className={cn(rowHeight[size], gapCells, borderCells)}
        >
          {Array.from({ length: leadingColumns }, (_, lead) => (
            <td
              key={`lead-${lead}`}
              className="box-content w-[var(--scanner-data-table-control-width)] p-0 pl-[var(--scanner-data-table-cell-gap,0px)]"
            />
          ))}
          {columns.map((column) => (
            <td
              key={column.id}
              className="p-0 pl-[var(--scanner-data-table-cell-gap,0px)] pr-[var(--scanner-spacing-5)]"
            >
              <span className="block h-[var(--scanner-leading-md)] animate-pulse rounded-[var(--scanner-radius-sm)] bg-[var(--scanner-bg-highlight-gray)]" />
            </td>
          ))}
        </tr>
      ))
    : pageRows.map((row, index) => {
        const rowId = idOf(row, index);
        const canExpand = expandable && (isRowExpandable ? isRowExpandable(row, index) : true);
        const isExpanded = canExpand && expandedSet.has(rowId);

        return (
          <DataTableContentRow
            key={rowId}
            size={size}
            aria-rowindex={pageOffset + index + 2}
            data-row-id={rowId}
            data-grabbed={grabbedRowId === rowId || undefined}
            selection={
              selectable ? (selectedSet.has(rowId) ? 'selected' : 'unselected') : 'none'
            }
            onSelectionChange={(checked) => toggleRow(rowId, checked)}
            selectLabel={getRowSelectLabel?.(row, index)}
            expansion={!expandable ? 'none' : canExpand ? (isExpanded ? 'expanded' : 'collapsed') : 'indend'}
            onExpandedChange={(open) => toggleExpanded(rowId, open)}
            expandedContent={renderExpandedContent?.(row, index)}
            expandedContentId={`${baseId}-expanded-${index}`}
            draggable={draggable}
            onDragHandleActivate={() => {
              setGrabbedRowId((current) => (current === rowId ? null : rowId));
              setReorderMessage(
                grabbedRowId === rowId
                  ? 'Row dropped.'
                  : 'Row grabbed. Use the arrow keys to move it, Escape to cancel.',
              );
            }}
            dragLabel={getRowDragLabel?.(row, index)}
            columnCount={columns.length}
            tabIndex={onRowClick ? 0 : undefined}
            onClick={onRowClick ? (event) => onRowClick(row, index, event) : undefined}
            onKeyDown={(event) => handleRowKeyDown(event, row, rowId, index)}
            className={onRowClick ? 'cursor-pointer outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--scanner-border-focus)]' : undefined}
          >
            {columns.map((column) => (
              <DataTableContentItem
                key={column.id}
                data-column={column.id}
                size={size}
                content={column.content ?? 'text'}
                text={column.accessor?.(row, index)}
                {...column.cell?.(row, index)}
              />
            ))}
          </DataTableContentRow>
        );
      });

  const isEmpty = !loading && pageRows.length === 0;

  /* ── Table ── */
  const table = (
    <table
      aria-label={ariaLabel}
      aria-labelledby={!ariaLabel && caption === undefined && showTitle ? titleId : undefined}
      aria-rowcount={totalCount + 1}
      aria-colcount={columnCount}
      aria-busy={loading || undefined}
      data-size={size}
      style={{ minWidth: toPx(minWidth) }}
      className="w-full table-fixed border-separate border-spacing-0 text-left"
    >
      {caption !== undefined && <caption className="sr-only">{caption}</caption>}

      <colgroup>
        {Array.from({ length: leadingColumns }, (_, index) => (
          <col key={`control-${index}`} style={{ width: colWidth(index, CONTROL_WIDTH) }} />
        ))}
        {columns.map((column, index) => (
          <col
            key={column.id}
            style={{ width: colWidth(leadingColumns + index, toPx(column.width)) }}
          />
        ))}
      </colgroup>

      <thead>
        <DataTableHeaderRow
          aria-rowindex={1}
          selection={headerSelection}
          onSelectionChange={toggleAll}
          selectAllLabel={selectAllLabel}
          expansion={expandable ? 'indend' : 'none'}
          draggable={draggable}
          className={cn(stickyHeader && stickyHeaderCells)}
        >
          {columns.map((column) => {
            const sorted: DataTableSortDirection =
              sortState?.columnId === column.id ? sortState.direction : 'none';
            return (
              <DataTableHeaderItem
                key={column.id}
                data-column={column.id}
                sortable={column.sortable ?? !!column.sortAccessor}
                sorted={sorted}
                onSortChange={(direction) => setSortState(nextSortState(column.id, direction))}
                filterable={column.filterable}
                onFilterClick={column.onFilterClick}
                showDivider={column.showDivider}
                {...column.headerProps}
              >
                {column.header}
              </DataTableHeaderItem>
            );
          })}
        </DataTableHeaderRow>
      </thead>

      <tbody>
        {isEmpty ? (
          <tr data-empty="">
            <td colSpan={columnCount} className="p-0">
              <div
                className={cn(
                  'flex flex-col items-center justify-center gap-[var(--scanner-spacing-3)]',
                  'py-[var(--scanner-spacing-9)] text-center',
                  bodyText,
                  'text-[color:var(--scanner-text-secondary)]',
                )}
              >
                {emptyState ?? emptyStateLabel}
              </div>
            </td>
          </tr>
        ) : (
          renderedRows
        )}
      </tbody>
    </table>
  );

  return (
    <div
      ref={ref}
      data-size={size}
      data-selection={selectable ? (selected.length > 0 ? 'selected' : 'unselected') : 'none'}
      data-draggable={draggable || undefined}
      className={cn('flex w-full flex-col gap-[var(--scanner-spacing-5)]', className)}
      style={style}
      {...rest}
    >
      {showTitle && (
        <div
          data-part="title"
          className="flex w-full items-center gap-[var(--scanner-spacing-2)]"
        >
          <TitleTag id={titleId} className={cn(titleText, 'm-0')}>
            {title}
          </TitleTag>
          {titleTrailing}
        </div>
      )}

      {showToolbar && (
        <DataTableToolbars
          selectedCount={selectable ? selected.length : 0}
          onCancel={selectable ? () => setSelected([]) : undefined}
          {...toolbarProps}
        />
      )}

      {scrolls ? (
        <ScrollArea
          data-part="viewport"
          orientation={orientation}
          role="region"
          aria-label={ariaLabel ?? (typeof title === 'string' ? title : 'Table')}
          className="w-full"
          style={{
            maxHeight: showVerticalScroll ? (toPx(maxHeight) ?? viewportHeight[size]) : undefined,
          }}
        >
          {table}
        </ScrollArea>
      ) : (
        <div data-part="viewport" className="w-full">
          {table}
        </div>
      )}

      {showPagination && (
        <DataTablePagination
          page={activePage}
          pageSize={currentPageSize}
          totalItems={totalCount}
          pageSizeOptions={pageSizeOptions}
          onPageChange={setCurrentPage}
          onPageSizeChange={setCurrentPageSize}
          {...paginationProps}
        />
      )}

      {draggable && (
        <span aria-live="polite" className="sr-only">
          {reorderMessage}
        </span>
      )}
    </div>
  );
}

/** `forwardRef` loses the generic, so the ref-forwarding component is re-typed as a generic one. */
interface DataTableComponent {
  <Row>(props: DataTableProps<Row> & RefAttributes<HTMLDivElement>): ReactElement | null;
  displayName?: string;
}

/**
 * Scanner DataTable — the full table composition: title, toolbar, the table itself and pagination.
 *
 * Figma props → React:
 * - Size → `size`, Selection (None / Unselected / Selected) → `selectable` + `selectedRowIds`,
 *   Draggable → `draggable`
 * - Show title → `title` / `showTitle`, Show toolbar → `showToolbar` + `toolbarProps`,
 *   Show pagnation → `showPagination`, Show horizontal / vertical scroll → `showHorizontalScroll`
 *   / `showVerticalScroll`
 *
 * Selection, sorting, expansion and pagination each work controlled or uncontrolled.
 * The table sorts and pages `rows` itself unless you set `manualSorting` / `manualPagination`.
 * Pointer drag-and-drop is left to the app (`onRowReorder` + the handle); the handle is
 * keyboard-operable: Space/Enter grabs the row, arrows move it, Escape cancels.
 *
 * @example
 * <DataTable
 *   title="Patients"
 *   rows={patients}
 *   getRowId={(patient) => patient.id}
 *   columns={[
 *     { id: 'name', header: 'Patient', accessor: (p) => p.name, sortAccessor: (p) => p.name },
 *     { id: 'status', header: 'Status', content: 'badge', cell: (p) => ({ text: p.status }) },
 *   ]}
 *   selectable
 *   showToolbar
 *   showPagination
 * />
 */
export const DataTable = forwardRef(DataTableInner) as DataTableComponent;

DataTable.displayName = 'DataTable';
