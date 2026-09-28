import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Slider } from './Slider';
import type { SliderProps, SliderRange, SliderState } from './slider.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Slider (node 17867:9913, page "Slider" 18362:19162)
 * Layer set × Ranged × State = 12 variants — every combination is rendered in `FigmaMatrix`.
 */

const LAYERS = [1, 2] as const;
const RANGED = [false, true] as const;
const STATES: SliderState[] = ['enabled', 'disabled', 'skeleton'];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Props for one Figma variant (Figma defaults: Show label, Show value; single at 50, ranged at 33/67). */
function variantProps(layer: 1 | 2, ranged: boolean, state: SliderState, extra: Partial<SliderProps> = {}): SliderProps {
  const base = {
    layer,
    label: 'Label',
    disabled: state === 'disabled',
    skeleton: state === 'skeleton',
    ...extra,
  };
  return ranged
    ? ({ ...base, ranged: true, defaultValue: [33, 67] } as SliderProps)
    : ({ ...base, ranged: false, defaultValue: 50 } as SliderProps);
}

const FIELD_WIDTH = 320;
const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: '16px 24px', verticalAlign: 'top', width: FIELD_WIDTH };
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
/** Set 01 inputs are white, Set 02 grey — a page background makes both visible */
const canvas: React.CSSProperties = { background: 'var(--scanner-bg-page)', padding: 24 };

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  parameters: {
    docs: {
      description: {
        component:
          'Select a value or a range by dragging a handle along a track, or pressing anywhere on the track. ' +
          'Keyboard: Tab to a handle; Left/Down and Right/Up step; PageUp/PageDown move 10 steps; Home/End jump to the bounds. ' +
          '`editable` adds number inputs kept in sync with the handles.',
      },
    },
  },
  argTypes: {
    layer: { name: 'Layer set', control: 'inline-radio', options: [1, 2] },
    ranged: { name: 'Ranged', control: 'boolean' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    label: { name: 'Label text value', control: 'text' },
    explainer: { name: 'Explainer (tooltip)', control: 'text' },
    showValue: { name: 'Show value', control: 'boolean' },
    startValueText: { name: 'Start number value', control: 'text' },
    endValueText: { name: 'End number value', control: 'text' },
    editable: { name: 'Editable', control: 'boolean' },
    showTooltip: { name: 'Handle value tooltip', control: 'boolean' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    'data-state': { name: 'Forced handle state', control: 'inline-radio', options: [undefined, 'focused', 'pressed'] },
  },
  args: { layer: 1, label: 'Label', showValue: true, min: 0, max: 100, step: 1, onChange: fn() },
  decorators: [
    (Story, { parameters }) => (
      <div style={canvas}>
        <div style={parameters.layout === 'fullscreen' ? undefined : { width: FIELD_WIDTH, paddingTop: 48 }}>
          <Story />
        </div>
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Slider>;

/* ── Default ── */

export const Default: Story = { args: { defaultValue: 50 } };

/* ── Ranged ── */

export const Single: Story = { name: 'Ranged: False', args: { defaultValue: 50 } };
export const Ranged: Story = { name: 'Ranged: True', args: { ranged: true, defaultValue: [33, 67] } as Partial<SliderProps> };

/* ── Layer set ── */

export const LayerSet01: Story = { name: 'Layer set: Set 01', args: { layer: 1, editable: true, defaultValue: 50 } };
export const LayerSet02: Story = { name: 'Layer set: Set 02', args: { layer: 2, editable: true, defaultValue: 50 } };

/* ── States ── */

export const Enabled: Story = { name: 'State: Enabled', args: { defaultValue: 50 } };
export const Disabled: Story = { name: 'State: Disabled', args: { disabled: true, defaultValue: 50 } };
export const Skeleton: Story = { name: 'State: Skeleton', args: { skeleton: true, defaultValue: 50 } };
export const HandleFocused: Story = { name: 'Handle: Focused', args: { 'data-state': 'focused', defaultValue: 50 } };
export const HandlePressed: Story = { name: 'Handle: Pressed', args: { 'data-state': 'pressed', defaultValue: 50 } };

/* ── Boolean properties ── */

export const Editable: Story = { name: 'Editable', args: { editable: true, defaultValue: 50 } };
export const EditableRanged: Story = {
  name: 'Editable (Ranged)',
  args: { editable: true, ranged: true, defaultValue: [25, 75] } as Partial<SliderProps>,
};
export const WithExplainer: Story = { name: 'Show explainer', args: { explainer: 'Text message', defaultValue: 50 } };
export const NoLabelNoValue: Story = {
  name: 'Show label: False, Show value: False',
  args: { label: undefined, showValue: false, startHandleLabel: 'Volume', defaultValue: 50 },
};
export const CustomValues: Story = {
  name: 'Start / End number values',
  args: { min: 0, max: 1000, step: 10, defaultValue: 250, startValueText: '$0', endValueText: '$1,000' },
};

const ControlledDemo = (args: SliderProps) => {
  const [range, setRange] = useState<SliderRange>([200, 800]);
  return (
    <div>
      <Slider layer={args.layer} disabled={args.disabled} ranged value={range} onChange={setRange} min={0} max={1000} step={10} editable label="Price" />
      <p style={{ font: '14px/20px var(--scanner-font-sans)', color: 'var(--scanner-text-secondary)' }}>
        {`${range[0]} – ${range[1]}`}
      </p>
    </div>
  );
};

export const ControlledRange: Story = {
  name: 'Controlled: ranged + editable',
  render: (args) => <ControlledDemo {...args} />,
};

/* ── All states — rows: Ranged × State (+ forced handle states), columns: Layer set ── */

const HANDLE_ROWS = [
  { label: 'Handle Focused', state: 'enabled' as SliderState, extra: { 'data-state': 'focused' } as Partial<SliderProps> },
  { label: 'Handle Pressed', state: 'enabled' as SliderState, extra: { 'data-state': 'pressed' } as Partial<SliderProps> },
];

export const AllStates: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {LAYERS.map((l) => (
            <th key={l} style={headCell}>{`Set 0${l} · Editable`}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {RANGED.flatMap((r) => [
          ...STATES.map((s) => (
            <tr key={`${r}-${s}`}>
              <th style={headCell}>{`Ranged: ${cap(String(r))} · ${cap(s)}`}</th>
              {LAYERS.map((l) => (
                <td key={l} style={cell}>
                  <Slider {...variantProps(l, r, s, { editable: true })} />
                </td>
              ))}
            </tr>
          )),
          ...HANDLE_ROWS.map((h) => (
            <tr key={`${r}-${h.label}`}>
              <th style={headCell}>{`Ranged: ${cap(String(r))} · ${h.label}`}</th>
              {LAYERS.map((l) => (
                <td key={l} style={{ ...cell, paddingTop: 56 }}>
                  <Slider {...variantProps(l, r, h.state, { editable: true, ...h.extra })} />
                </td>
              ))}
            </tr>
          )),
        ])}
      </tbody>
    </table>
  ),
};

/* ── Full Figma matrix: all 12 variants (Figma defaults: Show label + Show value, not editable) ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 12 variants)',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div>
      {RANGED.map((r) => (
        <section key={String(r)}>
          <h3 style={sectionTitle}>{`Ranged=${cap(String(r))}`}</h3>
          <table style={table}>
            <thead>
              <tr>
                <th style={headCell} />
                {LAYERS.map((l) => (
                  <th key={l} style={headCell}>{`Layer set=Set 0${l}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STATES.map((s) => (
                <tr key={s}>
                  <th style={headCell}>{`State=${cap(s)}`}</th>
                  {LAYERS.map((l) => (
                    <td key={l} style={cell}>
                      <Slider {...variantProps(l, r, s)} />
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

/* ── Optional elements: Show label / Show value / Editable / Show explainer ── */

export const OptionalElements: Story = {
  name: 'Optional elements',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {RANGED.map((r) => (
            <th key={String(r)} style={headCell}>{`Ranged=${cap(String(r))}`}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[
          { name: 'Label + explainer + value + editable', extra: { explainer: 'Text message', editable: true } },
          { name: 'Editable, no label, no value', extra: { label: undefined, showValue: false, editable: true } },
          { name: 'Track only', extra: { label: undefined, showValue: false } },
        ].map((row) => (
          <tr key={row.name}>
            <th style={headCell}>{row.name}</th>
            {RANGED.map((r) => (
              <td key={String(r)} style={cell}>
                <Slider {...variantProps(1, r, 'enabled', row.extra as Partial<SliderProps>)} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const KeyboardSingle: Story = {
  tags: ['test'],
  args: { defaultValue: 50 },
  play: async ({ args, canvasElement }) => {
    const handle = within(canvasElement).getByRole('slider', { name: 'Label' });
    await userEvent.tab();
    await expect(handle).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    await expect(handle).toHaveAttribute('aria-valuenow', '52');
    await userEvent.keyboard('{PageDown}');
    await expect(handle).toHaveAttribute('aria-valuenow', '42');
    await userEvent.keyboard('{End}');
    await expect(handle).toHaveAttribute('aria-valuenow', '100');
    await userEvent.keyboard('{Home}');
    await expect(args.onChange).toHaveBeenLastCalledWith(0);
  },
};

export const KeyboardRangedNoCross: Story = {
  tags: ['test'],
  args: { ranged: true, defaultValue: [45, 50], step: 5 } as Partial<SliderProps>,
  play: async ({ canvasElement }) => {
    const view = within(canvasElement);
    const start = view.getByRole('slider', { name: 'Label start' });
    const end = view.getByRole('slider', { name: 'Label end' });
    await userEvent.tab();
    await expect(start).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    await expect(start).toHaveAttribute('aria-valuenow', '50');
    await userEvent.tab();
    await expect(end).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(end).toHaveAttribute('aria-valuenow', '50');
    await expect(end).toHaveAttribute('aria-valuemin', '50');
  },
};

export const PointerTrackClick: Story = {
  tags: ['test'],
  args: { defaultValue: 0 },
  play: async ({ canvasElement }) => {
    const view = within(canvasElement);
    const track = canvasElement.querySelector('[data-part="track"]') as HTMLElement;
    const rect = track.getBoundingClientRect();
    /* press the track centre → handle jumps to ~50 */
    await userEvent.pointer({ keys: '[MouseLeft]', target: track, coords: { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 } });
    const handle = view.getByRole('slider');
    await expect(Number(handle.getAttribute('aria-valuenow'))).toBeGreaterThanOrEqual(49);
    await expect(Number(handle.getAttribute('aria-valuenow'))).toBeLessThanOrEqual(51);
    await expect(handle).toHaveFocus();
  },
};

export const EditableSync: Story = {
  tags: ['test'],
  args: { editable: true, defaultValue: 50 },
  play: async ({ canvasElement }) => {
    const view = within(canvasElement);
    const input = view.getByRole('spinbutton');
    await userEvent.tripleClick(input);
    await userEvent.keyboard('75');
    await expect(view.getByRole('slider')).toHaveAttribute('aria-valuenow', '75');
  },
};

export const DisabledIgnoresInput: Story = {
  tags: ['test'],
  args: { disabled: true, defaultValue: 50 },
  play: async ({ args, canvasElement }) => {
    const handle = within(canvasElement).getByRole('slider');
    await expect(handle).toHaveAttribute('aria-disabled', 'true');
    await expect(handle).toHaveAttribute('tabindex', '-1');
    await userEvent.tab();
    await expect(handle).not.toHaveFocus();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};
