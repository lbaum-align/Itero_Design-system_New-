import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TabItem } from './TabItem';

const meta: Meta<typeof TabItem> = {
  title: 'Components/_TabItem',
  component: TabItem,
  argTypes: {
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
  },
  args: {
    onClick: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof TabItem>;

// ---------------------------------------------------------------------------
// Default — interactive Controls for every prop
// ---------------------------------------------------------------------------
export const Default: Story = {
  args: { children: 'Tab item' },
};

// ---------------------------------------------------------------------------
// Selected — active tab with bottom indicator
// ---------------------------------------------------------------------------
export const Selected: Story = {
  args: { children: 'Tab item', selected: true },
};

// ---------------------------------------------------------------------------
// Disabled — dimmed, non-interactive
// ---------------------------------------------------------------------------
export const Disabled: Story = {
  args: { children: 'Tab item', disabled: true },
};

// ---------------------------------------------------------------------------
// Skeleton — loading placeholder
// ---------------------------------------------------------------------------
export const Skeleton: Story = {
  args: { skeleton: true },
};

// ---------------------------------------------------------------------------
// AllStates — matrix matching the Figma component set exactly.
// Uses data-state attributes to force hover / focus visuals.
// ---------------------------------------------------------------------------
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Row labels */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32 }}>
        <div style={{ width: 80, textAlign: 'right', fontSize: 12, color: '#666' }}>
          Enabled
        </div>
        <TabItem>Tab item</TabItem>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32 }}>
        <div style={{ width: 80, textAlign: 'right', fontSize: 12, color: '#666' }}>
          Hovered
        </div>
        <TabItem data-state="hovered">Tab item</TabItem>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32 }}>
        <div style={{ width: 80, textAlign: 'right', fontSize: 12, color: '#666' }}>
          Focused
        </div>
        <TabItem data-state="focused">Tab item</TabItem>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32 }}>
        <div style={{ width: 80, textAlign: 'right', fontSize: 12, color: '#666' }}>
          Selected
        </div>
        <TabItem selected>Tab item</TabItem>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32 }}>
        <div style={{ width: 80, textAlign: 'right', fontSize: 12, color: '#666' }}>
          Disabled
        </div>
        <TabItem disabled>Tab item</TabItem>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32 }}>
        <div style={{ width: 80, textAlign: 'right', fontSize: 12, color: '#666' }}>
          Skeleton
        </div>
        <TabItem skeleton>Tab item</TabItem>
      </div>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// TabBar — simulates a group of tabs as they'd appear in context
// ---------------------------------------------------------------------------
export const TabBar: Story = {
  render: () => (
    <div
      role="tablist"
      style={{
        display: 'flex',
        gap: 24,
        borderBottom: '1px solid var(--scanner-border-subtle)',
      }}
    >
      <TabItem selected>Overview</TabItem>
      <TabItem>Details</TabItem>
      <TabItem>Settings</TabItem>
      <TabItem disabled>Billing</TabItem>
    </div>
  ),
};
