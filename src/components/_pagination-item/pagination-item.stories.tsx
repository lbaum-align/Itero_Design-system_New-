import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { PaginationItem } from './PaginationItem';
import type { PaginationItemProps, PaginationItemSize } from './pagination-item.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → _Pagination item (node 34178:41733)
 * Size × State = 16 variants — every combination is rendered in `FigmaMatrix`.
 */

const SIZES: PaginationItemSize[] = ['x-large', 'large', 'medium', 'small'];
const STATES = ['enabled', 'hovered', 'focused', 'selected'] as const;
type State = (typeof STATES)[number];

const sizeLabel: Record<PaginationItemSize, string> = {
  'x-large': 'X-Large',
  large: 'Large',
  medium: 'Medium',
  small: 'Small',
};
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function variantProps(size: PaginationItemSize, state: State, page = 1): PaginationItemProps {
  return {
    page,
    size,
    selected: state === 'selected',
    'data-state': state === 'hovered' || state === 'focused' ? state : undefined,
  };
}

/* ── Layout helpers (story-only) ── */

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 16, verticalAlign: 'middle', textAlign: 'center' };
const headCell: React.CSSProperties = {
  padding: 16,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

/* ------------------------------------------------------------------ */

const meta: Meta<typeof PaginationItem> = {
  title: 'Private/_PaginationItem',
  component: PaginationItem,
  parameters: {
    docs: {
      description: {
        component:
          'A single page button used by `Pagination` (private — not exported from the package). ' +
          'The current page is Selected (`aria-current="page"`). Keyboard: Tab to focus, Enter/Space to select.',
      },
    },
  },
  argTypes: {
    page: { control: 'number' },
    size: { name: 'Size', control: 'inline-radio', options: SIZES },
    selected: { name: 'Selected', control: 'boolean' },
    disabled: { control: 'boolean' },
    'data-state': { name: 'Forced state', control: 'inline-radio', options: [undefined, 'hovered', 'focused'] },
  },
  args: { page: 1, size: 'x-large', onClick: fn() },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof PaginationItem>;

/* ── Default ── */

export const Default: Story = {};

/* ── Sizes ── */

export const XLarge: Story = { name: 'Size: X-Large', args: { size: 'x-large' } };
export const Large: Story = { name: 'Size: Large', args: { size: 'large' } };
export const Medium: Story = { name: 'Size: Medium', args: { size: 'medium' } };
export const Small: Story = { name: 'Size: Small', args: { size: 'small' } };

/* ── States ── */

export const Enabled: Story = { name: 'State: Enabled' };
export const Hovered: Story = { name: 'State: Hovered', args: { 'data-state': 'hovered' } };
export const Focused: Story = { name: 'State: Focused', args: { 'data-state': 'focused' } };
export const Selected: Story = { name: 'State: Selected', args: { selected: true } };

/* ── All sizes ── */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      {SIZES.map((s) => (
        <PaginationItem key={s} {...variantProps(s, 'enabled')} />
      ))}
    </div>
  ),
};

/* ── All states: size rows × state columns (+ disabled, not a Figma state) ── */

export const AllStates: Story = {
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {STATES.map((st) => (
            <th key={st} style={headCell}>{cap(st)}</th>
          ))}
          <th style={headCell}>Disabled (code only)</th>
        </tr>
      </thead>
      <tbody>
        {SIZES.map((s) => (
          <tr key={s}>
            <th style={headCell}>{sizeLabel[s]}</th>
            {STATES.map((st) => (
              <td key={st} style={cell}>
                <PaginationItem {...variantProps(s, st)} />
              </td>
            ))}
            <td style={cell}>
              <PaginationItem page={1} size={s} disabled />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Full Figma matrix: 16 variants laid out like the component set (state rows × size columns) ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 16 variants)',
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {SIZES.map((s) => (
            <th key={s} style={headCell}>{`Size=${sizeLabel[s]}`}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {STATES.map((st) => (
          <tr key={st}>
            <th style={headCell}>{`State=${cap(st)}`}</th>
            {SIZES.map((s) => (
              <td key={s} style={cell}>
                <PaginationItem {...variantProps(s, st)} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Multi-digit pages grow horizontally ── */

export const MultiDigitPages: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {SIZES.map((s) => (
        <div key={s} style={{ display: 'flex', gap: 8 }}>
          {[9, 10, 100, 1000, 10000].map((p) => (
            <PaginationItem key={p} page={p} size={s} selected={p === 100} />
          ))}
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const ClickSelectsPage: Story = {
  tags: ['test'],
  args: { page: 3 },
  play: async ({ args, canvasElement }) => {
    const item = within(canvasElement).getByRole('button', { name: 'Page 3' });
    await userEvent.click(item);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const KeyboardActivation: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const item = within(canvasElement).getByRole('button', { name: 'Page 1' });
    await userEvent.tab();
    await expect(item).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

export const SelectedIsCurrentPage: Story = {
  tags: ['test'],
  args: { selected: true },
  play: async ({ canvasElement }) => {
    const item = within(canvasElement).getByRole('button', { name: 'Page 1' });
    await expect(item).toHaveAttribute('aria-current', 'page');
  },
};
