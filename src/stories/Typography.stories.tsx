import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Typography',
};
export default meta;

type Story = StoryObj;

const sampleText = 'The quick brown fox jumps over the lazy dog';

/* ---- Font sizes ---- */
const fontSizes = [
  { name: 'x-small (xs)', var: '--scanner-text-xs', leading: '--scanner-leading-xs' },
  { name: 'small (sm)', var: '--scanner-text-sm', leading: '--scanner-leading-sm' },
  { name: 'medium (md)', var: '--scanner-text-md', leading: '--scanner-leading-md' },
  { name: 'large (lg)', var: '--scanner-text-lg', leading: '--scanner-leading-lg' },
  { name: 'x-large (xl)', var: '--scanner-text-xl', leading: '--scanner-leading-xl' },
  { name: '2x-large (2xl)', var: '--scanner-text-2xl', leading: '--scanner-leading-2xl' },
  { name: '3x-large (3xl)', var: '--scanner-text-3xl', leading: '--scanner-leading-3xl' },
  { name: '4x-large (4xl)', var: '--scanner-text-4xl', leading: '--scanner-leading-4xl' },
  { name: '5x-large (5xl)', var: '--scanner-text-5xl', leading: '--scanner-leading-5xl' },
  { name: '6x-large (6xl)', var: '--scanner-text-6xl', leading: '--scanner-leading-6xl' },
  { name: '7x-large (7xl)', var: '--scanner-text-7xl', leading: '--scanner-leading-7xl' },
];

export const FontSizeScale: Story = {
  render: () => (
    <div style={{ padding: 24, fontFamily: 'var(--scanner-font-sans)' }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: 'var(--scanner-text-primary)' }}>
        Font Size Scale
      </h2>
      {fontSizes.map(({ name, var: cssVar, leading }) => (
        <div key={name} style={{ marginBottom: 16, borderBottom: '1px solid var(--scanner-border-subtle)', paddingBottom: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--scanner-text-secondary)', marginBottom: 4 }}>
            {name} — <code>{cssVar}</code> / <code>{leading}</code>
          </div>
          <div
            style={{
              fontSize: `var(${cssVar})`,
              lineHeight: `var(${leading})`,
              color: 'var(--scanner-text-primary)',
            }}
          >
            {sampleText}
          </div>
        </div>
      ))}
    </div>
  ),
};

/* ---- Font weights ---- */
export const FontWeights: Story = {
  render: () => (
    <div style={{ padding: 24, fontFamily: 'var(--scanner-font-sans)' }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: 'var(--scanner-text-primary)' }}>
        Font Weights
      </h2>
      {[
        { name: 'Regular (400)', weight: 'var(--scanner-font-regular)' },
        { name: 'Medium (500)', weight: 'var(--scanner-font-medium)' },
        { name: 'Bold (700)', weight: 'var(--scanner-font-bold)' },
      ].map(({ name, weight }) => (
        <div key={name} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--scanner-text-secondary)', marginBottom: 4 }}>{name}</div>
          <div style={{ fontSize: 20, fontWeight: weight as unknown as number, color: 'var(--scanner-text-primary)' }}>
            {sampleText}
          </div>
        </div>
      ))}
    </div>
  ),
};

/* ---- Font families ---- */
export const FontFamilies: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, fontFamily: 'var(--scanner-font-sans)', color: 'var(--scanner-text-primary)' }}>
        Font Families
      </h2>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: 'var(--scanner-text-secondary)', marginBottom: 4, fontFamily: 'var(--scanner-font-sans)' }}>
          Sans — <code>--scanner-font-sans</code> (Roboto)
        </div>
        <div style={{ fontFamily: 'var(--scanner-font-sans)', fontSize: 20, color: 'var(--scanner-text-primary)' }}>
          {sampleText}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'var(--scanner-text-secondary)', marginBottom: 4, fontFamily: 'var(--scanner-font-sans)' }}>
          Mono — <code>--scanner-font-mono</code> (Roboto Mono)
        </div>
        <div style={{ fontFamily: 'var(--scanner-font-mono)', fontSize: 20, color: 'var(--scanner-text-primary)' }}>
          {sampleText}
        </div>
      </div>
    </div>
  ),
};

/* ---- Named text styles ---- */
const textStyles = [
  { name: 'Code 01', className: 'scanner-text-code-01' },
  { name: 'Code 02', className: 'scanner-text-code-02' },
  { name: 'Label 01', className: 'scanner-text-label-01' },
  { name: 'Label 02', className: 'scanner-text-label-02' },
  { name: 'Label 03', className: 'scanner-text-label-03' },
  { name: 'Body 01', className: 'scanner-text-body-01' },
  { name: 'Body 02', className: 'scanner-text-body-02' },
  { name: 'Body 03', className: 'scanner-text-body-03' },
  { name: 'Body 04', className: 'scanner-text-body-04' },
  { name: 'Link 01', className: 'scanner-text-link-01' },
  { name: 'Link 02', className: 'scanner-text-link-02' },
  { name: 'Heading 01', className: 'scanner-text-heading-01' },
  { name: 'Heading 02', className: 'scanner-text-heading-02' },
  { name: 'Heading 03', className: 'scanner-text-heading-03' },
  { name: 'Heading 04', className: 'scanner-text-heading-04' },
  { name: 'Heading 05', className: 'scanner-text-heading-05' },
  { name: 'Heading 06', className: 'scanner-text-heading-06' },
  { name: 'Display Regular 01', className: 'scanner-text-display-regular-01' },
  { name: 'Display Regular 02', className: 'scanner-text-display-regular-02' },
  { name: 'Display Regular 03', className: 'scanner-text-display-regular-03' },
  { name: 'Display Bold 01', className: 'scanner-text-display-bold-01' },
  { name: 'Display Bold 02', className: 'scanner-text-display-bold-02' },
  { name: 'Display Medium 01', className: 'scanner-text-display-medium-01' },
  { name: 'Display Medium 02', className: 'scanner-text-display-medium-02' },
];

export const TextStyles: Story = {
  render: () => (
    <div style={{ padding: 24, fontFamily: 'var(--scanner-font-sans)' }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: 'var(--scanner-text-primary)' }}>
        Named Text Styles
      </h2>
      {textStyles.map(({ name, className }) => (
        <div key={className} style={{ marginBottom: 12, borderBottom: '1px solid var(--scanner-border-subtle)', paddingBottom: 8 }}>
          <div style={{ fontSize: 11, color: 'var(--scanner-text-secondary)', marginBottom: 4 }}>
            {name} — <code>.{className}</code>
          </div>
          <div className={className} style={{ color: 'var(--scanner-text-primary)' }}>
            {sampleText}
          </div>
        </div>
      ))}
    </div>
  ),
};
