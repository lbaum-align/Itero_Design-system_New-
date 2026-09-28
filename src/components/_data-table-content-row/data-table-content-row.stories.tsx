import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { DataTableContentRow } from './DataTableContentRow';
import { DataTableContentItem } from '../_data-table-content-item';
import type {
  DataTableContentRowExpansion,
  DataTableContentRowSelection,
  DataTableContentRowSize,
} from './data-table-content-row.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Rows / Data table content row (node 30539:50181)
 * Size (Large (1 line), X-large (2 lines), 2X-large (3 lines)) × Selection (None, Unselected,
 * Selected) × Expansion (None, Collapsed, Expanded, Indend) × Draggable (False, True)
 * = 68 published variants (of 72 combinations) — every combination is rendered in `FigmaMatrix`.
 */

const SIZES: DataTableContentRowSize[] = ['large', 'x-large', '2x-large'];
const sizeLabel: Record<DataTableContentRowSize, string> = {
  large: 'Large (1 line)',
  'x-large': 'X-large (2 lines)',
  '2x-large': '2X-large (3 lines)',
};

const SELECTIONS: DataTableContentRowSelection[] = ['none', 'unselected', 'selected'];
const selectionLabel: Record<DataTableContentRowSelection, string> = {
  none: 'None',
  unselected: 'Unselected',
  selected: 'Selected',
};

const EXPANSIONS: DataTableContentRowExpansion[] = ['none', 'collapsed', 'expanded', 'indend'];
const expansionLabel: Record<DataTableContentRowExpansion, string> = {
  none: 'None',
  collapsed: 'Collapsed',
  expanded: 'Expanded',
  indend: 'Indend',
};

const cells = (size: DataTableContentRowSize) =>
  Array.from({ length: 6 }, (_, index) => (
    <DataTableContentItem key={index} size={size} text="Cell item text" />
  ));

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 900, tableLayout: 'fixed' };
const caption: React.CSSProperties = {
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  padding: '16px 0 4px',
};

const meta: Meta<typeof DataTableContentRow> = {
  title: 'Private/_DataTableContentRow',
  component: DataTableContentRow,
  parameters: {
    docs: {
      description: {
        component:
          'Content row of a data table: a `<tr>` with the optional leading columns (drag handle, ' +
          'expander, checkbox) followed by `_DataTableContentItem` cells, plus a second `<tr>` for ' +
          'the expanded content when `expansion="expanded"`. Figma defines no row hover; the hovered ' +
          'layer token is applied as a code addition (see the sign-off).',
      },
    },
  },
  argTypes: {
    size: { name: 'Size', control: 'inline-radio', options: SIZES },
    selection: { name: 'Selection', control: 'inline-radio', options: SELECTIONS },
    expansion: { name: 'Expansion', control: 'inline-radio', options: EXPANSIONS },
    draggable: { name: 'Draggable', control: 'boolean' },
    'data-state': {
      name: 'Forced state',
      control: 'inline-radio',
      options: [undefined, 'hovered'],
    },
  },
  args: {
    size: 'large',
    selection: 'unselected',
    expansion: 'none',
    draggable: false,
    onSelectionChange: fn(),
    onExpandedChange: fn(),
    children: cells('large'),
  },
  decorators: [
    (Story) => (
      <table style={table}>
        <tbody>
          <Story />
        </tbody>
      </table>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof DataTableContentRow>;

export const Default: Story = {};

/* ── Per Figma "Size" ── */

export const SizeLarge: Story = { name: 'Size: Large (1 line)', args: { size: 'large' } };
export const SizeXLarge: Story = {
  name: 'Size: X-large (2 lines)',
  args: { size: 'x-large', children: cells('x-large') },
};
export const Size2XLarge: Story = {
  name: 'Size: 2X-large (3 lines)',
  args: { size: '2x-large', children: cells('2x-large') },
};

/* ── Per Figma "Selection" ── */

export const SelectionNone: Story = { name: 'Selection: None', args: { selection: 'none' } };
export const SelectionUnselected: Story = {
  name: 'Selection: Unselected',
  args: { selection: 'unselected' },
};
export const SelectionSelected: Story = {
  name: 'Selection: Selected',
  args: { selection: 'selected' },
};

/* ── Per Figma "Expansion" ── */

export const ExpansionCollapsed: Story = {
  name: 'Expansion: Collapsed',
  args: { expansion: 'collapsed' },
};
export const ExpansionExpanded: Story = {
  name: 'Expansion: Expanded',
  args: { expansion: 'expanded', expandedContentId: 'row-details' },
};
export const ExpansionIndend: Story = {
  name: 'Expansion: Indend',
  args: { expansion: 'indend' },
};
export const Draggable: Story = { args: { draggable: true } };

/* ── Cell contents ── */

export const MixedCellContents: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <table style={table}>
      <tbody>
        <DataTableContentRow size="x-large" selection="unselected" expansion="collapsed" draggable>
          <DataTableContentItem
            size="x-large"
            content="text-subtext"
            text="Jane Doe"
            subtext="ID 12345"
            avatar={{ alt: 'Jane Doe', name: 'Jane Doe' }}
            showAvatar
          />
          <DataTableContentItem size="x-large" content="link" text="Open scan" href="#" />
          <DataTableContentItem
            size="x-large"
            content="badge"
            text="Completed"
            badgeStatus="success"
          />
          <DataTableContentItem
            size="x-large"
            content="progress"
            progress={{ value: 2 }}
            text="2 of 3 steps"
          />
          <DataTableContentItem
            size="x-large"
            content="buttons"
            actions={[
              { iconName: 'edit', label: 'Edit row' },
              { iconName: 'more-horizontal', label: 'More actions' },
            ]}
          />
        </DataTableContentRow>
      </tbody>
    </table>
  ),
};

/* ── All states (forced via data-state) ── */

export const AllStates: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <div>
      {(['enabled', 'hovered'] as const).flatMap((state) =>
        SELECTIONS.map((selection) => (
          <div key={`${state}-${selection}`}>
            <p style={caption}>{`${state} · Selection=${selectionLabel[selection]}`}</p>
            <table style={table}>
              <tbody>
                <DataTableContentRow
                  selection={selection}
                  expansion="collapsed"
                  draggable
                  data-state={state === 'hovered' ? 'hovered' : undefined}
                >
                  {cells('large')}
                </DataTableContentRow>
              </tbody>
            </table>
          </div>
        )),
      )}
    </div>
  ),
};

/* ── All sizes ── */

export const AllSizes: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <table style={table}>
      <tbody>
        {SIZES.map((size) => (
          <DataTableContentRow
            key={size}
            size={size}
            selection="unselected"
            expansion="collapsed"
            draggable
          >
            {cells(size)}
          </DataTableContentRow>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Full Figma matrix: Size × Selection × Expansion × Draggable ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 68 variants)',
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <Story />],
  render: () => (
    <div style={{ padding: 24 }}>
      {SIZES.flatMap((size) =>
        SELECTIONS.flatMap((selection) =>
          EXPANSIONS.flatMap((expansion) =>
            [false, true].map((draggable) => (
              <div key={`${size}-${selection}-${expansion}-${draggable}`}>
                <p style={caption}>
                  {`Size=${sizeLabel[size]}, Selection=${selectionLabel[selection]}, Expansion=${expansionLabel[expansion]}, Draggable=${draggable}`}
                </p>
                <table style={table}>
                  <tbody>
                    <DataTableContentRow
                      size={size}
                      selection={selection}
                      expansion={expansion}
                      draggable={draggable}
                    >
                      {cells(size)}
                    </DataTableContentRow>
                  </tbody>
                </table>
              </div>
            )),
          ),
        ),
      )}
    </div>
  ),
};

/* ── Interactive example ── */

const InteractiveRow = () => {
  const [selected, setSelected] = useState(false);
  const [expanded, setExpanded] = useState(false);
  return (
    <table style={table}>
      <tbody>
        <DataTableContentRow
          size="large"
          draggable
          selection={selected ? 'selected' : 'unselected'}
          onSelectionChange={setSelected}
          expansion={expanded ? 'expanded' : 'collapsed'}
          onExpandedChange={setExpanded}
          expandedContentId="interactive-row-details"
          expandedContent={<span>Details for the selected scan</span>}
        >
          {cells('large')}
        </DataTableContentRow>
      </tbody>
    </table>
  );
};

export const Interactive: Story = {
  decorators: [(Story) => <Story />],
  render: () => <InteractiveRow />,
};

/* ── Interaction tests ── */

export const SelectingARow: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', { name: 'Select row' });
    await userEvent.click(checkbox);
    await expect(args.onSelectionChange).toHaveBeenCalledWith(true);
  },
};

export const ExpandingARow: Story = {
  tags: ['test'],
  args: { expansion: 'collapsed' },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Expand row' });
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(button);
    await expect(args.onExpandedChange).toHaveBeenCalledWith(true);
  },
};

export const ExpandedRowIsLinkedToTheExpander: Story = {
  tags: ['test'],
  args: { expansion: 'expanded', expandedContentId: 'row-details' },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Collapse row' });
    await expect(button).toHaveAttribute('aria-controls', 'row-details');
    await expect(canvasElement.querySelector('#row-details')).toBeInTheDocument();
  },
};

export const DragHandleIsKeyboardOperable: Story = {
  tags: ['test'],
  args: { draggable: true, onDragHandleActivate: fn() },
  play: async ({ args, canvasElement }) => {
    const handle = within(canvasElement).getByRole('button', { name: 'Drag to reorder row' });
    handle.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onDragHandleActivate).toHaveBeenCalledTimes(1);
  },
};
