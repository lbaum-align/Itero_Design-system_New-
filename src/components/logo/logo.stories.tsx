import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { Logo } from './Logo';
import { logoLabels } from './logo-labels';
import type { LogoVariation } from './logo.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Logo (node 13355:4609, page "Logos").
 * Variation (8 values). No states. Colours are theme tokens, so both themes are shown.
 */

/** Figma component-set order */
const VARIATIONS: LogoVariation[] = [
  'align',
  'align-xray-insight',
  'invisalign',
  'invisalign-first',
  'itero',
  'vivera-retainers',
  'itero-exocad',
  'all-logos',
];

const figmaName: Record<LogoVariation, string> = {
  align: 'Align',
  'align-xray-insight': 'Align X-ray insight',
  invisalign: 'Invisalign',
  'invisalign-first': 'Invisalign first',
  itero: 'iTero',
  'vivera-retainers': 'Vivera retainers',
  'itero-exocad': 'iTero + Exocad',
  'all-logos': 'All logos',
};

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 12, verticalAlign: 'middle' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const meta: Meta<typeof Logo> = {
  title: 'Components/Logo',
  component: Logo,
  parameters: {
    docs: {
      description: {
        component:
          'Product logos as inline SVG. Artwork is the exact Figma export; each region uses the colour token bound in Figma ' +
          '(icon-primary / icon-secondary / icon-tertiary / icon-link), so logos adapt to light and dark themes. ' +
          '`role="img"` with the brand name as accessible name; `decorative` hides it.',
      },
    },
  },
  argTypes: {
    variation: { name: 'Variation', control: 'select', options: VARIATIONS },
    height: { control: { type: 'number', min: 12, max: 96 } },
    label: { control: 'text' },
    decorative: { control: 'boolean' },
  },
  args: { variation: 'align', height: 28 },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Logo>;

export const Default: Story = {};

export const Align: Story = { args: { variation: 'align' } };
export const AlignXrayInsight: Story = {
  name: 'Align X-ray insight',
  args: { variation: 'align-xray-insight' },
};
export const Invisalign: Story = { args: { variation: 'invisalign' } };
export const InvisalignFirst: Story = {
  name: 'Invisalign first',
  args: { variation: 'invisalign-first' },
};
export const ITero: Story = { name: 'iTero', args: { variation: 'itero' } };
export const ViveraRetainers: Story = {
  name: 'Vivera retainers',
  args: { variation: 'vivera-retainers' },
};
export const IteroExocad: Story = { name: 'iTero + Exocad', args: { variation: 'itero-exocad' } };
export const AllLogos: Story = { name: 'All logos', args: { variation: 'all-logos' } };

/** No interactive states — every variation in light and dark theme. */
export const AllStates: Story = {
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell}>Variation</th>
          <th style={headCell}>Light</th>
          <th style={headCell}>Dark</th>
        </tr>
      </thead>
      <tbody>
        {VARIATIONS.map((v) => (
          <tr key={v}>
            <th style={headCell}>{figmaName[v]}</th>
            <td style={{ ...cell, background: 'var(--scanner-bg-layer-01)' }} data-theme="light">
              <Logo variation={v} />
            </td>
            <td style={{ ...cell, background: 'var(--scanner-bg-layer-01)' }} data-theme="dark">
              <Logo variation={v} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/** Laid out like the Figma component set (40px between rows). */
export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 8 variants)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'flex-start' }}>
      {VARIATIONS.map((v) => (
        <Logo key={v} variation={v} />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      {[16, 20, 28, 40].map((h) => (
        <Logo key={h} variation="itero" height={h} />
      ))}
    </div>
  ),
};

export const HasAccessibleName: Story = {
  tags: ['test'],
  args: { variation: 'itero-exocad' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', { name: logoLabels['itero-exocad'] }),
    ).toBeInTheDocument();
  },
};
