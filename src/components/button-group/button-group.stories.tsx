import type { Meta, StoryObj } from '@storybook/react';
import { ButtonGroup } from './ButtonGroup';
import { Button } from '../button';

const meta: Meta<typeof ButtonGroup> = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    size: { control: 'select', options: ['large', 'medium', 'small'] },
  },
};
export default meta;

type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
  args: {
    children: undefined, // Overridden by render
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button emphasis="secondary">Cancel</Button>
      <Button>Save</Button>
    </ButtonGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ButtonGroup orientation="horizontal">
      <Button emphasis="secondary">Cancel</Button>
      <Button emphasis="secondary">Reset</Button>
      <Button>Save</Button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button emphasis="secondary">Cancel</Button>
      <Button emphasis="secondary">Reset</Button>
      <Button>Save</Button>
    </ButtonGroup>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <p style={{ marginBottom: 8, fontWeight: 600 }}>Large</p>
        <ButtonGroup size="large">
          <Button size="large" emphasis="secondary">Cancel</Button>
          <Button size="large">Save</Button>
        </ButtonGroup>
      </div>
      <div>
        <p style={{ marginBottom: 8, fontWeight: 600 }}>Medium</p>
        <ButtonGroup size="medium">
          <Button size="medium" emphasis="secondary">Cancel</Button>
          <Button size="medium">Save</Button>
        </ButtonGroup>
      </div>
      <div>
        <p style={{ marginBottom: 8, fontWeight: 600 }}>Small</p>
        <ButtonGroup size="small">
          <Button size="small" emphasis="secondary">Cancel</Button>
          <Button size="small">Save</Button>
        </ButtonGroup>
      </div>
    </div>
  ),
};

export const AllOrientations: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 48 }}>
      <div>
        <p style={{ marginBottom: 8, fontWeight: 600 }}>Horizontal</p>
        <ButtonGroup orientation="horizontal">
          <Button emphasis="secondary">Cancel</Button>
          <Button>Save</Button>
        </ButtonGroup>
      </div>
      <div>
        <p style={{ marginBottom: 8, fontWeight: 600 }}>Vertical</p>
        <ButtonGroup orientation="vertical">
          <Button emphasis="secondary">Cancel</Button>
          <Button>Save</Button>
        </ButtonGroup>
      </div>
    </div>
  ),
};

export const MixedVariants: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="danger" emphasis="ghost">Delete</Button>
      <Button emphasis="secondary">Cancel</Button>
      <Button>Confirm</Button>
    </ButtonGroup>
  ),
};
