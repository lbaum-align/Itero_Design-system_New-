import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  argTypes: {
    size: {
      control: 'select',
      options: ['large', 'medium', 'small', 'extra-small'],
    },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
  },
  args: {
    onDismiss: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: { children: 'Tag label', size: 'medium' },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
      <Tag size="large" onDismiss={() => {}}>Large</Tag>
      <Tag size="medium" onDismiss={() => {}}>Medium</Tag>
      <Tag size="small" onDismiss={() => {}}>Small</Tag>
      <Tag size="extra-small" onDismiss={() => {}}>XS</Tag>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
      <Tag size="large" disabled onDismiss={() => {}}>Large</Tag>
      <Tag size="medium" disabled onDismiss={() => {}}>Medium</Tag>
      <Tag size="small" disabled onDismiss={() => {}}>Small</Tag>
      <Tag size="extra-small" disabled onDismiss={() => {}}>XS</Tag>
    </div>
  ),
};

export const Skeleton: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
      <Tag size="large" skeleton />
      <Tag size="medium" skeleton />
      <Tag size="small" skeleton />
      <Tag size="extra-small" skeleton />
    </div>
  ),
};

export const WithoutDismiss: Story = {
  args: { children: 'Read only', size: 'medium' },
};
