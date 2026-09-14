import type { Meta, StoryObj } from '@storybook/react';
import { TextTriggerTooltip } from './TextTriggerTooltip';

const meta: Meta<typeof TextTriggerTooltip> = {
  title: 'Components/TextTriggerTooltip',
  component: TextTriggerTooltip,
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom'],
    },
    content: { control: 'text' },
    children: { control: 'text' },
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

type Story = StoryObj<typeof TextTriggerTooltip>;

/* ---- Default ---- */
export const Default: Story = {
  args: {
    children: 'Definition tooltip',
    content: 'A tooltip is a brief, informative message that appears when a user hovers over an element.',
    position: 'bottom',
  },
};

/* ---- All Positions ---- */
export const AllPositions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 80, alignItems: 'center', padding: 60 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, opacity: 0.5 }}>position=&quot;top&quot;</span>
        <TextTriggerTooltip content="Tooltip above the text" position="top">
          Definition tooltip
        </TextTriggerTooltip>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, opacity: 0.5 }}>position=&quot;bottom&quot;</span>
        <TextTriggerTooltip content="Tooltip below the text" position="bottom">
          Definition tooltip
        </TextTriggerTooltip>
      </div>
    </div>
  ),
};

/* ---- Inline in paragraph ---- */
export const InlineInParagraph: Story = {
  render: () => (
    <p style={{ fontSize: 14, lineHeight: '24px', maxWidth: 400 }}>
      The patient&apos;s{' '}
      <TextTriggerTooltip
        content="A unique identifier assigned to each patient in the system."
        position="top"
      >
        Patient ID
      </TextTriggerTooltip>{' '}
      is required for all clinical records. Please also verify the{' '}
      <TextTriggerTooltip
        content="The International Classification of Diseases code for the diagnosis."
        position="bottom"
      >
        ICD code
      </TextTriggerTooltip>{' '}
      before submitting.
    </p>
  ),
};
