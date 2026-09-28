import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { DataTablePagination } from './DataTablePagination';
import type { DataTablePaginationProps } from './data-table-pagination.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Bars / Data table pagination (node 33899:18446, page "Data table")
 * One variant (no Figma variant properties) — `FigmaMatrix` renders it at the Figma width (825).
 * Private — composed by DataTable ("Show pagination"); in the table it fills the table width (1328).
 */

const FIGMA_WIDTH = 825;
const TABLE_WIDTH = 1328;

/* ── Layout helpers (story-only) ── */
const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 12, verticalAlign: 'top' };
const headCell: React.CSSProperties = {
  padding: 12,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};
const Frame = ({ children, width = TABLE_WIDTH }: { children: React.ReactNode; width?: number }) => (
  <div style={{ width }}>{children}</div>
);

/** Controlled wrapper — the bar is a controlled component, DataTable owns page / pageSize. */
function ControlledPagination({
  page: initialPage = 1,
  pageSize: initialPageSize = 10,
  onPageChange,
  onPageSizeChange,
  width = TABLE_WIDTH,
  ...rest
}: DataTablePaginationProps & { width?: number }) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  return (
    <Frame width={width}>
      <DataTablePagination
        {...rest}
        page={page}
        pageSize={pageSize}
        onPageChange={(p) => {
          setPage(p);
          onPageChange?.(p);
        }}
        onPageSizeChange={(s) => {
          setPageSize(s);
          onPageSizeChange?.(s);
        }}
      />
    </Frame>
  );
}

const meta: Meta<typeof DataTablePagination> = {
  title: 'Private/_DataTablePagination',
  component: DataTablePagination,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Rows per page, the visible range, a page picker and previous / next buttons. ' +
          'Controlled (`page` / `pageSize`) or uncontrolled (`defaultPage` / `defaultPageSize`). ' +
          'Changing the page size keeps the first visible row on screen.',
      },
    },
  },
  argTypes: {
    page: { control: { type: 'number', min: 1 } },
    pageSize: { control: { type: 'number', min: 1 } },
    totalItems: { control: { type: 'number', min: 0 } },
    pageSizeOptions: { control: 'object' },
    itemsPerPageLabel: { control: 'text' },
    pageLabel: { control: 'text' },
    previousLabel: { control: 'text' },
    nextLabel: { control: 'text' },
    disabled: { control: 'boolean' },
    rangeLabel: { control: false },
    pagesLabel: { control: false },
  },
  args: {
    page: 1,
    pageSize: 10,
    totalItems: 104,
    pageSizeOptions: [10, 20, 50, 100],
    itemsPerPageLabel: 'Items per page',
    disabled: false,
    onPageChange: fn(),
    onPageSizeChange: fn(),
  },
  render: (args) => <ControlledPagination {...args} />,
};
export default meta;

type Story = StoryObj<typeof DataTablePagination>;

/* ── Default ── */

export const Default: Story = {};

/* ── Figma variant ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (the single variant)',
  render: () => (
    <table style={table}>
      <tbody>
        <tr>
          <th style={headCell}>Data table pagination</th>
          <td style={cell}>
            <ControlledPagination totalItems={104} width={FIGMA_WIDTH} />
          </td>
        </tr>
      </tbody>
    </table>
  ),
};

export const InDataTableWidth: Story = {
  name: 'Table width (1328)',
  render: () => <ControlledPagination totalItems={104} />,
};

/* ── States ── */

const stateRows: { label: string; props: DataTablePaginationProps }[] = [
  { label: 'First page', props: { page: 1, pageSize: 10, totalItems: 104 } },
  { label: 'Middle page', props: { page: 5, pageSize: 10, totalItems: 104 } },
  { label: 'Last page', props: { page: 11, pageSize: 10, totalItems: 104 } },
  { label: 'Single page', props: { page: 1, pageSize: 10, totalItems: 4 } },
  { label: 'No items', props: { page: 1, pageSize: 10, totalItems: 0 } },
  { label: 'Large page size', props: { page: 1, pageSize: 100, totalItems: 10_400 } },
  { label: 'Disabled', props: { page: 3, pageSize: 10, totalItems: 104, disabled: true } },
];

export const AllStates: Story = {
  render: () => (
    <table style={table}>
      <tbody>
        {stateRows.map(({ label, props }) => (
          <tr key={label}>
            <th style={headCell}>{label}</th>
            <td style={cell}>
              <Frame width={FIGMA_WIDTH}>
                <DataTablePagination {...props} />
              </Frame>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const FirstPage: Story = { name: 'State: First page', args: { page: 1 } };
export const MiddlePage: Story = { name: 'State: Middle page', args: { page: 5 } };
export const LastPage: Story = { name: 'State: Last page', args: { page: 11 } };
export const Empty: Story = { name: 'State: No items', args: { totalItems: 0 } };
export const Disabled: Story = { name: 'State: Disabled', args: { disabled: true, page: 3 } };

/* ── Edge cases ── */

export const CustomLabels: Story = {
  name: 'Custom labels (i18n)',
  args: {
    itemsPerPageLabel: 'Zeilen pro Seite',
    rangeLabel: (start, end, total) => `${start}–${end} von ${total}`,
    pagesLabel: (totalPages) => `von ${totalPages} Seiten`,
    pageLabel: 'Seite',
    previousLabel: 'Vorherige Seite',
    nextLabel: 'Nächste Seite',
  },
};

export const Uncontrolled: Story = {
  name: 'Uncontrolled (defaultPage / defaultPageSize)',
  render: () => (
    <Frame>
      <DataTablePagination defaultPage={2} defaultPageSize={20} totalItems={104} />
    </Frame>
  ),
};

/* ── Play tests ── */

const onPageChange = fn();
const onPageSizeChange = fn();

export const PageChangeInteraction: Story = {
  name: 'Play: previous / next',
  render: () => <ControlledPagination totalItems={104} onPageChange={onPageChange} width={FIGMA_WIDTH} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    onPageChange.mockClear();
    const previous = canvas.getByRole('button', { name: 'Previous page' });
    const next = canvas.getByRole('button', { name: 'Next page' });

    await expect(previous).toBeDisabled();
    await expect(canvas.getByText('1–10 of 104 items')).toBeInTheDocument();

    await userEvent.click(next);
    await expect(onPageChange).toHaveBeenLastCalledWith(2);
    await expect(canvas.getByText('11–20 of 104 items')).toBeInTheDocument();
    await expect(previous).toBeEnabled();

    await userEvent.click(previous);
    await expect(onPageChange).toHaveBeenLastCalledWith(1);
    await expect(canvas.getByText('1–10 of 104 items')).toBeInTheDocument();
    /* Focus moves to the still-enabled button when the pressed one disables */
    await expect(next).toHaveFocus();
  },
};

export const PageDropdownInteraction: Story = {
  name: 'Play: page dropdown',
  render: () => <ControlledPagination totalItems={104} onPageChange={onPageChange} width={FIGMA_WIDTH} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    onPageChange.mockClear();
    await userEvent.click(canvas.getByRole('combobox', { name: 'Page' }));
    await userEvent.click(await canvas.findByRole('option', { name: '3' }));
    await expect(onPageChange).toHaveBeenLastCalledWith(3);
    await expect(canvas.getByText('21–30 of 104 items')).toBeInTheDocument();
  },
};

export const PageSizeInteraction: Story = {
  name: 'Play: items per page',
  render: () => (
    <ControlledPagination
      totalItems={104}
      page={3}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      width={FIGMA_WIDTH}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    onPageSizeChange.mockClear();
    onPageChange.mockClear();
    await expect(canvas.getByText('21–30 of 104 items')).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('combobox', { name: 'Items per page' }));
    await userEvent.click(await canvas.findByRole('option', { name: '20' }));

    await expect(onPageSizeChange).toHaveBeenLastCalledWith(20);
    /* The first visible row (21) stays visible → page 2 of 6 */
    await expect(onPageChange).toHaveBeenLastCalledWith(2);
    await expect(canvas.getByText('21–40 of 104 items')).toBeInTheDocument();
    await expect(canvas.getByText('of 6 pages')).toBeInTheDocument();
  },
};

export const KeyboardInteraction: Story = {
  name: 'Play: keyboard',
  render: () => <ControlledPagination totalItems={104} width={FIGMA_WIDTH} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const next = canvas.getByRole('button', { name: 'Next page' });
    next.focus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByText('11–20 of 104 items')).toBeInTheDocument();

    const pageSelect = canvas.getByRole('combobox', { name: 'Page' });
    pageSelect.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(pageSelect).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{Escape}');
    await expect(pageSelect).toHaveAttribute('aria-expanded', 'false');
  },
};
