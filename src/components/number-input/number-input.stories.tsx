import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { NumberInput } from './NumberInput';

const meta: Meta<typeof NumberInput> = {
  title: 'Components/NumberInput',
  component: NumberInput,
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'x-large'],
    },
    layer: { control: 'select', options: [1, 2] },
    value: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    label: { control: 'text' },
    helperText: { control: 'text' },
    errorText: { control: 'text' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    showControls: { control: 'boolean' },
    showExplainer: { control: 'boolean' },
    explainerText: { control: 'text' },
  },
  args: {
    onChange: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 288, fontFamily: 'var(--scanner-font-sans)' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof NumberInput>;

/* ------------------------------------------------------------------ */
/*  Default                                                           */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  args: {
    label: 'Label',
    helperText: 'Optional helper text',
    defaultValue: 1000,
    size: 'large',
  },
};

/* ------------------------------------------------------------------ */
/*  With Label and Helper Text                                        */
/* ------------------------------------------------------------------ */

export const WithLabelAndHelper: Story = {
  args: {
    label: 'Quantity',
    helperText: 'Enter a number between 1 and 100',
    defaultValue: 50,
    min: 1,
    max: 100,
    size: 'large',
  },
};

/* ------------------------------------------------------------------ */
/*  With Min / Max Bounds                                             */
/* ------------------------------------------------------------------ */

export const WithMinMaxBounds: Story = {
  args: {
    label: 'Amount',
    helperText: 'Range: 0 - 10',
    defaultValue: 5,
    min: 0,
    max: 10,
    step: 1,
    size: 'large',
  },
};

/* ------------------------------------------------------------------ */
/*  Error State                                                       */
/* ------------------------------------------------------------------ */

export const ErrorState: Story = {
  args: {
    label: 'Label',
    defaultValue: 1000,
    error: true,
    errorText: 'Error text message',
    size: 'large',
  },
};

/* ------------------------------------------------------------------ */
/*  Disabled State                                                    */
/* ------------------------------------------------------------------ */

export const DisabledState: Story = {
  args: {
    label: 'Label',
    helperText: 'Optional helper text',
    defaultValue: 1000,
    disabled: true,
    size: 'large',
  },
};

/* ------------------------------------------------------------------ */
/*  Skeleton State                                                    */
/* ------------------------------------------------------------------ */

export const SkeletonState: Story = {
  args: {
    label: 'Label',
    skeleton: true,
    size: 'large',
  },
};

/* ------------------------------------------------------------------ */
/*  With Explainer Tooltip                                            */
/* ------------------------------------------------------------------ */

export const WithExplainer: Story = {
  args: {
    label: 'Quantity',
    helperText: 'How many items to add',
    defaultValue: 1,
    showExplainer: true,
    explainerText: 'Enter the total number of items you wish to order.',
    size: 'large',
  },
};

/* ------------------------------------------------------------------ */
/*  Without Controls                                                  */
/* ------------------------------------------------------------------ */

export const WithoutControls: Story = {
  args: {
    label: 'Amount',
    helperText: 'Type a number directly',
    defaultValue: 42,
    showControls: false,
    size: 'large',
  },
};

/* ------------------------------------------------------------------ */
/*  All Sizes                                                         */
/* ------------------------------------------------------------------ */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {(['small', 'medium', 'large', 'x-large'] as const).map((size) => (
        <div key={size}>
          <p
            style={{
              fontFamily: 'var(--scanner-font-sans)',
              fontSize: 12,
              color: 'var(--scanner-text-secondary)',
              marginBottom: 8,
            }}
          >
            {size}
          </p>
          <NumberInput
            label="Label"
            helperText="Optional helper text"
            defaultValue={1000}
            size={size}
          />
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  All States                                                        */
/* ------------------------------------------------------------------ */

const stateLabel = {
  fontFamily: 'var(--scanner-font-sans)',
  fontSize: 12,
  color: 'var(--scanner-text-secondary)',
  minWidth: 80,
  flexShrink: 0,
} as const;

export const AllStates: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr 1fr',
        gap: '24px 16px',
        alignItems: 'start',
      }}
    >
      {/* Header row */}
      <div />
      <span style={stateLabel}>Set 01</span>
      <span style={stateLabel}>Set 02</span>

      {/* Enabled */}
      <span style={stateLabel}>Enabled</span>
      <NumberInput label="Label" helperText="Optional helper text" defaultValue={1000} layer={1} />
      <NumberInput label="Label" helperText="Optional helper text" defaultValue={1000} layer={2} />

      {/* Focused (data-state hint for screenshots) */}
      <span style={stateLabel}>Focused</span>
      <div data-state="focused">
        <NumberInput label="Label" helperText="Optional helper text" defaultValue={1000} layer={1} />
      </div>
      <div data-state="focused">
        <NumberInput label="Label" helperText="Optional helper text" defaultValue={1000} layer={2} />
      </div>

      {/* Disabled */}
      <span style={stateLabel}>Disabled</span>
      <NumberInput label="Label" helperText="Optional helper text" defaultValue={1000} disabled layer={1} />
      <NumberInput label="Label" helperText="Optional helper text" defaultValue={1000} disabled layer={2} />

      {/* Error */}
      <span style={stateLabel}>Error</span>
      <NumberInput label="Label" defaultValue={1000} error errorText="Error text message" layer={1} />
      <NumberInput label="Label" defaultValue={1000} error errorText="Error text message" layer={2} />

      {/* Skeleton */}
      <span style={stateLabel}>Skeleton</span>
      <NumberInput label="Label" skeleton layer={1} />
      <NumberInput label="Label" skeleton layer={2} />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Layer Set 02                                                      */
/* ------------------------------------------------------------------ */

export const LayerSet02: Story = {
  args: {
    label: 'Label',
    helperText: 'Optional helper text',
    defaultValue: 1000,
    layer: 2,
    size: 'large',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          maxWidth: 288,
          padding: 24,
          backgroundColor: 'var(--scanner-bg-secondary)',
          borderRadius: 8,
        }}
      >
        <Story />
      </div>
    ),
  ],
};
