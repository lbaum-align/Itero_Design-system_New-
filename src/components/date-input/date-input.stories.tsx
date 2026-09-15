import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { DateInput } from './DateInput';
import type { DateInputProps, DateInputSize } from './date-input.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Date input (node 25493:22854)
 * Layer set × Filled × State × Size = 60 variants — every combination is rendered in `FigmaMatrix`.
 */

const SIZES: DateInputSize[] = ['large', 'medium', 'small'];
const LAYERS = [1, 2] as const;
const FILLED = [false, true] as const;
const STATES = ['enabled', 'focused', 'disabled', 'error', 'skeleton'] as const;
type State = (typeof STATES)[number];

const sizeLabel: Record<DateInputSize, string> = { large: 'Large', medium: 'Medium', small: 'Small' };
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Props for one Figma variant (Figma defaults: label + helper shown, value 07.12.2024). */
function variantProps(size: DateInputSize, layer: 1 | 2, filled: boolean, state: State): DateInputProps {
  return {
    size,
    layer,
    label: 'Label',
    helperText: 'Optional helper text',
    errorText: 'Error text message',
    defaultValue: filled ? '07.12.2024' : undefined,
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

const meta: Meta<typeof DateInput> = {
  title: 'Components/DateInput',
  component: DateInput,
  parameters: {
    docs: {
      description: {
        component:
          'Manual date entry without a calendar — for dates users already know (birthdates, card expiry). ' +
          'Use the placeholder to show the expected format; use Date picker when users need to browse dates. ' +
          'Keyboard: Tab focuses the field; Ctrl/Opt + arrows move through the text. Clicking the field container focuses the input.',
      },
    },
  },
  argTypes: {
    size: { name: 'Size', control: 'inline-radio', options: SIZES },
    layer: { name: 'Layer set', control: 'inline-radio', options: [1, 2] },
    label: { name: 'Label text value', control: 'text' },
    showLabel: { name: 'Show label', control: 'boolean' },
    required: { name: 'Required field', control: 'boolean' },
    helperText: { name: 'Helper text value', control: 'text' },
    errorText: { name: 'Error text value', control: 'text' },
    showHelper: { name: 'Show helper', control: 'boolean' },
    showExplainer: { name: 'Show explainer', control: 'boolean' },
    explainerText: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    'data-state': { name: 'Forced state', control: 'inline-radio', options: [undefined, 'focused'] },
  },
  args: {
    size: 'large',
    layer: 1,
    label: 'Label',
    helperText: 'Optional helper text',
    errorText: 'Error text message',
    placeholder: 'mm / dd / yyyy',
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

type Story = StoryObj<typeof DateInput>;

/* ── Default ── */

export const Default: Story = {};

/* ── Sizes ── */

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
export const Filled: Story = { name: 'Filled: True', args: { defaultValue: '07.12.2024' } };

/* ── States ── */

export const Focused: Story = { name: 'State: Focused', args: { 'data-state': 'focused' } };
export const Disabled: Story = { name: 'State: Disabled', args: { disabled: true, defaultValue: '07.12.2024' } };
export const ErrorState: Story = { name: 'State: Error', args: { error: true } };
export const Skeleton: Story = { name: 'State: Skeleton', args: { skeleton: true } };

/* ── Optional elements ── */

export const Required: Story = { name: 'Required field', args: { required: true } };
export const WithExplainer: Story = { name: 'Show explainer', args: { showExplainer: true } };
export const NoLabelNoHelper: Story = {
  name: 'Show label: False, Show helper: False',
  args: { showLabel: false, showHelper: false },
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
              <DateInput {...variantProps(s, 1, true, 'enabled')} />
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  ),
};

/* ── All states: layer set × filled rows, 5 state columns ── */

export const AllStates: Story = {
  parameters: { layout: 'fullscreen' },
  render: ({ size = 'large' }) => (
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
        {LAYERS.flatMap((l) =>
          FILLED.map((f) => (
            <tr key={`${l}-${f}`}>
              <th style={headCell}>{`Set 0${l} · Filled ${f ? 'True' : 'False'}`}</th>
              {STATES.map((st) => (
                <td key={st} style={cell}>
                  <DateInput {...variantProps(size, l, f, st)} />
                </td>
              ))}
            </tr>
          )),
        )}
      </tbody>
    </table>
  ),
};

/* ── Full Figma matrix: all 60 variants ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 60 variants)',
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
              {LAYERS.flatMap((l) =>
                FILLED.map((f) => (
                  <tr key={`${l}-${f}`}>
                    <th style={headCell}>{`Layer set=Set 0${l}, Filled=${f ? 'True' : 'False'}`}</th>
                    {STATES.map((st) => (
                      <td key={st} style={cell}>
                        <DateInput {...variantProps(s, l, f, st)} />
                      </td>
                    ))}
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  ),
};

/* ── Overflow: long label/helper wrap ── */

export const LongContent: Story = {
  args: {
    required: true,
    showExplainer: true,
    label: 'Date of the first intraoral scan for this patient',
    helperText: 'Use the date shown on the scan report, format MM/DD/YYYY',
    defaultValue: '07/12/2024',
  },
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const TypingFiresOnChange: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Label' });
    await userEvent.type(input, '07/12/2024');
    await expect(input).toHaveValue('07/12/2024');
    await expect(args.onChange).toHaveBeenCalledTimes(10);
  },
};

export const TabFocusesField: Story = {
  tags: ['test'],
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Label' });
    await userEvent.tab();
    await expect(input).toHaveFocus();
  },
};

export const DisabledIgnoresInput: Story = {
  tags: ['test'],
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Label' });
    await expect(input).toBeDisabled();
    await userEvent.type(input, '01', { pointerEventsCheck: 0 });
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

export const ErrorIsAnnounced: Story = {
  tags: ['test'],
  args: { error: true, required: true },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Label' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toBeRequired();
    await expect(input).toHaveAccessibleDescription('Error text message');
  },
};
