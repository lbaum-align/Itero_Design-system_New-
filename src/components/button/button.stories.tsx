import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: { control: 'select', options: ['brand', 'danger', 'success'] },
    emphasis: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'select', options: ['large', 'medium', 'small'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
  },
  args: { onClick: fn() },
};
export default meta;

type Story = StoryObj<typeof Button>;

/* ── Basic ── */

export const Default: Story = {
  args: { children: 'Button text' },
};

export const WithIcon: Story = {
  args: { children: 'Button text', iconName: 'add' },
};

export const IconOnly: Story = {
  args: { iconName: 'add', iconOnly: true, 'aria-label': 'Add item' },
};

/* ── Types × Emphasis ── */

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: '16px 24px', alignItems: 'start' }}>
      {/* Header row */}
      <div style={{ fontWeight: 600 }}>Primary</div>
      <div style={{ fontWeight: 600 }}>Secondary</div>
      <div style={{ fontWeight: 600 }}>Ghost</div>

      {/* Brand */}
      <Button variant="brand" emphasis="primary">Brand</Button>
      <Button variant="brand" emphasis="secondary">Brand</Button>
      <Button variant="brand" emphasis="ghost">Brand</Button>

      {/* Danger */}
      <Button variant="danger" emphasis="primary">Danger</Button>
      <Button variant="danger" emphasis="secondary">Danger</Button>
      <Button variant="danger" emphasis="ghost">Danger</Button>

      {/* Success */}
      <Button variant="success" emphasis="primary">Success</Button>
      <Button variant="success" emphasis="secondary">Success</Button>
      <Button variant="success" emphasis="ghost">Success</Button>
    </div>
  ),
};

/* ── Sizes ── */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Button size="large">Large</Button>
      <Button size="medium">Medium</Button>
      <Button size="small">Small</Button>
    </div>
  ),
};

export const AllSizesWithIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Button size="large" iconName="add">Large</Button>
      <Button size="medium" iconName="add">Medium</Button>
      <Button size="small" iconName="add">Small</Button>
    </div>
  ),
};

export const AllSizesIconOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Button size="large" iconName="add" iconOnly aria-label="Add" />
      <Button size="medium" iconName="add" iconOnly aria-label="Add" />
      <Button size="small" iconName="add" iconOnly aria-label="Add" />
    </div>
  ),
};

/* ── States ── */

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Button disabled emphasis="primary">Disabled</Button>
      <Button disabled emphasis="secondary">Disabled</Button>
      <Button disabled emphasis="ghost">Disabled</Button>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Button loading emphasis="primary">Saving</Button>
      <Button loading emphasis="secondary">Saving</Button>
      <Button loading emphasis="ghost">Saving</Button>
    </div>
  ),
};

export const Skeleton: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Button skeleton size="large" />
      <Button skeleton size="medium" />
      <Button skeleton size="small" />
    </div>
  ),
};
