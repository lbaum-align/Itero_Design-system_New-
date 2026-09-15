import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { RadioButtonsVerticalGroup } from './RadioButtonsVerticalGroup';
import type { RadioButtonsVerticalGroupProps, RadioOption } from './radio-buttons-vertical-group.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → 02 Radio buttons vertical group/Default (node 25:1188)
 * Component properties: Show label · Label text value · Show explainer · Required — every
 * combination is rendered in `FigmaMatrix`. Items use 01 Radio button item.
 */

const figmaItems: RadioOption[] = [1, 2, 3, 4, 5].map((n) => ({ label: 'Radio button value', value: `option-${n}` }));

const realItems: RadioOption[] = [
  { label: 'Email', value: 'email' },
  { label: 'Phone call', value: 'phone' },
  { label: 'SMS', value: 'sms' },
  { label: 'Mail', value: 'mail' },
];

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 16, verticalAlign: 'top' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

/** Stateful wrapper so stories behave like a real form field. */
const Controlled = (props: RadioButtonsVerticalGroupProps) => {
  const [value, setValue] = useState(props.value ?? '');
  return (
    <RadioButtonsVerticalGroup
      {...props}
      value={value}
      onChange={(v) => {
        setValue(v);
        props.onChange?.(v);
      }}
    />
  );
};

const meta: Meta<typeof RadioButtonsVerticalGroup> = {
  title: 'Components/RadioButtonsVerticalGroup',
  component: RadioButtonsVerticalGroup,
  parameters: {
    docs: {
      description: {
        component:
          'A labelled group of mutually exclusive options stacked vertically (60px rows, 8px apart). ' +
          'Keyboard: Tab / Shift+Tab move into and out of the group (focus lands on the selected radio), ' +
          'arrow keys move the selection between enabled radios and wrap, Space selects the focused radio.',
      },
    },
  },
  argTypes: {
    showLabel: { name: 'Show label', control: 'boolean' },
    label: { name: 'Label text value', control: 'text' },
    tooltipContent: { name: 'Show explainer (tooltip text)', control: 'text' },
    tooltipPosition: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] },
    required: { name: 'Required', control: 'boolean' },
    helperText: { control: 'text' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    value: { control: 'text' },
  },
  args: {
    label: 'Label',
    showLabel: true,
    required: false,
    items: figmaItems,
    value: 'option-1',
    onChange: fn(),
  },
  render: (args) => <Controlled {...args} />,
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof RadioButtonsVerticalGroup>;

/* ── Default (Figma default: label shown, first item selected) ── */

export const Default: Story = {};

/* ── Component properties ── */

export const WithoutLabel: Story = { name: 'Show label: False', args: { showLabel: false } };
export const WithExplainer: Story = {
  name: 'Show explainer: True',
  args: { tooltipContent: 'Additional information about this choice' },
};
export const Required: Story = { name: 'Required: True', args: { required: true } };

/* ── States ── */

export const NothingSelected: Story = { args: { value: '' } };
export const Disabled: Story = { args: { disabled: true, value: 'option-2' } };
export const PartiallyDisabled: Story = {
  args: {
    items: [
      { label: 'Available', value: 'a' },
      { label: 'Unavailable', value: 'b', disabled: true },
      { label: 'Available', value: 'c' },
    ],
    value: 'a',
  },
};
export const ErrorWithHelperText: Story = {
  args: { required: true, error: true, value: '', helperText: 'Please select an option.' },
};
export const Skeleton: Story = { args: { skeleton: true } };

export const AllStates: Story = {
  render: () => {
    const items = figmaItems.slice(0, 3);
    const states: [string, Partial<RadioButtonsVerticalGroupProps>][] = [
      ['Enabled', { value: 'option-1' }],
      ['Nothing selected', { value: '' }],
      ['Disabled', { disabled: true, value: 'option-1' }],
      ['Error', { error: true, required: true, value: '', helperText: 'Please select an option.' }],
      ['Skeleton', { skeleton: true, value: 'option-1' }],
    ];
    return (
      <table style={table}>
        <thead>
          <tr>
            {states.map(([title]) => (
              <th key={title} style={headCell}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {states.map(([title, props]) => (
              <td key={title} style={cell}>
                <Controlled label="Label" items={items} {...props} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    );
  },
};

/* ── Figma matrix: Show label × Show explainer × Required ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all property combinations)',
  parameters: { layout: 'fullscreen' },
  render: () => {
    const bools = [true, false];
    return (
      <div style={{ padding: 24 }}>
        <table style={table}>
          <thead>
            <tr>
              <th style={headCell} />
              {bools.flatMap((explainer) =>
                bools.map((required) => (
                  <th key={`${explainer}-${required}`} style={headCell}>
                    {`Show explainer=${explainer ? 'True' : 'False'} · Required=${required ? 'True' : 'False'}`}
                  </th>
                )),
              )}
            </tr>
          </thead>
          <tbody>
            {bools.map((showLabel) => (
              <tr key={String(showLabel)}>
                <th style={headCell}>{`Show label=${showLabel ? 'True' : 'False'}`}</th>
                {bools.flatMap((explainer) =>
                  bools.map((required) => (
                    <td key={`${explainer}-${required}`} style={cell}>
                      <Controlled
                        label="Label"
                        showLabel={showLabel}
                        tooltipContent={explainer ? 'Explainer text' : undefined}
                        required={required}
                        items={figmaItems}
                        value="option-1"
                      />
                    </td>
                  )),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
};

/* ── Content examples ── */

export const RealWorld: Story = {
  args: {
    label: 'Preferred contact method',
    tooltipContent: 'We only use this to send appointment reminders',
    required: true,
    items: realItems,
    value: 'email',
  },
};

export const LongValuesWrap: Story = {
  args: {
    items: [
      { label: 'Radio button label that wraps to multiple lines because it is too long', value: 'long-1' },
      { label: 'Short value', value: 'short' },
      { label: 'Another long radio value that needs to wrap beneath the first line', value: 'long-2' },
    ],
    value: 'long-1',
  },
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const ClickSelects: Story = {
  tags: ['test'],
  args: { items: realItems, value: 'email' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('SMS'));
    await expect(canvas.getByRole('radio', { name: 'SMS' })).toBeChecked();
    await expect(args.onChange).toHaveBeenCalledWith('sms');
  },
};

export const ArrowKeysMoveSelection: Story = {
  tags: ['test'],
  args: { items: realItems, value: 'phone' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    /* Roving tabindex: Tab lands on the selected radio */
    await userEvent.tab();
    await expect(canvas.getByRole('radio', { name: 'Phone call' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('radio', { name: 'SMS' })).toHaveFocus();
    await expect(canvas.getByRole('radio', { name: 'SMS' })).toBeChecked();
    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    await expect(canvas.getByRole('radio', { name: 'Email' })).toBeChecked();
    /* Wraps from first to last */
    await userEvent.keyboard('{ArrowUp}');
    await expect(canvas.getByRole('radio', { name: 'Mail' })).toBeChecked();
    await expect(args.onChange).toHaveBeenLastCalledWith('mail');
  },
};

export const ArrowKeysSkipDisabled: Story = {
  tags: ['test'],
  args: {
    items: [
      { label: 'First', value: 'a' },
      { label: 'Second', value: 'b', disabled: true },
      { label: 'Third', value: 'c' },
    ],
    value: 'a',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('radio', { name: 'Third' })).toHaveFocus();
    await expect(canvas.getByRole('radio', { name: 'Third' })).toBeChecked();
  },
};

export const DisabledGroupIgnoresInput: Story = {
  tags: ['test'],
  args: { items: realItems, value: 'email', disabled: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('radiogroup')).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(canvas.getByText('SMS'), { pointerEventsCheck: 0 });
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};
