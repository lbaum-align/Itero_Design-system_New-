import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { Decoration } from './Decoration';
import type { DecorationColor } from './decoration.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → _Decoration (node 32583:26851, page "Logos").
 * Color (7 values) × Icon instance swap (default Gift). No interactive states.
 */

/** Figma component-set order */
const COLORS: DecorationColor[] = ['gray', 'red', 'magenta', 'purple', 'blue', 'green', 'orange'];
const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 8, verticalAlign: 'middle' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const meta: Meta<typeof Decoration> = {
  title: 'Private/_Decoration',
  component: Decoration,
  parameters: {
    docs: {
      description: {
        component:
          'Private 44×44 tile with a 24px icon on a highlight background. Presentational (`aria-hidden`) unless `label` is set.',
      },
    },
  },
  argTypes: {
    color: { name: 'Color', control: 'inline-radio', options: COLORS },
    icon: {
      name: 'Icon',
      control: 'select',
      options: ['gift', 'calendar', 'settings', 'account', 'notification-outline', 'search'],
    },
    label: { control: 'text' },
  },
  args: { color: 'gray', icon: 'gift' },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Decoration>;

export const Default: Story = {};

export const Gray: Story = { args: { color: 'gray' } };
export const Red: Story = { args: { color: 'red' } };
export const Magenta: Story = { args: { color: 'magenta' } };
export const Purple: Story = { args: { color: 'purple' } };
export const Blue: Story = { args: { color: 'blue' } };
export const Green: Story = { args: { color: 'green' } };
export const Orange: Story = { args: { color: 'orange' } };

/** No interactive states in Figma — every colour, light and dark theme. */
export const AllStates: Story = {
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {COLORS.map((c) => (
            <th key={c} style={headCell}>
              {label(c)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(['light', 'dark'] as const).map((theme) => (
          <tr key={theme} data-theme={theme} style={{ background: 'var(--scanner-bg-layer-01)' }}>
            <th style={{ ...headCell, color: 'var(--scanner-text-secondary)' }}>{label(theme)}</th>
            {COLORS.map((c) => (
              <td key={c} style={cell}>
                <Decoration color={c} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 7 variants)',
  render: () => (
    <div style={{ display: 'flex', gap: 40 }}>
      {COLORS.map((c) => (
        <Decoration key={c} color={c} />
      ))}
    </div>
  ),
};

export const IconSwap: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      {(['calendar', 'settings', 'account', 'search'] as const).map((i, idx) => (
        <Decoration key={i} icon={i} color={COLORS[idx + 1]} />
      ))}
    </div>
  ),
};

export const PresentationalByDefault: Story = {
  tags: ['test'],
  args: { 'data-testid': 'decoration' } as Record<string, string>,
  play: async ({ canvasElement }) => {
    const el = within(canvasElement).getByTestId('decoration');
    await expect(el).toHaveAttribute('aria-hidden', 'true');
    await expect(el.querySelector('svg')).toHaveAttribute('width', '24');
  },
};
