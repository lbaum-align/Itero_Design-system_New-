import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Spacing',
};
export default meta;

type Story = StoryObj;

/* ---- Spacing scale ---- */
const spacingTokens = [
  { name: 'spacing-1', value: '2px' },
  { name: 'spacing-2', value: '4px' },
  { name: 'spacing-3', value: '8px' },
  { name: 'spacing-4', value: '12px' },
  { name: 'spacing-5', value: '16px' },
  { name: 'spacing-6', value: '20px' },
  { name: 'spacing-7', value: '24px' },
  { name: 'spacing-8', value: '32px' },
  { name: 'spacing-9', value: '40px' },
  { name: 'spacing-10', value: '48px' },
  { name: 'spacing-11', value: '64px' },
];

export const SpacingScale: Story = {
  render: () => (
    <div style={{ padding: 24, fontFamily: 'var(--scanner-font-sans)' }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: 'var(--scanner-text-primary)' }}>
        Spacing Scale
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {spacingTokens.map(({ name, value }) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <code
              style={{
                width: 120,
                fontSize: 12,
                color: 'var(--scanner-text-secondary)',
                flexShrink: 0,
              }}
            >
              --scanner-{name}
            </code>
            <span
              style={{
                width: 40,
                fontSize: 12,
                color: 'var(--scanner-text-tertiary)',
                flexShrink: 0,
                textAlign: 'right',
              }}
            >
              {value}
            </span>
            <div
              style={{
                width: `var(--scanner-${name})`,
                height: 24,
                background: 'var(--scanner-bg-brand)',
                borderRadius: 4,
                flexShrink: 0,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  ),
};

/* ---- Border radius ---- */
const radiusTokens = [
  { name: 'radius-none', value: '0px' },
  { name: 'radius-sm', value: '4px' },
  { name: 'radius-md', value: '8px' },
  { name: 'radius-lg', value: '12px' },
  { name: 'radius-xl', value: '16px' },
  { name: 'radius-2xl', value: '20px' },
  { name: 'radius-3xl', value: '24px' },
  { name: 'radius-full', value: '10000px' },
];

export const BorderRadius: Story = {
  render: () => (
    <div style={{ padding: 24, fontFamily: 'var(--scanner-font-sans)' }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: 'var(--scanner-text-primary)' }}>
        Border Radius Scale
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 24,
        }}
      >
        {radiusTokens.map(({ name, value }) => (
          <div key={name} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 80,
                height: 80,
                background: 'var(--scanner-bg-brand)',
                borderRadius: `var(--scanner-${name})`,
                margin: '0 auto 8px',
              }}
            />
            <code style={{ fontSize: 11, color: 'var(--scanner-text-secondary)' }}>
              {name}
            </code>
            <div style={{ fontSize: 11, color: 'var(--scanner-text-tertiary)' }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  ),
};
