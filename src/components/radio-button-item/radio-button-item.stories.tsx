import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { RadioButtonItem } from './RadioButtonItem';
import type { RadioButtonItemProps } from './radio-button-item.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → 01 Radio button item (node 1223:1419)
 * Selected (True, False) × State (Enabled, Focused, Disabled, Skeleton) — all rendered in `FigmaMatrix`.
 */

const SELECTED = [false, true] as const;
const STATES = ['enabled', 'focused', 'disabled', 'skeleton'] as const;
type State = (typeof STATES)[number];

const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Props for one Figma variant. */
function variantProps(selected: boolean, state: State, showLabel = true): RadioButtonItemProps {
  return {
    selected,
    showLabel,
    label: 'Radio button value',
    'aria-label': showLabel ? undefined : 'Radio button value',
    disabled: state === 'disabled',
    skeleton: state === 'skeleton',
    'data-state': state === 'focused' ? 'focused' : undefined,
    onChange: () => {},
  };
}

/* ── Layout helpers (story-only) ── */

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 12, verticalAlign: 'top' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

/* ------------------------------------------------------------------ */

const meta: Meta<typeof RadioButtonItem> = {
  title: 'Components/RadioButtonItem',
  component: RadioButtonItem,
  parameters: {
    docs: {
      description: {
        component:
          'A single option of a mutually exclusive set. Use inside RadioButtonsVerticalGroup / RadioButtonsHorizontalGroup, ' +
          'which add arrow-key navigation. Clicking the control or its value selects it; Space selects the focused radio. ' +
          'Long values wrap under the first line while the control stays top-aligned.',
      },
    },
  },
  argTypes: {
    selected: { name: 'Selected', control: 'boolean' },
    showLabel: { name: 'Show value', control: 'boolean' },
    label: { name: 'Text value', control: 'text' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    'data-state': { name: 'Forced state', control: 'inline-radio', options: [undefined, 'focused'] },
  },
  args: {
    label: 'Radio button value',
    selected: false,
    showLabel: true,
    name: 'radio-story',
    value: 'option',
    onChange: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof RadioButtonItem>;

/* ── Default ── */

export const Default: Story = {};

/* ── Selected (Figma "Selected") ── */

export const Unselected: Story = { name: 'Selected: False' };
export const Selected: Story = { name: 'Selected: True', args: { selected: true } };

/* ── States (Figma "State") ── */

const StateRow = ({ state }: { state: State }) => (
  <div style={{ display: 'flex', gap: 32 }}>
    {SELECTED.map((s) => (
      <RadioButtonItem key={String(s)} {...variantProps(s, state)} />
    ))}
  </div>
);

export const Enabled: Story = { render: () => <StateRow state="enabled" /> };
export const Focused: Story = { render: () => <StateRow state="focused" /> };
export const Disabled: Story = { render: () => <StateRow state="disabled" /> };
export const Skeleton: Story = { render: () => <StateRow state="skeleton" /> };

/* ── All states — Selected rows × State columns ── */

export const AllStates: Story = {
  render: ({ showLabel = true }) => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {STATES.map((st) => (
            <th key={st} style={headCell}>{label(st)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {SELECTED.map((s) => (
          <tr key={String(s)}>
            <th style={headCell}>{`Selected=${s ? 'True' : 'False'}`}</th>
            {STATES.map((st) => (
              <td key={st} style={cell}>
                <RadioButtonItem {...variantProps(s, st, showLabel)} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Full Figma matrix: 8 variants × Show value ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 8 variants)',
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {SELECTED.flatMap((s) =>
            [true, false].map((show) => (
              <th key={`${s}-${show}`} style={headCell}>
                {`Selected=${s ? 'True' : 'False'} · Show value=${show ? 'True' : 'False'}`}
              </th>
            )),
          )}
        </tr>
      </thead>
      <tbody>
        {STATES.map((st) => (
          <tr key={st}>
            <th style={headCell}>{`State=${label(st)}`}</th>
            {SELECTED.flatMap((s) =>
              [true, false].map((show) => (
                <td key={`${s}-${show}`} style={cell}>
                  <RadioButtonItem {...variantProps(s, st, show)} />
                </td>
              )),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Overflow: long values wrap, control stays top-aligned ── */

export const LongValueWraps: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <RadioButtonItem
        name="wrap"
        value="a"
        selected
        onChange={() => {}}
        label="Radio button label that wraps to multiple lines because it is too long"
      />
      <div style={{ width: 200 }}>
        <RadioButtonItem
          name="wrap"
          value="b"
          onChange={() => {}}
          label="Radio button label that wraps inside a narrow container"
        />
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const ClickSelects: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const radio = within(canvasElement).getByRole('radio', { name: 'Radio button value' });
    await expect(radio).not.toBeChecked();
    await userEvent.click(within(canvasElement).getByText('Radio button value'));
    await expect(args.onChange).toHaveBeenCalledWith(true, expect.anything());
  },
};

export const KeyboardSpaceSelects: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const radio = within(canvasElement).getByRole('radio', { name: 'Radio button value' });
    await userEvent.tab();
    await expect(radio).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(args.onChange).toHaveBeenCalledTimes(1);
  },
};

export const DisabledIgnoresClick: Story = {
  tags: ['test'],
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    const radio = within(canvasElement).getByRole('radio', { name: 'Radio button value' });
    await expect(radio).toBeDisabled();
    await expect(radio).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(within(canvasElement).getByText('Radio button value'), { pointerEventsCheck: 0 });
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};
