import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { HorizontalCheckboxGroup } from './HorizontalCheckboxGroup';
import { CheckboxItem } from '../checkbox-item';
import type { HorizontalCheckboxGroupProps } from './horizontal-checkbox-group.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → 03 Horizontal checkbox group (node 28129:11602)
 * Show label × Show explainer × Required — rendered in `FigmaMatrix`.
 */

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: '8px 24px', verticalAlign: 'top' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const LABEL_COMBOS: { name: string; props: Partial<HorizontalCheckboxGroupProps> }[] = [
  { name: 'Show label=False', props: { showLabel: false } },
  { name: 'Show label=True', props: {} },
  { name: 'Required=True', props: { required: true } },
  { name: 'Show explainer=True', props: { tooltipContent: 'Explainer text' } },
  { name: 'Show explainer + Required', props: { tooltipContent: 'Explainer text', required: true } },
];

const Items = () => (
  <>
    <CheckboxItem label="Checkbox value" />
    <CheckboxItem label="Checkbox value" />
  </>
);

const meta: Meta<typeof HorizontalCheckboxGroup> = {
  title: 'Components/HorizontalCheckboxGroup',
  component: HorizontalCheckboxGroup,
  parameters: {
    docs: {
      description: {
        component:
          'Labelled row of CheckboxItems with a 16px gap. Keyboard: arrow keys move between checkboxes, Space/Enter toggle.',
      },
    },
  },
  argTypes: {
    label: { name: 'Label text', control: 'text' },
    showLabel: { name: 'Show label', control: 'boolean' },
    tooltipContent: { name: 'Show explainer (text)', control: 'text' },
    required: { name: 'Required', control: 'boolean' },
    helperText: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
  },
  args: {
    label: 'Label',
    showLabel: true,
    required: false,
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

type Story = StoryObj<typeof HorizontalCheckboxGroup>;

/* ── Default ── */

export const Default: Story = {
  render: (args) => (
    <HorizontalCheckboxGroup {...args}>
      <Items />
    </HorizontalCheckboxGroup>
  ),
};

/* ── Label properties ── */

export const WithExplainer: Story = {
  name: 'Show explainer',
  args: { tooltipContent: 'Select every jaw that was scanned' },
  render: Default.render,
};
export const Required: Story = { args: { required: true }, render: Default.render };
export const WithoutLabel: Story = { name: 'Show label=False', args: { showLabel: false }, render: Default.render };

/* ── Full Figma matrix ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (label properties)',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ padding: 24 }}>
      <table style={table}>
        <tbody>
          {LABEL_COMBOS.map((c) => (
            <tr key={c.name}>
              <th style={headCell}>{c.name}</th>
              <td style={cell}>
                <HorizontalCheckboxGroup label="Label" {...c.props}>
                  <Items />
                </HorizontalCheckboxGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

/* ── All states of the contained items ── */

const STATE_ROWS: { name: string; group: Partial<HorizontalCheckboxGroupProps>; focused?: boolean }[] = [
  { name: 'Enabled', group: {} },
  { name: 'Focused (first item)', group: {}, focused: true },
  { name: 'Disabled', group: { disabled: true } },
  { name: 'Skeleton', group: { skeleton: true } },
  { name: 'Error (not in Figma)', group: { required: true, error: 'Select at least one option' } },
  { name: 'Helper text (not in Figma)', group: { helperText: 'Choose one or more' } },
];

export const AllStates: Story = {
  render: () => (
    <table style={table}>
      <tbody>
        {STATE_ROWS.map((r) => (
          <tr key={r.name}>
            <th style={headCell}>{r.name}</th>
            <td style={cell}>
              <HorizontalCheckboxGroup label="Label" {...r.group}>
                <CheckboxItem label="Unselected" data-state={r.focused ? 'focused' : undefined} />
                <CheckboxItem label="Selected" defaultChecked />
                <CheckboxItem label="Indeterminate" checked="indeterminate" onChange={() => {}} />
              </HorizontalCheckboxGroup>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Many items ── */

export const ManyItems: Story = {
  render: () => (
    <HorizontalCheckboxGroup label="Teeth">
      {['UL1', 'UL2', 'UL3', 'UR1', 'UR2', 'UR3'].map((t) => (
        <CheckboxItem key={t} label={t} />
      ))}
    </HorizontalCheckboxGroup>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const ArrowKeyNavigation: Story = {
  tags: ['test'],
  render: () => (
    <HorizontalCheckboxGroup label="Jaws">
      <CheckboxItem label="Upper" />
      <CheckboxItem label="Lower" />
      <CheckboxItem label="Bite" />
    </HorizontalCheckboxGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole('checkbox', { name: 'Upper' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('checkbox', { name: 'Lower' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('checkbox', { name: 'Bite' })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(canvas.getByRole('checkbox', { name: 'Lower' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('checkbox', { name: 'Lower' })).toBeChecked();
  },
};

export const DisabledGroup: Story = {
  tags: ['test'],
  args: { disabled: true },
  render: Default.render,
  play: async ({ canvasElement }) => {
    for (const cb of within(canvasElement).getAllByRole('checkbox')) await expect(cb).toBeDisabled();
  },
};
