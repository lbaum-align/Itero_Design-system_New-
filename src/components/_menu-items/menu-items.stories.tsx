import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { MenuItems } from './MenuItems';
import type { MenuItemSize, MenuItemsProps, MenuItemType } from './menu-items.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → _Menu items (node 30413:41882, page "Menu").
 * Size × Type × State = 24 variants (rendered in `FigmaMatrix`), plus boolean properties
 * Show divider / Show headline / Show subtext / Indented / Selected / Show trailing element.
 */

const SIZES: MenuItemSize[] = ['large', 'medium', 'small'];
const TYPES: MenuItemType[] = ['neutral', 'destructive'];
const STATES = ['enabled', 'hovered', 'focused', 'disabled'] as const;
type State = (typeof STATES)[number];

const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function variantProps(size: MenuItemSize, type: MenuItemType, state: State, extra: Partial<MenuItemsProps> = {}): MenuItemsProps {
  return {
    size,
    type,
    label: 'Option',
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

/* ------------------------------------------------------------------ */

const meta: Meta<typeof MenuItems> = {
  title: 'Private/_MenuItems',
  component: MenuItems,
  parameters: {
    docs: {
      description: {
        component:
          'One row of a Menu. Neutral for standard actions, Destructive for risky ones (delete, remove). ' +
          'Labels truncate with an ellipsis (Figma: avoid multi-line items). Enter/Space activate; ArrowRight opens a submenu item.',
      },
    },
  },
  argTypes: {
    size: { name: 'Size', control: 'inline-radio', options: SIZES },
    type: { name: 'Type', control: 'inline-radio', options: TYPES },
    disabled: { control: 'boolean' },
    'data-state': { name: 'Forced state', control: 'inline-radio', options: [undefined, 'hovered', 'focused'] },
    label: { name: 'Option text value', control: 'text' },
    showHeadline: { name: 'Show headline', control: 'boolean' },
    headline: { name: 'Headline text value', control: 'text' },
    showSubtext: { name: 'Show subtext', control: 'boolean' },
    subtext: { name: 'Subhead text value', control: 'text' },
    showDivider: { name: 'Show divider', control: 'boolean' },
    indented: { name: 'Indented', control: 'boolean' },
    selected: { name: 'Selected', control: 'boolean' },
    showTrailingElement: { name: 'Show trailing element', control: 'boolean' },
    trailingElementProps: { control: 'object' },
  },
  args: {
    size: 'large',
    type: 'neutral',
    label: 'Option',
    headline: 'Headline',
    subtext: 'Subhead',
    trailingElementProps: { shortcutKeys: ['⌘', 'X'] },
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

type Story = StoryObj<typeof MenuItems>;

const Boxed = (props: MenuItemsProps) => (
  <div style={itemBox}>
    <MenuItems {...props} />
  </div>
);

/* ── Default ── */

export const Default: Story = { render: (args) => <Boxed {...args} /> };

/* ── Type ── */

export const Neutral: Story = { name: 'Type: Neutral', render: (args) => <Boxed {...args} type="neutral" /> };
export const Destructive: Story = {
  name: 'Type: Destructive',
  render: (args) => <Boxed {...args} type="destructive" label="Delete" />,
};

/* ── Boolean properties ── */

export const Selected: Story = { render: (args) => <Boxed {...args} selected /> };
export const Indented: Story = { render: (args) => <Boxed {...args} indented /> };
export const WithHeadline: Story = { name: 'Show headline', render: (args) => <Boxed {...args} showHeadline /> };
export const WithSubtext: Story = { name: 'Show subtext', render: (args) => <Boxed {...args} showSubtext /> };
export const WithDivider: Story = { name: 'Show divider', render: (args) => <Boxed {...args} showDivider /> };

export const TrailingElements: Story = {
  name: 'Show trailing element (all types)',
  render: (args) => (
    <div style={itemBox}>
      <MenuItems {...args} label="Cut" showTrailingElement trailingElementProps={{ shortcutKeys: ['⌘', 'X'] }} />
      <MenuItems {...args} label="Auto-save" showTrailingElement trailingElementProps={{ toggle: true, toggleSelected: true }} />
      <MenuItems {...args} label="Export as" showTrailingElement trailingElementProps={{ type: 'submenu', label: 'PNG', showLabel: true }} />
      <MenuItems {...args} label="Share" showTrailingElement trailingElementProps={{ type: 'submenu' }} />
    </div>
  ),
};

/* ── All sizes ── */

export const AllSizes: Story = {
  render: (args) => (
    <table style={table}>
      <tbody>
        {SIZES.map((s) => (
          <tr key={s}>
            <th style={headCell}>{label(s)}</th>
            <td style={cell}>
              <Boxed {...args} size={s} />
            </td>
            <td style={cell}>
              <Boxed
                {...args}
                size={s}
                selected
                showSubtext
                showTrailingElement
                trailingElementProps={{ shortcutKeys: ['⌘', 'X'] }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── All states — type rows × state columns (size from controls) ── */

export const AllStates: Story = {
  render: ({ size = 'large' }) => (
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
        {TYPES.map((t) => (
          <tr key={t}>
            <th style={headCell}>{label(t)}</th>
            {STATES.map((st) => (
              <td key={st} style={cell}>
                <Boxed
                  {...variantProps(size, t, st, {
                    selected: t === 'neutral' ? true : undefined,
                    showTrailingElement: true,
                    trailingElementProps: { shortcutKeys: ['⌘', 'X'] },
                  })}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const Hovered: Story = { render: (args) => <Boxed {...args} data-state="hovered" /> };
export const Focused: Story = { render: (args) => <Boxed {...args} data-state="focused" /> };
export const Disabled: Story = {
  render: (args) => (
    <div style={itemBox}>
      <MenuItems {...args} disabled selected showSubtext showTrailingElement />
      <MenuItems {...args} disabled label="Auto-save" showTrailingElement trailingElementProps={{ toggle: true, toggleSelected: true }} />
      <MenuItems {...args} disabled type="destructive" label="Delete" />
    </div>
  ),
};

/* ── Figma matrix: all 24 variants + boolean properties ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 24 variants)',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ padding: 24 }}>
      {SIZES.map((s) => (
        <section key={s}>
          <h3 style={sectionTitle}>{`Size=${label(s)}`}</h3>
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
              {TYPES.map((t) => (
                <tr key={t}>
                  <th style={headCell}>{`Type=${label(t)}`}</th>
                  {STATES.map((st) => (
                    <td key={st} style={cell}>
                      <Boxed {...variantProps(s, t, st)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      <h3 style={sectionTitle}>Boolean properties (Neutral, per size)</h3>
      <table style={table}>
        <thead>
          <tr>
            <th style={headCell} />
            {SIZES.map((s) => (
              <th key={s} style={headCell}>{`Size=${label(s)}`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(
            [
              ['Show divider', { showDivider: true }],
              ['Show headline', { showHeadline: true }],
              ['Show subtext', { showSubtext: true }],
              ['Indented', { indented: true }],
              ['Selected', { selected: true }],
              ['Trailing: Keyboard shortcut', { showTrailingElement: true, trailingElementProps: { shortcutKeys: ['⌘', 'X'] } }],
              ['Trailing: Toggle', { showTrailingElement: true, trailingElementProps: { toggle: true } }],
              ['Trailing: Submenu + label', { showTrailingElement: true, trailingElementProps: { type: 'submenu', label: 'Label', showLabel: true } }],
              ['All on', { showDivider: true, showHeadline: true, showSubtext: true, selected: true, showTrailingElement: true, trailingElementProps: { shortcutKeys: ['⌘', 'X'] } }],
            ] as Array<[string, Partial<MenuItemsProps>]>
          ).map(([name, extra]) => (
            <tr key={name}>
              <th style={headCell}>{name}</th>
              {SIZES.map((s) => (
                <td key={s} style={cell}>
                  <Boxed {...variantProps(s, 'neutral', 'enabled', extra)} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

/* ── Overflow: long labels truncate with an ellipsis ── */

export const LongLabelTruncates: Story = {
  render: (args) => (
    <Boxed
      {...args}
      label="Export the full-arch scan with all annotations and notes"
      showTrailingElement
      trailingElementProps={{ shortcutKeys: ['⇧', '⌘', 'E'] }}
    />
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const ClickActivates: Story = {
  tags: ['test'],
  render: (args) => <Boxed {...args} />,
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('menuitem', { name: 'Option' }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const KeyboardActivation: Story = {
  tags: ['test'],
  render: (args) => <Boxed {...args} />,
  play: async ({ args, canvasElement }) => {
    const item = within(canvasElement).getByRole('menuitem', { name: 'Option' });
    await userEvent.tab();
    await expect(item).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

export const DisabledIgnoresClick: Story = {
  tags: ['test'],
  render: (args) => <Boxed {...args} disabled />,
  play: async ({ args, canvasElement }) => {
    const item = within(canvasElement).getByRole('menuitem', { name: 'Option' });
    await expect(item).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(item, { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

const ToggleItem = (args: MenuItemsProps) => {
  const [on, setOn] = useState(false);
  return (
    <Boxed
      {...args}
      label="Auto-save"
      showTrailingElement
      trailingElementProps={{ toggle: true, toggleSelected: on, onToggleChange: setOn }}
    />
  );
};

export const ToggleItemChecks: Story = {
  tags: ['test'],
  render: (args) => <ToggleItem {...args} />,
  play: async ({ canvasElement }) => {
    const item = within(canvasElement).getByRole('menuitemcheckbox', { name: 'Auto-save' });
    await expect(item).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(item);
    await expect(item).toHaveAttribute('aria-checked', 'true');
  },
};
