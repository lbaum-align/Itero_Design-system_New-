import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { MenuTrailingElements } from './MenuTrailingElements';

const meta: Meta<typeof MenuTrailingElements> = {
  title: 'Private/MenuTrailingElements',
  component: MenuTrailingElements,
  argTypes: {
    toggle: { control: 'boolean' },
    toggleSelected: { control: 'boolean' },
    showLabel: { control: 'boolean' },
  },
  args: {
    onToggleChange: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof MenuTrailingElements>;

/* ── Default (Keyboard Shortcut) ── */

export const Default: Story = {
  args: { shortcutKeys: ['⌘', 'X'] },
};

/* ── Per-type variants ── */

export const KeyboardShortcut: Story = {
  args: { shortcutKeys: ['⌘', 'X'] },
};

export const KeyboardShortcutMultiKey: Story = {
  args: { shortcutKeys: ['Ctrl', 'Shift', 'P'] },
};

export const ToggleOff: Story = {
  args: { toggle: true, toggleSelected: false },
};

export const ToggleOn: Story = {
  args: { toggle: true, toggleSelected: true },
};

export const Submenu: Story = {
  args: { icon: 'chevron-right' },
};

export const SubmenuWithLabel: Story = {
  args: { icon: 'chevron-right', label: 'More options', showLabel: true },
};

/* ── All Types ── */

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ width: 140, fontWeight: 600 }}>Shortcut:</span>
        <MenuTrailingElements shortcutKeys={['⌘', 'X']} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ width: 140, fontWeight: 600 }}>Shortcut (multi):</span>
        <MenuTrailingElements shortcutKeys={['Ctrl', 'Shift', 'P']} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ width: 140, fontWeight: 600 }}>Toggle (off):</span>
        <MenuTrailingElements toggle toggleSelected={false} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ width: 140, fontWeight: 600 }}>Toggle (on):</span>
        <MenuTrailingElements toggle toggleSelected />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ width: 140, fontWeight: 600 }}>Submenu:</span>
        <MenuTrailingElements icon="chevron-right" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ width: 140, fontWeight: 600 }}>Submenu + label:</span>
        <MenuTrailingElements icon="chevron-right" label="Label" showLabel />
      </div>
    </div>
  ),
};
