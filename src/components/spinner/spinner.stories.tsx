import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  argTypes: {
    size: {
      control: 'select',
      options: ['mini', 'small', 'medium', 'large', 'xl', '2xl'],
    },
    onColor: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: { size: 'medium' },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <Spinner size="mini" />
      <Spinner size="small" />
      <Spinner size="medium" />
      <Spinner size="large" />
      <Spinner size="xl" />
      <Spinner size="2xl" />
    </div>
  ),
};

export const OnColor: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        background: 'var(--scanner-bg-brand)',
        padding: 24,
        borderRadius: 8,
      }}
    >
      <Spinner size="mini" onColor />
      <Spinner size="small" onColor />
      <Spinner size="medium" onColor />
      <Spinner size="large" onColor />
    </div>
  ),
};
