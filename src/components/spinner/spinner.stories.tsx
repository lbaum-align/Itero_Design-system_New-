import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { Spinner } from './Spinner';
import type { SpinnerPhase, SpinnerSize } from './spinner.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Spinner (node 25:1124)
 * Size × On color × Phase — every combination is rendered in `FigmaMatrix`.
 */

const SIZES: SpinnerSize[] = ['2xl', 'xl', 'large', 'medium', 'small', 'mini'];
const PHASES: SpinnerPhase[] = [1, 2, 3, 4];
const sizeLabel: Record<SpinnerSize, string> = {
  '2xl': '2X Large',
  xl: 'X Large',
  large: 'Large',
  medium: 'Medium',
  small: 'Small',
  mini: 'Mini',
};

/* ── Layout helpers (story-only) ── */

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 12, verticalAlign: 'middle', textAlign: 'center' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};
const onColorBg: React.CSSProperties = { background: 'var(--scanner-bg-brand)' };

/* ------------------------------------------------------------------ */

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    docs: {
      description: {
        component:
          'Indeterminate loading indicator for actions that take a few seconds. ' +
          'Small sizes for a single processing component, large sizes for whole regions. ' +
          'Use a progress bar when progress can be measured.',
      },
    },
  },
  argTypes: {
    size: { name: 'Size', control: 'inline-radio', options: SIZES },
    onColor: { name: 'On color', control: 'boolean' },
    phase: { name: 'Phase (static frame)', control: 'inline-radio', options: [undefined, 1, 2, 3, 4] },
    'aria-label': { control: 'text' },
  },
  args: { size: 'medium', onColor: false },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Spinner>;

/* ── Default ── */

export const Default: Story = {};

/* ── On color ── */

export const OnColorFalse: Story = { name: 'On color: False' };

export const OnColorTrue: Story = {
  name: 'On color: True',
  args: { onColor: true },
  decorators: [
    (Story) => (
      <div style={{ ...onColorBg, padding: 16, display: 'inline-flex' }}>
        <Story />
      </div>
    ),
  ],
};

/* ── All sizes ── */

export const AllSizes: Story = {
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {SIZES.map((s) => (
            <th key={s} style={headCell}>{sizeLabel[s]}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <th style={headCell}>On color: False</th>
          {SIZES.map((s) => (
            <td key={s} style={cell}>
              <Spinner size={s} />
            </td>
          ))}
        </tr>
        <tr style={onColorBg}>
          <th style={{ ...headCell, color: 'var(--scanner-text-on-color)' }}>On color: True</th>
          {SIZES.map((s) => (
            <td key={s} style={cell}>
              <Spinner size={s} onColor />
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  ),
};

/* ── All states: the spinner has no interactive states; its "states" are the 4 animation phases ── */

export const AllStates: Story = {
  name: 'AllStates (phases)',
  render: ({ size = 'medium' }) => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {PHASES.map((p) => (
            <th key={p} style={headCell}>{`Phase ${p}`}</th>
          ))}
          <th style={headCell}>Animated</th>
        </tr>
      </thead>
      <tbody>
        {[false, true].map((onColor) => (
          <tr key={String(onColor)} style={onColor ? onColorBg : undefined}>
            <th style={{ ...headCell, color: onColor ? 'var(--scanner-text-on-color)' : headCell.color }}>
              {`On color: ${onColor ? 'True' : 'False'}`}
            </th>
            {PHASES.map((p) => (
              <td key={p} style={cell}>
                <Spinner size={size} onColor={onColor} phase={p} />
              </td>
            ))}
            <td style={cell}>
              <Spinner size={size} onColor={onColor} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Full Figma matrix: Size × On color × Phase ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all variants)',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ padding: 24 }}>
      <table style={table}>
        <thead>
          <tr>
            <th style={headCell} />
            {PHASES.map((p) => (
              <th key={p} style={headCell}>{`Phase=${p}`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SIZES.flatMap((s) =>
            [false, true].map((onColor) => (
              <tr key={`${s}-${onColor}`} style={onColor ? onColorBg : undefined}>
                <th style={{ ...headCell, color: onColor ? 'var(--scanner-text-on-color)' : headCell.color }}>
                  {`Size=${sizeLabel[s]}, On color=${onColor ? 'True' : 'False'}`}
                </th>
                {PHASES.map((p) => (
                  <td key={p} style={cell}>
                    <Spinner size={s} onColor={onColor} phase={p} />
                  </td>
                ))}
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction / a11y tests                                          */
/* ------------------------------------------------------------------ */

export const AnnouncesLoading: Story = {
  tags: ['test'],
  args: { 'aria-label': 'Loading scans' },
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole('status', { name: 'Loading scans' });
    await expect(status).toBeInTheDocument();
    await expect(status.querySelector('svg')).toHaveClass('animate-spin');
  },
};

export const PhaseFreezesAnimation: Story = {
  tags: ['test'],
  args: { phase: 3 },
  play: async ({ canvasElement }) => {
    const svg = within(canvasElement).getByRole('status').querySelector('svg');
    await expect(svg).not.toHaveClass('animate-spin');
    await expect(svg).toHaveClass('rotate-180');
  },
};
