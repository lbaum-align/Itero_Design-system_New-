import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PaginationItem } from './PaginationItem';

const meta: Meta<typeof PaginationItem> = {
  title: 'Private/_PaginationItem',
  component: PaginationItem,
  args: {
    onClick: fn(),
  },
  argTypes: {
    page: { control: 'number' },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof PaginationItem>;

export const Default: Story = {
  args: { page: 1, size: 'medium' },
};

export const Selected: Story = {
  args: { page: 3, selected: true, size: 'medium' },
};

export const Disabled: Story = {
  args: { page: 5, disabled: true, size: 'medium' },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Medium size */}
      <div>
        <p style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>Medium</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <PaginationItem page={1} size="medium" />
            <span style={{ fontSize: 12 }}>Enabled</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <PaginationItem page={2} size="medium" data-state="hovered" />
            <span style={{ fontSize: 12 }}>Hovered</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <PaginationItem page={3} size="medium" selected />
            <span style={{ fontSize: 12 }}>Selected</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <PaginationItem page={4} size="medium" disabled />
            <span style={{ fontSize: 12 }}>Disabled</span>
          </div>
        </div>
      </div>

      {/* Small size */}
      <div>
        <p style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>Small</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <PaginationItem page={1} size="small" />
            <span style={{ fontSize: 12 }}>Enabled</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <PaginationItem page={2} size="small" data-state="hovered" />
            <span style={{ fontSize: 12 }}>Hovered</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <PaginationItem page={3} size="small" selected />
            <span style={{ fontSize: 12 }}>Selected</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <PaginationItem page={4} size="small" disabled />
            <span style={{ fontSize: 12 }}>Disabled</span>
          </div>
        </div>
      </div>
    </div>
  ),
};
