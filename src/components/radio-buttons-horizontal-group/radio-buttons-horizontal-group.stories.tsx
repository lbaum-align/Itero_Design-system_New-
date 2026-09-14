import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { RadioButtonsHorizontalGroup } from './RadioButtonsHorizontalGroup';
import type { RadioButtonOption } from './radio-buttons-horizontal-group.types';

/* ------------------------------------------------------------------ */
/*  Sample option sets                                                 */
/* ------------------------------------------------------------------ */

const defaultOptions: RadioButtonOption[] = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
];

const fiveOptions: RadioButtonOption[] = [
  { label: 'Radio button value', value: '1' },
  { label: 'Radio button value', value: '2' },
  { label: 'Radio button value', value: '3' },
  { label: 'Radio button value', value: '4' },
  { label: 'Radio button value', value: '5' },
];

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof RadioButtonsHorizontalGroup> = {
  title: 'Components/RadioButtonsHorizontalGroup',
  component: RadioButtonsHorizontalGroup,
  argTypes: {
    showLabel: { control: 'boolean' },
    required: { control: 'boolean' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    label: { control: 'text' },
    tooltipContent: { control: 'text' },
    helperText: { control: 'text' },
    value: { control: 'text' },
    name: { control: 'text' },
  },
  args: {
    onChange: fn(),
    name: 'demo-group',
    options: defaultOptions,
  },
};
export default meta;

type Story = StoryObj<typeof RadioButtonsHorizontalGroup>;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

/** Default — interactive with Controls panel */
export const Default: Story = {
  args: {
    label: 'Label',
    options: defaultOptions,
  },
};

/** With label and helper text */
export const WithLabelAndHelperText: Story = {
  args: {
    label: 'Choose your plan',
    helperText: 'Select the plan that best fits your needs.',
    options: defaultOptions,
  },
};

/** With tooltip explainer */
export const WithTooltip: Story = {
  args: {
    label: 'Preferred contact method',
    tooltipContent: 'Select how you would like us to reach you.',
    options: [
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'phone' },
      { label: 'SMS', value: 'sms' },
    ],
  },
};

/** Preselected value */
export const WithPreselectedValue: Story = {
  args: {
    label: 'Choose an option',
    value: 'b',
    options: defaultOptions,
  },
};

/** Required field */
export const Required: Story = {
  args: {
    label: 'Select your role',
    required: true,
    options: [
      { label: 'Developer', value: 'dev' },
      { label: 'Designer', value: 'design' },
      { label: 'Manager', value: 'manager' },
    ],
  },
};

/** Error state with helper text */
export const ErrorState: Story = {
  args: {
    label: 'Select an option',
    required: true,
    error: true,
    helperText: 'Please select one of the options above.',
    options: defaultOptions,
  },
};

/** All items disabled */
export const Disabled: Story = {
  args: {
    label: 'Disabled group',
    disabled: true,
    value: 'b',
    options: defaultOptions,
  },
};

/** Individual item disabled */
export const PartiallyDisabled: Story = {
  args: {
    label: 'Some options unavailable',
    options: [
      { label: 'Available', value: 'a' },
      { label: 'Unavailable', value: 'b', disabled: true },
      { label: 'Available', value: 'c' },
    ],
  },
};

/** Skeleton loading state */
export const Skeleton: Story = {
  args: {
    label: 'Loading...',
    skeleton: true,
    options: defaultOptions,
  },
};

/** Hidden label (label used for aria-label only) */
export const HiddenLabel: Story = {
  args: {
    label: 'Choose plan',
    showLabel: false,
    options: defaultOptions,
  },
};

/** Five items — matching the Figma reference layout */
export const FiveItems: Story = {
  args: {
    label: 'Label',
    options: fiveOptions,
    value: '1',
  },
};

/** Interactive controlled example */
export const Interactive: Story = {
  render: function InteractiveStory() {
    const [selected, setSelected] = useState('');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <RadioButtonsHorizontalGroup
          label="Interactive demo"
          name="interactive"
          value={selected}
          options={defaultOptions}
          onChange={setSelected}
        />
        <p
          style={{
            fontFamily: 'var(--scanner-font-sans)',
            fontSize: 'var(--scanner-text-sm)',
            color: 'var(--scanner-text-secondary)',
          }}
        >
          Selected: {selected || '(none)'}
        </p>
      </div>
    );
  },
};

/** All states side by side */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Default */}
      <RadioButtonsHorizontalGroup
        label="Default"
        name="state-default"
        options={defaultOptions}
        onChange={fn()}
      />

      {/* With selected value */}
      <RadioButtonsHorizontalGroup
        label="Preselected"
        name="state-selected"
        value="b"
        options={defaultOptions}
        onChange={fn()}
      />

      {/* Required */}
      <RadioButtonsHorizontalGroup
        label="Required"
        name="state-required"
        required
        options={defaultOptions}
        onChange={fn()}
      />

      {/* With tooltip */}
      <RadioButtonsHorizontalGroup
        label="With tooltip"
        name="state-tooltip"
        tooltipContent="Additional information"
        options={defaultOptions}
        onChange={fn()}
      />

      {/* With helper text */}
      <RadioButtonsHorizontalGroup
        label="With helper text"
        name="state-helper"
        helperText="Choose the option that applies to you."
        options={defaultOptions}
        onChange={fn()}
      />

      {/* Error */}
      <RadioButtonsHorizontalGroup
        label="Error state"
        name="state-error"
        required
        error
        helperText="This field is required."
        options={defaultOptions}
        onChange={fn()}
      />

      {/* Disabled */}
      <RadioButtonsHorizontalGroup
        label="Disabled"
        name="state-disabled"
        disabled
        value="a"
        options={defaultOptions}
        onChange={fn()}
      />

      {/* Skeleton */}
      <RadioButtonsHorizontalGroup
        label="Skeleton"
        name="state-skeleton"
        skeleton
        options={defaultOptions}
        onChange={fn()}
      />

      {/* Hidden label */}
      <RadioButtonsHorizontalGroup
        label="Hidden label"
        name="state-hidden"
        showLabel={false}
        options={defaultOptions}
        onChange={fn()}
      />
    </div>
  ),
};
