import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RadioButtonsVerticalGroup } from './RadioButtonsVerticalGroup';
import type { RadioOption } from './radio-buttons-vertical-group.types';

const sampleItems: RadioOption[] = [
  { label: 'Radio button value', value: 'option-1' },
  { label: 'Radio button value', value: 'option-2' },
  { label: 'Radio button value', value: 'option-3' },
  { label: 'Radio button value', value: 'option-4' },
  { label: 'Radio button value', value: 'option-5' },
];

const realItems: RadioOption[] = [
  { label: 'Email', value: 'email' },
  { label: 'Phone call', value: 'phone' },
  { label: 'SMS', value: 'sms' },
  { label: 'Mail', value: 'mail' },
];

const meta: Meta<typeof RadioButtonsVerticalGroup> = {
  title: 'Components/RadioButtonsVerticalGroup',
  component: RadioButtonsVerticalGroup,
  argTypes: {
    label: { control: 'text' },
    showLabel: { control: 'boolean' },
    tooltipContent: { control: 'text' },
    required: { control: 'boolean' },
    helperText: { control: 'text' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    value: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof RadioButtonsVerticalGroup>;

/* ------------------------------------------------------------------ */
/* Default — with Controls for every prop                               */
/* ------------------------------------------------------------------ */
export const Default: Story = {
  args: {
    label: 'Label',
    showLabel: true,
    name: 'default-group',
    items: sampleItems,
  },
  render: function Render(args) {
    const [selected, setSelected] = useState(args.value ?? '');
    return (
      <RadioButtonsVerticalGroup
        {...args}
        value={selected}
        onChange={setSelected}
      />
    );
  },
};

/* ------------------------------------------------------------------ */
/* With label and helper text                                            */
/* ------------------------------------------------------------------ */
export const WithLabelAndHelperText: Story = {
  render: function Render() {
    const [selected, setSelected] = useState('email');
    return (
      <RadioButtonsVerticalGroup
        label="Preferred contact method"
        name="contact-method"
        helperText="Select how you would like us to reach you."
        value={selected}
        onChange={setSelected}
        items={realItems}
      />
    );
  },
};

/* ------------------------------------------------------------------ */
/* With preselected value                                                */
/* ------------------------------------------------------------------ */
export const WithPreselectedValue: Story = {
  render: function Render() {
    const [selected, setSelected] = useState('option-1');
    return (
      <RadioButtonsVerticalGroup
        label="Label"
        name="preselected-group"
        value={selected}
        onChange={setSelected}
        items={sampleItems}
      />
    );
  },
};

/* ------------------------------------------------------------------ */
/* Error state                                                           */
/* ------------------------------------------------------------------ */
export const ErrorState: Story = {
  render: function Render() {
    const [selected, setSelected] = useState('');
    return (
      <RadioButtonsVerticalGroup
        label="Label"
        name="error-group"
        error
        required
        helperText="Please select an option."
        value={selected}
        onChange={setSelected}
        items={sampleItems}
      />
    );
  },
};

/* ------------------------------------------------------------------ */
/* Disabled group                                                        */
/* ------------------------------------------------------------------ */
export const DisabledGroup: Story = {
  render: function Render() {
    return (
      <RadioButtonsVerticalGroup
        label="Label"
        name="disabled-group"
        disabled
        value="option-2"
        items={sampleItems}
      />
    );
  },
};

/* ------------------------------------------------------------------ */
/* All states side by side                                               */
/* ------------------------------------------------------------------ */
export const AllStates: Story = {
  render: function Render() {
    const [v1, setV1] = useState('');
    const [v2, setV2] = useState('option-1');
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
        {/* Default */}
        <div>
          <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12, color: '#888' }}>Default</p>
          <RadioButtonsVerticalGroup
            label="Label"
            name="all-default"
            value={v1}
            onChange={setV1}
            items={sampleItems.slice(0, 3)}
          />
        </div>

        {/* Preselected */}
        <div>
          <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12, color: '#888' }}>Preselected</p>
          <RadioButtonsVerticalGroup
            label="Label"
            name="all-preselected"
            value={v2}
            onChange={setV2}
            items={sampleItems.slice(0, 3)}
          />
        </div>

        {/* Required + Explainer */}
        <div>
          <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12, color: '#888' }}>Required + Explainer</p>
          <RadioButtonsVerticalGroup
            label="Label"
            name="all-required"
            required
            tooltipContent="Additional information"
            value="option-1"
            items={sampleItems.slice(0, 3)}
          />
        </div>

        {/* Error */}
        <div>
          <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12, color: '#888' }}>Error</p>
          <RadioButtonsVerticalGroup
            label="Label"
            name="all-error"
            error
            required
            helperText="Please select an option."
            items={sampleItems.slice(0, 3)}
          />
        </div>

        {/* Disabled */}
        <div>
          <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12, color: '#888' }}>Disabled</p>
          <RadioButtonsVerticalGroup
            label="Label"
            name="all-disabled"
            disabled
            value="option-2"
            items={sampleItems.slice(0, 3)}
          />
        </div>

        {/* No label */}
        <div>
          <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12, color: '#888' }}>No label</p>
          <RadioButtonsVerticalGroup
            label="Label"
            showLabel={false}
            name="all-no-label"
            value="option-1"
            items={sampleItems.slice(0, 3)}
          />
        </div>

        {/* With helper text */}
        <div>
          <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12, color: '#888' }}>Helper text</p>
          <RadioButtonsVerticalGroup
            label="Label"
            name="all-helper"
            helperText="Choose one option."
            value="option-1"
            items={sampleItems.slice(0, 3)}
          />
        </div>

        {/* Skeleton */}
        <div>
          <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12, color: '#888' }}>Skeleton</p>
          <RadioButtonsVerticalGroup
            label="Label"
            name="all-skeleton"
            skeleton
            items={sampleItems.slice(0, 3)}
          />
        </div>
      </div>
    );
  },
};
