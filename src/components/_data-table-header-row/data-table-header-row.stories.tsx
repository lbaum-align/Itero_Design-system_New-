import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { DataTableHeaderRow } from './DataTableHeaderRow';
import { DataTableHeaderItem } from '../_data-table-header-item';
import type {
  DataTableHeaderRowExpansion,
  DataTableHeaderRowSelection,
} from './data-table-header-row.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Rows / Data table header row (node 30601:6315)
 * Size (Large) × Selection (None, Unselected, Selected, Indeterminate) × Expansion (None, Indend)
 * × Draggable (False, True) = 16 variants — every one is rendered in `FigmaMatrix`.
 */

const SELECTIONS: DataTableHeaderRowSelection[] = [
  'none',
  'unselected',
  'selected',
  'indeterminate',
];
const selectionLabel: Record<DataTableHeaderRowSelection, string> = {
  none: 'None',
  unselected: 'Unselected',
  selected: 'Selected',
  indeterminate: 'Indeterminate',
};

const EXPANSIONS: DataTableHeaderRowExpansion[] = ['none', 'indend'];
const expansionLabel: Record<DataTableHeaderRowExpansion, string> = {
  none: 'None',
  indend: 'Indend',
};

const COLUMNS = ['Patient', 'Scan type', 'Status', 'Practice', 'Updated', 'Actions'];

const headerCells = (sorted: 'none' | 'ascending' = 'none') =>
  COLUMNS.map((column, index) => (
    <DataTableHeaderItem key={column} sortable sorted={index === 0 ? sorted : 'none'}>
      {column}
    </DataTableHeaderItem>
  ));

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 900, tableLayout: 'fixed' };
const caption: React.CSSProperties = {
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  padding: '16px 0 4px',
};

const meta: Meta<typeof DataTableHeaderRow> = {
  title: 'Private/_DataTableHeaderRow',
  component: DataTableHeaderRow,
  parameters: {
    docs: {
      description: {
        component:
          'Header row of a data table: a `<tr>` with the optional leading columns (drag spacer, ' +
          'expansion spacer, select-all checkbox) followed by `_DataTableHeaderItem` cells. ' +
          'Figma’s Draggable and Expansion=Indend only reserve empty columns so the header lines ' +
          'up with the rows below.',
      },
    },
  },
  argTypes: {
    selection: { name: 'Selection', control: 'inline-radio', options: SELECTIONS },
    expansion: { name: 'Expansion', control: 'inline-radio', options: EXPANSIONS },
    draggable: { name: 'Draggable', control: 'boolean' },
    'data-state': { name: 'Forced state', control: 'inline-radio', options: [undefined, 'hovered'] },
  },
  args: {
    selection: 'unselected',
    expansion: 'none',
    draggable: false,
    onSelectionChange: fn(),
    children: headerCells(),
  },
  decorators: [
    (Story) => (
      <table style={table}>
        <thead>
          <Story />
        </thead>
      </table>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof DataTableHeaderRow>;

export const Default: Story = {};

/* ── Per Figma "Selection" variant ── */

export const SelectionNone: Story = { name: 'Selection: None', args: { selection: 'none' } };
export const SelectionUnselected: Story = {
  name: 'Selection: Unselected',
  args: { selection: 'unselected' },
};
export const SelectionSelected: Story = {
  name: 'Selection: Selected',
  args: { selection: 'selected' },
};
export const SelectionIndeterminate: Story = {
  name: 'Selection: Indeterminate',
  args: { selection: 'indeterminate' },
};

/* ── Per Figma "Expansion" / "Draggable" ── */

export const ExpansionIndend: Story = { name: 'Expansion: Indend', args: { expansion: 'indend' } };
export const Draggable: Story = { args: { draggable: true } };
export const SortedColumn: Story = { args: { children: headerCells('ascending') } };

/* ── All states ── */

export const AllStates: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <div>
      {(['enabled', 'hovered'] as const).map((state) => (
        <div key={state}>
          <p style={caption}>{state}</p>
          <table style={table}>
            <thead>
              <DataTableHeaderRow
                selection="indeterminate"
                draggable
                expansion="indend"
                data-state={state === 'hovered' ? 'hovered' : undefined}
              >
                {headerCells('ascending')}
              </DataTableHeaderRow>
            </thead>
          </table>
        </div>
      ))}
    </div>
  ),
};

/* ── Full Figma matrix: all 16 variants ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 16 variants)',
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <Story />],
  render: () => (
    <div style={{ padding: 24 }}>
      {SELECTIONS.flatMap((selection) =>
        EXPANSIONS.flatMap((expansion) =>
          [false, true].map((draggable) => (
            <div key={`${selection}-${expansion}-${draggable}`}>
              <p style={caption}>
                {`Selection=${selectionLabel[selection]}, Expansion=${expansionLabel[expansion]}, Draggable=${draggable}`}
              </p>
              <table style={table}>
                <thead>
                  <DataTableHeaderRow
                    selection={selection}
                    expansion={expansion}
                    draggable={draggable}
                  >
                    {headerCells()}
                  </DataTableHeaderRow>
                </thead>
              </table>
            </div>
          )),
        ),
      )}
    </div>
  ),
};

/* ── Interaction tests ── */

export const SelectAllToggles: Story = {
  tags: ['test'],
  args: { selection: 'indeterminate' },
  play: async ({ args, canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', { name: 'Select all rows' });
    await expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    await userEvent.click(checkbox);
    await expect(args.onSelectionChange).toHaveBeenCalledWith(true);
  },
};

export const SortingAColumn: Story = {
  tags: ['test'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvas.getByRole('columnheader', { name: 'Patient' });
    await expect(header).toHaveAttribute('aria-sort', 'none');
    await userEvent.click(canvas.getByRole('button', { name: 'Patient' }));
  },
};
