import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { CheckboxItem } from './CheckboxItem';
import type { CheckboxItemProps, CheckboxSelection } from './checkbox-item.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → 01 Checkbox item (node 1223:1396)
 * Selected × State — every combination is rendered in `FigmaMatrix`.
 */

const SELECTIONS: CheckboxSelection[] = ['unselected', 'selected', 'indeterminate'];
const STATES = ['enabled', 'focused', 'disabled', 'skeleton'] as const;
type State = (typeof STATES)[number];

const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Props for one Figma variant. */
function variantProps(selection: CheckboxSelection, state: State, showLabel = true): CheckboxItemProps {
  return {
    checked: selection,
    label: 'Checkbox value',
    showLabel,
    'aria-label': showLabel ? undefined : 'Checkbox value',
    disabled: state === 'disabled',
    skeleton: state === 'skeleton',
    'data-state': state === 'focused' ? 'focused' : undefined,
    onChange: () => {},
  };
}

/* ── Layout helpers (story-only) ── */

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: '0 16px', verticalAlign: 'middle' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};
const sectionTitle: React.CSSProperties = {
  font: '500 16px/24px var(--scanner-font-sans)',
  color: 'var(--scanner-text-primary)',
  margin: '24px 0 8px',
};

/* ------------------------------------------------------------------ */

const meta: Meta<typeof CheckboxItem> = {
  title: 'Components/CheckboxItem',
  component: CheckboxItem,
  parameters: {
    docs: {
      description: {
        component:
          'Lets users select one or more options. The checkbox and its value text are one click target. ' +
          'Long values wrap beneath the value start, top-aligned with the checkbox. ' +
          'Keyboard: Tab to focus, Space/Enter to toggle, arrow keys move between items in a group.',
      },
    },
  },
  argTypes: {
    checked: { name: 'Selected', control: 'inline-radio', options: SELECTIONS },
    label: { name: 'Text value', control: 'text' },
    showLabel: { name: 'Show value', control: 'boolean' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    'data-state': { name: 'Forced state', control: 'inline-radio', options: [undefined, 'focused'] },
  },
  args: {
    label: 'Checkbox value',
    showLabel: true,
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

type Story = StoryObj<typeof CheckboxItem>;

/* ── Default (uncontrolled — click to toggle) ── */

export const Default: Story = {};

/* ── Per selection (Figma "Selected") ── */

export const Unselected: Story = { args: { checked: 'unselected' } };
export const Selected: Story = { args: { checked: 'selected' } };
export const Indeterminate: Story = { args: { checked: 'indeterminate' } };

/* ── Per state (Figma "State") ── */

const StateRow = ({ state }: { state: State }) => (
  <div style={{ display: 'flex', gap: 32 }}>
    {SELECTIONS.map((sel) => (
      <CheckboxItem key={sel} {...variantProps(sel, state)} />
    ))}
  </div>
);

export const Enabled: Story = { render: () => <StateRow state="enabled" /> };
export const Focused: Story = { render: () => <StateRow state="focused" /> };
export const Disabled: Story = { render: () => <StateRow state="disabled" /> };
export const Skeleton: Story = { render: () => <StateRow state="skeleton" /> };

/* ── Show value (Figma "Show value") ── */

export const ShowValueFalse: Story = {
  name: 'Show value: False',
  args: { showLabel: false, 'aria-label': 'Checkbox value' },
};

/* ── All states — selection rows × state columns ── */

export const AllStates: Story = {
  args: { showLabel: true },
  render: ({ showLabel = true }) => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {STATES.map((s) => (
            <th key={s} style={headCell}>{label(s)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {SELECTIONS.map((sel) => (
          <tr key={sel}>
            <th style={headCell}>{label(sel)}</th>
            {STATES.map((s) => (
              <td key={s} style={cell}>
                <CheckboxItem {...variantProps(sel, s, showLabel)} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Full Figma matrix: 12 variants × Show value ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 12 variants × Show value)',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ padding: 24 }}>
      {[true, false].map((show) => (
        <section key={String(show)}>
          <h3 style={sectionTitle}>{`Show value=${show ? 'True' : 'False'}`}</h3>
          <table style={table}>
            <thead>
              <tr>
                <th style={headCell} />
                {SELECTIONS.map((sel) => (
                  <th key={sel} style={headCell}>{`Selected=${label(sel)}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STATES.map((st) => (
                <tr key={st}>
                  <th style={headCell}>{`State=${label(st)}`}</th>
                  {SELECTIONS.map((sel) => (
                    <td key={sel} style={cell}>
                      <CheckboxItem {...variantProps(sel, st, show)} />
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

/* ── Overflow: text wraps beneath, top-aligned with the checkbox ── */

export const LongValueWraps: Story = {
  render: () => (
    <div style={{ width: 220 }}>
      <CheckboxItem label="Checkbox label that wraps to multiple lines because it’s too long" defaultChecked />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const ClickToggles: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', { name: 'Checkbox value' });
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
    await expect(args.onChange).toHaveBeenLastCalledWith(true);
    /* The value text is part of the click target */
    await userEvent.click(within(canvasElement).getByText('Checkbox value'));
    await expect(checkbox).not.toBeChecked();
    await expect(args.onChange).toHaveBeenLastCalledWith(false);
  },
};

export const KeyboardToggles: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', { name: 'Checkbox value' });
    await userEvent.tab();
    await expect(checkbox).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(checkbox).toBeChecked();
    await userEvent.keyboard('{Enter}');
    await expect(checkbox).not.toBeChecked();
    await expect(args.onChange).toHaveBeenCalledTimes(2);
  },
};

export const IndeterminateSelects: Story = {
  tags: ['test'],
  args: { checked: 'indeterminate' },
  play: async ({ args, canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', { name: 'Checkbox value' });
    await expect(checkbox).toBePartiallyChecked();
    await userEvent.click(checkbox);
    await expect(args.onChange).toHaveBeenCalledWith(true);
  },
};

export const DisabledIgnoresClick: Story = {
  tags: ['test'],
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', { name: 'Checkbox value' });
    await expect(checkbox).toBeDisabled();
    await userEvent.click(checkbox, { pointerEventsCheck: 0 });
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};
