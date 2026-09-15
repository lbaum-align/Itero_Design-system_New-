import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { NumberInput } from './NumberInput';
import type { NumberInputProps, NumberInputSize } from './number-input.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Number input (node 36634:12646)
 * Layer set × State × Size = 40 variants — every combination is rendered in `FigmaMatrix`.
 */

const SIZES: NumberInputSize[] = ['x-large', 'large', 'medium', 'small'];
const LAYERS = [1, 2] as const;
const STATES = ['enabled', 'focused', 'disabled', 'error', 'skeleton'] as const;
type State = (typeof STATES)[number];

const sizeLabel: Record<NumberInputSize, string> = {
  'x-large': 'X-Large',
  large: 'Large',
  medium: 'Medium',
  small: 'Small',
};
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Props for one Figma variant (Figma defaults: label, helper and controls shown, value 1000). */
function variantProps(size: NumberInputSize, layer: 1 | 2, state: State): NumberInputProps {
  return {
    size,
    layer,
    label: 'Label',
    helperText: 'Optional helper text',
    errorText: 'Error text message',
    defaultValue: 1000,
    disabled: state === 'disabled',
    error: state === 'error',
    skeleton: state === 'skeleton',
    'data-state': state === 'focused' ? 'focused' : undefined,
  };
}

/* ── Layout helpers (story-only) ── */

const FIELD_WIDTH = 288;
const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 12, verticalAlign: 'top', width: FIELD_WIDTH };
const headCell: React.CSSProperties = {
  padding: 12,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  verticalAlign: 'top',
  whiteSpace: 'nowrap',
};
const sectionTitle: React.CSSProperties = {
  font: '500 16px/24px var(--scanner-font-sans)',
  color: 'var(--scanner-text-primary)',
  margin: '24px 0 8px',
};
/** Neutral accent background so both Set 01 (white) and Set 02 (grey) fields are visible */
const canvas: React.CSSProperties = { background: 'var(--scanner-bg-accent)', padding: 16 };

/* ------------------------------------------------------------------ */

const meta: Meta<typeof NumberInput> = {
  title: 'Components/NumberInput',
  component: NumberInput,
  parameters: {
    docs: {
      description: {
        component:
          'Numeric entry with Subtract / Add controls (ghost buttons). Use Slider for continuous ranges and Text input for non-numeric data. ' +
          'Keyboard: Tab focuses the field; ArrowUp/ArrowDown step, PageUp/PageDown step ×10, Home/End jump to min/max. ' +
          'Clicking anywhere in the field container focuses the input.',
      },
    },
  },
  argTypes: {
    size: { name: 'Size', control: 'inline-radio', options: SIZES },
    layer: { name: 'Layer set', control: 'inline-radio', options: [1, 2] },
    value: { name: 'Number value', control: 'number' },
    defaultValue: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    label: { name: 'Label text value', control: 'text' },
    helperText: { name: 'Helper text value', control: 'text' },
    errorText: { name: 'Error text value', control: 'text' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    showControls: { name: 'Show controls', control: 'boolean' },
    showExplainer: { name: 'Show explainer', control: 'boolean' },
    explainerText: { control: 'text' },
    'data-state': { name: 'Forced state', control: 'inline-radio', options: [undefined, 'focused'] },
  },
  args: {
    size: 'x-large',
    layer: 1,
    label: 'Label',
    helperText: 'Optional helper text',
    errorText: 'Error text message',
    defaultValue: 1000,
    explainerText: 'Additional context for this field',
    onChange: fn(),
  },
  decorators: [
    (Story, { parameters }) => (
      <div style={canvas}>
        <div style={parameters.layout === 'fullscreen' ? undefined : { width: FIELD_WIDTH }}>
          <Story />
        </div>
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof NumberInput>;

/* ── Default ── */

export const Default: Story = {};

/* ── Sizes ── */

export const XLarge: Story = { name: 'Size: X-Large', args: { size: 'x-large' } };
export const Large: Story = { name: 'Size: Large', args: { size: 'large' } };
export const Medium: Story = { name: 'Size: Medium', args: { size: 'medium' } };
export const Small: Story = { name: 'Size: Small', args: { size: 'small' } };

/* ── Layer set ── */

export const LayerSet01: Story = { name: 'Layer set: Set 01', args: { layer: 1 } };
export const LayerSet02: Story = {
  name: 'Layer set: Set 02',
  args: { layer: 2 },
  decorators: [
    (Story) => (
      <div style={{ background: 'var(--scanner-bg-layer-01)', padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};

/* ── States ── */

export const Focused: Story = { name: 'State: Focused', args: { 'data-state': 'focused' } };
export const Disabled: Story = { name: 'State: Disabled', args: { disabled: true } };
export const ErrorState: Story = { name: 'State: Error', args: { error: true } };
export const Skeleton: Story = { name: 'State: Skeleton', args: { skeleton: true } };

/* ── Optional elements ── */

export const WithExplainer: Story = { name: 'Show explainer', args: { showExplainer: true } };
export const WithoutControls: Story = { name: 'Show controls: False', args: { showControls: false } };
export const NoLabelNoHelper: Story = {
  name: 'Show label: False, Show helper: False',
  args: { label: undefined, helperText: undefined },
};
export const MinMaxStep: Story = {
  name: 'Min / max / decimal step',
  args: { min: 0, max: 1, step: 0.1, defaultValue: 0.5, helperText: 'Between 0 and 1, step 0.1' },
};

function ControlledNumberInput(props: NumberInputProps) {
  const [value, setValue] = useState(5);
  return (
    <NumberInput
      {...props}
      value={value}
      onChange={(v) => {
        setValue(v);
        props.onChange?.(v);
      }}
      helperText={`Value: ${value} (0 – 10)`}
    />
  );
}

export const Controlled: Story = {
  args: { min: 0, max: 10 },
  render: (args) => <ControlledNumberInput {...args} />,
};

/* ── All sizes ── */

export const AllSizes: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <table style={table}>
      <tbody>
        <tr>
          {SIZES.map((s) => (
            <td key={s} style={cell}>
              <div style={{ ...headCell, padding: '0 0 8px' }}>{sizeLabel[s]}</div>
              <NumberInput {...variantProps(s, 1, 'enabled')} />
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  ),
};

/* ── All states: layer set × size rows, 5 state columns ── */

export const AllStates: Story = {
  parameters: { layout: 'fullscreen' },
  render: ({ size = 'x-large' }) => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {STATES.map((st) => (
            <th key={st} style={headCell}>{cap(st)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {LAYERS.map((l) => (
          <tr key={l}>
            <th style={headCell}>{`Set 0${l} · ${sizeLabel[size]}`}</th>
            {STATES.map((st) => (
              <td key={st} style={cell}>
                <NumberInput {...variantProps(size, l, st)} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Full Figma matrix: all 40 variants ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 40 variants)',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div>
      {SIZES.map((s) => (
        <section key={s}>
          <h3 style={sectionTitle}>{`Size=${sizeLabel[s]}`}</h3>
          <table style={table}>
            <thead>
              <tr>
                <th style={headCell} />
                {STATES.map((st) => (
                  <th key={st} style={headCell}>{`State=${cap(st)}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LAYERS.map((l) => (
                <tr key={l}>
                  <th style={headCell}>{`Layer set=Set 0${l}`}</th>
                  {STATES.map((st) => (
                    <td key={st} style={cell}>
                      <NumberInput {...variantProps(s, l, st)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  ),
};

/* ── Overflow: long values ellipsize, long label/helper wrap ── */

export const LongContent: Story = {
  args: {
    defaultValue: 123456789012345.67,
    label: 'Number of aligners to be produced for this treatment plan',
    helperText: 'Enter the total number of aligners, including refinements and retainers',
  },
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const ControlsStepValue: Story = {
  tags: ['test'],
  args: { defaultValue: 5, min: 0, max: 6 },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('spinbutton', { name: 'Label' });
    await userEvent.click(canvas.getByRole('button', { name: 'Increment' }));
    await expect(input).toHaveValue('6');
    await expect(args.onChange).toHaveBeenLastCalledWith(6);
    await expect(canvas.getByRole('button', { name: 'Increment' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Decrement' }));
    await expect(input).toHaveValue('5');
  },
};

export const KeyboardStepping: Story = {
  tags: ['test'],
  args: { defaultValue: 10, min: 0, max: 100, step: 5 },
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole('spinbutton', { name: 'Label' });
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    await expect(input).toHaveValue('20');
    await userEvent.keyboard('{ArrowDown}');
    await expect(input).toHaveValue('15');
    await userEvent.keyboard('{End}');
    await expect(args.onChange).toHaveBeenLastCalledWith(100);
    await userEvent.keyboard('{Home}');
    await expect(input).toHaveValue('0');
  },
};

export const TypingClampsOnBlur: Story = {
  tags: ['test'],
  args: { defaultValue: 1, min: 0, max: 50 },
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole('spinbutton', { name: 'Label' });
    await userEvent.clear(input);
    await userEvent.type(input, '75');
    await userEvent.tab();
    await expect(input).toHaveValue('50');
    await expect(args.onChange).toHaveBeenLastCalledWith(50);
  },
};

export const DisabledIgnoresInput: Story = {
  tags: ['test'],
  args: { disabled: true, defaultValue: 3 },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('spinbutton', { name: 'Label' });
    await expect(input).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Increment' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Increment' }), { pointerEventsCheck: 0 });
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

export const ErrorIsAnnounced: Story = {
  tags: ['test'],
  args: { error: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('spinbutton', { name: 'Label' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('Error text message');
  },
};
