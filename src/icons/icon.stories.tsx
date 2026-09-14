import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import type { IconName } from './icon.types';

const allIconNames: IconName[] = [
  'add',
  'arrow-down',
  'arrow-left',
  'arrow-right',
  'arrow-up',
  'calendar',
  'check',
  'checkmark',
  'chevron-down',
  'chevron-left',
  'chevron-right',
  'chevron-up',
  'close',
  'close-empty',
  'copy',
  'drag',
  'edit',
  'error',
  'external',
  'eye',
  'eye-off',
  'filter',
  'help',
  'info',
  'menu',
  'minus',
  'more-horizontal',
  'more-vertical',
  'search',
  'sort',
  'sort-ascending',
  'sort-descending',
  'success',
  'user',
  'warning',
];

const meta: Meta<typeof Icon> = {
  title: 'Foundations/Icons',
  component: Icon,
  argTypes: {
    name: { control: 'select', options: allIconNames },
    size: { control: 'select', options: [12, 16, 20, 24, 32] },
  },
};
export default meta;

type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: { name: 'add', size: 24 },
};

export const Gallery: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: 16,
      }}
    >
      {allIconNames.map((name) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            padding: 12,
            borderRadius: 8,
            border: '1px solid var(--scanner-border-subtle)',
          }}
        >
          <Icon name={name} size={24} />
          <span
            style={{
              fontFamily: 'var(--scanner-font-mono)',
              fontSize: 11,
              color: 'var(--scanner-text-secondary)',
              textAlign: 'center',
              wordBreak: 'break-all',
            }}
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {([12, 16, 20, 24, 32] as const).map((size) => (
        <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <Icon name="search" size={size} />
          <span style={{ fontFamily: 'var(--scanner-font-mono)', fontSize: 11, color: 'var(--scanner-text-secondary)' }}>
            {size}px
          </span>
        </div>
      ))}
    </div>
  ),
};

export const WithColor: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <span style={{ color: 'var(--scanner-icon-primary)' }}><Icon name="check" size={24} /></span>
      <span style={{ color: 'var(--scanner-icon-error)' }}><Icon name="error" size={24} /></span>
      <span style={{ color: 'var(--scanner-icon-success)' }}><Icon name="success" size={24} /></span>
      <span style={{ color: 'var(--scanner-icon-warning)' }}><Icon name="warning" size={24} /></span>
      <span style={{ color: 'var(--scanner-icon-link)' }}><Icon name="info" size={24} /></span>
    </div>
  ),
};
