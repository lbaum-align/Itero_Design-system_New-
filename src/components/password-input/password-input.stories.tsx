import type { Meta, StoryObj } from '@storybook/react';
import { PasswordInput } from './PasswordInput';

const meta: Meta<typeof PasswordInput> = {
  title: 'Components/PasswordInput',
  component: PasswordInput,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 288 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label: { control: 'text' },
    showLabel: { control: 'boolean' },
    helperText: { control: 'text' },
    showHelper: { control: 'boolean' },
    errorText: { control: 'text' },
    error: { control: 'boolean' },
    required: { control: 'boolean' },
    showLink: { control: 'boolean' },
    linkText: { control: 'text' },
    linkHref: { control: 'text' },
    showExplainer: { control: 'boolean' },
    explainerContent: { control: 'text' },
    layer: { control: 'radio', options: [1, 2] },
    skeleton: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PasswordInput>;

/* ------------------------------------------------------------------ */
/*  1. Default — Controls playground                                    */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  args: {
    label: 'Password',
    placeholder: 'Password',
    showLabel: true,
    showHelper: true,
    helperText: 'Optional helper text',
    showLink: true,
    linkText: 'Forgot password?',
    required: false,
    error: false,
    disabled: false,
    skeleton: false,
    layer: 1,
  },
};

/* ------------------------------------------------------------------ */
/*  2. With label and helper text                                       */
/* ------------------------------------------------------------------ */

export const WithLabelAndHelper: Story = {
  name: 'With Label & Helper',
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    helperText: 'Must be at least 8 characters',
    showLabel: true,
    showHelper: true,
    showLink: false,
  },
};

/* ------------------------------------------------------------------ */
/*  3. Show/hide password toggle                                        */
/* ------------------------------------------------------------------ */

export const ShowHideToggle: Story = {
  name: 'Show/Hide Toggle',
  args: {
    label: 'Password',
    placeholder: 'Password',
    defaultValue: 'mySecretP@ss',
    showLink: false,
    showHelper: false,
  },
};

/* ------------------------------------------------------------------ */
/*  4. Error state                                                      */
/* ------------------------------------------------------------------ */

export const ErrorState: Story = {
  name: 'Error State',
  args: {
    label: 'Password',
    placeholder: 'Password',
    error: true,
    errorText: 'Error text message',
    showLink: true,
    linkText: 'Forgot password?',
  },
};

export const ErrorStateFilled: Story = {
  name: 'Error State (Filled)',
  args: {
    label: 'Password',
    defaultValue: 'badpass',
    error: true,
    errorText: 'Password must be at least 8 characters',
    showLink: true,
  },
};

/* ------------------------------------------------------------------ */
/*  5. With "Forgot password?" link                                     */
/* ------------------------------------------------------------------ */

export const WithForgotPasswordLink: Story = {
  name: 'Forgot Password Link',
  args: {
    label: 'Password',
    placeholder: 'Password',
    showLink: true,
    linkText: 'Forgot password?',
    linkHref: '/forgot-password',
    showHelper: true,
    helperText: 'Optional helper text',
  },
};

/* ------------------------------------------------------------------ */
/*  6. Disabled state                                                   */
/* ------------------------------------------------------------------ */

export const DisabledEmpty: Story = {
  name: 'Disabled (Empty)',
  args: {
    label: 'Password',
    placeholder: 'Password',
    disabled: true,
    showLink: true,
    showHelper: true,
  },
};

export const DisabledFilled: Story = {
  name: 'Disabled (Filled)',
  args: {
    label: 'Password',
    defaultValue: 'mypassword',
    disabled: true,
    showLink: true,
    showHelper: true,
  },
};

/* ------------------------------------------------------------------ */
/*  7. Skeleton state                                                   */
/* ------------------------------------------------------------------ */

export const SkeletonState: Story = {
  name: 'Skeleton',
  args: {
    skeleton: true,
    showLabel: true,
    showHelper: true,
  },
};

export const SkeletonNoHelper: Story = {
  name: 'Skeleton (No Helper)',
  args: {
    skeleton: true,
    showLabel: true,
    showHelper: false,
  },
};

/* ------------------------------------------------------------------ */
/*  Per-variant: Required                                               */
/* ------------------------------------------------------------------ */

export const Required: Story = {
  args: {
    label: 'Password',
    placeholder: 'Password',
    required: true,
    showLink: true,
    showHelper: true,
  },
};

/* ------------------------------------------------------------------ */
/*  Per-variant: With explainer tooltip                                 */
/* ------------------------------------------------------------------ */

export const WithExplainer: Story = {
  name: 'With Explainer',
  args: {
    label: 'Password',
    placeholder: 'Password',
    showExplainer: true,
    explainerContent: 'Your password must be at least 8 characters long.',
    required: true,
    showLink: false,
    showHelper: true,
    helperText: 'Use a mix of letters, numbers, and symbols',
  },
};

/* ------------------------------------------------------------------ */
/*  Per-variant: Layer set 2                                            */
/* ------------------------------------------------------------------ */

export const Layer2: Story = {
  name: 'Layer Set 2',
  decorators: [
    (Story) => (
      <div
        style={{
          width: 288,
          padding: 24,
          backgroundColor: 'var(--scanner-bg-primary)',
          borderRadius: 12,
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Password',
    placeholder: 'Password',
    layer: 2,
    showLink: true,
    showHelper: true,
  },
};

/* ------------------------------------------------------------------ */
/*  AllStates — matrix for visual comparison                            */
/* ------------------------------------------------------------------ */

export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: 320 }}>
      <div>
        <h4 style={{ margin: '0 0 8px', fontSize: 12, color: '#666' }}>Enabled (empty)</h4>
        <PasswordInput
          label="Password"
          placeholder="Password"
          showLink
          showHelper
          helperText="Optional helper text"
        />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px', fontSize: 12, color: '#666' }}>Enabled (filled, hidden)</h4>
        <PasswordInput
          label="Password"
          defaultValue="mypassword"
          showLink
          showHelper
          helperText="Optional helper text"
        />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px', fontSize: 12, color: '#666' }}>Focused (click input below)</h4>
        <PasswordInput
          label="Password"
          placeholder="Password"
          showLink
          showHelper
          helperText="Optional helper text"
        />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px', fontSize: 12, color: '#666' }}>Error (empty)</h4>
        <PasswordInput
          label="Password"
          placeholder="Password"
          error
          errorText="Error text message"
          showLink
        />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px', fontSize: 12, color: '#666' }}>Error (filled)</h4>
        <PasswordInput
          label="Password"
          defaultValue="badpass"
          error
          errorText="Error text message"
          showLink
        />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px', fontSize: 12, color: '#666' }}>Disabled (empty)</h4>
        <PasswordInput
          label="Password"
          placeholder="Password"
          disabled
          showLink
          showHelper
          helperText="Optional helper text"
        />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px', fontSize: 12, color: '#666' }}>Disabled (filled)</h4>
        <PasswordInput
          label="Password"
          defaultValue="mypassword"
          disabled
          showLink
          showHelper
          helperText="Optional helper text"
        />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px', fontSize: 12, color: '#666' }}>Skeleton</h4>
        <PasswordInput skeleton showLabel showHelper />
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Layer comparison                                                    */
/* ------------------------------------------------------------------ */

export const LayerComparison: Story = {
  name: 'Layer Set Comparison',
  render: () => (
    <div style={{ display: 'flex', gap: 32 }}>
      <div style={{ width: 288 }}>
        <h4 style={{ margin: '0 0 8px', fontSize: 12, color: '#666' }}>Layer 1 (default)</h4>
        <PasswordInput
          label="Password"
          placeholder="Password"
          layer={1}
          showLink
          showHelper
        />
      </div>
      <div
        style={{
          width: 288,
          padding: 16,
          backgroundColor: 'var(--scanner-bg-primary)',
          borderRadius: 8,
        }}
      >
        <h4 style={{ margin: '0 0 8px', fontSize: 12, color: '#666' }}>Layer 2</h4>
        <PasswordInput
          label="Password"
          placeholder="Password"
          layer={2}
          showLink
          showHelper
        />
      </div>
    </div>
  ),
};
