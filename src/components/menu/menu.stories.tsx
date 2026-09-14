import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Menu, MenuDivider } from './Menu';
import { MenuItems } from '../_menu-items';

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
  argTypes: {
    size: { control: 'select', options: ['large', 'medium', 'small'] },
    scroll: { control: 'boolean' },
  },
  args: { onClose: fn() },
  decorators: [
    (Story) => (
      <div style={{ padding: 32, background: 'var(--scanner-bg-secondary, #f4f4f4)', minHeight: 400 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Menu>;

/* ── Default ── */

export const Default: Story = {
  args: {
    size: 'large',
    children: (
      <>
        <MenuItems label="Option 1" />
        <MenuItems label="Option 2" />
        <MenuItems label="Option 3" />
        <MenuItems label="Option 4" />
      </>
    ),
  },
};

/* ── With icons (selected checkmark) ── */

export const WithIcons: Story = {
  render: () => (
    <Menu size="large">
      <MenuItems label="Option A" selected />
      <MenuItems label="Option B" />
      <MenuItems label="Option C" selected />
      <MenuItems label="Option D" />
    </Menu>
  ),
};

/* ── With keyboard shortcuts ── */

export const WithShortcuts: Story = {
  render: () => (
    <Menu size="large">
      <MenuItems
        label="Cut"
        showTrailingElement
        trailingElementProps={{ shortcutKeys: ['⌘', 'X'] }}
      />
      <MenuItems
        label="Copy"
        showTrailingElement
        trailingElementProps={{ shortcutKeys: ['⌘', 'C'] }}
      />
      <MenuItems
        label="Paste"
        showTrailingElement
        trailingElementProps={{ shortcutKeys: ['⌘', 'V'] }}
      />
    </Menu>
  ),
};

/* ── With toggle items ── */

export const WithToggles: Story = {
  render: () => (
    <Menu size="medium">
      <MenuItems
        label="Show toolbar"
        showTrailingElement
        trailingElementProps={{ toggle: true, toggleSelected: true }}
      />
      <MenuItems
        label="Show sidebar"
        showTrailingElement
        trailingElementProps={{ toggle: true, toggleSelected: false }}
      />
      <MenuItems
        label="Dark mode"
        showTrailingElement
        trailingElementProps={{ toggle: true, toggleSelected: false }}
      />
    </Menu>
  ),
};

/* ── With submenu indicator ── */

export const WithSubmenu: Story = {
  render: () => (
    <Menu size="large">
      <MenuItems label="New file" />
      <MenuItems
        label="Open recent"
        showTrailingElement
        trailingElementProps={{ icon: 'chevron-right' }}
      />
      <MenuItems
        label="Export as"
        showTrailingElement
        trailingElementProps={{ icon: 'chevron-right', label: 'PNG', showLabel: true }}
      />
    </Menu>
  ),
};

/* ── With dividers / groups ── */

export const WithDividers: Story = {
  render: () => (
    <Menu size="large">
      <MenuItems label="Undo" showTrailingElement trailingElementProps={{ shortcutKeys: ['⌘', 'Z'] }} />
      <MenuItems label="Redo" showTrailingElement trailingElementProps={{ shortcutKeys: ['⌘', 'Shift', 'Z'] }} />
      <MenuDivider />
      <MenuItems label="Cut" showTrailingElement trailingElementProps={{ shortcutKeys: ['⌘', 'X'] }} />
      <MenuItems label="Copy" showTrailingElement trailingElementProps={{ shortcutKeys: ['⌘', 'C'] }} />
      <MenuItems label="Paste" showTrailingElement trailingElementProps={{ shortcutKeys: ['⌘', 'V'] }} />
      <MenuDivider />
      <MenuItems label="Delete" type="destructive" />
    </Menu>
  ),
};

/* ── With headlines / groups ── */

export const WithHeadlines: Story = {
  render: () => (
    <Menu size="large">
      <MenuItems label="Edit" showHeadline headline="File" />
      <MenuItems label="Save" />
      <MenuDivider />
      <MenuItems label="Preferences" showHeadline headline="Settings" />
      <MenuItems label="Keyboard shortcuts" />
    </Menu>
  ),
};

/* ── Disabled items ── */

export const DisabledItems: Story = {
  render: () => (
    <Menu size="large">
      <MenuItems label="Cut" disabled />
      <MenuItems label="Copy" />
      <MenuItems label="Paste" disabled />
      <MenuDivider />
      <MenuItems label="Delete" type="destructive" disabled />
    </Menu>
  ),
};

/* ── All sizes ── */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'start' }}>
      {(['large', 'medium', 'small'] as const).map((s) => (
        <div key={s}>
          <div style={{ fontWeight: 600, marginBottom: 8, textTransform: 'capitalize' }}>{s}</div>
          <Menu size={s}>
            <MenuItems label="Option 1" />
            <MenuItems label="Option 2" />
            <MenuItems label="Option 3" />
            <MenuItems label="Option 4" />
            <MenuItems label="Option 5" />
          </Menu>
        </div>
      ))}
    </div>
  ),
};

/* ── With scroll indicator ── */

export const WithScroll: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'start' }}>
      <Menu size="large" scroll>
        <MenuItems label="Option 1" />
        <MenuItems label="Option 2" />
        <MenuItems label="Option 3" />
        <MenuItems label="Option 4" />
        <MenuItems label="Option 5" />
        <MenuItems label="Option 6" />
        <MenuItems label="Option 7" />
        <MenuItems label="Option 8" />
      </Menu>
      <Menu size="medium" scroll>
        <MenuItems label="Option 1" />
        <MenuItems label="Option 2" />
        <MenuItems label="Option 3" />
        <MenuItems label="Option 4" />
        <MenuItems label="Option 5" />
        <MenuItems label="Option 6" />
        <MenuItems label="Option 7" />
        <MenuItems label="Option 8" />
      </Menu>
    </div>
  ),
};

/* ── All Variants Matrix ── */

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Neutral types */}
      <div>
        <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Neutral</h3>
        <div style={{ display: 'flex', gap: 24 }}>
          <Menu size="large">
            <MenuItems label="Default" />
            <MenuItems label="Selected" selected />
            <MenuItems label="With subtext" showSubtext subtext="Description" />
            <MenuItems label="With shortcut" showTrailingElement trailingElementProps={{ shortcutKeys: ['⌘', 'K'] }} />
            <MenuItems label="Indented" indented />
            <MenuItems label="Disabled" disabled />
          </Menu>
        </div>
      </div>

      {/* Destructive types */}
      <div>
        <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Destructive</h3>
        <div style={{ display: 'flex', gap: 24 }}>
          <Menu size="large">
            <MenuItems label="Delete" type="destructive" />
            <MenuItems label="Delete (subtext)" type="destructive" showSubtext subtext="This cannot be undone" />
            <MenuItems label="Delete (disabled)" type="destructive" disabled />
          </Menu>
        </div>
      </div>

      {/* Mixed with dividers */}
      <div>
        <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Mixed with dividers</h3>
        <Menu size="large">
          <MenuItems label="Edit" showHeadline headline="Actions" showTrailingElement trailingElementProps={{ shortcutKeys: ['⌘', 'E'] }} />
          <MenuItems label="Duplicate" />
          <MenuDivider />
          <MenuItems label="Move to" showHeadline headline="Organize" showTrailingElement trailingElementProps={{ icon: 'chevron-right' }} />
          <MenuItems label="Archive" />
          <MenuDivider />
          <MenuItems label="Delete" type="destructive" showTrailingElement trailingElementProps={{ shortcutKeys: ['⌘', '⌫'] }} />
        </Menu>
      </div>
    </div>
  ),
};

/* ── Complex real-world example ── */

export const RealWorldExample: Story = {
  render: () => (
    <Menu size="medium">
      <MenuItems label="New tab" showTrailingElement trailingElementProps={{ shortcutKeys: ['⌘', 'T'] }} />
      <MenuItems label="New window" showTrailingElement trailingElementProps={{ shortcutKeys: ['⌘', 'N'] }} />
      <MenuItems label="New incognito window" showTrailingElement trailingElementProps={{ shortcutKeys: ['⌘', 'Shift', 'N'] }} />
      <MenuDivider />
      <MenuItems
        label="Bookmarks"
        showTrailingElement
        trailingElementProps={{ icon: 'chevron-right' }}
      />
      <MenuItems
        label="History"
        showTrailingElement
        trailingElementProps={{ icon: 'chevron-right' }}
      />
      <MenuDivider />
      <MenuItems
        label="Show full URLs"
        showTrailingElement
        trailingElementProps={{ toggle: true, toggleSelected: true }}
      />
      <MenuDivider />
      <MenuItems label="Settings" showTrailingElement trailingElementProps={{ shortcutKeys: ['⌘', ','] }} />
      <MenuItems label="Clear browsing data" type="destructive" />
    </Menu>
  ),
};
