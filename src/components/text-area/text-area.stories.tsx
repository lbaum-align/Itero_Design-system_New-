import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { TextArea } from './TextArea';
import type { TextAreaProps } from './text-area.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Text area (node 6176:2286)
 * Layer set × Filled × State = 20 variants — every combination is rendered in `FigmaMatrix`.
 */

const LAYERS = [1, 2] as const;
const FILLED = [false, true] as const;
const STATES = ['enabled', 'focused', 'disabled', 'error', 'skeleton'] as const;
type State = (typeof STATES)[number];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const LONG_TEXT =
  'Patient reports sensitivity on the lower left molars after the last appointment. ' +
  'Recommend a follow-up scan in two weeks and review the bite registration before the next aligner set is ordered. ' +
  'Notes continue past the visible area so the field scrolls vertically.';

/** Props for one Figma variant (Figma defaults: label + helper + placeholder shown). */
function variantProps(layer: 1 | 2, filled: boolean, state: State): TextAreaProps {
  return {
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
/** Neutral accent background so both Set 01 (white) and Set 02 (grey) fields are visible */
const canvas: React.CSSProperties = { background: 'var(--scanner-bg-accent)', padding: 16 };

/* ------------------------------------------------------------------ */

const meta: Meta<typeof TextArea> = {
  title: 'Components/TextArea',
  component: TextArea,
  parameters: {
    docs: {
      description: {
        component:
          'Multi-line free-form text entry. Content that exceeds the field scrolls vertically; users can drag the ' +
          'resize handle to make the field taller or shorter. Keyboard: Tab focuses the field; the clear button is the next Tab stop.',
      },
    },
  },
  argTypes: {
    layer: { name: 'Layer set', control: 'inline-radio', options: [1, 2] },
    label: { name: 'Label text value', control: 'text' },
    placeholder: { name: 'Placeholder text value', control: 'text' },
    helperText: { name: 'Helper text value', control: 'text' },
    errorText: { name: 'Error text value', control: 'text' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    required: { name: 'Required', control: 'boolean' },
    tooltipContent: { name: 'Explainer (tooltip)', control: 'text' },
    showCounter: { name: 'Show counter', control: 'boolean' },
    counter: { name: 'Counter value', control: 'text' },
    maxLength: { control: 'number' },
    clearable: { control: 'boolean' },
    'data-state': { name: 'Forced state', control: 'inline-radio', options: [undefined, 'focused'] },
  },
  args: {
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
type Story = StoryObj<typeof TextArea>;

/* ── Default ── */

export const Default: Story = {};

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

export const Focused: Story = { name: 'State: Focused', args: { 'data-state': 'focused', defaultValue: 'Filled text' } };
export const Disabled: Story = { name: 'State: Disabled', args: { disabled: true, defaultValue: 'Filled text' } };
export const ErrorState: Story = {
  name: 'State: Error',
  args: { error: true, errorText: 'Error text message', defaultValue: 'Filled text' },
};
export const Skeleton: Story = { name: 'State: Skeleton', args: { skeleton: true, showCounter: true, maxLength: 100 } };

/* ── Boolean properties ── */

export const Required: Story = { args: { required: true } };
export const WithExplainer: Story = { name: 'Show explainer', args: { tooltipContent: 'Additional context for this field' } };
export const WithCounter: Story = { name: 'Show counter', args: { showCounter: true, maxLength: 100 } };
export const ShowScroll: Story = { name: 'Show scroll (overflowing content)', args: { defaultValue: LONG_TEXT } };
export const NoLabelNoHelper: Story = {
  name: 'Show label: False, Show helper: False',
  args: { label: undefined, helperText: undefined },
};
export const NotClearable: Story = { name: 'Clearable: false', args: { clearable: false, defaultValue: 'Filled text' } };

/* ── Controlled usage (hooks live in a named component) ── */

const ControlledDemo = (args: TextAreaProps) => {
  const [value, setValue] = useState('');
  return (
    <TextArea
      {...args}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onClear={() => setValue('')}
    />
  );
};

export const Controlled: Story = {
  name: 'Controlled: counter + required + explainer',
  args: {
    label: 'Notes',
    required: true,
    tooltipContent: 'Visible to the treating doctor only',
    showCounter: true,
    maxLength: 100,
    placeholder: 'Start typing...',
  },
  render: (args) => <ControlledDemo {...args} />,
};

/* ── All states — rows: states, columns: Layer set × Filled ── */

const StateMatrix = ({ extra }: { extra?: Partial<TextAreaProps> }) => (
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
                <TextArea {...variantProps(l, f, st)} {...extra} />
              </td>
            )),
          )}
        </tr>
      ))}
    </tbody>
  </table>
);

export const AllStates: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <StateMatrix extra={{ required: true, tooltipContent: 'Explainer', showCounter: true, maxLength: 100 }} />,
};

/* ── Full Figma matrix: all 20 variants, laid out like the component set ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 20 variants)',
  parameters: { layout: 'fullscreen' },
  render: () => <StateMatrix />,
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const TypingUpdatesCounter: Story = {
  tags: ['test'],
  args: { showCounter: true, maxLength: 100 },
  play: async ({ args, canvasElement }) => {
    const view = within(canvasElement);
    const textarea = view.getByLabelText('Label');
    await userEvent.click(textarea);
    await expect(textarea).toHaveFocus();
    await userEvent.type(textarea, 'Hello{Enter}there');
    await expect(textarea).toHaveValue('Hello\nthere');
    await expect(view.getByText('11/100')).toBeInTheDocument();
    await expect(args.onChange).toHaveBeenCalled();
  },
};

export const ClearButtonClears: Story = {
  tags: ['test'],
  args: { defaultValue: 'Filled text' },
  play: async ({ args, canvasElement }) => {
    const view = within(canvasElement);
    const textarea = view.getByLabelText('Label');
    await userEvent.click(textarea);
    await userEvent.tab();
    const clear = view.getByRole('button', { name: 'Clear text' });
    await expect(clear).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(textarea).toHaveValue('');
    await expect(textarea).toHaveFocus();
    await expect(args.onClear).toHaveBeenCalledTimes(1);
  },
};

export const DisabledIgnoresInput: Story = {
  tags: ['test'],
  args: { disabled: true, defaultValue: 'Filled text' },
  play: async ({ args, canvasElement }) => {
    const view = within(canvasElement);
    const textarea = view.getByLabelText('Label');
    await expect(textarea).toBeDisabled();
    await expect(view.queryByRole('button', { name: 'Clear text' })).toBeNull();
    await userEvent.type(textarea, 'abc', { pointerEventsCheck: 0 });
    await expect(textarea).toHaveValue('Filled text');
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

export const ErrorIsAnnounced: Story = {
  tags: ['test'],
  args: { error: true, errorText: 'Error text message' },
  play: async ({ canvasElement }) => {
    const view = within(canvasElement);
    const textarea = view.getByLabelText('Label');
    await expect(textarea).toHaveAttribute('aria-invalid', 'true');
    await expect(textarea).toHaveAccessibleDescription('Error text message');
  },
};
