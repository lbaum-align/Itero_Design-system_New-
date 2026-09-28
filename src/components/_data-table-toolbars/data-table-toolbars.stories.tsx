import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Dropdown } from '../dropdown';
import { DataTableToolbars } from './DataTableToolbars';
import type { DataTableToolbarAction, DataTableToolbarsProps } from './data-table-toolbars.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Bars / Data table toolbars (node 34038:306507, page "Data table")
 * Bulk actions: False, True — both rendered in `FigmaMatrix` at the Figma width (1328).
 * Private — composed by DataTable.
 */

/** Figma "Buttons group": 3× Secondary icon-only (Add alt) + Primary "Button text". */
const figmaActions = (onClick?: () => void, extra: Partial<DataTableToolbarAction> = {}): DataTableToolbarAction[] => [
  { id: 'a1', label: 'Add', iconName: 'add', iconOnly: true, onClick, ...extra },
  { id: 'a2', label: 'Add', iconName: 'add', iconOnly: true, onClick, ...extra },
  { id: 'a3', label: 'Add', iconName: 'add', iconOnly: true, onClick, ...extra },
  { id: 'primary', label: 'Button text', emphasis: 'primary', onClick, ...extra },
];

/** Figma "Actions": Secondary "Action 1…3". */
const figmaBulkActions = (onClick?: () => void, extra: Partial<DataTableToolbarAction> = {}): DataTableToolbarAction[] =>
  [1, 2, 3].map((n) => ({ id: `action-${n}`, label: `Action ${n}`, onClick, ...extra }));

const FIGMA_WIDTH = 1328;

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
const Frame = ({ children, width = FIGMA_WIDTH }: { children: React.ReactNode; width?: number }) => (
  <div style={{ width }}>{children}</div>
);

const meta: Meta<typeof DataTableToolbars> = {
  title: 'Private/_DataTableToolbars',
  component: DataTableToolbars,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Data table toolbar: Large search input (and optional filters) on the left; table actions on the right. ' +
          'With a selection (`selectedCount > 0` or `bulkActions`) the actions are replaced by the selection summary, bulk actions and Cancel.',
      },
    },
  },
  argTypes: {
    bulkActions: { name: 'Bulk actions', control: 'boolean' },
    selectedCount: { control: { type: 'number', min: 0 } },
    showSearch: { control: 'boolean' },
    cancelLabel: { control: 'text' },
    actions: { control: false },
    bulkActionItems: { control: false },
    searchProps: { control: 'object' },
    filters: { control: false },
    selectedLabel: { control: false },
  },
  args: {
    bulkActions: false,
    selectedCount: 2,
    showSearch: true,
    cancelLabel: 'Cancel',
    searchProps: { placeholder: 'Search' },
    actions: figmaActions(),
    bulkActionItems: figmaBulkActions(),
    onCancel: fn(),
  },
  render: (args) => (
    <Frame>
      <DataTableToolbars {...args} />
    </Frame>
  ),
};
export default meta;

type Story = StoryObj<typeof DataTableToolbars>;

/* ── Default ── */

export const Default: Story = {};

/* ── Per variant (Figma "Bulk actions") ── */

export const BulkActionsFalse: Story = { name: 'Bulk actions: False', args: { bulkActions: false } };

export const BulkActionsTrue: Story = { name: 'Bulk actions: True', args: { bulkActions: true, selectedCount: 2 } };

/* ── AllStates — rows = Bulk actions, columns = content state ── */

const STATES = ['Enabled', 'Search filled', 'Search focused', 'Actions disabled', 'Actions loading'] as const;
type State = (typeof STATES)[number];

function stateProps(bulk: boolean, state: State): DataTableToolbarsProps {
  const extra: Partial<DataTableToolbarAction> = {
    disabled: state === 'Actions disabled',
    loading: state === 'Actions loading',
  };
  return {
    bulkActions: bulk,
    selectedCount: 2,
    actions: figmaActions(undefined, extra),
    bulkActionItems: figmaBulkActions(undefined, extra),
    onCancel: () => {},
    searchProps: {
      placeholder: 'Search',
      defaultValue: state === 'Search filled' || state === 'Search focused' ? 'Smith' : undefined,
      'data-state': state === 'Search focused' ? 'focused' : undefined,
    },
  };
}

export const AllStates: Story = {
  render: () => (
    <table style={table}>
      <tbody>
        {([false, true] as const).map((bulk) =>
          STATES.map((state) => (
            <tr key={`${bulk}-${state}`}>
              <th style={headCell}>
                Bulk actions={bulk ? 'True' : 'False'}
                <br />
                {state}
              </th>
              <td style={cell}>
                <Frame>
                  <DataTableToolbars {...stateProps(bulk, state)} />
                </Frame>
              </td>
            </tr>
          )),
        )}
      </tbody>
    </table>
  ),
};

/* ── FigmaMatrix — every Figma variant ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 2 variants)',
  render: () => (
    <table style={table}>
      <tbody>
        {([false, true] as const).map((bulk) => (
          <tr key={String(bulk)}>
            <th style={headCell}>Bulk actions={bulk ? 'True' : 'False'}</th>
            <td style={cell}>
              <Frame>
                <DataTableToolbars {...stateProps(bulk, 'Enabled')} />
              </Frame>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Edge cases ── */

export const WithFilters: Story = {
  name: 'Search + filter',
  args: {
    filters: (
      <div style={{ width: 200 }}>
        <Dropdown
          aria-label="Status"
          placeholder="Status"
          options={[
            { value: 'open', label: 'Open' },
            { value: 'closed', label: 'Closed' },
          ]}
        />
      </div>
    ),
  },
};

export const WithoutSearch: Story = { args: { showSearch: false } };

export const SingleItemSelected: Story = { name: 'One item selected', args: { bulkActions: true, selectedCount: 1 } };

export const NarrowContainer: Story = {
  name: 'Overflow: narrow container',
  args: { bulkActions: true },
  render: (args) => (
    <Frame width={800}>
      <DataTableToolbars {...args} />
    </Frame>
  ),
};

/* ── Interactive ── */

const ROWS = ['Smith', 'Jones', 'Brown', 'Taylor'];

function InteractiveToolbar({ onBulk, onAdd }: { onBulk: (count: number) => void; onAdd: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const rows = ROWS.filter((r) => r.toLowerCase().includes(query.toLowerCase()));
  return (
    <Frame>
      <DataTableToolbars
        searchProps={{ placeholder: 'Search', 'aria-label': 'Search patients', value: query, onChange: (e) => setQuery(e.target.value) }}
        actions={[{ id: 'add', label: 'Add patient', emphasis: 'primary', onClick: onAdd }]}
        selectedCount={selected.length}
        bulkActionItems={[{ id: 'delete', label: 'Delete', onClick: () => onBulk(selected.length) }]}
        onCancel={() => setSelected([])}
      />
      <ul style={{ listStyle: 'none', padding: 0, font: '16px/24px var(--scanner-font-sans)' }}>
        {rows.map((r) => (
          <li key={r}>
            <label>
              <input
                type="checkbox"
                checked={selected.includes(r)}
                onChange={(e) => setSelected((s) => (e.target.checked ? [...s, r] : s.filter((x) => x !== r)))}
              />{' '}
              {r}
            </label>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

const onBulk = fn();
const onAdd = fn();

export const Interactive: Story = {
  render: () => <InteractiveToolbar onBulk={onBulk} onAdd={onAdd} />,
};

export const BulkActionInteraction: Story = {
  name: 'Play: bulk action + cancel',
  render: () => <InteractiveToolbar onBulk={onBulk} onAdd={onAdd} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    onBulk.mockClear();
    await userEvent.click(canvas.getByRole('button', { name: 'Add patient' }));
    await expect(onAdd).toHaveBeenCalled();

    await userEvent.click(canvas.getByRole('checkbox', { name: 'Smith' }));
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Jones' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('2 items selected');
    await expect(canvas.queryByRole('button', { name: 'Add patient' })).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Delete' }));
    await expect(onBulk).toHaveBeenCalledWith(2);

    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    await expect(canvas.queryByRole('status')).not.toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Add patient' })).toBeInTheDocument();
  },
};

export const SearchInteraction: Story = {
  name: 'Play: search filters rows',
  render: () => <InteractiveToolbar onBulk={onBulk} onAdd={onAdd} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole('searchbox', { name: 'Search patients' });
    await userEvent.type(search, 'sm');
    await expect(canvas.getAllByRole('checkbox')).toHaveLength(1);
    await userEvent.keyboard('{Escape}');
    await expect(search).toHaveValue('');
    await expect(canvas.getAllByRole('checkbox')).toHaveLength(4);
  },
};
