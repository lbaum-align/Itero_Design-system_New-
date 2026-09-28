import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { DataTable } from './DataTable';
import type { DataTableColumn, DataTableProps, DataTableSize } from './data-table.types';
import type { BadgeStatus } from '../badge';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Data table (node 30943:10418, page "Data table")
 * Size (Large (1 line) / X-large (2 lines) / 2x-large (3 lines)) × Selection (None / Unselected /
 * Selected) × Draggable (False / True) = 18 variants — every one is rendered in `FigmaMatrix` —
 * plus the booleans Show title, Show toolbar, Show pagnation (sic), Show horizontal scroll and
 * Show vertical scroll, each of which has its own story and its own control in `Default`.
 */

/* ------------------------------------------------------------------ */
/*  Demo data                                                         */
/* ------------------------------------------------------------------ */

interface Patient {
  id: string;
  name: string;
  chart: string;
  scan: string;
  status: BadgeStatus;
  statusLabel: string;
  practice: string;
  updated: string;
  steps: number;
}

const STATUSES: { status: BadgeStatus; label: string }[] = [
  { status: 'success', label: 'Completed' },
  { status: 'info', label: 'In review' },
  { status: 'warning', label: 'Action needed' },
  { status: 'neutral', label: 'Draft' },
  { status: 'destructive', label: 'Rejected' },
];

const NAMES = [
  'Amelia Hart',
  'Benjamin Osei',
  'Carla Moretti',
  'Daniel Weiss',
  'Elena Petrova',
  'Farid Haddad',
  'Grace Nakamura',
  'Hugo Lindqvist',
  'Isabel Ferreira',
  'Jonas Meyer',
  'Keiko Tanaka',
  'Liam O’Connor',
  'Maya Rozen',
  'Noah Dubois',
  'Olivia Brennan',
  'Pavel Novak',
  'Quinn Adebayo',
  'Rosa Iglesias',
  'Samir Chaudhry',
  'Tessa Vandenberg',
  'Ulf Andersson',
  'Vera Kowalski',
  'Wesley Mbeki',
  'Yara Haddadin',
];

const SCANS = ['Full arch', 'Upper arch', 'Lower arch', 'Bite registration', 'Retainer'];

const makePatients = (count: number): Patient[] =>
  Array.from({ length: count }, (_, index) => {
    const status = STATUSES[index % STATUSES.length]!;
    return {
      id: `patient-${index + 1}`,
      name: NAMES[index % NAMES.length]!,
      chart: `Chart ${1000 + index}`,
      scan: SCANS[index % SCANS.length]!,
      status: status.status,
      statusLabel: status.label,
      practice: index % 2 === 0 ? 'Riverside Dental' : 'Northside Ortho',
      updated: `2026-0${(index % 9) + 1}-1${index % 10}`,
      steps: (index % 4) as 0 | 1 | 2 | 3,
    };
  });

const PATIENTS = makePatients(24);
const FEW = PATIENTS.slice(0, 3);

const columns: DataTableColumn<Patient>[] = [
  {
    id: 'name',
    header: 'Patient',
    sortAccessor: (patient) => patient.name,
    content: 'text-subtext',
    cell: (patient) => ({ text: patient.name, subtext: patient.chart }),
  },
  {
    id: 'scan',
    header: 'Scan type',
    filterable: true,
    sortAccessor: (patient) => patient.scan,
    accessor: (patient) => patient.scan,
  },
  {
    id: 'status',
    header: 'Status',
    content: 'badge',
    sortAccessor: (patient) => patient.statusLabel,
    cell: (patient) => ({ text: patient.statusLabel, badgeStatus: patient.status }),
  },
  {
    id: 'progress',
    header: 'Progress',
    content: 'progress',
    sortAccessor: (patient) => patient.steps,
    cell: (patient) => ({
      progress: { value: patient.steps, segments: 3, label: 'Treatment progress' },
      text: `${patient.steps} of 3 steps`,
      subtext: 'Updated today',
    }),
  },
  {
    id: 'practice',
    header: 'Practice',
    content: 'link',
    sortAccessor: (patient) => patient.practice,
    cell: (patient) => ({ text: patient.practice, href: '#practice' }),
  },
  {
    id: 'updated',
    header: 'Last updated',
    showDivider: true,
    sortAccessor: (patient) => patient.updated,
    accessor: (patient) => patient.updated,
  },
  {
    id: 'actions',
    header: '',
    width: 120,
    content: 'buttons',
    cell: (patient) => ({
      actions: [
        { iconName: 'edit', label: `Edit ${patient.name}` },
        { iconName: 'more-horizontal', label: `More actions for ${patient.name}` },
      ],
    }),
  },
];

/** Figma's placeholder columns ("Header text" / "Cell item text") for the variant matrix. */
const figmaColumns: DataTableColumn<Patient>[] = Array.from({ length: 6 }, (_, index) => ({
  id: `column-${index + 1}`,
  header: 'Header text',
  accessor: () => 'Cell item text',
}));

const getRowId = (patient: Patient) => patient.id;

const toolbarProps = {
  searchProps: { placeholder: 'Search', 'aria-label': 'Search patients' },
  actions: [
    { id: 'filter', label: 'Filter', iconName: 'filter' as const, iconOnly: true },
    { id: 'columns', label: 'Columns', iconName: 'settings' as const, iconOnly: true },
    { id: 'export', label: 'Export', iconName: 'launch' as const, iconOnly: true },
    { id: 'add', label: 'Add patient', emphasis: 'primary' as const },
  ],
  bulkActionItems: [
    { id: 'assign', label: 'Assign' },
    { id: 'export-selected', label: 'Export' },
    { id: 'archive', label: 'Archive' },
  ],
};

/* ── Layout helpers (story-only) ── */

const sectionTitle: React.CSSProperties = {
  font: '500 16px/24px var(--scanner-font-sans)',
  color: 'var(--scanner-text-primary)',
  margin: '32px 0 12px',
};

const stack: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 40 };

const SIZES: DataTableSize[] = ['large', 'x-large', '2x-large'];
const sizeLabel: Record<DataTableSize, string> = {
  large: 'Large (1 line)',
  'x-large': 'X-large (2 lines)',
  '2x-large': '2x-large (3 lines)',
};

type Selection = 'None' | 'Unselected' | 'Selected';
const SELECTIONS: Selection[] = ['None', 'Unselected', 'Selected'];

/** Figma "Selection": None = no checkbox column, Unselected = nothing ticked, Selected = row 1 ticked. */
const selectionProps = (selection: Selection) => ({
  selectable: selection !== 'None',
  selectedRowIds: selection === 'Selected' ? [FEW[0]!.id] : [],
});

/* ------------------------------------------------------------------ */

const meta = {
  title: 'Components/DataTable',
  component: DataTable as (props: DataTableProps<Patient>) => React.ReactElement | null,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Figma "Data table" (30943:10418). Title, toolbar, the table itself and pagination, ' +
          'driven by `columns` / `rows` / `getRowId`. Selection, sorting, expansion and pagination ' +
          'each work controlled or uncontrolled.',
      },
    },
  },
  args: {
    columns,
    rows: PATIENTS,
    getRowId,
    size: 'large',
    title: 'Data table title',
    showTitle: true,
    showToolbar: true,
    toolbarProps,
    showPagination: true,
    selectable: true,
    draggable: false,
    expandable: false,
    showHorizontalScroll: false,
    showVerticalScroll: false,
    loading: false,
    caption: 'Patients',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: SIZES,
      description: 'Figma "Size"',
    },
    selectable: { control: 'boolean', description: 'Figma "Selection" ≠ None' },
    draggable: { control: 'boolean', description: 'Figma "Draggable"' },
    showTitle: { control: 'boolean', description: 'Figma "Show title"' },
    showToolbar: { control: 'boolean', description: 'Figma "Show toolbar"' },
    showPagination: { control: 'boolean', description: 'Figma "Show pagnation" (sic)' },
    showHorizontalScroll: { control: 'boolean', description: 'Figma "Show horizontal scroll"' },
    showVerticalScroll: { control: 'boolean', description: 'Figma "Show vertical scroll"' },
    expandable: { control: 'boolean', description: 'Expander column (row "Expansion")' },
    loading: { control: 'boolean' },
    title: { control: 'text' },
    minWidth: { control: 'text' },
    maxHeight: { control: 'text' },
  },
} satisfies Meta<DataTableProps<Patient>>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Default ── */

export const Default: Story = {};

/* ── Size ── */

const SizeStory = (size: DataTableSize): Story => ({
  name: `Size: ${sizeLabel[size]}`,
  args: { size, rows: PATIENTS.slice(0, 6), showPagination: false },
});

export const SizeLarge = SizeStory('large');
export const SizeXLarge = SizeStory('x-large');
export const Size2XLarge = SizeStory('2x-large');

export const AllSizes: Story = {
  render: (args) => (
    <div style={stack}>
      {SIZES.map((size) => (
        <section key={size}>
          <h3 style={sectionTitle}>{sizeLabel[size]}</h3>
          <DataTable {...args} size={size} rows={FEW} showPagination={false} title={undefined} />
        </section>
      ))}
    </div>
  ),
};

/* ── Selection (Figma "Selection") ── */

export const SelectionNone: Story = {
  name: 'Selection: None',
  args: { selectable: false, rows: FEW, showPagination: false },
};

export const SelectionUnselected: Story = {
  name: 'Selection: Unselected',
  args: { selectable: true, defaultSelectedRowIds: [], rows: FEW, showPagination: false },
};

export const SelectionSelected: Story = {
  name: 'Selection: Selected',
  args: {
    selectable: true,
    defaultSelectedRowIds: [FEW[0]!.id, FEW[1]!.id],
    rows: FEW,
    showPagination: false,
  },
};

/* ── Draggable ── */

export const Draggable: Story = {
  name: 'Draggable',
  args: { draggable: true, rows: FEW, showPagination: false },
  parameters: {
    docs: {
      description: {
        story:
          'Figma "Draggable=True". Pointer drag-and-drop is left to the app; the handle is ' +
          'keyboard-operable — Space/Enter grabs the row, ↑/↓ move it (`onRowReorder`), Escape cancels.',
      },
    },
  },
};

/** Reordering needs state, so it lives in its own component (rules of hooks). */
const ReorderableTable = (args: DataTableProps<Patient>) => {
  const [rows, setRows] = useState<Patient[]>(FEW);
  return (
    <DataTable
      {...args}
      rows={rows}
      draggable
      showPagination={false}
      onRowReorder={(reorder) => setRows(reorder.rows)}
    />
  );
};

export const DraggableInteractive: Story = {
  name: 'Draggable: keyboard reorder',
  render: (args) => <ReorderableTable {...args} />,
};

/* ── Booleans ── */

export const WithoutTitle: Story = {
  name: 'Show title: False',
  args: { showTitle: false, rows: FEW, showPagination: false },
};

export const WithoutToolbar: Story = {
  name: 'Show toolbar: False',
  args: { showToolbar: false, rows: FEW, showPagination: false },
};

export const WithPagination: Story = {
  name: 'Show pagnation: True',
  args: { showPagination: true },
};

export const WithoutPagination: Story = {
  name: 'Show pagnation: False',
  args: { showPagination: false, rows: FEW },
};

export const HorizontalScroll: Story = {
  name: 'Show horizontal scroll',
  args: { showHorizontalScroll: true, minWidth: 1600, rows: PATIENTS.slice(0, 6), showPagination: false },
};

export const VerticalScroll: Story = {
  name: 'Show vertical scroll',
  args: { showVerticalScroll: true, showPagination: false, rows: PATIENTS },
};

export const BothScrolls: Story = {
  name: 'Many rows and columns (both scrolls)',
  args: {
    showHorizontalScroll: true,
    showVerticalScroll: true,
    minWidth: 1800,
    showPagination: false,
    rows: PATIENTS,
  },
};

/* ── Expansion ── */

export const ExpandedRows: Story = {
  args: {
    expandable: true,
    rows: FEW,
    showPagination: false,
    defaultExpandedRowIds: [FEW[1]!.id],
    isRowExpandable: (patient: Patient) => patient.id !== FEW[2]!.id,
    renderExpandedContent: (patient: Patient) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <strong style={{ font: '500 16px/24px var(--scanner-font-sans)' }}>{patient.name}</strong>
        <span
          style={{ font: '400 16px/24px var(--scanner-font-sans)', color: 'var(--scanner-text-secondary)' }}
        >
          {patient.scan} · {patient.practice} · last updated {patient.updated}
        </span>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Figma row "Expansion": expandable rows get the expander, rows that cannot expand get the ' +
          '"Indend" spacer so every column still lines up.',
      },
    },
  },
};

/* ── Sorting ── */

export const Sorting: Story = {
  args: {
    rows: PATIENTS.slice(0, 8),
    showPagination: false,
    defaultSort: { columnId: 'name', direction: 'ascending' },
  },
};

/* ── Empty / loading ── */

export const EmptyState: Story = {
  args: { rows: [], showPagination: true },
};

export const CustomEmptyState: Story = {
  args: {
    rows: [],
    showPagination: false,
    emptyState: (
      <>
        <strong style={{ font: '500 18px/28px var(--scanner-font-sans)' }}>No patients yet</strong>
        <span>Add a patient or change the filters to see results here.</span>
      </>
    ),
  },
};

export const Loading: Story = {
  args: { loading: true, skeletonRowCount: 6, showPagination: false },
};

/* ── Figma matrix ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 18 variants)',
  parameters: {
    docs: {
      description: {
        story:
          'Size × Selection × Draggable = 18 published variants, each with Figma\'s defaults ' +
          '(Show title, Show toolbar and Show pagnation on, both scrolls off). Three rows per table ' +
          'instead of Figma\'s ten, so the matrix stays readable.',
      },
    },
  },
  render: (args) => (
    <div style={stack}>
      {SIZES.map((size) =>
        SELECTIONS.map((selection) =>
          [false, true].map((draggable) => (
            <section key={`${size}-${selection}-${draggable}`}>
              <h3 style={sectionTitle}>
                {`Size=${sizeLabel[size]}, Selection=${selection}, Draggable=${draggable ? 'True' : 'False'}`}
              </h3>
              <DataTable
                {...args}
                columns={figmaColumns}
                rows={FEW}
                size={size}
                draggable={draggable}
                showTitle
                showToolbar
                showPagination
                title="Data table title"
                {...selectionProps(selection)}
              />
            </section>
          )),
        ),
      )}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const SelectAllRows: Story = {
  args: {
    rows: FEW,
    showPagination: false,
    selectable: true,
    onSelectedRowIdsChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select all rows' }));
    await expect(args.onSelectedRowIdsChange).toHaveBeenCalledWith(FEW.map((row) => row.id));
    const rows = canvas.getAllByRole('row').slice(1);
    for (const row of rows) await expect(row).toHaveAttribute('aria-selected', 'true');
  },
};

export const SortingAColumn: Story = {
  args: { rows: PATIENTS.slice(0, 5), showPagination: false, onSortChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvas.getByRole('columnheader', { name: /Patient/ });
    await expect(header).toHaveAttribute('aria-sort', 'none');
    await userEvent.click(within(header).getByRole('button', { name: /Patient/ }));
    await expect(args.onSortChange).toHaveBeenCalledWith({
      columnId: 'name',
      direction: 'ascending',
    });
    await expect(header).toHaveAttribute('aria-sort', 'ascending');
    const firstCell = canvas.getAllByRole('row')[1]!;
    await expect(within(firstCell).getByText('Amelia Hart')).toBeInTheDocument();
  },
};

export const ExpandingARow: Story = {
  args: {
    rows: FEW,
    showPagination: false,
    expandable: true,
    onExpandedRowIdsChange: fn(),
    renderExpandedContent: (patient: Patient) => <span>Details for {patient.name}</span>,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const [expander] = canvas.getAllByRole('button', { name: /expand/i });
    await userEvent.click(expander!);
    await expect(args.onExpandedRowIdsChange).toHaveBeenCalledWith([FEW[0]!.id]);
    await expect(canvas.getByText(`Details for ${FEW[0]!.name}`)).toBeInTheDocument();
  },
};

export const Paginating: Story = {
  args: { rows: PATIENTS, showPagination: true, defaultPageSize: 10, onPageChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(PATIENTS[0]!.name)).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }));
    await expect(args.onPageChange).toHaveBeenCalledWith(2);
    await expect(canvas.getByText(PATIENTS[10]!.name)).toBeInTheDocument();
  },
};

export const BulkActionOnSelection: Story = {
  args: {
    rows: FEW,
    showPagination: false,
    selectable: true,
    toolbarProps: {
      ...toolbarProps,
      bulkActionItems: [{ id: 'archive', label: 'Archive', onClick: fn() }],
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    /* Bulk mode only appears once a row is selected */
    await expect(canvas.queryByRole('button', { name: 'Archive' })).not.toBeInTheDocument();
    await userEvent.click(canvas.getAllByRole('checkbox', { name: 'Select row' })[0]!);
    await expect(canvas.getByText('1 item selected')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Archive' }));
    await expect(args.toolbarProps?.bulkActionItems?.[0]?.onClick).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    await expect(canvas.queryByText('1 item selected')).not.toBeInTheDocument();
  },
};

export const KeyboardRowReorder: Story = {
  args: { rows: FEW, showPagination: false, draggable: true, onRowReorder: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = canvas.getAllByRole('button', { name: 'Drag to reorder row' })[0]!;
    handle.focus();
    await userEvent.keyboard('[Space]');
    await userEvent.keyboard('{ArrowDown}');
    await expect(args.onRowReorder).toHaveBeenCalledWith(
      expect.objectContaining({ rowId: FEW[0]!.id, from: 0, to: 1 }),
    );
  },
};
