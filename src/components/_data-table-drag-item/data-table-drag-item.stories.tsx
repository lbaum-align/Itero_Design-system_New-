import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { DataTableDragItem } from './DataTableDragItem';
import type {
  DataTableDragItemProps,
  DataTableDragItemSize,
} from './data-table-drag-item.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Items / Data table drag item (node 34019:66971)
 * Size (Large, X-large, 2X-large) = 3 variants — all rendered in `FigmaMatrix`.
 */

const SIZES: DataTableDragItemSize[] = ['large', 'x-large', '2x-large'];
const sizeLabel: Record<DataTableDragItemSize, string> = {
  large: 'Large',
  'x-large': 'X-large',
  '2x-large': '2X-large',
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

function stateProps(state: State): Partial<DataTableDragItemProps> {
  return {
    disabled: state === 'disabled',
    'data-state':
      state === 'hovered' || state === 'focused' || state === 'pressed' ? state : undefined,
  };
}

/* max-content keeps matrix columns from squeezing labels into wrapping */
const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const headCell: React.CSSProperties = {
  padding: 8,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const meta: Meta<typeof DataTableDragItem> = {
  title: 'Private/_DataTableDragItem',
  component: DataTableDragItem,
  parameters: {
    docs: {
      description: {
        component:
          'Drag-handle cell of a data table row. Renders a `<td>` with a 24×24 "Drag drop" glyph ' +
          '(`icon-tertiary`) centred in the row height. Keyboard: Tab to focus, Enter/Space to start ' +
          'a keyboard drag (`onHandleActivate`).',
      },
    },
  },
  argTypes: {
    size: { name: 'Size', control: 'inline-radio', options: SIZES },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    'data-state': {
      name: 'Forced state',
      control: 'inline-radio',
      options: [undefined, 'hovered', 'focused', 'pressed'],
    },
  },
  args: { size: 'large', onHandleActivate: fn() },
  decorators: [
    (Story) => (
      <table style={table}>
        <tbody>
          <tr>
            <Story />
          </tr>
        </tbody>
      </table>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof DataTableDragItem>;

export const Default: Story = {};

/* ── Per Figma size variant ── */

export const SizeLarge: Story = { name: 'Size: Large', args: { size: 'large' } };
export const SizeXLarge: Story = { name: 'Size: X-large', args: { size: 'x-large' } };
export const Size2XLarge: Story = { name: 'Size: 2X-large', args: { size: '2x-large' } };

/* ── All sizes ── */

export const AllSizes: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <table style={table}>
      <tbody>
        {SIZES.map((size) => (
          <tr key={size}>
            <th style={headCell}>{sizeLabel[size]}</th>
            <DataTableDragItem size={size} />
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

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
        {SIZES.map((size) => (
          <tr key={size}>
            <th style={headCell}>{sizeLabel[size]}</th>
            {STATES.map((state) => (
              <DataTableDragItem key={state} size={size} {...stateProps(state)} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Full Figma matrix: all 3 variants ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 3 variants)',
  decorators: [(Story) => <Story />],
  render: () => (
    <table style={table}>
      <tbody>
        {SIZES.map((size) => (
          <tr key={size}>
            <th style={headCell}>{`Size=${sizeLabel[size]}`}</th>
            <DataTableDragItem size={size} />
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Interaction tests ── */

export const KeyboardActivation: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const handle = within(canvasElement).getByRole('button', { name: 'Drag to reorder row' });
    await userEvent.tab();
    await expect(handle).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onHandleActivate).toHaveBeenCalledTimes(2);
  },
};

export const DisabledIsNotOperable: Story = {
  tags: ['test'],
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    const handle = within(canvasElement).getByRole('button', { name: 'Drag to reorder row' });
    await expect(handle).toBeDisabled();
    await userEvent.click(handle, { pointerEventsCheck: 0 });
    await expect(args.onHandleActivate).not.toHaveBeenCalled();
  },
};
