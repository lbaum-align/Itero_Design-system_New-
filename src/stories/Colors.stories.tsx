import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Colors',
};
export default meta;

type Story = StoryObj;

/* ---- Helper ---- */
function Swatch({ name, cssVar }: { name: string; cssVar: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 6,
          background: `var(${cssVar})`,
          border: '1px solid var(--scanner-border-subtle)',
          flexShrink: 0,
        }}
      />
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--scanner-text-primary)' }}>
          {name}
        </div>
        <code style={{ fontSize: 11, color: 'var(--scanner-text-secondary)' }}>{cssVar}</code>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h3
        style={{
          fontSize: 16,
          fontWeight: 600,
          marginBottom: 12,
          color: 'var(--scanner-text-primary)',
          borderBottom: '1px solid var(--scanner-border-subtle)',
          paddingBottom: 8,
        }}
      >
        {title}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 8 }}>
        {children}
      </div>
    </div>
  );
}

/* ---- Primitive Colors ---- */
const neutralScale = [50, 100, 200, 300, 600, 700, 800, 900] as const;
const blueScale = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
const purpleScale = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
const redScale = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
const greenScale = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
const orangeScale = [50, 100, 300, 500, 700, 900] as const;
const magentaScale = [50, 100, 200, 300, 500, 700, 900] as const;

export const Primitives: Story = {
  render: () => (
    <div style={{ padding: 24, fontFamily: 'var(--scanner-font-sans)' }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: 'var(--scanner-text-primary)' }}>
        Primitive Color Palette
      </h2>

      <Section title="Neutral">
        {neutralScale.map((s) => (
          <Swatch key={s} name={`Neutral ${s}`} cssVar={`--scanner-neutral-${s}`} />
        ))}
      </Section>

      <Section title="Blue">
        {blueScale.map((s) => (
          <Swatch key={s} name={`Blue ${s}`} cssVar={`--scanner-blue-${s}`} />
        ))}
      </Section>

      <Section title="Purple">
        {purpleScale.map((s) => (
          <Swatch key={s} name={`Purple ${s}`} cssVar={`--scanner-purple-${s}`} />
        ))}
      </Section>

      <Section title="Red">
        {redScale.map((s) => (
          <Swatch key={s} name={`Red ${s}`} cssVar={`--scanner-red-${s}`} />
        ))}
      </Section>

      <Section title="Green">
        {greenScale.map((s) => (
          <Swatch key={s} name={`Green ${s}`} cssVar={`--scanner-green-${s}`} />
        ))}
      </Section>

      <Section title="Orange">
        {orangeScale.map((s) => (
          <Swatch key={s} name={`Orange ${s}`} cssVar={`--scanner-orange-${s}`} />
        ))}
      </Section>

      <Section title="Magenta">
        {magentaScale.map((s) => (
          <Swatch key={s} name={`Magenta ${s}`} cssVar={`--scanner-magenta-${s}`} />
        ))}
      </Section>
    </div>
  ),
};

/* ---- Semantic Colors ---- */
const bgTokens = [
  'bg-primary', 'bg-secondary', 'bg-tertiary', 'bg-inverse',
  'bg-brand', 'bg-brand-hover', 'bg-brand-active',
  'bg-destructive', 'bg-destructive-hover', 'bg-destructive-active',
  'bg-hover', 'bg-active', 'bg-selected', 'bg-disabled',
  'bg-overlay', 'bg-elevated', 'bg-on-color',
  'bg-highlight-blue', 'bg-highlight-green', 'bg-highlight-red',
  'bg-highlight-orange', 'bg-highlight-purple', 'bg-highlight-magenta',
];

const textTokens = [
  'text-primary', 'text-secondary', 'text-tertiary', 'text-disabled',
  'text-inverse', 'text-inverse-secondary', 'text-inverse-tertiary',
  'text-on-color', 'text-link', 'text-error', 'text-success', 'text-warning',
];

const borderTokens = [
  'border-default', 'border-subtle', 'border-strong', 'border-inverse',
  'border-interactive', 'border-error', 'border-success', 'border-warning',
  'border-hover', 'border-active', 'border-disabled', 'border-focus',
];

const iconTokens = [
  'icon-primary', 'icon-secondary', 'icon-tertiary', 'icon-disabled',
  'icon-inverse', 'icon-on-color', 'icon-link', 'icon-error',
  'icon-success', 'icon-warning',
];

const statusTokens = [
  'status-danger', 'status-danger-bg', 'status-success', 'status-success-bg',
  'status-warning', 'status-warning-bg', 'status-info', 'status-info-bg',
];

export const SemanticBackgrounds: Story = {
  render: () => (
    <div style={{ padding: 24, fontFamily: 'var(--scanner-font-sans)' }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: 'var(--scanner-text-primary)' }}>
        Semantic Background Colors
      </h2>
      <Section title="Background">
        {bgTokens.map((t) => (
          <Swatch key={t} name={t} cssVar={`--scanner-${t}`} />
        ))}
      </Section>
    </div>
  ),
};

export const SemanticText: Story = {
  render: () => (
    <div style={{ padding: 24, fontFamily: 'var(--scanner-font-sans)' }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: 'var(--scanner-text-primary)' }}>
        Semantic Text Colors
      </h2>
      <Section title="Text">
        {textTokens.map((t) => (
          <Swatch key={t} name={t} cssVar={`--scanner-${t}`} />
        ))}
      </Section>
    </div>
  ),
};

export const SemanticBorders: Story = {
  render: () => (
    <div style={{ padding: 24, fontFamily: 'var(--scanner-font-sans)' }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: 'var(--scanner-text-primary)' }}>
        Semantic Border Colors
      </h2>
      <Section title="Border">
        {borderTokens.map((t) => (
          <Swatch key={t} name={t} cssVar={`--scanner-${t}`} />
        ))}
      </Section>
    </div>
  ),
};

export const SemanticIcons: Story = {
  render: () => (
    <div style={{ padding: 24, fontFamily: 'var(--scanner-font-sans)' }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: 'var(--scanner-text-primary)' }}>
        Semantic Icon Colors
      </h2>
      <Section title="Icon">
        {iconTokens.map((t) => (
          <Swatch key={t} name={t} cssVar={`--scanner-${t}`} />
        ))}
      </Section>
    </div>
  ),
};

export const Status: Story = {
  render: () => (
    <div style={{ padding: 24, fontFamily: 'var(--scanner-font-sans)' }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: 'var(--scanner-text-primary)' }}>
        Status Colors
      </h2>
      <Section title="Status">
        {statusTokens.map((t) => (
          <Swatch key={t} name={t} cssVar={`--scanner-${t}`} />
        ))}
      </Section>
    </div>
  ),
};

/* ---- Alpha / transparency ---- */
const grayAlphaLevels = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];
const whiteAlphaLevels = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];

export const TransparentColors: Story = {
  render: () => (
    <div style={{ padding: 24, fontFamily: 'var(--scanner-font-sans)' }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: 'var(--scanner-text-primary)' }}>
        Transparent Color Scales
      </h2>

      <Section title="Gray Alpha (black + alpha) — for light backgrounds">
        {grayAlphaLevels.map((l) => (
          <Swatch key={l} name={`Gray Alpha ${l}`} cssVar={`--scanner-gray-alpha-${l}`} />
        ))}
      </Section>

      <div style={{ background: '#1b1b1b', padding: 24, borderRadius: 12, marginTop: 16 }}>
        <Section title="White Alpha (white + alpha) — for dark backgrounds">
          {whiteAlphaLevels.map((l) => (
            <Swatch key={l} name={`White Alpha ${l}`} cssVar={`--scanner-white-alpha-${l}`} />
          ))}
        </Section>
      </div>
    </div>
  ),
};
