import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { DataTableExpansionItem } from './DataTableExpansionItem';
import type {
  DataTableExpansionItemProps,
  DataTableExpansionItemSize,
} from './data-table-expansion-item.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Items / Data table expansion item (node 30570:39079)
 * Size (Large, X-large, 2X-large) = 3 variants — all rendered in `FigmaMatrix`.
 * The expanded chevron comes from "Rows / Data table content row" Expansion=Expanded.
 */

const SIZES: DataTableExpansionItemSize[] = ['large', 'x-large', '2x-large'];
const sizeLabel: Record<DataTableExpansionItemSize, string> = {
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

function stateProps(state: State): Partial<DataTableExpansionItemProps> {
  return {
    disabled: state === 'disabled',
    'data-state':
      state === 'hovered' || state === 'focused' || state === 'pressed' ? state : undefined,
  };
}

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const headCell: React.CSSProperties = {
  padding: 8,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const meta: Meta<typeof DataTableExpansionItem> = {
  title: 'Private/_DataTableExpansionItem',
  component: DataTableExpansionItem,
  parameters: {
    docs: {
      description: {
        component:
          'Expand/collapse cell of a data table row: a `<td>` with a 24×24 chevron button carrying ' +
          '`aria-expanded` (and `aria-controls` when the expanded row has an id). The chevron points ' +
          'down when collapsed and up when expanded. Keyboard: Tab to focus, Enter/Space to toggle.',
      },
    },
  },
  argTypes: {
    size: { name: 'Size', control: 'inline-radio', options: SIZES },
    expanded: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    'data-state': {
      name: 'Forced state',
      control: 'inline-radio',
      options: [undefined, 'hovered', 'focused', 'pressed'],
    },
  },
  args: { size: 'large', expanded: false, onExpandedChange: fn() },
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

type Story = StoryObj<typeof DataTableExpansionItem>;

export const Default: Story = {};

/* ── Per Figma size variant ── */

export const SizeLarge: Story = { name: 'Size: Large', args: { size: 'large' } };
export const SizeXLarge: Story = { name: 'Size: X-large', args: { size: 'x-large' } };
export const Size2XLarge: Story = { name: 'Size: 2X-large', args: { size: '2x-large' } };

export const Expanded: Story = { args: { expanded: true } };

/* ── All sizes ── */

export const AllSizes: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          <th style={headCell}>Collapsed</th>
          <th style={headCell}>Expanded</th>
        </tr>
      </thead>
      <tbody>
        {SIZES.map((size) => (
          <tr key={size}>
            <th style={headCell}>{sizeLabel[size]}</th>
            <DataTableExpansionItem size={size} />
            <DataTableExpansionItem size={size} expanded />
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
        {[false, true].map((expanded) => (
          <tr key={String(expanded)}>
            <th style={headCell}>{expanded ? 'Expanded' : 'Collapsed'}</th>
            {STATES.map((state) => (
              <DataTableExpansionItem key={state} expanded={expanded} {...stateProps(state)} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Full Figma matrix: 3 variants × collapsed/expanded ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 3 variants)',
  decorators: [(Story) => <Story />],
  render: () => (
    <table style={table}>
      <tbody>
        {SIZES.map((size) => (
          <tr key={size}>
            <th style={headCell}>{`Size=${sizeLabel[size]}`}</th>
            <DataTableExpansionItem size={size} />
            <DataTableExpansionItem size={size} expanded />
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Interaction tests ── */

export const TogglesOnClick: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Expand row' });
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(button);
    await expect(args.onExpandedChange).toHaveBeenCalledWith(true);
  },
};

export const TogglesWithKeyboard: Story = {
  tags: ['test'],
  args: { expanded: true },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Collapse row' });
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onExpandedChange).toHaveBeenCalledWith(false);
  },
};
