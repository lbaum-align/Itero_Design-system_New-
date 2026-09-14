import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Effects',
};
export default meta;

type Story = StoryObj;

const shadowTokens = [
  { name: 'None', var: '--scanner-shadow-none' },
  { name: 'Depth 01', var: '--scanner-shadow-depth-01' },
  { name: 'Depth 02', var: '--scanner-shadow-depth-02' },
  { name: 'Depth 03', var: '--scanner-shadow-depth-03' },
];

export const Shadows: Story = {
  render: () => (
    <div style={{ padding: 48, fontFamily: 'var(--scanner-font-sans)', background: 'var(--scanner-bg-secondary)' }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 32, color: 'var(--scanner-text-primary)' }}>
        Elevation / Shadow Tokens
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 32,
        }}
      >
        {shadowTokens.map(({ name, var: cssVar }) => (
          <div key={name} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '100%',
                height: 120,
                background: 'var(--scanner-bg-primary)',
                borderRadius: 'var(--scanner-radius-lg)',
                boxShadow: `var(${cssVar})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--scanner-text-primary)',
              }}
            >
              {name}
            </div>
            <code style={{ fontSize: 11, color: 'var(--scanner-text-secondary)', marginTop: 8, display: 'block' }}>
              {cssVar}
            </code>
          </div>
        ))}
      </div>
    </div>
  ),
};
