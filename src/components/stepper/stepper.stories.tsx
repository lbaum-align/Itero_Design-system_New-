import type { Meta, StoryObj } from '@storybook/react';
import { Stepper } from './Stepper';
import type { StepItem } from './stepper.types';

const defaultSteps: StepItem[] = [
  { label: 'Personal info' },
  { label: 'Address' },
  { label: 'Payment' },
  { label: 'Review' },
];

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
    currentStep: {
      control: { type: 'number', min: 0, max: 7 },
    },
    error: { control: 'boolean' },
    skeleton: { control: 'boolean' },
  },
  args: {
    steps: defaultSteps,
    currentStep: 0,
    orientation: 'horizontal',
    error: false,
    skeleton: false,
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

/** Default horizontal stepper */
export const Default: Story = {};

/** Horizontal stepper — default orientation */
export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    currentStep: 1,
  },
};

/** Vertical orientation */
export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    currentStep: 1,
  },
};

/** First step active */
export const FirstStepActive: Story = {
  args: {
    currentStep: 0,
  },
};

/** Middle step active */
export const MiddleStepActive: Story = {
  args: {
    currentStep: 2,
  },
};

/** Last step active */
export const LastStepActive: Story = {
  args: {
    currentStep: 3,
  },
};

/** All steps completed (currentStep beyond last index) */
export const AllCompleted: Story = {
  args: {
    currentStep: 4,
  },
};

/** Current step has error */
export const WithError: Story = {
  args: {
    currentStep: 2,
    error: true,
  },
};

/** Skeleton loading state */
export const SkeletonState: Story = {
  args: {
    skeleton: true,
  },
};

/** Vertical with error */
export const VerticalWithError: Story = {
  args: {
    orientation: 'vertical',
    currentStep: 1,
    error: true,
  },
};

/** Vertical — all completed */
export const VerticalAllCompleted: Story = {
  args: {
    orientation: 'vertical',
    currentStep: 4,
  },
};

/** Vertical skeleton */
export const VerticalSkeleton: Story = {
  args: {
    orientation: 'vertical',
    skeleton: true,
  },
};

/** Various step counts */
export const TwoSteps: Story = {
  args: {
    steps: [{ label: 'Start' }, { label: 'Finish' }],
    currentStep: 0,
  },
};

export const EightSteps: Story = {
  args: {
    steps: [
      { label: 'Step 1' },
      { label: 'Step 2' },
      { label: 'Step 3' },
      { label: 'Step 4' },
      { label: 'Step 5' },
      { label: 'Step 6' },
      { label: 'Step 7' },
      { label: 'Step 8' },
    ],
    currentStep: 3,
  },
};

/** All horizontal step states (progress through steps) */
export const AllHorizontalStates: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-2 text-sm text-[var(--scanner-text-secondary)]">Step 1 active</p>
        <Stepper steps={defaultSteps} currentStep={0} orientation="horizontal" />
      </div>
      <div>
        <p className="mb-2 text-sm text-[var(--scanner-text-secondary)]">Step 2 active</p>
        <Stepper steps={defaultSteps} currentStep={1} orientation="horizontal" />
      </div>
      <div>
        <p className="mb-2 text-sm text-[var(--scanner-text-secondary)]">Step 3 active</p>
        <Stepper steps={defaultSteps} currentStep={2} orientation="horizontal" />
      </div>
      <div>
        <p className="mb-2 text-sm text-[var(--scanner-text-secondary)]">All completed</p>
        <Stepper steps={defaultSteps} currentStep={4} orientation="horizontal" />
      </div>
      <div>
        <p className="mb-2 text-sm text-[var(--scanner-text-secondary)]">Error on step 2</p>
        <Stepper steps={defaultSteps} currentStep={1} orientation="horizontal" error />
      </div>
      <div>
        <p className="mb-2 text-sm text-[var(--scanner-text-secondary)]">Skeleton</p>
        <Stepper steps={defaultSteps} currentStep={0} orientation="horizontal" skeleton />
      </div>
    </div>
  ),
};

/** All vertical step states */
export const AllVerticalStates: Story = {
  render: () => (
    <div className="flex gap-12">
      <div>
        <p className="mb-2 text-sm text-[var(--scanner-text-secondary)]">Step 1 active</p>
        <Stepper steps={defaultSteps} currentStep={0} orientation="vertical" />
      </div>
      <div>
        <p className="mb-2 text-sm text-[var(--scanner-text-secondary)]">Step 2 active</p>
        <Stepper steps={defaultSteps} currentStep={1} orientation="vertical" />
      </div>
      <div>
        <p className="mb-2 text-sm text-[var(--scanner-text-secondary)]">All completed</p>
        <Stepper steps={defaultSteps} currentStep={4} orientation="vertical" />
      </div>
      <div>
        <p className="mb-2 text-sm text-[var(--scanner-text-secondary)]">Error</p>
        <Stepper steps={defaultSteps} currentStep={1} orientation="vertical" error />
      </div>
      <div>
        <p className="mb-2 text-sm text-[var(--scanner-text-secondary)]">Skeleton</p>
        <Stepper steps={defaultSteps} currentStep={0} orientation="vertical" skeleton />
      </div>
    </div>
  ),
};
