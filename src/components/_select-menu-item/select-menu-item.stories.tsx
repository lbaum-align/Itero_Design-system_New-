import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { SelectMenuItem } from './SelectMenuItem';
import type { SelectMenuItemProps, SelectMenuItemSize } from './select-menu-item.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → _Select menu Item (node 7149:1690, page "Dropdown").
 * Size × Type (Single) × Selected × State = 32 variants (rendered in `FigmaMatrix`),
 * plus Show divider / Show headline / Show subtext.
 */

const SIZES: SelectMenuItemSize[] = ['x-large', 'large', 'medium', 'small'];
const STATES = ['enabled', 'hovered', 'focused', 'disabled'] as const;
type State = (typeof STATES)[number];

const sizeLabel: Record<SelectMenuItemSize, string> = { 'x-large': 'X-Large', large: 'Large', medium: 'Medium', small: 'Small' };
const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function variantProps(
  size: SelectMenuItemSize,
  selected: boolean,
  state: State,
  extra: Partial<SelectMenuItemProps> = {},
): SelectMenuItemProps {
  return {
    size,
    selected,
    optionText: 'Option',
    disabled: state === 'disabled',
    'data-state': state === 'hovered' || state === 'focused' ? state : undefined,
    ...extra,
  };
}

/* ── Layout helpers (story-only) ── */

const ITEM_WIDTH = 288; // Figma variant width
const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 8, verticalAlign: 'top' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};
const itemBox: React.CSSProperties = { width: ITEM_WIDTH, background: 'var(--scanner-bg-elevated)' };
const sectionTitle: React.CSSProperties = {
  font: '500 16px/24px var(--scanner-font-sans)',
  color: 'var(--scanner-text-primary)',
  margin: '24px 0 8px',
};

/** Options must live in a listbox for valid ARIA. */
const Box = (props: SelectMenuItemProps) => (
  <div role="listbox" aria-label="Options" style={itemBox}>
    <SelectMenuItem {...props} />
  </div>
);

/* ------------------------------------------------------------------ */

const meta: Meta<typeof SelectMenuItem> = {
  title: 'Private/_SelectMenuItem',
  component: SelectMenuItem,
  parameters: {
    docs: {
      description: {
        component:
          'One option of a SelectMenu (Dropdown / Combobox list). Selected shows a trailing checkmark. ' +
          'Long option text truncates with an ellipsis (Figma: avoid multiple lines).',
      },
    },
  },
  argTypes: {
    size: { name: 'Size', control: 'inline-radio', options: SIZES },
    selected: { name: 'Selected', control: 'boolean' },
    disabled: { control: 'boolean' },
    'data-state': { name: 'Forced state', control: 'inline-radio', options: [undefined, 'hovered', 'focused'] },
    optionText: { name: 'Option text', control: 'text' },
    showHeadline: { name: 'Show headline', control: 'boolean' },
    headlineText: { name: 'Headline text', control: 'text' },
    showSubtext: { name: 'Show subtext', control: 'boolean' },
    subheadText: { name: 'Subhead text', control: 'text' },
    showDivider: { name: 'Show divider', control: 'boolean' },
  },
  args: {
    size: 'x-large',
    selected: false,
    optionText: 'Option',
    headlineText: 'Headline',
    subheadText: 'Subhead',
    onClick: fn(),
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

type Story = StoryObj<typeof SelectMenuItem>;

/* ── Default ── */

export const Default: Story = { render: (args) => <Box {...args} /> };

/* ── Per size ── */

export const XLarge: Story = { name: 'Size: X-Large', render: (args) => <Box {...args} size="x-large" /> };
export const Large: Story = { name: 'Size: Large', render: (args) => <Box {...args} size="large" /> };
export const Medium: Story = { name: 'Size: Medium', render: (args) => <Box {...args} size="medium" /> };
export const Small: Story = { name: 'Size: Small', render: (args) => <Box {...args} size="small" /> };

/* ── Selected / booleans ── */

export const Selected: Story = { name: 'Selected: True', render: (args) => <Box {...args} selected /> };
export const WithHeadline: Story = { name: 'Show headline', render: (args) => <Box {...args} showHeadline /> };
export const WithSubtext: Story = { name: 'Show subtext', render: (args) => <Box {...args} showSubtext /> };
export const WithDivider: Story = { name: 'Show divider', render: (args) => <Box {...args} showDivider /> };

/* ── All sizes ── */

export const AllSizes: Story = {
  render: (args) => (
    <table style={table}>
      <tbody>
        {SIZES.map((s) => (
          <tr key={s}>
            <th style={headCell}>{sizeLabel[s]}</th>
            <td style={cell}>
              <Box {...args} size={s} />
            </td>
            <td style={cell}>
              <Box {...args} size={s} selected showSubtext />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── All states — selected rows × state columns (size from controls) ── */

export const AllStates: Story = {
  render: ({ size = 'x-large' }) => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {STATES.map((st) => (
            <th key={st} style={headCell}>{label(st)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[false, true].map((sel) => (
          <tr key={String(sel)}>
            <th style={headCell}>{`Selected=${sel ? 'True' : 'False'}`}</th>
            {STATES.map((st) => (
              <td key={st} style={cell}>
                <Box {...variantProps(size, sel, st)} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const Hovered: Story = { render: (args) => <Box {...args} data-state="hovered" /> };
export const Focused: Story = { render: (args) => <Box {...args} data-state="focused" /> };
export const Disabled: Story = { render: (args) => <Box {...args} disabled selected showSubtext /> };

/* ── Figma matrix: all 32 variants, laid out like the component set ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 32 variants)',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ padding: 24 }}>
      {SIZES.map((s) => (
        <section key={s}>
          <h3 style={sectionTitle}>{`Size=${sizeLabel[s]}, Type=Single`}</h3>
          <table style={table}>
            <thead>
              <tr>
                <th style={headCell} />
                {STATES.map((st) => (
                  <th key={st} style={headCell}>{`State=${label(st)}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[false, true].map((sel) => (
                <tr key={String(sel)}>
                  <th style={headCell}>{`Selected=${sel ? 'True' : 'False'}`}</th>
                  {STATES.map((st) => (
                    <td key={st} style={cell}>
                      <Box {...variantProps(s, sel, st)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      <h3 style={sectionTitle}>Boolean properties (per size)</h3>
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
          {(
            [
              ['Show headline', { showHeadline: true }],
              ['Show subtext', { showSubtext: true }],
              ['Show subtext + Selected', { showSubtext: true, selected: true }],
              ['Show divider', { showDivider: true }],
            ] as Array<[string, Partial<SelectMenuItemProps>]>
          ).map(([name, extra]) => (
            <tr key={name}>
              <th style={headCell}>{name}</th>
              {SIZES.map((s) => (
                <td key={s} style={cell}>
                  <Box {...variantProps(s, false, 'enabled', extra)} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

export const LongOptionTruncates: Story = {
  render: (args) => <Box {...args} selected optionText="Invisalign Outcome Simulator Pro with full-arch progress assessment" />,
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const ClickCallsOnClick: Story = {
  tags: ['test'],
  render: (args) => <Box {...args} />,
  play: async ({ args, canvasElement }) => {
    const option = within(canvasElement).getByRole('option', { name: 'Option' });
    await expect(option).toHaveAttribute('aria-selected', 'false');
    await userEvent.click(option);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const DisabledIgnoresClick: Story = {
  tags: ['test'],
  render: (args) => <Box {...args} disabled />,
  play: async ({ args, canvasElement }) => {
    const option = within(canvasElement).getByRole('option', { name: 'Option' });
    await expect(option).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(option, { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
