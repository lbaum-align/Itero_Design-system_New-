import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { CheckboxItem } from './CheckboxItem';

const meta: Meta<typeof CheckboxItem> = {
  title: 'Components/CheckboxItem',
  component: CheckboxItem,
  argTypes: {
    checked: {
      control: 'select',
      options: ['unselected', 'selected', 'indeterminate'],
    },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    showLabel: { control: 'boolean' },
  },
  args: {
    onChange: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof CheckboxItem>;

export const Default: Story = {
  args: { label: 'Checkbox value', checked: 'unselected' },
};

export const Selected: Story = {
  args: { label: 'Checkbox value', checked: 'selected' },
};

export const Indeterminate: Story = {
  args: { label: 'Checkbox value', checked: 'indeterminate' },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: '0 32px' }}>
      <CheckboxItem label="Unselected" checked="unselected" />
      <CheckboxItem label="Selected" checked="selected" />
      <CheckboxItem label="Indeterminate" checked="indeterminate" />

      <CheckboxItem label="Unselected disabled" checked="unselected" disabled />
      <CheckboxItem label="Selected disabled" checked="selected" disabled />
      <CheckboxItem label="Indeterminate disabled" checked="indeterminate" disabled />

      <CheckboxItem label="Skeleton" skeleton />
      <CheckboxItem label="Skeleton" skeleton />
      <CheckboxItem label="Skeleton" skeleton />
    </div>
  ),
};

export const WithBooleanChecked: Story = {
  args: { label: 'Boolean true', checked: true },
};
