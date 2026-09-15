import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { PasswordInput } from './PasswordInput';
import type { PasswordInputProps } from './password-input.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Password input (node 6176:2285)
 * Layer set × Filled × State × Visible = 40 variants — every combination is rendered in `FigmaMatrix`.
 */

const LAYERS = [1, 2] as const;
const FILLED = [false, true] as const;
const VISIBLE = [false, true] as const;
const STATES = ['enabled', 'focused', 'disabled', 'error', 'skeleton'] as const;
type State = (typeof STATES)[number];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Props for one Figma variant (Figma defaults: label, link, helper and placeholder shown). */
function variantProps(layer: 1 | 2, filled: boolean, state: State, visible: boolean): PasswordInputProps {
  return {
    layer,
    placeholder: 'Password',
    defaultValue: filled ? 'Password' : undefined,
    defaultPasswordVisible: visible,
    disabled: state === 'disabled',
    error: state === 'error',
    skeleton: state === 'skeleton',
    'data-state': state === 'focused' ? 'focused' : undefined,
    linkHref: '#',
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

const meta: Meta<typeof PasswordInput> = {
  title: 'Components/PasswordInput',
  component: PasswordInput,
  parameters: {
    docs: {
      description: {
        component:
          'Masked entry for passwords and other sensitive values. The visibility toggle appears once the field has a value ' +
          '(or while it is focused). Keyboard: Tab focuses the field, Tab again reaches the toggle, Enter/Space toggles visibility.',
      },
    },
  },
  argTypes: {
    layer: { name: 'Layer set', control: 'inline-radio', options: [1, 2] },
    label: { name: 'Label text value', control: 'text' },
    showLabel: { name: 'Show label', control: 'boolean' },
    placeholder: { name: 'Placeholder', control: 'text' },
    helperText: { name: 'Helper text value', control: 'text' },
    showHelper: { name: 'Show helper', control: 'boolean' },
    errorText: { name: 'Error text value', control: 'text' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    required: { name: 'Required', control: 'boolean' },
    showLink: { name: 'Show link', control: 'boolean' },
    linkText: { control: 'text' },
    linkHref: { control: 'text' },
    showExplainer: { name: 'Show explainer', control: 'boolean' },
    explainerContent: { control: 'text' },
    passwordVisible: { name: 'Visible (controlled)', control: 'boolean' },
    'data-state': { name: 'Forced state', control: 'inline-radio', options: [undefined, 'focused'] },
  },
  args: {
    layer: 1,
    label: 'Password',
    placeholder: 'Password',
    linkHref: '#',
    explainerContent: 'Use at least 8 characters',
    onChange: fn(),
    onPasswordVisibleChange: fn(),
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
type Story = StoryObj<typeof PasswordInput>;

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

/* ── Filled / Visible ── */

export const Empty: Story = { name: 'Filled: False' };
export const Filled: Story = { name: 'Filled: True', args: { defaultValue: 'mySecretP@ss' } };
export const Visible: Story = { name: 'Visible: True', args: { defaultValue: 'mySecretP@ss', defaultPasswordVisible: true } };

/* ── States ── */

export const Focused: Story = { name: 'State: Focused', args: { 'data-state': 'focused' } };
export const Disabled: Story = { name: 'State: Disabled', args: { disabled: true, defaultValue: 'mySecretP@ss' } };
export const ErrorState: Story = {
  name: 'State: Error',
  args: { error: true, errorText: 'Incorrect password', defaultValue: 'mySecretP@ss' },
};
export const Skeleton: Story = { name: 'State: Skeleton', args: { skeleton: true } };

/* ── Boolean properties ── */

export const Required: Story = { args: { required: true } };
export const WithExplainer: Story = { name: 'Show explainer', args: { showExplainer: true } };
export const Minimal: Story = {
  name: 'Show label/link/helper: False',
  args: { showLabel: false, showLink: false, showHelper: false, 'aria-label': 'Password' },
};

/* ── Controlled visibility (hooks live in a named component) ── */

const ControlledDemo = (args: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState('');
  return (
    <PasswordInput
      {...args}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      passwordVisible={visible}
      onPasswordVisibleChange={setVisible}
      helperText={visible ? 'Password is visible' : 'Password is hidden'}
    />
  );
};

export const ControlledVisibility: Story = {
  name: 'Controlled visibility',
  render: (args) => <ControlledDemo {...args} />,
};

/* ── All states — rows: states, columns: Layer set × Filled × Visible ── */

const StateTable = ({ layer, extra }: { layer: 1 | 2; extra?: Partial<PasswordInputProps> }) => (
  <table style={table}>
    <thead>
      <tr>
        <th style={headCell} />
        {FILLED.flatMap((f) =>
          VISIBLE.map((v) => (
            <th key={`${f}-${v}`} style={headCell}>{`Filled=${cap(String(f))}, Visible=${cap(String(v))}`}</th>
          )),
        )}
      </tr>
    </thead>
    <tbody>
      {STATES.map((st) => (
        <tr key={st}>
          <th style={headCell}>{`State=${cap(st)}`}</th>
          {FILLED.flatMap((f) =>
            VISIBLE.map((v) => (
              <td key={`${f}-${v}`} style={cell}>
                <PasswordInput {...variantProps(layer, f, st, v)} {...extra} />
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
  render: ({ layer = 1 }) => (
    <StateTable layer={layer} extra={{ required: true, showExplainer: true, explainerContent: 'Explainer' }} />
  ),
};

/* ── Full Figma matrix: all 40 variants ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 40 variants)',
  parameters: { layout: 'fullscreen' },
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

/* ── Overflow content ── */

export const LongContent: Story = {
  name: 'Overflow content',
  args: {
    label: 'Create a new password for your clinic account',
    defaultValue: 'a-very-long-passphrase-that-scrolls-horizontally-inside-the-field',
    defaultPasswordVisible: true,
    helperText: 'Password must be 8–12 characters, include a number and a special character.',
  },
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const ToggleVisibility: Story = {
  tags: ['test'],
  args: { defaultValue: 'secret' },
  play: async ({ args, canvasElement }) => {
    const view = within(canvasElement);
    const input = view.getByLabelText('Password');
    await expect(input).toHaveAttribute('type', 'password');
    await userEvent.click(view.getByRole('button', { name: 'Show password' }));
    await expect(input).toHaveAttribute('type', 'text');
    await expect(args.onPasswordVisibleChange).toHaveBeenCalledWith(true);
    await userEvent.click(view.getByRole('button', { name: 'Hide password' }));
    await expect(input).toHaveAttribute('type', 'password');
  },
};

export const KeyboardToggle: Story = {
  tags: ['test'],
  play: async ({ canvasElement }) => {
    const view = within(canvasElement);
    const input = view.getByLabelText('Password');
    await userEvent.click(input);
    await userEvent.type(input, 'secret');
    await userEvent.tab();
    const toggle = view.getByRole('button', { name: 'Show password' });
    await expect(toggle).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(input).toHaveAttribute('type', 'text');
    await userEvent.keyboard(' ');
    await expect(input).toHaveAttribute('type', 'password');
  },
};

export const DisabledIgnoresInput: Story = {
  tags: ['test'],
  args: { disabled: true, defaultValue: 'secret' },
  play: async ({ args, canvasElement }) => {
    const view = within(canvasElement);
    const input = view.getByLabelText('Password');
    await expect(input).toBeDisabled();
    await expect(view.getByRole('button', { name: 'Show password' })).toBeDisabled();
    await userEvent.type(input, 'abc', { pointerEventsCheck: 0 });
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

export const ErrorIsAnnounced: Story = {
  tags: ['test'],
  args: { error: true, errorText: 'Incorrect password' },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Password');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('Incorrect password');
  },
};
