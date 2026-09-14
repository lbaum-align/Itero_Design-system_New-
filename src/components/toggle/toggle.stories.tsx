import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Toggle } from './Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  argTypes: {
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
  },
  args: {
    onChange: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: { selected: false },
};

export const Selected: Story = {
  args: { selected: true },
};

export const Disabled: Story = {
  args: { selected: false, disabled: true },
};

export const DisabledSelected: Story = {
  args: { selected: true, disabled: true },
};

export const Skeleton: Story = {
  args: { skeleton: true },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '16px 32px', alignItems: 'center' }}>
      <span style={{ fontFamily: 'var(--scanner-font-sans)', fontSize: 12, color: 'var(--scanner-text-secondary)' }}>Off — Enabled</span>
      <Toggle selected={false} />

      <span style={{ fontFamily: 'var(--scanner-font-sans)', fontSize: 12, color: 'var(--scanner-text-secondary)' }}>On — Enabled</span>
      <Toggle selected={true} />

      <span style={{ fontFamily: 'var(--scanner-font-sans)', fontSize: 12, color: 'var(--scanner-text-secondary)' }}>Off — Disabled</span>
      <Toggle selected={false} disabled />

      <span style={{ fontFamily: 'var(--scanner-font-sans)', fontSize: 12, color: 'var(--scanner-text-secondary)' }}>On — Disabled</span>
      <Toggle selected={true} disabled />

      <span style={{ fontFamily: 'var(--scanner-font-sans)', fontSize: 12, color: 'var(--scanner-text-secondary)' }}>Skeleton</span>
      <Toggle skeleton />
    </div>
  ),
};
