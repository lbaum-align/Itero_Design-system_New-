import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { Icon } from './Icon';
import { iconNames, iconRegistry } from './registry';
import type { IconName, IconSize } from './icon.types';

/*
 * Source: Figma "05. Icons library 2.0.0", as instanced in "06. Scanner core 1.0.0 full".
 * Figma ships each icon at 16/20/24/32 (exact scales of one drawing); the React `size` prop also accepts 12 and 28.
 */

const ALL_SIZES: readonly IconSize[] = [12, 16, 20, 24, 28, 32];
const FIGMA_SIZES: readonly IconSize[] = [16, 20, 24, 32];

const mono = {
  fontFamily: 'var(--scanner-font-mono)',
  fontSize: 11,
  color: 'var(--scanner-text-secondary)',
} as const;

const cell = { padding: '6px 10px', borderBottom: '1px solid var(--scanner-border-subtle)' } as const;

const meta: Meta<typeof Icon> = {
  title: 'Foundations/Icons',
  component: Icon,
  argTypes: {
    name: { control: 'select', options: iconNames },
    size: { control: 'select', options: ALL_SIZES },
    label: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: { name: 'add', size: 24 },
};

/** Every registry icon at every supported size, with its Figma icon name and source. */
export const AllIconsAllSizes: Story = {
  render: () => (
    <table style={{ borderCollapse: 'collapse', width: 'max-content', color: 'var(--scanner-icon-primary)' }}>
      <thead>
        <tr>
          <th style={{ ...cell, ...mono, textAlign: 'left' }}>registry name</th>
          <th style={{ ...cell, ...mono, textAlign: 'left' }}>Figma icon</th>
          {ALL_SIZES.map((size) => (
            <th key={size} style={{ ...cell, ...mono }}>
              {size}
              {FIGMA_SIZES.includes(size) ? '' : '*'}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {iconNames.map((name) => {
          const entry = iconRegistry[name];
          return (
            <tr key={name} data-icon-row={name}>
              <td style={{ ...cell, ...mono }}>{name}</td>
              <td style={{ ...cell, ...mono }}>
                {entry.figmaName ?? '—'}
                {entry.source !== 'figma' && ` (${entry.source})`}
              </td>
              {ALL_SIZES.map((size) => (
                <td key={size} style={{ ...cell, textAlign: 'center' }}>
                  <Icon name={name} size={size} />
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  ),
  play: async ({ canvasElement }) => {
    const rows = canvasElement.querySelectorAll('tbody tr');
    await expect(rows).toHaveLength(iconNames.length);
    await expect(canvasElement.querySelectorAll('tbody svg')).toHaveLength(iconNames.length * ALL_SIZES.length);
  },
};

/** One tile per icon at 24px — quick visual scan. */
export const Gallery: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
      {iconNames.map((name) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            padding: 10,
            borderRadius: 8,
            border: '1px solid var(--scanner-border-subtle)',
            color: 'var(--scanner-icon-primary)',
          }}
        >
          <Icon name={name} size={24} />
          <span style={{ ...mono, textAlign: 'center', wordBreak: 'break-all' }}>{name}</span>
          <span style={{ ...mono, textAlign: 'center', color: 'var(--scanner-text-tertiary)' }}>
            {iconRegistry[name].figmaName ?? '—'}
          </span>
        </div>
      ))}
    </div>
  ),
};

/** Figma icon sets at their Figma artboard sizes (16/20/24/32), for side-by-side comparison with Figma. */
export const FigmaSizes: Story = {
  render: () => {
    const sample: IconName[] = ['add', 'user', 'launch', 'information', 'view', 'view-off', 'help', 'error', 'warning', 'checkmark'];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, color: 'var(--scanner-icon-primary)' }}>
        {sample.map((name) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {FIGMA_SIZES.map((size) => (
              <Icon key={size} name={name} size={size} />
            ))}
            <span style={mono}>{iconRegistry[name].figmaName}</span>
          </div>
        ))}
      </div>
    );
  },
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

export const Labelled: Story = {
  args: { name: 'search', size: 24, label: 'Search' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('img', { name: 'Search' })).toHaveAttribute('data-icon', 'search');
  },
};
