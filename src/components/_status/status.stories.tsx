import type { Meta, StoryObj } from '@storybook/react';
import { Status } from './Status';

const meta: Meta<typeof Status> = {
  title: 'Private/_Status',
  component: Status,
  argTypes: {
    status: {
      control: 'select',
      options: ['online', 'offline', 'away', 'busy'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Status>;

export const Default: Story = {
  args: { status: 'online', size: 'medium' },
};

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Status status="online" />
        <span style={{ fontSize: 12 }}>Online</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Status status="offline" />
        <span style={{ fontSize: 12 }}>Offline</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Status status="away" />
        <span style={{ fontSize: 12 }}>Away</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Status status="busy" />
        <span style={{ fontSize: 12 }}>Busy</span>
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Status status="online" size="small" />
        <span style={{ fontSize: 12 }}>Small</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Status status="online" size="medium" />
        <span style={{ fontSize: 12 }}>Medium</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Status status="online" size="large" />
        <span style={{ fontSize: 12 }}>Large</span>
      </div>
    </div>
  ),
};
