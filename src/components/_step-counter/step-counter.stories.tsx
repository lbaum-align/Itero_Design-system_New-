import type { Meta, StoryObj } from '@storybook/react';
import { StepCounter } from './StepCounter';

const meta: Meta<typeof StepCounter> = {
  title: 'Private/_StepCounter',
  component: StepCounter,
  argTypes: {
    state: {
      control: 'radio',
      options: ['not-started', 'in-progress'],
    },
    step: {
      control: { type: 'number', min: 1, max: 8 },
    },
  },
  args: {
    state: 'not-started',
    step: 1,
  },
};

export default meta;
type Story = StoryObj<typeof StepCounter>;

/** Default step counter */
export const Default: Story = {};

/** Not started state */
export const NotStarted: Story = {
  args: { state: 'not-started', step: 1 },
};

/** In progress state */
export const InProgress: Story = {
  args: { state: 'in-progress', step: 1 },
};

/** All steps — not started */
export const AllStepsNotStarted: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
        <StepCounter key={step} state="not-started" step={step} />
      ))}
    </div>
  ),
};

/** All steps — in progress */
export const AllStepsInProgress: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
        <StepCounter key={step} state="in-progress" step={step} />
      ))}
    </div>
  ),
};

/** All states matrix */
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <span className="w-24 text-sm text-[var(--scanner-text-secondary)]">Not started</span>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
          <StepCounter key={step} state="not-started" step={step} />
        ))}
      </div>
      <div className="flex gap-4 items-center">
        <span className="w-24 text-sm text-[var(--scanner-text-secondary)]">In progress</span>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
          <StepCounter key={step} state="in-progress" step={step} />
        ))}
      </div>
    </div>
  ),
};
