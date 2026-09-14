import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { RadioButtonItem } from './RadioButtonItem';

const meta: Meta<typeof RadioButtonItem> = {
  title: 'Components/RadioButtonItem',
  component: RadioButtonItem,
  argTypes: {
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    showLabel: { control: 'boolean' },
  },
  args: {
    onChange: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof RadioButtonItem>;

export const Default: Story = {
  args: { label: 'Radio button value', selected: false },
};

export const Selected: Story = {
  args: { label: 'Radio button value', selected: true },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, auto)', gap: '16px 32px' }}>
      <RadioButtonItem label="Unselected" selected={false} name="demo1" value="a" />
      <RadioButtonItem label="Selected" selected={true} name="demo2" value="b" />

      <RadioButtonItem label="Unselected disabled" selected={false} disabled name="demo3" value="c" />
      <RadioButtonItem label="Selected disabled" selected={true} disabled name="demo4" value="d" />

      <RadioButtonItem label="Skeleton" skeleton />
      <RadioButtonItem label="Skeleton selected" skeleton />
    </div>
  ),
};
