import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    status: {
      control: { type: 'select' },
      options: ['default', 'success', 'error'],
    },
    label: { control: 'text' },
    showLabel: { control: 'boolean' },
    helperText: { control: 'text' },
    showHelperText: { control: 'boolean' },
    errorText: { control: 'text' },
    retryLabel: { control: 'text' },
    indeterminate: { control: 'boolean' },
  },
  args: {
    value: 50,
    label: 'Label',
    showLabel: true,
    helperText: 'Optional helper text',
    showHelperText: true,
    errorText: 'Error text message',
    retryLabel: 'Try again',
    indeterminate: false,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

/* ------------------------------------------------------------------ */
/*  Default (with Controls)                                             */
/* ------------------------------------------------------------------ */

export const Default: Story = {};

/* ------------------------------------------------------------------ */
/*  Various percentages (matching Figma Progress variants)              */
/* ------------------------------------------------------------------ */

export const Progress0: Story = {
  name: '0%',
  args: { value: 0, label: 'Label', helperText: 'Optional helper text' },
};

export const Progress25: Story = {
  name: '25%',
  args: { value: 25, label: 'Label', helperText: 'Optional helper text' },
};

export const Progress50: Story = {
  name: '50%',
  args: { value: 50, label: 'Label', helperText: 'Optional helper text' },
};

export const Progress75: Story = {
  name: '75%',
  args: { value: 75, label: 'Label', helperText: 'Optional helper text' },
};

export const Progress100: Story = {
  name: '100% (Success)',
  args: { value: 100, label: 'Label', helperText: 'Optional helper text' },
};

/* ------------------------------------------------------------------ */
/*  With label                                                          */
/* ------------------------------------------------------------------ */

export const WithLabel: Story = {
  name: 'With Label',
  args: {
    value: 60,
    label: 'Uploading file...',
    showLabel: true,
    helperText: '60% complete',
    showHelperText: true,
  },
};

export const WithoutLabel: Story = {
  name: 'Without Label',
  args: {
    value: 45,
    showLabel: false,
    showHelperText: false,
  },
};

export const WithoutHelperText: Story = {
  name: 'Without Helper Text',
  args: {
    value: 30,
    label: 'Processing',
    showLabel: true,
    showHelperText: false,
  },
};

/* ------------------------------------------------------------------ */
/*  Success / Error states                                              */
/* ------------------------------------------------------------------ */

export const Success: Story = {
  name: 'Success',
  args: {
    value: 100,
    status: 'success',
    label: 'Upload complete',
    helperText: 'All files uploaded successfully',
  },
};

export const Error: Story = {
  name: 'Error',
  args: {
    value: 100,
    status: 'error',
    label: 'Upload failed',
    errorText: 'Error text message',
    retryLabel: 'Try again',
  },
};

export const ErrorWithCustomRetry: Story = {
  name: 'Error with Custom Retry Label',
  args: {
    value: 75,
    status: 'error',
    label: 'Processing failed',
    errorText: 'An unexpected error occurred. Please try again.',
    retryLabel: 'Retry',
  },
};

/* ------------------------------------------------------------------ */
/*  Indeterminate / Loading                                             */
/* ------------------------------------------------------------------ */

export const Indeterminate: Story = {
  name: 'Indeterminate',
  args: {
    indeterminate: true,
    label: 'Loading...',
    helperText: 'Please wait',
  },
};

export const IndeterminateWithoutLabel: Story = {
  name: 'Indeterminate (No Label)',
  args: {
    indeterminate: true,
    showLabel: false,
    showHelperText: false,
  },
};

/* ------------------------------------------------------------------ */
/*  All Figma Variants — side by side                                   */
/* ------------------------------------------------------------------ */

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h4 style={{ marginBottom: 8, fontSize: 12, opacity: 0.6 }}>
          Progress: 0%
        </h4>
        <ProgressBar value={0} label="Label" helperText="Optional helper text" />
      </div>

      <div>
        <h4 style={{ marginBottom: 8, fontSize: 12, opacity: 0.6 }}>
          Progress: 25%
        </h4>
        <ProgressBar
          value={25}
          label="Label"
          helperText="Optional helper text"
        />
      </div>

      <div>
        <h4 style={{ marginBottom: 8, fontSize: 12, opacity: 0.6 }}>
          Progress: 50%
        </h4>
        <ProgressBar
          value={50}
          label="Label"
          helperText="Optional helper text"
        />
      </div>

      <div>
        <h4 style={{ marginBottom: 8, fontSize: 12, opacity: 0.6 }}>
          Progress: 75%
        </h4>
        <ProgressBar
          value={75}
          label="Label"
          helperText="Optional helper text"
        />
      </div>

      <div>
        <h4 style={{ marginBottom: 8, fontSize: 12, opacity: 0.6 }}>
          Progress: 100% (Success)
        </h4>
        <ProgressBar
          value={100}
          label="Label"
          helperText="Optional helper text"
        />
      </div>

      <div>
        <h4 style={{ marginBottom: 8, fontSize: 12, opacity: 0.6 }}>
          Progress: Error
        </h4>
        <ProgressBar
          value={100}
          status="error"
          label="Label"
          errorText="Error text message"
        />
      </div>

      <div>
        <h4 style={{ marginBottom: 8, fontSize: 12, opacity: 0.6 }}>
          Indeterminate
        </h4>
        <ProgressBar
          indeterminate
          label="Loading..."
          helperText="Please wait"
        />
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Boolean toggles                                                     */
/* ------------------------------------------------------------------ */

export const LabelAndHelperCombinations: Story = {
  name: 'Label & Helper Combinations',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h4 style={{ marginBottom: 8, fontSize: 12, opacity: 0.6 }}>
          Show label + Show helper text
        </h4>
        <ProgressBar
          value={50}
          label="Label"
          showLabel
          helperText="Optional helper text"
          showHelperText
        />
      </div>

      <div>
        <h4 style={{ marginBottom: 8, fontSize: 12, opacity: 0.6 }}>
          Show label only
        </h4>
        <ProgressBar
          value={50}
          label="Label"
          showLabel
          showHelperText={false}
        />
      </div>

      <div>
        <h4 style={{ marginBottom: 8, fontSize: 12, opacity: 0.6 }}>
          Show helper text only
        </h4>
        <ProgressBar
          value={50}
          showLabel={false}
          helperText="Optional helper text"
          showHelperText
        />
      </div>

      <div>
        <h4 style={{ marginBottom: 8, fontSize: 12, opacity: 0.6 }}>
          Bar only (no label, no helper)
        </h4>
        <ProgressBar
          value={50}
          showLabel={false}
          showHelperText={false}
        />
      </div>
    </div>
  ),
};
