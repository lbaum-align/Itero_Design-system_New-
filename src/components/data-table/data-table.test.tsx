import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { DataTable } from './DataTable';
import type { DataTableColumn, DataTableProps } from './data-table.types';

interface Row {
  id: string;
  name: string;
  status: string;
}

const ROWS: Row[] = [
  { id: 'r1', name: 'Carla', status: 'Completed' },
  { id: 'r2', name: 'Amelia', status: 'Draft' },
  { id: 'r3', name: 'Benjamin', status: 'In review' },
];

const COLUMNS: DataTableColumn<Row>[] = [
  { id: 'name', header: 'Patient', accessor: (row) => row.name, sortAccessor: (row) => row.name },
  { id: 'status', header: 'Status', accessor: (row) => row.status },
];

const manyRows = (count: number): Row[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `row-${index + 1}`,
    name: `Name ${index + 1}`,
    status: 'Draft',
  }));

const renderTable = (props: Partial<DataTableProps<Row>> = {}) =>
  render(
    <DataTable
      columns={COLUMNS}
      rows={ROWS}
      getRowId={(row) => row.id}
      aria-label="Patients"
      {...props}
    />,
  );

/** Body rows only (the header row is the first `role="row"`). */
const bodyRows = () => screen.getAllByRole('row').slice(1);

describe('DataTable', () => {
  /* ── Structure ── */

  it('renders a header cell per column and a row per row', () => {
    renderTable();
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    expect(screen.getByRole('columnheader', { name: 'Patient' })).toBeInTheDocument();
    expect(bodyRows()).toHaveLength(3);
    expect(screen.getByText('Carla')).toBeInTheDocument();
  });

  it('exposes the row and column counts and names the table', () => {
    renderTable();
    const table = screen.getByRole('table', { name: 'Patients' });
    expect(table).toHaveAttribute('aria-rowcount', '4');
    expect(table).toHaveAttribute('aria-colcount', '2');
    expect(bodyRows()[0]).toHaveAttribute('aria-rowindex', '2');
  });

  it('names the table from the visually hidden caption, and from the title when there is none', () => {
    const { unmount } = renderTable({ caption: 'All patients', 'aria-label': undefined });
    expect(screen.getByRole('table', { name: 'All patients' })).toBeInTheDocument();
    unmount();

    renderTable({ title: 'Patients 2026', 'aria-label': undefined });
    expect(screen.getByRole('table', { name: 'Patients 2026' })).toBeInTheDocument();
  });

  it('renders the title only when asked (Figma "Show title")', () => {
    const { unmount } = renderTable({ title: 'Data table title' });
    expect(screen.getByRole('heading', { name: 'Data table title' })).toBeInTheDocument();
    unmount();

    renderTable({ title: 'Data table title', showTitle: false });
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders the toolbar and the pagination only when asked', () => {
    renderTable({
      showToolbar: true,
      toolbarProps: { actions: [{ id: 'add', label: 'Add' }] },
      showPagination: true,
    });
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });

  it('gives every column a fixed width slot, including the leading control columns', () => {
    const { container } = renderTable({ selectable: true, draggable: true, expandable: true });
    expect(container.querySelectorAll('colgroup > col')).toHaveLength(5);
    expect(container.querySelector('table')).toHaveClass('table-fixed');
  });

  /* ── Size (Figma "Size") ── */

  it.each([
    ['large', 'row-height-lg'],
    ['x-large', 'row-height-xl'],
    ['2x-large', 'row-height-2xl'],
  ] as const)('applies the %s row height', (size, token) => {
    const { container } = renderTable({ size });
    expect(container.querySelector('tbody tr')?.className).toContain(token);
  });

  /* ── Selection (Figma "Selection") ── */

  it('has no selection column by default', () => {
    renderTable();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(bodyRows()[0]).not.toHaveAttribute('aria-selected');
  });

  it('selects a row and reports the next selection', () => {
    const onSelectedRowIdsChange = vi.fn();
    renderTable({ selectable: true, onSelectedRowIdsChange });

    fireEvent.click(screen.getAllByRole('checkbox', { name: 'Select row' })[0]!);
    expect(onSelectedRowIdsChange).toHaveBeenCalledWith(['r1']);
    expect(bodyRows()[0]).toHaveAttribute('aria-selected', 'true');
    expect(bodyRows()[1]).toHaveAttribute('aria-selected', 'false');
  });

  it('shows the select-all checkbox as indeterminate for a partial selection', () => {
    renderTable({ selectable: true, defaultSelectedRowIds: ['r1'] });
    const selectAll = screen.getByRole('checkbox', { name: 'Select all rows' });
    expect(selectAll).toHaveAttribute('aria-checked', 'mixed');
  });

  it('selects and clears every row from the header checkbox', () => {
    const onSelectedRowIdsChange = vi.fn();
    renderTable({ selectable: true, onSelectedRowIdsChange });
    const selectAll = screen.getByRole('checkbox', { name: 'Select all rows' });

    fireEvent.click(selectAll);
    expect(onSelectedRowIdsChange).toHaveBeenLastCalledWith(['r1', 'r2', 'r3']);
    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toBeChecked();

    fireEvent.click(selectAll);
    expect(onSelectedRowIdsChange).toHaveBeenLastCalledWith([]);
  });

  it('keeps a controlled selection under the caller’s control', () => {
    const onSelectedRowIdsChange = vi.fn();
    renderTable({ selectable: true, selectedRowIds: ['r2'], onSelectedRowIdsChange });
    expect(bodyRows()[1]).toHaveAttribute('aria-selected', 'true');

    fireEvent.click(screen.getAllByRole('checkbox', { name: 'Select row' })[0]!);
    expect(onSelectedRowIdsChange).toHaveBeenCalledWith(['r2', 'r1']);
    expect(bodyRows()[0]).toHaveAttribute('aria-selected', 'false');
  });

  it('uses a per-row checkbox label when one is given', () => {
    renderTable({ selectable: true, getRowSelectLabel: (row) => `Select ${row.name}` });
    expect(screen.getByRole('checkbox', { name: 'Select Carla' })).toBeInTheDocument();
  });

  /* ── Sorting ── */

  it('cycles the sort none → ascending → descending → none and sorts the rows', () => {
    const onSortChange = vi.fn();
    renderTable({ onSortChange });
    const header = screen.getByRole('columnheader', { name: /Patient/ });
    expect(header).toHaveAttribute('aria-sort', 'none');

    fireEvent.click(within(header).getByRole('button'));
    expect(onSortChange).toHaveBeenLastCalledWith({ columnId: 'name', direction: 'ascending' });
    expect(screen.getByRole('columnheader', { name: /Patient/ })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
    expect(within(bodyRows()[0]!).getByText('Amelia')).toBeInTheDocument();

    fireEvent.click(within(screen.getByRole('columnheader', { name: /Patient/ })).getByRole('button'));
    expect(onSortChange).toHaveBeenLastCalledWith({ columnId: 'name', direction: 'descending' });
    expect(within(bodyRows()[0]!).getByText('Carla')).toBeInTheDocument();

    fireEvent.click(within(screen.getByRole('columnheader', { name: /Patient/ })).getByRole('button'));
    expect(onSortChange).toHaveBeenLastCalledWith(null);
  });

  it('does not sort the rows itself when manualSorting is set', () => {
    renderTable({ manualSorting: true, defaultSort: { columnId: 'name', direction: 'ascending' } });
    expect(within(bodyRows()[0]!).getByText('Carla')).toBeInTheDocument();
  });

  it('only makes columns with a sort accessor (or sortable) a button', () => {
    renderTable();
    const status = screen.getByRole('columnheader', { name: 'Status' });
    expect(within(status).queryByRole('button')).not.toBeInTheDocument();
  });

  /* ── Expansion ── */

  it('expands a row and links the expanded content to the expander', () => {
    const onExpandedRowIdsChange = vi.fn();
    const { container } = renderTable({
      expandable: true,
      onExpandedRowIdsChange,
      renderExpandedContent: (row) => <span>Details for {row.name}</span>,
    });

    fireEvent.click(screen.getAllByRole('button', { name: 'Expand row' })[0]!);
    expect(onExpandedRowIdsChange).toHaveBeenCalledWith(['r1']);
    expect(screen.getByText('Details for Carla')).toBeInTheDocument();
    expect(container.querySelector('[data-data-table-row="expanded-content"]')).toBeInTheDocument();
  });

  it('gives rows that cannot expand the Figma "Indend" spacer instead of an expander', () => {
    renderTable({ expandable: true, isRowExpandable: (row) => row.id !== 'r2' });
    expect(bodyRows()[1]).toHaveAttribute('data-expansion', 'indend');
    expect(bodyRows()[0]).toHaveAttribute('data-expansion', 'collapsed');
  });

  /* ── Pagination ── */

  it('pages the rows and keeps the pagination in step', () => {
    const onPageChange = vi.fn();
    renderTable({ rows: manyRows(24), showPagination: true, defaultPageSize: 10, onPageChange });
    expect(bodyRows()).toHaveLength(10);
    expect(screen.getByText('Name 1')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(screen.getByText('Name 11')).toBeInTheDocument();
    expect(screen.queryByText('Name 1')).not.toBeInTheDocument();
  });

  it('treats the rows as a single page when totalItems is given (server paging)', () => {
    renderTable({ rows: manyRows(10), showPagination: true, totalItems: 120, defaultPageSize: 10 });
    expect(bodyRows()).toHaveLength(10);
    expect(screen.getByRole('table')).toHaveAttribute('aria-rowcount', '121');
  });

  /* ── Drag (Figma "Draggable") ── */

  it('shows the drag handle only when draggable', () => {
    const { unmount } = renderTable();
    expect(screen.queryByRole('button', { name: 'Drag to reorder row' })).not.toBeInTheDocument();
    unmount();

    renderTable({ draggable: true });
    expect(screen.getAllByRole('button', { name: 'Drag to reorder row' })).toHaveLength(3);
  });

  it('reorders a grabbed row with the arrow keys', () => {
    const onRowReorder = vi.fn();
    renderTable({ draggable: true, onRowReorder });
    const handle = screen.getAllByRole('button', { name: 'Drag to reorder row' })[0]!;

    /* Arrow keys do nothing until the row is grabbed */
    fireEvent.keyDown(handle, { key: 'ArrowDown' });
    expect(onRowReorder).not.toHaveBeenCalled();

    fireEvent.keyDown(handle, { key: ' ' });
    fireEvent.keyDown(handle, { key: 'ArrowDown' });
    expect(onRowReorder).toHaveBeenCalledWith(
      expect.objectContaining({ rowId: 'r1', from: 0, to: 1 }),
    );
    expect(onRowReorder.mock.calls[0]![0].rows.map((row: Row) => row.id)).toEqual([
      'r2',
      'r1',
      'r3',
    ]);

    /* Escape releases the row */
    fireEvent.keyDown(handle, { key: 'Escape' });
    fireEvent.keyDown(handle, { key: 'ArrowDown' });
    expect(onRowReorder).toHaveBeenCalledTimes(1);
  });

  it('never moves a row past the ends of the list', () => {
    const onRowReorder = vi.fn();
    renderTable({ draggable: true, onRowReorder });
    const handle = screen.getAllByRole('button', { name: 'Drag to reorder row' })[0]!;
    fireEvent.keyDown(handle, { key: ' ' });
    fireEvent.keyDown(handle, { key: 'ArrowUp' });
    expect(onRowReorder).not.toHaveBeenCalled();
  });

  /* ── Rows ── */

  it('activates a row with the pointer and the keyboard when onRowClick is given', () => {
    const onRowClick = vi.fn();
    renderTable({ onRowClick });
    const row = bodyRows()[0]!;
    expect(row).toHaveAttribute('tabindex', '0');

    fireEvent.click(row);
    fireEvent.keyDown(row, { key: 'Enter' });
    expect(onRowClick).toHaveBeenCalledTimes(2);
    expect(onRowClick.mock.calls[0]![0]).toEqual(ROWS[0]);
  });

  /* ── Empty / loading ── */

  it('renders the empty state instead of rows', () => {
    const { unmount } = renderTable({ rows: [] });
    expect(screen.getByText('No data to display')).toBeInTheDocument();
    unmount();

    renderTable({ rows: [], emptyState: <span>Nothing here</span> });
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('marks the table busy and renders skeleton rows while loading', () => {
    const { container } = renderTable({ loading: true, skeletonRowCount: 4 });
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
    expect(container.querySelectorAll('tbody tr[data-skeleton]')).toHaveLength(4);
    expect(screen.queryByText('Carla')).not.toBeInTheDocument();
  });

  /* ── Scroll (Figma "Show horizontal / vertical scroll") ── */

  it('wraps the table in a scroll region only when a scroll is enabled', () => {
    const { unmount } = renderTable();
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
    unmount();

    renderTable({ showVerticalScroll: true, title: 'Patients' });
    const region = screen.getByRole('region', { name: 'Patients' });
    expect(region).toHaveAttribute('data-orientation', 'vertical');
    expect(region.style.maxHeight).toContain('--scanner-data-table-viewport-height-lg');
  });

  it('scrolls both ways when both Figma scroll booleans are on', () => {
    renderTable({ showHorizontalScroll: true, showVerticalScroll: true, minWidth: 1600 });
    expect(screen.getByRole('region')).toHaveAttribute('data-orientation', 'both');
    expect(screen.getByRole('table').style.minWidth).toBe('1600px');
  });

  it('sticks the header cells while the body scrolls', () => {
    const { container } = renderTable({ showVerticalScroll: true });
    expect(container.querySelector('thead tr')?.className).toContain('[&>*]:sticky');
  });

  /* ── Toolbar wiring ── */

  it('switches the toolbar to bulk actions as soon as a row is selected, and cancel clears it', () => {
    renderTable({
      selectable: true,
      showToolbar: true,
      toolbarProps: { bulkActionItems: [{ id: 'archive', label: 'Archive' }] },
    });
    expect(screen.queryByRole('button', { name: 'Archive' })).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('checkbox', { name: 'Select row' })[0]!);
    expect(screen.getByText('1 item selected')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Archive' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByText('1 item selected')).not.toBeInTheDocument();
  });

  /* ── Plumbing ── */

  it('forwards the ref and merges className', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <DataTable
        ref={ref}
        columns={COLUMNS}
        rows={ROWS}
        getRowId={(row) => row.id}
        aria-label="Patients"
        className="custom-class"
      />,
    );
    expect(ref.current).toBe(container.firstChild);
    expect(ref.current).toHaveClass('custom-class');
    expect(ref.current).toHaveClass('flex');
  });

  it('reflects the Figma variant values as data attributes', () => {
    const { container } = renderTable({
      size: 'x-large',
      selectable: true,
      defaultSelectedRowIds: ['r1'],
      draggable: true,
    });
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute('data-size', 'x-large');
    expect(root).toHaveAttribute('data-selection', 'selected');
    expect(root).toHaveAttribute('data-draggable', 'true');
  });
});
