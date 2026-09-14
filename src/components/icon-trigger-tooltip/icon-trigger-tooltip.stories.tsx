import type { Meta, StoryObj } from '@storybook/react';
import { IconTriggerTooltip } from './IconTriggerTooltip';

const meta: Meta<typeof IconTriggerTooltip> = {
  title: 'Components/IconTriggerTooltip',
  component: IconTriggerTooltip,
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    iconName: {
      control: 'select',
      options: ['help', 'info'],
    },
    content: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 120 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof IconTriggerTooltip>;

/* ---- Default (help icon) ---- */
export const Default: Story = {
  args: {
    content: 'Enter your legal first name as it appears on your ID.',
    position: 'bottom',
  },
};

/* ---- With Info Icon ---- */
export const WithInfoIcon: Story = {
  args: {
    content: 'Additional information about this field.',
    iconName: 'info',
    position: 'bottom',
  },
};

/* ---- All Positions ---- */
export const AllPositions: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, padding: 60 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, opacity: 0.5 }}>position=&quot;top&quot;</span>
        <IconTriggerTooltip content="Tooltip on top" position="top" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, opacity: 0.5 }}>position=&quot;bottom&quot;</span>
        <IconTriggerTooltip content="Tooltip on bottom" position="bottom" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, opacity: 0.5 }}>position=&quot;left&quot;</span>
        <IconTriggerTooltip content="Tooltip on left" position="left" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, opacity: 0.5 }}>position=&quot;right&quot;</span>
        <IconTriggerTooltip content="Tooltip on right" position="right" />
      </div>
    </div>
  ),
};

/* ---- Inline with label ---- */
export const InlineWithLabel: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ fontSize: 14 }}>First name</span>
      <IconTriggerTooltip content="Enter your legal first name" position="top" />
    </div>
  ),
};
