import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { DatePicker } from './DatePicker';
import type { DatePickerProps, DatePickerType, DateRange } from './date-picker.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → 01 Date picker (node 7014:14260)
 * Layer set × Type × Selected × State = 48 variants — every combination is rendered in `FigmaMatrix`.
 * Stories pass a fixed `today` (July 8, 2024) so the calendar doesn't depend on the current date.
 */

const FIGMA_TODAY = new Date(2024, 6, 8);
const FIRST = new Date(2024, 6, 12); // Figma "Date value" / "First date value" 07.12.2024
const SECOND = new Date(2024, 6, 24); // Figma "Second date value" 07.24.2024

const LAYERS = [1, 2] as const;
const TYPES: DatePickerType[] = ['single', 'ranged'];
const SELECTED = [false, true] as const;
const STATES = ['enabled', 'hovered', 'focused', 'disabled', 'error', 'skeleton'] as const;
type State = (typeof STATES)[number];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Props for one Figma variant (Figma defaults: label + helper shown). */
function variantProps(layer: 1 | 2, type: DatePickerType, selected: boolean, state: State): DatePickerProps {
  const common = {
    layer,
    label: 'Label',
    helperText: 'Optional helper text',
    errorText: 'Error text message',
    today: FIGMA_TODAY,
    disabled: state === 'disabled',
    error: state === 'error',
    skeleton: state === 'skeleton',
    'data-state': state === 'hovered' || state === 'focused' ? state : undefined,
  } as const;
  return type === 'ranged'
    ? { ...common, type: 'ranged', defaultValue: selected ? { start: FIRST, end: SECOND } : undefined }
    : { ...common, type: 'single', defaultValue: selected ? FIRST : null };
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
const output: React.CSSProperties = {
  font: '400 14px/20px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  marginTop: 8,
};
/** Neutral accent background so both Set 01 (white) and Set 02 (grey) fields are visible */
const canvas: React.CSSProperties = { background: 'var(--scanner-bg-accent)', padding: 16, width: 'max-content' };

/* ------------------------------------------------------------------ */

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: {
    docs: {
      description: {
        component:
          'Date field with a calendar panel for a single date or a date range. Use DateInput for dates users already know. ' +
          'Mouse: click the field or the calendar icon to open; click outside to close. ' +
          'Keyboard: type a date in the field format; Enter or ArrowDown opens the calendar and moves focus into it; ' +
          'Escape closes and returns focus to the field.',
      },
    },
  },
  argTypes: {
    type: { name: 'Type', control: 'inline-radio', options: TYPES },
    layer: { name: 'Layer set', control: 'inline-radio', options: [1, 2] },
    label: { name: 'Label text value', control: 'text' },
    showLabel: { name: 'Show label', control: 'boolean' },
    required: { name: 'Required', control: 'boolean' },
    helperText: { name: 'Helper text value', control: 'text' },
    errorText: { name: 'Error text value', control: 'text' },
    showHelper: { name: 'Show helper', control: 'boolean' },
    showExplainer: { name: 'Show explainer', control: 'boolean' },
    explainerText: { control: 'text' },
    placeholder: { name: 'Placeholder text', control: 'text' },
    format: { control: 'select', options: ['mm.dd.yyyy', 'dd/mm/yyyy', 'yyyy-mm-dd'] },
    allowTyping: { control: 'boolean' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    locale: { control: 'select', options: [undefined, 'en-US', 'en-GB', 'de-DE', 'fr-FR', 'ja-JP'] },
    weekStartsOn: { control: 'inline-radio', options: [0, 1, 6] },
    'data-state': { name: 'Forced state', control: 'inline-radio', options: [undefined, 'hovered', 'focused'] },
  },
  args: {
    label: 'Label',
    helperText: 'Optional helper text',
    errorText: 'Error text message',
    explainerText: 'Pick the appointment date',
    today: FIGMA_TODAY,
    locale: 'en-US',
    onChange: fn(),
    onOpenChange: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 16, width: FIELD_WIDTH + 32, minHeight: 480 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {};

/* ── Type ── */

export const TypeSingle: Story = { name: 'Type: Single', args: { defaultValue: FIRST } };
export const TypeRanged: Story = {
  name: 'Type: Ranged',
  args: { type: 'ranged', defaultValue: { start: FIRST, end: SECOND } } as Partial<DatePickerProps>,
};

/* ── Layer set / Selected ── */

export const LayerSet01: Story = { name: 'Layer set: Set 01', args: { layer: 1 }, decorators: [(S) => <div style={canvas}><S /></div>] };
export const LayerSet02: Story = { name: 'Layer set: Set 02', args: { layer: 2 }, decorators: [(S) => <div style={canvas}><S /></div>] };
export const SelectedFalse: Story = { name: 'Selected: False' };
export const SelectedTrue: Story = { name: 'Selected: True', args: { defaultValue: FIRST } };

/* ── States ── */

export const Hovered: Story = { name: 'State: Hovered', args: { 'data-state': 'hovered' } };
export const Focused: Story = { name: 'State: Focused', args: { 'data-state': 'focused' } };
export const Disabled: Story = { name: 'State: Disabled', args: { disabled: true, defaultValue: FIRST } };
export const ErrorState: Story = { name: 'State: Error', args: { error: true } };
export const Skeleton: Story = { name: 'State: Skeleton', args: { skeleton: true } };

/* ── Boolean properties ── */

export const Required: Story = { args: { required: true } };
export const ShowExplainer: Story = { name: 'Show explainer', args: { showExplainer: true } };
export const NoLabelNoHelper: Story = { name: 'Show label: False, Show helper: False', args: { showLabel: false, showHelper: false } };

/* ── Open calendar ── */

export const OpenSingle: Story = { name: 'Open: Single', args: { defaultOpen: true, defaultValue: FIRST } };
export const OpenRanged: Story = {
  name: 'Open: Ranged',
  args: { type: 'ranged', defaultOpen: true, defaultValue: { start: FIRST, end: SECOND } } as Partial<DatePickerProps>,
};

/* ── Behaviour demos ── */

const RangeDemo = () => {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div>
      <DatePicker type="ranged" label="Period" value={range} onChange={setRange} today={FIGMA_TODAY} locale="en-US" />
      <p style={output}>{`Start: ${range.start?.toDateString() ?? '—'} · End: ${range.end?.toDateString() ?? '—'}`}</p>
    </div>
  );
};
export const RangeSelection: Story = { name: 'Range selection', render: () => <RangeDemo /> };

export const MinMax: Story = {
  name: 'Min / max',
  args: {
    label: 'Appointment',
    helperText: 'Select a date between July 5 and August 20',
    min: new Date(2024, 6, 5),
    max: new Date(2024, 7, 20),
    isDateDisabled: (d: Date) => d.getDay() === 0 || d.getDay() === 6,
    defaultOpen: true,
  },
};

export const Locales: Story = {
  decorators: [(S) => <div style={{ padding: 16, minHeight: 480 }}><S /></div>],
  render: () => (
    <div style={{ display: 'flex', gap: 420, alignItems: 'flex-start' }}>
      <div style={{ width: FIELD_WIDTH }}>
        <DatePicker label="de-DE · dd.mm.yyyy" locale="de-DE" weekStartsOn={1} format="dd.mm.yyyy" defaultValue={FIRST} today={FIGMA_TODAY} defaultOpen />
      </div>
      <div style={{ width: FIELD_WIDTH }}>
        <DatePicker label="ja-JP · yyyy-mm-dd" locale="ja-JP" format="yyyy-mm-dd" defaultValue={FIRST} today={FIGMA_TODAY} defaultOpen />
      </div>
    </div>
  ),
};

/* ── All states — Layer set × Type × Selected rows, 6 state columns ── */

const StateTable = ({ layer }: { layer: 1 | 2 }) => (
  <table style={table}>
    <thead>
      <tr>
        <th style={headCell} />
        {STATES.map((s) => (
          <th key={s} style={headCell}>
            {cap(s)}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {TYPES.flatMap((t) =>
        SELECTED.map((sel) => (
          <tr key={`${t}-${sel}`}>
            <th style={headCell}>{`Type=${cap(t)}, Selected=${sel ? 'True' : 'False'}`}</th>
            {STATES.map((s) => (
              <td key={s} style={cell}>
                <DatePicker {...variantProps(layer, t, sel, s)} />
              </td>
            ))}
          </tr>
        )),
      )}
    </tbody>
  </table>
);

export const AllStates: Story = {
  parameters: { layout: 'fullscreen' },
  decorators: [(S) => <div style={canvas}><S /></div>],
  render: ({ layer = 1 }) => <StateTable layer={layer} />,
};

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 48 variants)',
  parameters: { layout: 'fullscreen' },
  decorators: [(S) => <div style={canvas}><S /></div>],
  render: () => (
    <div>
      {LAYERS.map((l) => (
        <section key={l}>
          <h3 style={sectionTitle}>{`Layer set=Set 0${l}`}</h3>
          <StateTable layer={l} />
        </section>
      ))}
    </div>
  ),
};

export const LongContent: Story = {
  args: {
    label: 'Preferred first appointment date for the follow-up scan',
    helperText: 'Choose a weekday; the clinic will confirm the time slot by email within two business days.',
    showExplainer: true,
    defaultValue: FIRST,
  },
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const ClickOpensAndSelects: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'Label' });
    await userEvent.click(input);
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Friday, July 12, 2024' }));
    await expect(args.onChange).toHaveBeenCalledWith(new Date(2024, 6, 12));
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
    await expect(input).toHaveValue('07.12.2024');
    await expect(input).toHaveFocus();
  },
};

export const KeyboardOpenNavigateSelect: Story = {
  tags: ['test'],
  args: { defaultValue: FIRST },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'Label' });
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Friday, July 12, 2024' })).toHaveFocus());
    await userEvent.keyboard('{ArrowRight}{ArrowDown}');
    await expect(canvas.getByRole('button', { name: 'Saturday, July 20, 2024' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onChange).toHaveBeenLastCalledWith(new Date(2024, 6, 20));
    await expect(input).toHaveFocus();
    await expect(input).toHaveValue('07.20.2024');
  },
};

export const EscapeClosesAndReturnsFocus: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'Label' });
    input.focus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('dialog')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
    await expect(input).toHaveFocus();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
  },
};

export const OutsideClickCloses: Story = {
  tags: ['test'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open calendar' }));
    await expect(canvas.getByRole('dialog')).toBeInTheDocument();
    await userEvent.click(canvasElement.ownerDocument.body);
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const TypingCommitsDate: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: 'Label' });
    await userEvent.type(input, '08.03.2024');
    await expect(args.onChange).toHaveBeenLastCalledWith(new Date(2024, 7, 3));
  },
};

export const RangedByClicks: Story = {
  tags: ['test'],
  args: { type: 'ranged' } as Partial<DatePickerProps>,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('combobox', { name: 'Label, start date' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Friday, July 12, 2024' }));
    await expect(canvas.getByRole('dialog')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Wednesday, July 24, 2024' }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ start: FIRST, end: SECOND });
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
    await expect(canvas.getByRole('combobox', { name: 'Label, end date' })).toHaveValue('07.24.2024');
  },
};

export const DisabledDoesNotOpen: Story = {
  tags: ['test'],
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: 'Label' });
    await expect(input).toBeDisabled();
    await userEvent.click(input, { pointerEventsCheck: 0 });
    await expect(within(canvasElement).queryByRole('dialog')).not.toBeInTheDocument();
    await expect(args.onOpenChange).not.toHaveBeenCalled();
  },
};
