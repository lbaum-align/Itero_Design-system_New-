import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SplitButton } from './SplitButton';

const meta: Meta<typeof SplitButton> = {
  title: 'Components/SplitButton',
  component: SplitButton,
  argTypes: {
    variant: { control: 'select', options: ['brand', 'danger', 'success'] },
    emphasis: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'select', options: ['large', 'medium', 'small'] },
    opened: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    skeleton: { control: 'boolean' },
  },
  args: {
    onMainClick: fn(),
    onDropdownClick: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof SplitButton>;

/* ── Default ── */

export const Default: Story = {
  args: { children: 'Button text' },
};

/* ── Emphasis variants ── */

export const Primary: Story = {
  args: { children: 'Button text', emphasis: 'primary' },
};

export const Secondary: Story = {
  args: { children: 'Button text', emphasis: 'secondary' },
};

export const Ghost: Story = {
  args: { children: 'Button text', emphasis: 'ghost' },
};

/* ── Opened state ── */

export const Opened: Story = {
  args: { children: 'Button text', opened: true },
};

/* ── All Emphasis ── */

export const AllEmphasis: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <SplitButton emphasis="primary">Primary</SplitButton>
      <SplitButton emphasis="secondary">Secondary</SplitButton>
      <SplitButton emphasis="ghost">Ghost</SplitButton>
    </div>
  ),
};

/* ── All Sizes ── */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <SplitButton size="large">Large</SplitButton>
      <SplitButton size="medium">Medium</SplitButton>
      <SplitButton size="small">Small</SplitButton>
    </div>
  ),
};

/* ── All States ── */

export const AllStates: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, auto)',
        gap: '16px 24px',
        alignItems: 'start',
      }}
    >
      {/* Header row */}
      <div style={{ fontWeight: 600 }}>Primary</div>
      <div style={{ fontWeight: 600 }}>Secondary</div>
      <div style={{ fontWeight: 600 }}>Ghost</div>

      {/* Enabled - Closed */}
      <SplitButton emphasis="primary">Closed</SplitButton>
      <SplitButton emphasis="secondary">Closed</SplitButton>
      <SplitButton emphasis="ghost">Closed</SplitButton>

      {/* Enabled - Opened */}
      <SplitButton emphasis="primary" opened>Opened</SplitButton>
      <SplitButton emphasis="secondary" opened>Opened</SplitButton>
      <SplitButton emphasis="ghost" opened>Opened</SplitButton>

      {/* Disabled */}
      <SplitButton emphasis="primary" disabled>Disabled</SplitButton>
      <SplitButton emphasis="secondary" disabled>Disabled</SplitButton>
      <SplitButton emphasis="ghost" disabled>Disabled</SplitButton>

      {/* Loading */}
      <SplitButton emphasis="primary" loading>Loading</SplitButton>
      <SplitButton emphasis="secondary" loading>Loading</SplitButton>
      <SplitButton emphasis="ghost" loading>Loading</SplitButton>
    </div>
  ),
};

/* ── Skeleton ── */

export const Skeleton: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <SplitButton skeleton size="large">Large</SplitButton>
      <SplitButton skeleton size="medium">Medium</SplitButton>
      <SplitButton skeleton size="small">Small</SplitButton>
    </div>
  ),
};

/* ── All Sizes × Emphasis ── */

export const SizesAndEmphasis: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, auto)',
        gap: '16px 24px',
        alignItems: 'center',
      }}
    >
      {/* Header */}
      <div style={{ fontWeight: 600 }}>Large</div>
      <div style={{ fontWeight: 600 }}>Medium</div>
      <div style={{ fontWeight: 600 }}>Small</div>

      {/* Primary */}
      <SplitButton emphasis="primary" size="large">Primary</SplitButton>
      <SplitButton emphasis="primary" size="medium">Primary</SplitButton>
      <SplitButton emphasis="primary" size="small">Primary</SplitButton>

      {/* Secondary */}
      <SplitButton emphasis="secondary" size="large">Secondary</SplitButton>
      <SplitButton emphasis="secondary" size="medium">Secondary</SplitButton>
      <SplitButton emphasis="secondary" size="small">Secondary</SplitButton>

      {/* Ghost */}
      <SplitButton emphasis="ghost" size="large">Ghost</SplitButton>
      <SplitButton emphasis="ghost" size="medium">Ghost</SplitButton>
      <SplitButton emphasis="ghost" size="small">Ghost</SplitButton>
    </div>
  ),
};
