import type { Meta, StoryObj } from '@storybook/react';
import { KeyboardShortcut } from './KeyboardShortcut';

const meta: Meta<typeof KeyboardShortcut> = {
  title: 'Private/_KeyboardShortcut',
  component: KeyboardShortcut,
  argTypes: {
    keys: {
      control: 'object',
      description: 'Array of key labels to display',
    },
  },
};
export default meta;

type Story = StoryObj<typeof KeyboardShortcut>;

export const Default: Story = {
  args: { keys: ['⌘', 'K'] },
};

export const SingleKey: Story = {
  args: { keys: ['Esc'] },
};

export const CommonShortcuts: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 12, width: 80, color: 'var(--scanner-text-secondary)' }}>Copy</span>
        <KeyboardShortcut keys={['⌘', 'C']} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 12, width: 80, color: 'var(--scanner-text-secondary)' }}>Paste</span>
        <KeyboardShortcut keys={['⌘', 'V']} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 12, width: 80, color: 'var(--scanner-text-secondary)' }}>Save</span>
        <KeyboardShortcut keys={['⌘', 'S']} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 12, width: 80, color: 'var(--scanner-text-secondary)' }}>Command</span>
        <KeyboardShortcut keys={['⌘', 'Shift', 'P']} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 12, width: 80, color: 'var(--scanner-text-secondary)' }}>Windows</span>
        <KeyboardShortcut keys={['Ctrl', 'Shift', 'P']} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 12, width: 80, color: 'var(--scanner-text-secondary)' }}>Undo</span>
        <KeyboardShortcut keys={['⌘', 'Z']} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 12, width: 80, color: 'var(--scanner-text-secondary)' }}>Select all</span>
        <KeyboardShortcut keys={['⌘', 'A']} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 12, width: 80, color: 'var(--scanner-text-secondary)' }}>Escape</span>
        <KeyboardShortcut keys={['Esc']} />
      </div>
    </div>
  ),
};
