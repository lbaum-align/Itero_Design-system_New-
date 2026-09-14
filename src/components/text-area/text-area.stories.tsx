import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TextArea } from './TextArea';

const meta: Meta<typeof TextArea> = {
  title: 'Components/TextArea',
  component: TextArea,
  args: {
    label: 'Label',
    placeholder: 'Placeholder text',
    helperText: 'Optional helper text',
  },
  argTypes: {
    layer: {
      control: { type: 'inline-radio' },
      options: [1, 2],
    },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    required: { control: 'boolean' },
    showCounter: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof TextArea>;

/* ------------------------------------------------------------------ */
/*  Default                                                             */
/* ------------------------------------------------------------------ */

export const Default: Story = {};

/* ------------------------------------------------------------------ */
/*  With label and helper text                                          */
/* ------------------------------------------------------------------ */

export const WithLabelAndHelper: Story = {
  args: {
    label: 'Description',
    helperText: 'Provide a brief description of the issue.',
    placeholder: 'Enter description...',
  },
};

/* ------------------------------------------------------------------ */
/*  With error state                                                    */
/* ------------------------------------------------------------------ */

export const WithError: Story = {
  args: {
    label: 'Comment',
    error: true,
    errorText: 'This field is required',
    placeholder: 'Enter your comment...',
  },
};

/* ------------------------------------------------------------------ */
/*  With character count                                                */
/* ------------------------------------------------------------------ */

export const WithCharacterCount: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <TextArea
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
  args: {
    label: 'Bio',
    helperText: 'Write a short bio about yourself.',
    showCounter: true,
    maxLength: 100,
    placeholder: 'Tell us about yourself...',
  },
};

/* ------------------------------------------------------------------ */
/*  With tooltip                                                        */
/* ------------------------------------------------------------------ */

export const WithTooltip: Story = {
  args: {
    label: 'Notes',
    tooltipContent: 'Additional context about this field',
    placeholder: 'Type your notes...',
  },
};

/* ------------------------------------------------------------------ */
/*  Required                                                            */
/* ------------------------------------------------------------------ */

export const Required: Story = {
  args: {
    label: 'Required field',
    required: true,
    placeholder: 'This field is required...',
  },
};

/* ------------------------------------------------------------------ */
/*  Disabled state                                                      */
/* ------------------------------------------------------------------ */

export const Disabled: Story = {
  args: {
    label: 'Disabled field',
    disabled: true,
    helperText: 'This field is currently disabled.',
    placeholder: 'Cannot type here...',
  },
};

/* ------------------------------------------------------------------ */
/*  Disabled with value                                                 */
/* ------------------------------------------------------------------ */

export const DisabledWithValue: Story = {
  args: {
    label: 'Disabled field',
    disabled: true,
    value: 'This content is read-only and cannot be edited.',
    helperText: 'This field is currently disabled.',
  },
};

/* ------------------------------------------------------------------ */
/*  Skeleton state                                                      */
/* ------------------------------------------------------------------ */

export const Skeleton: Story = {
  args: {
    label: 'Loading...',
    skeleton: true,
    helperText: 'Loading...',
  },
};

/* ------------------------------------------------------------------ */
/*  Skeleton without label                                              */
/* ------------------------------------------------------------------ */

export const SkeletonMinimal: Story = {
  args: {
    skeleton: true,
  },
};

/* ------------------------------------------------------------------ */
/*  With clear button                                                   */
/* ------------------------------------------------------------------ */

export const WithClearButton: Story = {
  render: (args) => {
    const [value, setValue] = useState('Some text to clear');
    return (
      <TextArea
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue('')}
      />
    );
  },
  args: {
    label: 'Clearable field',
    helperText: 'Click the X icon to clear the textarea.',
  },
};

/* ------------------------------------------------------------------ */
/*  Layer Set 02                                                        */
/* ------------------------------------------------------------------ */

export const LayerSet02: Story = {
  args: {
    label: 'Layer Set 02',
    helperText: 'Displayed on a secondary background.',
    layer: 2,
    placeholder: 'Enter text...',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          background: 'var(--scanner-bg-primary)',
          padding: 'var(--scanner-spacing-7)',
          borderRadius: 'var(--scanner-radius-md)',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

/* ------------------------------------------------------------------ */
/*  All States                                                          */
/* ------------------------------------------------------------------ */

export const AllStates: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 288px)',
        gap: 'var(--scanner-spacing-7)',
      }}
    >
      {/* Row 1: Enabled */}
      <TextArea
        label="Enabled (empty)"
        placeholder="Placeholder text"
        helperText="Optional helper text"
      />
      <TextArea
        label="Enabled (filled)"
        value="Filled text"
        helperText="Optional helper text"
        onClear={() => {}}
      />
      <TextArea
        label="Enabled (empty)"
        placeholder="Placeholder text"
        helperText="Optional helper text"
        layer={2}
      />
      <TextArea
        label="Enabled (filled)"
        value="Filled text"
        helperText="Optional helper text"
        layer={2}
        onClear={() => {}}
      />

      {/* Row 2: Focused — simulated via data-state */}
      <TextArea
        label="Focused (empty)"
        placeholder="Placeholder text"
        helperText="Optional helper text"
        data-state="focused"
      />
      <TextArea
        label="Focused (filled)"
        value="Filled text"
        helperText="Optional helper text"
        onClear={() => {}}
        data-state="focused"
      />
      <TextArea
        label="Focused (empty)"
        placeholder="Placeholder text"
        helperText="Optional helper text"
        layer={2}
        data-state="focused"
      />
      <TextArea
        label="Focused (filled)"
        value="Filled text"
        helperText="Optional helper text"
        layer={2}
        onClear={() => {}}
        data-state="focused"
      />

      {/* Row 3: Disabled */}
      <TextArea
        label="Disabled (empty)"
        placeholder="Placeholder text"
        helperText="Optional helper text"
        disabled
      />
      <TextArea
        label="Disabled (filled)"
        value="Filled text"
        helperText="Optional helper text"
        disabled
      />
      <TextArea
        label="Disabled (empty)"
        placeholder="Placeholder text"
        helperText="Optional helper text"
        layer={2}
        disabled
      />
      <TextArea
        label="Disabled (filled)"
        value="Filled text"
        helperText="Optional helper text"
        layer={2}
        disabled
      />

      {/* Row 4: Error */}
      <TextArea
        label="Error (empty)"
        placeholder="Placeholder text"
        error
        errorText="Error text message"
      />
      <TextArea
        label="Error (filled)"
        value="Filled text"
        error
        errorText="Error text message"
        onClear={() => {}}
      />
      <TextArea
        label="Error (empty)"
        placeholder="Placeholder text"
        error
        errorText="Error text message"
        layer={2}
      />
      <TextArea
        label="Error (filled)"
        value="Filled text"
        error
        errorText="Error text message"
        layer={2}
        onClear={() => {}}
      />

      {/* Row 5: Skeleton */}
      <TextArea label="Skeleton" skeleton helperText="..." />
      <TextArea label="Skeleton" skeleton helperText="..." />
      <TextArea label="Skeleton" skeleton helperText="..." layer={2} />
      <TextArea label="Skeleton" skeleton helperText="..." layer={2} />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  All Features Combined                                               */
/* ------------------------------------------------------------------ */

export const AllFeaturesCombined: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <TextArea
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue('')}
      />
    );
  },
  args: {
    label: 'Full-featured textarea',
    required: true,
    helperText: 'This textarea shows all features at once.',
    tooltipContent: 'Helpful tooltip content here',
    showCounter: true,
    maxLength: 200,
    placeholder: 'Start typing...',
  },
};
