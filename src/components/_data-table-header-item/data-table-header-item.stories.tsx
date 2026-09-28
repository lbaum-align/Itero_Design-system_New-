import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { DataTableHeaderItem } from './DataTableHeaderItem';
import type { DataTableSortDirection } from './data-table-header-item.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Items / Data table header item (node 30601:2824)
 * Sorted (None, Ascending, Descending) × Filterable (False, True) × Show divider (False, True)
 * = 3 variants + 2 boolean properties — every combination is rendered in `FigmaMatrix`.
 */

const SORTED: DataTableSortDirection[] = ['none', 'ascending', 'descending'];
const sortedLabel: Record<DataTableSortDirection, string> = {
  none: 'None',
  ascending: 'Ascending',
  descending: 'Descending',
};

const STATES = ['enabled', 'hovered', 'focused', 'pressed', 'disabled'] as const;
type State = (typeof STATES)[number];
const stateLabel: Record<State, string> = {
  enabled: 'Enabled',
  hovered: 'Hovered',
  focused: 'Focused',
  pressed: 'Pressed',
  disabled: 'Disabled',
};

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const headCell: React.CSSProperties = {
  padding: 8,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const meta: Meta<typeof DataTableHeaderItem> = {
  title: 'Private/_DataTableHeaderItem',
  component: DataTableHeaderItem,
  parameters: {
    docs: {
      description: {
        component:
          'Header cell of a data table. Renders a `<th scope="col">` carrying `aria-sort`; when the ' +
          'column is sortable the label is a button that cycles none → ascending → descending → none. ' +
          'A sortable column with `sorted="none"` shows no arrow, exactly like Figma.',
      },
    },
  },
  argTypes: {
    sorted: { name: 'Sorted', control: 'inline-radio', options: SORTED },
    sortable: { control: 'boolean' },
    filterable: { name: 'Filterable', control: 'boolean' },
    showDivider: { name: 'Show divider', control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { name: 'Header text', control: 'text' },
    'data-state': {
      name: 'Forced state',
      control: 'inline-radio',
      options: [undefined, 'hovered', 'focused', 'pressed'],
    },
  },
  args: {
    children: 'Header text',
    sorted: 'none',
    sortable: true,
    filterable: false,
    showDivider: false,
    onSortChange: fn(),
    onFilterClick: fn(),
  },
  decorators: [
    (Story) => (
      <table style={{ ...table, width: 320 }}>
        <thead>
          <tr>
            <Story />
          </tr>
        </thead>
      </table>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof DataTableHeaderItem>;

export const Default: Story = {};

/* ── Per Figma "Sorted" variant ── */

export const SortedNone: Story = { name: 'Sorted: None', args: { sorted: 'none' } };
export const SortedAscending: Story = { name: 'Sorted: Ascending', args: { sorted: 'ascending' } };
export const SortedDescending: Story = {
  name: 'Sorted: Descending',
  args: { sorted: 'descending' },
};

/* ── Boolean properties ── */

export const Filterable: Story = { args: { filterable: true, sorted: 'ascending' } };
export const WithDivider: Story = { name: 'Show divider', args: { showDivider: true } };
export const NotSortable: Story = { args: { sortable: false, onSortChange: undefined } };

/* ── All states (forced via data-state) ── */

export const AllStates: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {STATES.map((state) => (
            <th key={state} style={headCell}>
              {stateLabel[state]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {SORTED.map((sorted) => (
          <tr key={sorted}>
            <th style={headCell}>{sortedLabel[sorted]}</th>
            {STATES.map((state) => (
              <DataTableHeaderItem
                key={state}
                sorted={sorted}
                sortable
                filterable
                showDivider
                disabled={state === 'disabled'}
                data-state={
                  state === 'hovered' || state === 'focused' || state === 'pressed'
                    ? state
                    : undefined
                }
              >
                Header text
              </DataTableHeaderItem>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Full Figma matrix: Sorted × Filterable × Show divider ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (Sorted × Filterable × Show divider)',
  decorators: [(Story) => <Story />],
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {[false, true].flatMap((filterable) =>
            [false, true].map((showDivider) => (
              <th key={`${filterable}-${showDivider}`} style={headCell}>
                {`Filterable=${filterable} · Divider=${showDivider}`}
              </th>
            )),
          )}
        </tr>
      </thead>
      <tbody>
        {SORTED.map((sorted) => (
          <tr key={sorted}>
            <th style={headCell}>{`Sorted=${sortedLabel[sorted]}`}</th>
            {[false, true].flatMap((filterable) =>
              [false, true].map((showDivider) => (
                <DataTableHeaderItem
                  key={`${filterable}-${showDivider}`}
                  sorted={sorted}
                  sortable
                  filterable={filterable}
                  showDivider={showDivider}
                >
                  Header text
                </DataTableHeaderItem>
              )),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Overflow: long header labels wrap instead of truncating (Figma text is fill/hug) ── */

export const LongLabelWraps: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <table style={{ ...table, width: 220 }}>
      <thead>
        <tr>
          <DataTableHeaderItem sorted="ascending" sortable filterable showDivider>
            Last completed scan date and time
          </DataTableHeaderItem>
        </tr>
      </thead>
    </table>
  ),
};

/* ── Interaction tests ── */

export const SortCyclesOnClick: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvas.getByRole('columnheader');
    await expect(header).toHaveAttribute('aria-sort', 'none');
    await userEvent.click(canvas.getByRole('button', { name: 'Header text' }));
    await expect(args.onSortChange).toHaveBeenCalledWith('ascending');
  },
};

export const SortWithKeyboard: Story = {
  tags: ['test'],
  args: { sorted: 'descending' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('columnheader')).toHaveAttribute('aria-sort', 'descending');
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    await expect(args.onSortChange).toHaveBeenCalledWith('none');
  },
};

export const FilterButtonIsOperable: Story = {
  tags: ['test'],
  args: { filterable: true },
  play: async ({ args, canvasElement }) => {
    const filter = within(canvasElement).getByRole('button', { name: 'Filter Header text' });
    await userEvent.click(filter);
    await expect(args.onFilterClick).toHaveBeenCalledTimes(1);
  },
};
