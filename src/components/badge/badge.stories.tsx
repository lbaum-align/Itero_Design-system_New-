import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  argTypes: {
    status: {
      control: 'select',
      options: ['neutral', 'info', 'success', 'warning', 'destructive'],
    },
    layout: {
      control: 'select',
      options: ['default', 'on-image'],
    },
    loading: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: 'Badge', status: 'neutral' },
};

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Badge status="neutral">Neutral</Badge>
      <Badge status="info">Info</Badge>
      <Badge status="success">Success</Badge>
      <Badge status="warning">Warning</Badge>
      <Badge status="destructive">Destructive</Badge>
    </div>
  ),
};

export const OnImage: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Badge layout="on-image" status="neutral">Neutral</Badge>
      <Badge layout="on-image" status="info">Info</Badge>
      <Badge layout="on-image" status="success">Success</Badge>
      <Badge layout="on-image" status="warning">Warning</Badge>
      <Badge layout="on-image" status="destructive">Destructive</Badge>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Badge loading>Loading</Badge>
      <Badge status="info">Loaded</Badge>
    </div>
  ),
};
