import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Menu, MenuDivider } from './Menu';
import { MenuItems } from '../_menu-items';
import type { MenuItemSize } from '../_menu-items';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Menu (node 30413:43333, page "Menu").
 * Size (Large, Medium, Small) × Scroll — every combination is rendered in `FigmaMatrix`.
 * Items: see Private/_MenuItems.
 */

const SIZES: MenuItemSize[] = ['large', 'medium', 'small'];
const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 16, verticalAlign: 'top' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

/** Figma Menu content: 8 × "Option"; Large items show the divider. */
const FigmaItems = ({ size, count = 8 }: { size: MenuItemSize; count?: number }) => (
  <>
    {Array.from({ length: count }, (_, i) => (
      <MenuItems key={i} label="Option" showDivider={size === 'large'} />
    ))}
  </>
);

/* ------------------------------------------------------------------ */

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
  parameters: {
    docs: {
      description: {
        component:
          'A list of related actions that opens from a trigger. Use Dropdown/Combobox for form choices. ' +
          'Keyboard: Tab focuses the first item, ArrowUp/ArrowDown move, Home/End jump, Enter/Space activate, ' +
          'ArrowRight opens a submenu item, Escape closes (`onClose`).',
      },
    },
  },
  argTypes: {
    size: { name: 'Size', control: 'inline-radio', options: SIZES },
    scroll: { name: 'Scroll', control: 'boolean' },
    maxHeight: { control: 'number' },
  },
  args: { size: 'large', scroll: false, onClose: fn(), 'aria-label': 'Actions' },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: 'var(--scanner-bg-page)', minHeight: 320 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Menu>;

/* ── Default ── */

export const Default: Story = {
  render: (args) => (
    <Menu {...args}>
      <MenuItems label="Cut" showTrailingElement trailingElementProps={{ shortcutKeys: ['⌘', 'X'] }} />
      <MenuItems label="Copy" showTrailingElement trailingElementProps={{ shortcutKeys: ['⌘', 'C'] }} />
      <MenuItems label="Paste" showTrailingElement trailingElementProps={{ shortcutKeys: ['⌘', 'V'] }} />
      <MenuDivider />
      <MenuItems label="Delete" type="destructive" />
    </Menu>
  ),
};

/* ── Per size ── */

export const Large: Story = { name: 'Size: Large', args: { size: 'large' }, render: (args) => <Menu {...args}><FigmaItems size="large" /></Menu> };
export const Medium: Story = { name: 'Size: Medium', args: { size: 'medium' }, render: (args) => <Menu {...args}><FigmaItems size="medium" /></Menu> };
export const Small: Story = { name: 'Size: Small', args: { size: 'small' }, render: (args) => <Menu {...args}><FigmaItems size="small" /></Menu> };

export const AllSizes: Story = {
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          {SIZES.map((s) => (
            <th key={s} style={headCell}>{`Size=${label(s)}`}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {SIZES.map((s) => (
            <td key={s} style={cell}>
              <Menu size={s} aria-label={`${s} menu`}>
                <FigmaItems size={s} count={5} />
              </Menu>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  ),
};

/* ── Figma matrix: Size × Scroll ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (3 sizes × Scroll)',
  render: () => (
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
        {[false, true].map((scroll) => (
          <tr key={String(scroll)}>
            <th style={headCell}>{`Scroll=${scroll ? 'True' : 'False'}`}</th>
            {SIZES.map((s) => (
              <td key={s} style={cell}>
                <Menu size={s} scroll={scroll} maxHeight={scroll ? 280 : undefined} aria-label={`${s} menu`}>
                  <FigmaItems size={s} count={scroll ? 12 : 8} />
                </Menu>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Item states inside a menu (forced) ── */

export const AllStates: Story = {
  render: () => (
    <table style={table}>
      <tbody>
        <tr>
          {SIZES.map((s) => (
            <td key={s} style={cell}>
              <Menu size={s} aria-label={`${s} menu`}>
                <MenuItems label="Enabled" />
                <MenuItems label="Hovered" data-state="hovered" />
                <MenuItems label="Focused" data-state="focused" />
                <MenuItems label="Disabled" disabled />
                <MenuItems label="Destructive" type="destructive" />
                <MenuItems label="Destructive hovered" type="destructive" data-state="hovered" />
                <MenuItems label="Destructive disabled" type="destructive" disabled />
              </Menu>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  ),
};

/* ── Figma anatomy example ── */

export const Anatomy: Story = {
  render: (args) => (
    <Menu {...args} size="large" style={{ width: 288 }}>
      <MenuItems label="Option" indented showDivider showTrailingElement trailingElementProps={{ type: 'submenu', label: 'Label', showLabel: true }} />
      <MenuItems label="Option" indented showDivider showTrailingElement trailingElementProps={{ shortcutKeys: ['⌘', 'D'] }} />
      <MenuItems label="Option" selected showDivider showTrailingElement trailingElementProps={{ shortcutKeys: ['⌘', 'A'] }} />
      <MenuItems label="Option" indented showDivider showTrailingElement trailingElementProps={{ shortcutKeys: ['⌘', 'V'] }} />
      <MenuItems label="Option" indented showDivider />
      <MenuItems label="Option" indented showSubtext subtext="Subhead" showDivider showTrailingElement trailingElementProps={{ type: 'submenu' }} />
      <MenuItems label="Option" indented showDivider />
      <MenuItems label="Option" showDivider />
      <MenuItems label="Option" type="destructive" indented />
    </Menu>
  ),
};

export const WithHeadlines: Story = {
  render: (args) => (
    <Menu {...args} size="medium">
      <MenuItems label="Rename" showHeadline headline="File" />
      <MenuItems label="Duplicate" showDivider />
      <MenuItems label="Preferences" showHeadline headline="Settings" />
      <MenuItems label="Auto-save" showTrailingElement trailingElementProps={{ toggle: true, toggleSelected: true }} />
    </Menu>
  ),
};

export const WithScroll: Story = {
  name: 'Scroll (long list)',
  args: { scroll: true, maxHeight: 240, size: 'medium' },
  render: (args) => (
    <Menu {...args}>
      {Array.from({ length: 15 }, (_, i) => (
        <MenuItems key={i} label={`Option ${i + 1}`} />
      ))}
    </Menu>
  ),
};

export const LongLabelTruncates: Story = {
  render: (args) => (
    <Menu {...args}>
      <MenuItems label="Export the full-arch scan with all annotations" />
      <MenuItems label="Share" showTrailingElement trailingElementProps={{ type: 'submenu' }} />
    </Menu>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

const CheckableMenu = (args: React.ComponentProps<typeof Menu>) => {
  const [grid, setGrid] = useState(false);
  return (
    <Menu {...args}>
      <MenuItems label="Cut" />
      <MenuItems label="Copy" disabled />
      <MenuItems label="Show grid" selected={grid} onClick={() => setGrid((g) => !g)} />
      <MenuItems label="Delete" type="destructive" />
    </Menu>
  );
};

export const KeyboardNavigation: Story = {
  tags: ['test'],
  render: (args) => <CheckableMenu {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
    /* Disabled "Copy" is skipped */
    await userEvent.keyboard('{ArrowDown}');
    const grid = canvas.getByRole('menuitemcheckbox', { name: 'Show grid' });
    await expect(grid).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(grid).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(canvas.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(canvas.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(args.onClose).toHaveBeenCalledTimes(1);
  },
};

export const ClickActivatesItem: Story = {
  tags: ['test'],
  render: (args) => <CheckableMenu {...args} />,
  play: async ({ canvasElement }) => {
    const grid = within(canvasElement).getByRole('menuitemcheckbox', { name: 'Show grid' });
    await userEvent.click(grid);
    await expect(grid).toHaveAttribute('aria-checked', 'true');
  },
};
