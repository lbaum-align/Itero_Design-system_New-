import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { SliderControl } from './SliderControl';
import type { SliderControlProps, SliderControlState } from './slider-control.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → _Slider control (node 18362:19166)
 * States: Enabled, Focused, Pressed, Disabled + Value. Private — composed by Slider.
 */

const STATES: SliderControlState[] = ['enabled', 'focused', 'pressed', 'disabled'];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function stateProps(state: SliderControlState, showValue = true): SliderControlProps {
  return {
    disabled: state === 'disabled',
    'data-state': state === 'focused' || state === 'pressed' ? state : undefined,
    showValue,
    valueText: '50',
    role: 'slider',
    'aria-label': `Handle ${state}`,
    'aria-valuenow': 50,
    tabIndex: state === 'disabled' ? -1 : 0,
  };
}

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: '56px 24px 16px', verticalAlign: 'bottom', textAlign: 'center' };
const headCell: React.CSSProperties = {
  padding: 8,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const meta: Meta<typeof SliderControl> = {
  title: 'Private/_SliderControl',
  component: SliderControl,
  parameters: {
    docs: {
      description: {
        component:
          'Private handle of Slider: 32px box with a 28px ring. Focused and Pressed use icon-link; Pressed adds a dot and the value tooltip ' +
          '(Figma "Value"). Slider passes role="slider", aria-* and key handlers through.',
      },
    },
  },
  argTypes: {
    pressed: { name: 'Pressed', control: 'boolean' },
    disabled: { control: 'boolean' },
    showValue: { name: 'Value', control: 'boolean' },
    valueText: { name: 'Text value', control: 'text' },
    'data-state': { name: 'Forced state', control: 'inline-radio', options: [undefined, 'focused', 'pressed'] },
  },
  args: { showValue: true, valueText: '50', role: 'slider', tabIndex: 0, 'aria-label': 'Handle', 'aria-valuenow': 50 },
  decorators: [
    (Story) => (
      <div style={{ padding: '64px 32px 24px' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SliderControl>;

export const Default: Story = {};

export const Enabled: Story = { name: 'States: Enabled' };
export const Focused: Story = { name: 'States: Focused', args: { 'data-state': 'focused' } };
export const Pressed: Story = { name: 'States: Pressed', args: { pressed: true } };
export const PressedNoValue: Story = { name: 'States: Pressed, Value: False', args: { pressed: true, showValue: false } };
export const Disabled: Story = { name: 'States: Disabled', args: { disabled: true } };

export const AllStates: Story = {
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          {STATES.map((s) => (
            <th key={s} style={headCell}>{cap(s)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {STATES.map((s) => (
            <td key={s} style={cell}>
              <SliderControl {...stateProps(s)} />
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  ),
};

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 4 variants × Value)',
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {STATES.map((s) => (
            <th key={s} style={headCell}>{`States=${cap(s)}`}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[true, false].map((v) => (
          <tr key={String(v)}>
            <th style={headCell}>{`Value=${cap(String(v))}`}</th>
            {STATES.map((s) => (
              <td key={s} style={cell}>
                <SliderControl {...stateProps(s, v)} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Interaction tests ── */

export const KeyboardFocusable: Story = {
  tags: ['test'],
  play: async ({ canvasElement }) => {
    const handle = within(canvasElement).getByRole('slider', { name: 'Handle' });
    await userEvent.tab();
    await expect(handle).toHaveFocus();
  },
};

export const PressedShowsTooltip: Story = {
  tags: ['test'],
  args: { pressed: true, valueText: '72' },
  play: async ({ canvasElement }) => {
    const tooltip = canvasElement.querySelector('[data-part="value-tooltip"]');
    await expect(tooltip).toHaveTextContent('72');
    await expect(canvasElement.querySelector('[data-part="dot"]')).not.toBeNull();
  },
};
