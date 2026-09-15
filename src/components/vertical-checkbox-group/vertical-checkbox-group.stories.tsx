import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { VerticalCheckboxGroup } from './VerticalCheckboxGroup';
import { CheckboxItem } from '../checkbox-item';
import type { VerticalCheckboxGroupProps } from './vertical-checkbox-group.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → 02 Vertical checkbox group (node 20619:27426)
 * Levels (1, 2) × Show label × Show explainer × Required — rendered in `FigmaMatrix`.
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

/** Figma "Show label / Show explainer / Required" combinations. */
const LABEL_COMBOS: { name: string; props: Partial<VerticalCheckboxGroupProps> }[] = [
  { name: 'Show label=False', props: { showLabel: false } },
  { name: 'Show label=True', props: {} },
  { name: 'Required=True', props: { required: true } },
  { name: 'Show explainer=True', props: { tooltipContent: 'Explainer text' } },
  { name: 'Explainer + Required', props: { tooltipContent: 'Explainer text', required: true } },
];

/**
 * Two items for Levels=1, main + two nested for Levels=2 — like the Figma component.
 * Returned as an array (not a fragment component) so the group sees each item as a child.
 */
const items = (levels: 1 | 2) =>
  Array.from({ length: levels === 2 ? 3 : 2 }, (_, i) => <CheckboxItem key={i} label="Checkbox value" />);

const meta: Meta<typeof VerticalCheckboxGroup> = {
  title: 'Components/VerticalCheckboxGroup',
  component: VerticalCheckboxGroup,
  parameters: {
    docs: {
      description: {
        component:
          'Labelled vertical list of CheckboxItems. Levels=2 nests every item after the first under it; ' +
          'checking the parent selects all children, unchecking clears them, a partial selection shows indeterminate. ' +
          'Keyboard: ArrowUp/ArrowDown move between checkboxes, Space/Enter toggle.',
      },
    },
  },
  argTypes: {
    levels: { name: 'Levels', control: 'inline-radio', options: [1, 2] },
    label: { name: 'Label text', control: 'text' },
    showLabel: { name: 'Show label', control: 'boolean' },
    tooltipContent: { name: 'Show explainer (text)', control: 'text' },
    required: { name: 'Required', control: 'boolean' },
    helperText: { control: 'text' },
    error: { control: 'boolean' },
    errorMessage: { control: 'text' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
  },
  args: {
    label: 'Label',
    showLabel: true,
    required: false,
    levels: 1,
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

type Story = StoryObj<typeof VerticalCheckboxGroup>;

/* ── Default ── */

export const Default: Story = {
  render: (args) => (
    <VerticalCheckboxGroup {...args}>
      {items(args.levels ?? 1)}
    </VerticalCheckboxGroup>
  ),
};

/* ── Per Levels ── */

export const Levels1: Story = { name: 'Levels=1', args: { levels: 1 }, render: Default.render };
export const Levels2: Story = { name: 'Levels=2', args: { levels: 2 }, render: Default.render };

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
  name: 'Figma matrix (Levels × label properties)',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ padding: 24 }}>
      <table style={table}>
        <thead>
          <tr>
            <th style={headCell} />
            {LABEL_COMBOS.map((c) => (
              <th key={c.name} style={headCell}>{c.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {([1, 2] as const).map((levels) => (
            <tr key={levels}>
              <th style={headCell}>{`Levels=${levels}`}</th>
              {LABEL_COMBOS.map((c) => (
                <td key={c.name} style={cell}>
                  <VerticalCheckboxGroup label="Label" levels={levels} {...c.props}>
                    {items(levels)}
                  </VerticalCheckboxGroup>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

/* ── All states of the contained items ── */

const STATE_COLUMNS: { name: string; group: Partial<VerticalCheckboxGroupProps>; focused?: boolean }[] = [
  { name: 'Enabled', group: {} },
  { name: 'Focused (first item)', group: {}, focused: true },
  { name: 'Disabled', group: { disabled: true } },
  { name: 'Skeleton', group: { skeleton: true } },
  { name: 'Error (not in Figma)', group: { required: true, error: true, errorMessage: 'Select at least one option' } },
  { name: 'Helper text (not in Figma)', group: { helperText: 'Choose one or more' } },
];

export const AllStates: Story = {
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          {STATE_COLUMNS.map((c) => (
            <th key={c.name} style={headCell}>{c.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {STATE_COLUMNS.map((c) => (
            <td key={c.name} style={cell}>
              <VerticalCheckboxGroup label="Label" {...c.group}>
                <CheckboxItem label="Unselected" data-state={c.focused ? 'focused' : undefined} />
                <CheckboxItem label="Selected" defaultChecked />
                <CheckboxItem label="Indeterminate" checked="indeterminate" onChange={() => {}} />
              </VerticalCheckboxGroup>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  ),
};

/* ── Nesting behaviour (Figma docs "Nesting") ── */

const CHILDREN = ['Upper jaw', 'Lower jaw', 'Bite', 'Pre-treatment'];

const NestedSelection = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const all = selected.length === CHILDREN.length;
  const parent = all ? 'selected' : selected.length ? 'indeterminate' : 'unselected';
  return (
    <VerticalCheckboxGroup label="Scans" levels={2}>
      <CheckboxItem label="All scans" checked={parent} onChange={(v) => setSelected(v ? CHILDREN : [])} />
      {CHILDREN.map((c) => (
        <CheckboxItem
          key={c}
          label={c}
          checked={selected.includes(c)}
          onChange={(v) => setSelected((s) => (v ? [...s, c] : s.filter((x) => x !== c)))}
        />
      ))}
    </VerticalCheckboxGroup>
  );
};

export const Nesting: Story = { render: () => <NestedSelection /> };

/* ── Overflow: long values wrap, top-aligned ── */

export const LongValues: Story = {
  render: () => (
    <div style={{ width: 260 }}>
      <VerticalCheckboxGroup label="Checkbox label that wraps to multiple lines because it’s too long">
        <CheckboxItem label="Checkbox value that wraps to multiple lines because it’s too long" />
        <CheckboxItem label="Checkbox value" />
      </VerticalCheckboxGroup>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const ArrowKeyNavigation: Story = {
  tags: ['test'],
  render: () => (
    <VerticalCheckboxGroup label="Jaws">
      <CheckboxItem label="Upper" />
      <CheckboxItem label="Lower" disabled />
      <CheckboxItem label="Bite" />
    </VerticalCheckboxGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole('checkbox', { name: 'Upper' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    /* Disabled items are skipped */
    await expect(canvas.getByRole('checkbox', { name: 'Bite' })).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(canvas.getByRole('checkbox', { name: 'Upper' })).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(canvas.getByRole('checkbox', { name: 'Upper' })).toBeChecked();
  },
};

export const ParentSelectsChildren: Story = {
  tags: ['test'],
  render: () => <NestedSelection />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Bite' }));
    await expect(canvas.getByRole('checkbox', { name: 'All scans' })).toBePartiallyChecked();
    await userEvent.click(canvas.getByRole('checkbox', { name: 'All scans' }));
    for (const c of CHILDREN) await expect(canvas.getByRole('checkbox', { name: c })).toBeChecked();
    await userEvent.click(canvas.getByRole('checkbox', { name: 'All scans' }));
    for (const c of CHILDREN) await expect(canvas.getByRole('checkbox', { name: c })).not.toBeChecked();
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
