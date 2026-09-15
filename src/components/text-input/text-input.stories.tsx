import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { TextInput } from './TextInput';
import type { TextInputProps, TextInputSize } from './text-input.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Text input (node 28:1412)
 * Size × Layer set × Filled × State = 80 variants — every combination is rendered in `FigmaMatrix`.
 */

const SIZES: TextInputSize[] = ['x-large', 'large', 'medium', 'small'];
const LAYERS = [1, 2] as const;
const FILLED = [false, true] as const;
const STATES = ['enabled', 'focused', 'disabled', 'error', 'skeleton'] as const;
type State = (typeof STATES)[number];

const sizeLabel: Record<TextInputSize, string> = {
  'x-large': 'X-Large',
  large: 'Large',
  medium: 'Medium',
  small: 'Small',
};
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Props for one Figma variant (Figma defaults: label + helper + placeholder shown). */
function variantProps(size: TextInputSize, layer: 1 | 2, filled: boolean, state: State): TextInputProps {
  return {
    size,
    layer,
    label: 'Label',
    placeholder: 'Placeholder text',
    helperText: 'Optional helper text',
    errorText: 'Error text message',
    defaultValue: filled ? 'Filled text' : undefined,
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

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  parameters: {
    docs: {
      description: {
        component:
          'Short, single-line free-form text entry. Content that overflows scrolls horizontally inside the field. ' +
          'Keyboard: Tab focuses the field; Escape clears it when `clearable`. Clicking anywhere in the field container focuses the input.',
      },
    },
  },
  argTypes: {
    size: { name: 'Size', control: 'inline-radio', options: SIZES },
    layer: { name: 'Layer set', control: 'inline-radio', options: [1, 2] },
    label: { name: 'Label text value', control: 'text' },
    placeholder: { name: 'Placeholder text value', control: 'text' },
    helperText: { name: 'Helper text value', control: 'text' },
    errorText: { name: 'Error text value', control: 'text' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    required: { name: 'Required', control: 'boolean' },
    tooltip: { name: 'Explainer (tooltip)', control: 'text' },
    counter: { name: 'Counter value', control: 'text' },
    showCounter: { name: 'Show counter (auto)', control: 'boolean' },
    maxLength: { control: 'number' },
    clearable: { name: 'Clearable', control: 'boolean' },
    'data-state': { name: 'Forced state', control: 'inline-radio', options: [undefined, 'focused'] },
  },
  args: {
    size: 'x-large',
    layer: 1,
    label: 'Label',
    placeholder: 'Placeholder text',
    helperText: 'Optional helper text',
    onChange: fn(),
    onClear: fn(),
  },
  decorators: [
    /* Single-field stories get the Figma 288px width; matrix stories (layout: fullscreen) size themselves */
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

type Story = StoryObj<typeof TextInput>;

/* ── Default ── */

export const Default: Story = {};

/* ── Sizes (Figma "Size") ── */

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

/* ── Filled ── */

export const Empty: Story = { name: 'Filled: False' };
export const Filled: Story = { name: 'Filled: True', args: { defaultValue: 'Filled text' } };

/* ── States ── */

export const Focused: Story = { name: 'State: Focused', args: { 'data-state': 'focused' } };
export const Disabled: Story = { name: 'State: Disabled', args: { disabled: true, defaultValue: 'Filled text' } };
export const ErrorState: Story = {
  name: 'State: Error',
  args: { error: true, errorText: 'Error text message', defaultValue: 'Filled text' },
};
export const Skeleton: Story = { name: 'State: Skeleton', args: { skeleton: true } };

/* ── Boolean properties ── */

export const Required: Story = { args: { required: true } };
export const WithExplainer: Story = { name: 'Show explainer', args: { tooltip: 'Additional context for this field' } };
export const WithCounter: Story = { name: 'Show counter', args: { counter: '0/12' } };
export const Clearable: Story = { args: { clearable: true, defaultValue: 'Filled text' } };
export const NoLabelNoHelper: Story = {
  name: 'Show label: False, Show helper: False',
  args: { label: undefined, helperText: undefined },
};

const CounterDemo = (args: TextInputProps) => {
  const [value, setValue] = useState('');
  const max = 12;
  return (
    <TextInput
      {...args}
      label="Short bio"
      placeholder="Write something..."
      helperText="Keep it brief"
      value={value}
      maxLength={max}
      showCounter
      clearable
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export const ControlledWithCounter: Story = {
  name: 'Controlled: counter + clearable',
  render: (args) => <CounterDemo {...args} />,
};

/* ── All sizes ── */

export const AllSizes: Story = {
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          <th style={headCell}>Filled: False</th>
          <th style={headCell}>Filled: True</th>
        </tr>
      </thead>
      <tbody>
        {SIZES.map((s) => (
          <tr key={s}>
            <th style={headCell}>{sizeLabel[s]}</th>
            {FILLED.map((f) => (
              <td key={String(f)} style={cell}>
                <TextInput {...variantProps(s, args.layer ?? 1, f, 'enabled')} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── All states — rows: states, columns: Layer set × Filled ── */

export const AllStates: Story = {
  parameters: { layout: 'fullscreen' },
  render: ({ size = 'x-large' }) => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {LAYERS.flatMap((l) =>
            FILLED.map((f) => (
              <th key={`${l}-${f}`} style={headCell}>{`Set 0${l} · Filled: ${cap(String(f))}`}</th>
            )),
          )}
        </tr>
      </thead>
      <tbody>
        {STATES.map((st) => (
          <tr key={st}>
            <th style={headCell}>{cap(st)}</th>
            {LAYERS.flatMap((l) =>
              FILLED.map((f) => (
                <td key={`${l}-${f}`} style={cell}>
                  <TextInput {...variantProps(size, l, f, st)} />
                </td>
              )),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Full Figma matrix: all 80 variants, laid out like the component set ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 80 variants)',
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
                {LAYERS.flatMap((l) =>
                  FILLED.map((f) => (
                    <th key={`${l}-${f}`} style={headCell}>{`Layer set=Set 0${l}, Filled=${cap(String(f))}`}</th>
                  )),
                )}
              </tr>
            </thead>
            <tbody>
              {STATES.map((st) => (
                <tr key={st}>
                  <th style={headCell}>{`State=${cap(st)}`}</th>
                  {LAYERS.flatMap((l) =>
                    FILLED.map((f) => (
                      <td key={`${l}-${f}`} style={cell}>
                        <TextInput {...variantProps(s, l, f, st)} />
                      </td>
                    )),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  ),
};

/* ── Figma component properties: Required / Explainer / Counter / Clearable per size ── */

export const OptionalElements: Story = {
  name: 'Optional elements per size',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <table style={table}>
      <tbody>
        {SIZES.map((s) => (
          <tr key={s}>
            <th style={headCell}>{sizeLabel[s]}</th>
            <td style={cell}>
              <TextInput {...variantProps(s, 1, true, 'enabled')} required tooltip="Explainer" counter="0/12" clearable />
            </td>
            <td style={cell}>
              <TextInput {...variantProps(s, 1, true, 'focused')} required tooltip="Explainer" counter="0/12" clearable />
            </td>
            <td style={cell}>
              <TextInput {...variantProps(s, 1, true, 'disabled')} required tooltip="Explainer" counter="0/12" clearable />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Overflow content: scrolls horizontally inside the field ── */

export const LongContent: Story = {
  name: 'Overflow content',
  args: {
    label: 'A very long label that needs to wrap onto a second line in narrow layouts',
    defaultValue: 'A very long value that does not fit in the single-line field and scrolls horizontally',
    helperText: 'Helper text also wraps when it is longer than the available width of the field.',
    counter: '86/120',
  },
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const TypingFiresOnChange: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Label');
    await userEvent.click(input);
    await expect(input).toHaveFocus();
    await userEvent.type(input, 'abc');
    await expect(input).toHaveValue('abc');
    await expect(args.onChange).toHaveBeenCalledTimes(3);
  },
};

export const ClearButtonClears: Story = {
  tags: ['test'],
  args: { clearable: true, defaultValue: 'Filled text' },
  play: async ({ args, canvasElement }) => {
    const view = within(canvasElement);
    const input = view.getByLabelText('Label');
    await userEvent.click(view.getByRole('button', { name: 'Clear input' }));
    await expect(input).toHaveValue('');
    await expect(input).toHaveFocus();
    await expect(args.onClear).toHaveBeenCalledTimes(1);
    await expect(view.queryByRole('button', { name: 'Clear input' })).toBeNull();
  },
};

export const EscapeClears: Story = {
  tags: ['test'],
  args: { clearable: true, defaultValue: 'Filled text' },
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Label');
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(input).toHaveValue('');
    await expect(args.onClear).toHaveBeenCalled();
  },
};

export const DisabledIgnoresInput: Story = {
  tags: ['test'],
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Label');
    await expect(input).toBeDisabled();
    await expect(input).toHaveAttribute('aria-disabled', 'true');
    await userEvent.type(input, 'abc', { pointerEventsCheck: 0 });
    await expect(input).toHaveValue('');
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

export const ErrorIsAnnounced: Story = {
  tags: ['test'],
  args: { error: true, errorText: 'Error text message' },
  play: async ({ canvasElement }) => {
    const view = within(canvasElement);
    const input = view.getByLabelText('Label');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('Error text message');
    await expect(view.getByRole('alert')).toHaveTextContent('Error text message');
  },
};
