import type { Meta, StoryObj } from '@storybook/react';
import { HorizontalCheckboxGroup } from './HorizontalCheckboxGroup';
import { CheckboxItem } from '../checkbox-item';

const meta: Meta<typeof HorizontalCheckboxGroup> = {
  title: 'Components/HorizontalCheckboxGroup',
  component: HorizontalCheckboxGroup,
  argTypes: {
    label: { control: 'text' },
    showLabel: { control: 'boolean' },
    required: { control: 'boolean' },
    tooltipContent: { control: 'text' },
    helperText: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Label',
    showLabel: true,
    required: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof HorizontalCheckboxGroup>;

/* ------------------------------------------------------------------ */
/* Default                                                             */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  args: {
    label: 'Label',
  },
  render: (args) => (
    <HorizontalCheckboxGroup {...args}>
      <CheckboxItem label="Option A" />
      <CheckboxItem label="Option B" />
      <CheckboxItem label="Option C" />
    </HorizontalCheckboxGroup>
  ),
};

/* ------------------------------------------------------------------ */
/* With label and helper text                                          */
/* ------------------------------------------------------------------ */

export const WithHelperText: Story = {
  args: {
    label: 'Select preferences',
    helperText: 'Choose one or more options from the list.',
  },
  render: (args) => (
    <HorizontalCheckboxGroup {...args}>
      <CheckboxItem label="Email" checked="selected" />
      <CheckboxItem label="SMS" />
      <CheckboxItem label="Push notifications" />
    </HorizontalCheckboxGroup>
  ),
};

/* ------------------------------------------------------------------ */
/* With tooltip                                                        */
/* ------------------------------------------------------------------ */

export const WithTooltip: Story = {
  args: {
    label: 'Notification channels',
    tooltipContent: 'Select how you would like to receive notifications.',
  },
  render: (args) => (
    <HorizontalCheckboxGroup {...args}>
      <CheckboxItem label="Email" />
      <CheckboxItem label="SMS" />
      <CheckboxItem label="In-app" />
    </HorizontalCheckboxGroup>
  ),
};

/* ------------------------------------------------------------------ */
/* Error state                                                         */
/* ------------------------------------------------------------------ */

export const ErrorState: Story = {
  args: {
    label: 'Required selection',
    required: true,
    error: 'Please select at least one option.',
  },
  render: (args) => (
    <HorizontalCheckboxGroup {...args}>
      <CheckboxItem label="Option A" />
      <CheckboxItem label="Option B" />
      <CheckboxItem label="Option C" />
    </HorizontalCheckboxGroup>
  ),
};

/* ------------------------------------------------------------------ */
/* Disabled                                                            */
/* ------------------------------------------------------------------ */

export const Disabled: Story = {
  args: {
    label: 'Unavailable options',
    disabled: true,
  },
  render: (args) => (
    <HorizontalCheckboxGroup {...args}>
      <CheckboxItem label="Option A" checked="selected" disabled />
      <CheckboxItem label="Option B" disabled />
      <CheckboxItem label="Option C" disabled />
    </HorizontalCheckboxGroup>
  ),
};

/* ------------------------------------------------------------------ */
/* All states side by side                                             */
/* ------------------------------------------------------------------ */

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      {/* Default */}
      <HorizontalCheckboxGroup label="Default">
        <CheckboxItem label="Option A" />
        <CheckboxItem label="Option B" checked="selected" />
        <CheckboxItem label="Option C" />
      </HorizontalCheckboxGroup>

      {/* With helper text */}
      <HorizontalCheckboxGroup
        label="With helper text"
        helperText="This is helper text for context."
      >
        <CheckboxItem label="Alpha" />
        <CheckboxItem label="Beta" />
      </HorizontalCheckboxGroup>

      {/* With tooltip */}
      <HorizontalCheckboxGroup
        label="With tooltip"
        tooltipContent="Helpful information about this group."
      >
        <CheckboxItem label="One" />
        <CheckboxItem label="Two" />
      </HorizontalCheckboxGroup>

      {/* Required */}
      <HorizontalCheckboxGroup label="Required" required>
        <CheckboxItem label="Accept" />
        <CheckboxItem label="Decline" />
      </HorizontalCheckboxGroup>

      {/* Error */}
      <HorizontalCheckboxGroup
        label="Error state"
        required
        error="At least one option is required."
      >
        <CheckboxItem label="Item 1" />
        <CheckboxItem label="Item 2" />
        <CheckboxItem label="Item 3" />
      </HorizontalCheckboxGroup>

      {/* Disabled */}
      <HorizontalCheckboxGroup label="Disabled" disabled>
        <CheckboxItem label="Locked A" checked="selected" disabled />
        <CheckboxItem label="Locked B" disabled />
      </HorizontalCheckboxGroup>

      {/* No label */}
      <HorizontalCheckboxGroup showLabel={false}>
        <CheckboxItem label="Hidden label A" />
        <CheckboxItem label="Hidden label B" />
      </HorizontalCheckboxGroup>

      {/* Many items */}
      <HorizontalCheckboxGroup label="Many items">
        <CheckboxItem label="1" />
        <CheckboxItem label="2" />
        <CheckboxItem label="3" />
        <CheckboxItem label="4" />
        <CheckboxItem label="5" />
        <CheckboxItem label="6" />
      </HorizontalCheckboxGroup>
    </div>
  ),
};
