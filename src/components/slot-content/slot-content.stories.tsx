import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { SlotContent } from './SlotContent';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Slot content (node 8146:4227, page "Logos").
 * One component, no variant properties or states.
 */

const meta: Meta<typeof SlotContent> = {
  title: 'Components/SlotContent',
  component: SlotContent,
  parameters: {
    docs: {
      description: {
        component:
          'Design-time placeholder for swappable content (Figma "Swap me to any component"). ' +
          'Used inside Popover, Modal window and Data table slots in Figma. Not interactive.',
      },
    },
  },
  argTypes: {
    children: { control: 'text', name: 'Text' },
  },
  args: { children: 'Swap me to any component' },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SlotContent>;

export const Default: Story = {};

/** No variants or states in Figma — the single component, as in the component set. */
export const AllStates: Story = {
  name: 'All states (single state)',
  render: () => <SlotContent style={{ width: 'max-content' }} />,
};

export const FigmaMatrix: Story = {
  name: 'Figma matrix (1 component)',
  render: () => <SlotContent style={{ width: 'max-content' }} />,
};

export const CustomLabel: Story = { args: { children: 'Filters form goes here' } };

export const LongTextWraps: Story = {
  render: () => (
    <div style={{ width: 240 }}>
      <SlotContent>
        Swap me to any component — long placeholder copy wraps inside the slot
      </SlotContent>
    </div>
  ),
};

export const RendersPlaceholderText: Story = {
  tags: ['test'],
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Swap me to any component')).toBeInTheDocument();
  },
};
