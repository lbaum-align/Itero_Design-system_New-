import type { Meta, StoryObj } from '@storybook/react';
import { HorizontalStepperItems } from './HorizontalStepperItems';

const meta: Meta<typeof HorizontalStepperItems> = {
  title: 'Private/_HorizontalStepperItems',
  component: HorizontalStepperItems,
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
type Story = StoryObj<typeof HorizontalStepperItems>;

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
    <div className="flex flex-col gap-4">
      {(['not-started', 'in-progress', 'completed', 'error', 'skeleton'] as const).map(
        (state) => (
          <div key={state} className="flex items-center gap-2">
            <span className="w-24 text-xs text-[var(--scanner-text-secondary)]">{state}</span>
            <HorizontalStepperItems state={state} step={2} label="Step name" />
          </div>
        ),
      )}
    </div>
  ),
};
