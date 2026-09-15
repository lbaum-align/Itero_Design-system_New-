import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Toggle } from './Toggle';
import type { ToggleProps } from './toggle.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Toggle (node 24292:6271)
 * Selected × State (+ Show value) — every combination is rendered in `FigmaMatrix`.
 */

const STATES = ['enabled', 'hovered', 'pressed', 'focused', 'disabled', 'skeleton'] as const;
type State = (typeof STATES)[number];

const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Props for one Figma variant. */
function variantProps(selected: boolean, state: State, showValue = true): ToggleProps {
  return {
    selected,
    showValue,
    disabled: state === 'disabled',
    skeleton: state === 'skeleton',
    'data-state': state === 'hovered' || state === 'focused' || state === 'pressed' ? state : undefined,
    'aria-label': showValue ? undefined : 'Value',
    children: 'Value',
  };
}

/* ── Layout helpers (story-only) ── */

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 12, verticalAlign: 'middle' };
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

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: {
    docs: {
      description: {
        component:
          'Switch for a binary setting that applies immediately (e.g. notifications on/off). ' +
          'Use checkboxes or radio buttons when a confirmation step follows. ' +
          'Keyboard: Tab to focus, Enter/Space to toggle. Clicking the value text also toggles.',
      },
    },
  },
  argTypes: {
    selected: { name: 'Selected', control: 'boolean' },
    showValue: { name: 'Show value', control: 'boolean' },
    children: { name: 'Text value', control: 'text' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    'data-state': {
      name: 'Forced state',
      control: 'inline-radio',
      options: [undefined, 'hovered', 'focused', 'pressed'],
    },
    'aria-label': { control: 'text' },
  },
  args: {
    selected: false,
    showValue: true,
    children: 'Value',
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

type Story = StoryObj<typeof Toggle>;

/* ── Default ── */

export const Default: Story = {};

/* ── Selected (Figma "Selected") ── */

export const SelectedFalse: Story = { name: 'Selected: False' };
export const SelectedTrue: Story = { name: 'Selected: True', args: { selected: true } };

/* ── Show value (Figma "Show value") ── */

export const ShowValueFalse: Story = {
  name: 'Show value: False',
  args: { showValue: false, 'aria-label': 'Notifications' },
};

/* ── Controlled example ── */

const ControlledToggle = (props: ToggleProps) => {
  const [on, setOn] = useState(false);
  return (
    <Toggle
      {...props}
      selected={on}
      onChange={(next) => {
        setOn(next);
        props.onChange?.(next);
      }}
    >
      Notifications
    </Toggle>
  );
};

export const Controlled: Story = { render: (args) => <ControlledToggle {...args} /> };

/* ── All states — selected rows × state columns ── */

export const AllStates: Story = {
  render: ({ showValue = true }) => (
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
        {[false, true].map((sel) => (
          <tr key={String(sel)}>
            <th style={headCell}>{`Selected: ${sel ? 'True' : 'False'}`}</th>
            {STATES.map((s) => (
              <td key={s} style={cell}>
                <Toggle {...variantProps(sel, s, showValue)} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Individual states ── */

const StateRow = ({ state }: { state: State }) => (
  <div style={{ display: 'flex', gap: 24 }}>
    <Toggle {...variantProps(false, state)} />
    <Toggle {...variantProps(true, state)} />
  </div>
);

export const Hovered: Story = { render: () => <StateRow state="hovered" /> };
export const Pressed: Story = { render: () => <StateRow state="pressed" /> };
export const Focused: Story = { render: () => <StateRow state="focused" /> };
export const Disabled: Story = { render: () => <StateRow state="disabled" /> };
export const Skeleton: Story = { render: () => <StateRow state="skeleton" /> };

/* ── Full Figma matrix: 12 variants × Show value ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 12 variants)',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ padding: 24 }}>
      {[true, false].map((showValue) => (
        <section key={String(showValue)}>
          <h3 style={sectionTitle}>{`Show value=${showValue ? 'True' : 'False'}`}</h3>
          <table style={table}>
            <thead>
              <tr>
                <th style={headCell} />
                {STATES.map((s) => (
                  <th key={s} style={headCell}>{`State=${label(s)}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[false, true].map((sel) => (
                <tr key={String(sel)}>
                  <th style={headCell}>{`Selected=${sel ? 'True' : 'False'}`}</th>
                  {STATES.map((s) => (
                    <td key={s} style={cell}>
                      <Toggle {...variantProps(sel, s, showValue)} />
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

/* ── Long value text wraps next to the switch ── */

export const LongValue: Story = {
  render: () => (
    <div style={{ width: 260 }}>
      <Toggle selected>Automatically upload scans to the cloud after each session</Toggle>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const ClickToggles: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const toggle = within(canvasElement).getByRole('switch', { name: 'Value' });
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(toggle);
    await expect(args.onChange).toHaveBeenCalledWith(true);
  },
};

export const ClickValueTextToggles: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByText('Value'));
    await expect(args.onChange).toHaveBeenCalledWith(true);
  },
};

export const KeyboardToggles: Story = {
  tags: ['test'],
  args: { selected: true },
  play: async ({ args, canvasElement }) => {
    const toggle = within(canvasElement).getByRole('switch', { name: 'Value' });
    await userEvent.tab();
    await expect(toggle).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onChange).toHaveBeenCalledTimes(2);
    await expect(args.onChange).toHaveBeenCalledWith(false);
  },
};

export const DisabledIgnoresClick: Story = {
  tags: ['test'],
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    const toggle = within(canvasElement).getByRole('switch', { name: 'Value' });
    await expect(toggle).toBeDisabled();
    await expect(toggle).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(toggle, { pointerEventsCheck: 0 });
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};
