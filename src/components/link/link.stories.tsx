import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link';

const meta: Meta<typeof Link> = {
  title: 'Components/Link',
  component: Link,
  argTypes: {
    type: {
      control: 'select',
      options: ['primary', 'secondary', 'inversed', 'on-color'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
    external: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: { children: 'Link', href: '#' },
};

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <Link type="primary" href="#">Primary</Link>
        <Link type="secondary" href="#">Secondary</Link>
      </div>
      <div
        style={{
          display: 'flex',
          gap: 24,
          alignItems: 'center',
          background: 'var(--scanner-bg-inverse)',
          padding: 16,
          borderRadius: 8,
        }}
      >
        <Link type="inversed" href="#">Inversed</Link>
      </div>
      <div
        style={{
          display: 'flex',
          gap: 24,
          alignItems: 'center',
          background: 'var(--scanner-bg-brand)',
          padding: 16,
          borderRadius: 8,
        }}
      >
        <Link type="on-color" href="#">On Color</Link>
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Link size="small" href="#">Small Link</Link>
      <Link size="medium" href="#">Medium Link</Link>
    </div>
  ),
};

export const External: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Link href="https://example.com" external>External Medium</Link>
      <Link href="https://example.com" external size="small">External Small</Link>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Link href="#" aria-disabled>Disabled Primary</Link>
      <Link href="#" type="secondary" aria-disabled>Disabled Secondary</Link>
    </div>
  ),
};
