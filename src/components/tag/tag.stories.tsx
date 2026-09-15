import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Tag } from './Tag';
import type { TagProps, TagSize } from './tag.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → 01 Tag (node 22123:13334)
 * Size × State — every combination is rendered in `FigmaMatrix`.
 */

const SIZES: TagSize[] = ['large', 'medium', 'small', 'extra-small'];
const STATES = ['enabled', 'disabled', 'skeleton'] as const;
type State = (typeof STATES)[number];

const sizeLabel: Record<TagSize, string> = {
  large: 'Large',
  medium: 'Medium',
  small: 'Small',
  'extra-small': 'Extra small',
};
const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Props for one Figma variant. */
function variantProps(size: TagSize, state: State | 'focused'): TagProps {
  return {
    size,
    disabled: state === 'disabled',
    skeleton: state === 'skeleton',
    'data-state': state === 'focused' ? 'focused' : undefined,
    onDismiss: () => {},
    children: 'Tag label',
  };
}

/* ── Layout helpers (story-only) ── */

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 8, verticalAlign: 'middle' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

/* ------------------------------------------------------------------ */

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  parameters: {
    docs: {
      description: {
        component:
          'Highlights applied filters or selected items and lets users remove them. Use a Chip for filtering and a Badge for status. ' +
          'Medium is the default outside inputs; Small goes inside large inputs, Extra small inside medium inputs. ' +
          'Long labels truncate with an ellipsis and a tooltip. Keyboard: Tab focuses the close icon, Enter/Space removes the tag.',
      },
    },
  },
  argTypes: {
    size: { name: 'Size', control: 'inline-radio', options: SIZES },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    children: { name: 'Text', control: 'text' },
    dismissLabel: { control: 'text' },
    'data-state': { name: 'Forced state', control: 'inline-radio', options: [undefined, 'focused'] },
  },
  args: {
    size: 'medium',
    children: 'Tag label',
    onDismiss: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Tag>;

/* ── Default ── */

export const Default: Story = {};

/* ── Per size (Figma "Size") ── */

export const Large: Story = { args: { size: 'large' } };
export const Medium: Story = { args: { size: 'medium' } };
export const Small: Story = { args: { size: 'small' } };
export const ExtraSmall: Story = { name: 'Extra small', args: { size: 'extra-small' } };

/* ── Per state (Figma "State") ── */

const StateRow = ({ state }: { state: State | 'focused' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    {SIZES.map((s) => (
      <Tag key={s} {...variantProps(s, state)} />
    ))}
  </div>
);

export const Enabled: Story = { render: () => <StateRow state="enabled" /> };
export const Disabled: Story = { render: () => <StateRow state="disabled" /> };
export const Skeleton: Story = { render: () => <StateRow state="skeleton" /> };
export const CloseIconFocused: Story = {
  name: 'Close icon focused (forced)',
  render: () => <StateRow state="focused" />,
};

/* ── All sizes ── */

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {SIZES.map((s) => (
        <Tag key={s} {...args} size={s}>
          {sizeLabel[s]}
        </Tag>
      ))}
    </div>
  ),
};

/* ── All states — sizes × states (plus forced close-icon focus) ── */

const ALL_STATE_COLUMNS = [...STATES, 'focused'] as const;

export const AllStates: Story = {
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {ALL_STATE_COLUMNS.map((s) => (
            <th key={s} style={headCell}>{s === 'focused' ? 'Focused (close icon)' : label(s)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {SIZES.map((size) => (
          <tr key={size}>
            <th style={headCell}>{sizeLabel[size]}</th>
            {ALL_STATE_COLUMNS.map((s) => (
              <td key={s} style={cell}>
                <Tag {...variantProps(size, s)} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Full Figma matrix: all 12 variants, laid out like the component set ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 12 variants)',
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
            <th style={headCell}>{`State=${label(st)}`}</th>
            {SIZES.map((s) => (
              <td key={s} style={cell}>
                <Tag {...variantProps(s, st)} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Edge cases from Figma docs ── */

export const OverflowTruncates: Story = {
  name: 'Overflow: truncates with tooltip',
  render: () => (
    <div style={{ width: 200, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
      {SIZES.map((s) => (
        <Tag key={s} size={s} onDismiss={() => {}}>
          Lower jaw preparation scan with margin line
        </Tag>
      ))}
    </div>
  ),
};

export const WithoutDismiss: Story = {
  name: 'Without close icon',
  args: { onDismiss: undefined, children: 'Read only' },
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const ClickDismisses: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const close = within(canvasElement).getByRole('button', { name: 'Remove Tag label' });
    await userEvent.click(close);
    await expect(args.onDismiss).toHaveBeenCalledTimes(1);
  },
};

export const KeyboardDismisses: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const close = within(canvasElement).getByRole('button', { name: 'Remove Tag label' });
    await userEvent.tab();
    await expect(close).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onDismiss).toHaveBeenCalledTimes(2);
  },
};

export const DisabledIgnoresDismiss: Story = {
  tags: ['test'],
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    const close = within(canvasElement).getByRole('button', { name: 'Remove Tag label' });
    await expect(close).toBeDisabled();
    await userEvent.click(close, { pointerEventsCheck: 0 });
    await expect(args.onDismiss).not.toHaveBeenCalled();
  },
};
