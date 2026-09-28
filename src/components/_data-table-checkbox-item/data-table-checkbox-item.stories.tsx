import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { DataTableCheckboxItem } from './DataTableCheckboxItem';
import type {
  CheckboxSelection,
  DataTableCheckboxItemSize,
} from './data-table-checkbox-item.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Items / Data table checkbox item (node 30570:39080)
 * Size (Large, X-large, 2X-large) = 3 variants — all rendered in `FigmaMatrix`.
 * The checkbox states come from the "01 Checkbox item" instance inside.
 */

const SIZES: DataTableCheckboxItemSize[] = ['large', 'x-large', '2x-large'];
const sizeLabel: Record<DataTableCheckboxItemSize, string> = {
  large: 'Large',
  'x-large': 'X-large',
  '2x-large': '2X-large',
};

const SELECTIONS: CheckboxSelection[] = ['unselected', 'selected', 'indeterminate'];
const selectionLabel: Record<CheckboxSelection, string> = {
  unselected: 'Unselected',
  selected: 'Selected',
  indeterminate: 'Indeterminate',
};

const STATES = ['enabled', 'focused', 'disabled', 'skeleton'] as const;
type State = (typeof STATES)[number];
const stateLabel: Record<State, string> = {
  enabled: 'Enabled',
  focused: 'Focused',
  disabled: 'Disabled',
  skeleton: 'Skeleton',
};

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const headCell: React.CSSProperties = {
  padding: 8,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const meta: Meta<typeof DataTableCheckboxItem> = {
  title: 'Private/_DataTableCheckboxItem',
  component: DataTableCheckboxItem,
  parameters: {
    docs: {
      description: {
        component:
          'Selection cell of a data table row: a `<td>` wrapping the shared `CheckboxItem` with its ' +
          'value text hidden. Keyboard: Tab to focus, Space or Enter to toggle.',
      },
    },
  },
  argTypes: {
    size: { name: 'Size', control: 'inline-radio', options: SIZES },
    checked: { name: 'Selected', control: 'inline-radio', options: SELECTIONS },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    label: { control: 'text' },
    'data-state': { name: 'Forced state', control: 'inline-radio', options: [undefined, 'focused'] },
  },
  args: { size: 'large', checked: 'unselected', onChange: fn() },
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

type Story = StoryObj<typeof DataTableCheckboxItem>;

export const Default: Story = {};

/* ── Per Figma size variant ── */

export const SizeLarge: Story = { name: 'Size: Large', args: { size: 'large' } };
export const SizeXLarge: Story = { name: 'Size: X-large', args: { size: 'x-large' } };
export const Size2XLarge: Story = { name: 'Size: 2X-large', args: { size: '2x-large' } };

/* ── Selections ── */

export const Selected: Story = { args: { checked: 'selected' } };
export const Indeterminate: Story = { args: { checked: 'indeterminate' } };

/* ── All sizes ── */

export const AllSizes: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <table style={table}>
      <tbody>
        {SIZES.map((size) => (
          <tr key={size}>
            <th style={headCell}>{sizeLabel[size]}</th>
            {SELECTIONS.map((selection) => (
              <DataTableCheckboxItem key={selection} size={size} checked={selection} />
            ))}
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
        {SELECTIONS.map((selection) => (
          <tr key={selection}>
            <th style={headCell}>{selectionLabel[selection]}</th>
            {STATES.map((state) => (
              <DataTableCheckboxItem
                key={state}
                checked={selection}
                disabled={state === 'disabled'}
                skeleton={state === 'skeleton'}
                data-state={state === 'focused' ? 'focused' : undefined}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Full Figma matrix: 3 size variants × every checkbox selection ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (3 variants × selections)',
  decorators: [(Story) => <Story />],
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {SELECTIONS.map((selection) => (
            <th key={selection} style={headCell}>
              {selectionLabel[selection]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {SIZES.map((size) => (
          <tr key={size}>
            <th style={headCell}>{`Size=${sizeLabel[size]}`}</th>
            {SELECTIONS.map((selection) => (
              <DataTableCheckboxItem key={selection} size={size} checked={selection} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Interaction tests ── */

export const ToggleWithKeyboard: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', { name: 'Select row' });
    await userEvent.tab();
    await expect(checkbox).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(args.onChange).toHaveBeenCalledWith(true);
  },
};

export const ToggleWithPointer: Story = {
  tags: ['test'],
  args: { checked: 'selected' },
  play: async ({ args, canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', { name: 'Select row' });
    await expect(checkbox).toBeChecked();
    await userEvent.click(checkbox);
    await expect(args.onChange).toHaveBeenCalledWith(false);
  },
};
