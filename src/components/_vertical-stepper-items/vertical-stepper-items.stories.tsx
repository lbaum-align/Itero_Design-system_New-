import type { Meta, StoryObj } from '@storybook/react';
import { VerticalStepperItems } from './VerticalStepperItems';

const meta: Meta<typeof VerticalStepperItems> = {
  title: 'Private/_VerticalStepperItems',
  component: VerticalStepperItems,
  argTypes: {
    state: {
      control: 'radio',
      options: ['not-started', 'in-progress', 'completed', 'error', 'skeleton'],
    },
    step: {
      control: { type: 'number', min: 1, max: 8 },
    },
    showLine: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    state: 'not-started',
    step: 1,
    label: 'Step name',
    showLine: true,
  },
};

export default meta;
type Story = StoryObj<typeof VerticalStepperItems>;

/** Default */
export const Default: Story = {};

/** Not started */
export const NotStarted: Story = {
  args: { state: 'not-started', step: 2 },
};

/** In progress */
export const InProgress: Story = {
  args: { state: 'in-progress', step: 1 },
};

/** Completed */
export const Completed: Story = {
  args: { state: 'completed', step: 1 },
};

/** Error */
export const Error: Story = {
  args: { state: 'error', step: 1 },
};

/** Skeleton */
export const Skeleton: Story = {
  args: { state: 'skeleton', step: 1 },
};

/** Without connecting line (first step) */
export const NoLine: Story = {
  args: { state: 'in-progress', step: 1, showLine: false },
};

/** All states matrix */
export const AllStates: Story = {
  render: () => (
    <div className="flex gap-8">
      {(['not-started', 'in-progress', 'completed', 'error', 'skeleton'] as const).map(
        (state) => (
          <div key={state} className="flex flex-col items-start">
            <span className="mb-2 text-xs text-[var(--scanner-text-secondary)]">{state}</span>
            <VerticalStepperItems state={state} step={2} label="Step name" />
          </div>
        ),
      )}
    </div>
  ),
};
