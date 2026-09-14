import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TextInput } from './TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  parameters: { layout: 'centered' },
  argTypes: {
    size: {
      control: 'select',
      options: ['x-large', 'large', 'medium', 'small'],
    },
    layer: { control: 'select', options: [1, 2] },
    error: { control: 'boolean' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    clearable: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TextInput>;

/* ------------------------------------------------------------------ */
/*  Default                                                             */
/* ------------------------------------------------------------------ */
export const Default: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder text',
    helperText: 'Optional helper text',
    size: 'x-large',
    layer: 1,
  },
};

/* ------------------------------------------------------------------ */
/*  With label and helper text                                          */
/* ------------------------------------------------------------------ */
export const WithLabelAndHelper: Story = {
  name: 'With label & helper',
  args: {
    label: 'Full name',
    placeholder: 'Enter your name',
    helperText: 'As it appears on your ID',
  },
};

/* ------------------------------------------------------------------ */
/*  Error state with error message                                      */
/* ------------------------------------------------------------------ */
export const ErrorState: Story = {
  name: 'Error',
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    error: true,
    errorText: 'Please enter a valid email address',
    value: 'invalid-email',
  },
};

/* ------------------------------------------------------------------ */
/*  With tooltip on label                                               */
/* ------------------------------------------------------------------ */
export const WithTooltip: Story = {
  name: 'With tooltip',
  args: {
    label: 'API key',
    placeholder: 'Enter API key',
    helperText: 'Found in your account settings',
    tooltip: 'Your API key is used to authenticate requests',
  },
};

/* ------------------------------------------------------------------ */
/*  Required field                                                      */
/* ------------------------------------------------------------------ */
export const Required: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    helperText: 'Required for account verification',
    required: true,
  },
};

/* ------------------------------------------------------------------ */
/*  Disabled state                                                      */
/* ------------------------------------------------------------------ */
export const Disabled: Story = {
  args: {
    label: 'Username',
    placeholder: 'Placeholder text',
    helperText: 'Optional helper text',
    disabled: true,
  },
};

export const DisabledFilled: Story = {
  name: 'Disabled (filled)',
  args: {
    label: 'Username',
    value: 'john.doe',
    helperText: 'Optional helper text',
    disabled: true,
  },
};

/* ------------------------------------------------------------------ */
/*  Skeleton state                                                      */
/* ------------------------------------------------------------------ */
export const Skeleton: Story = {
  args: {
    skeleton: true,
    size: 'x-large',
  },
};

/* ------------------------------------------------------------------ */
/*  Clearable (controlled)                                              */
/* ------------------------------------------------------------------ */

function ClearableDemo() {
  const [value, setValue] = useState('Filled text');
  return (
    <TextInput
      label="Search"
      placeholder="Type to search..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      clearable
      onClear={() => setValue('')}
    />
  );
}

export const Clearable: Story = {
  render: () => <ClearableDemo />,
};

/* ------------------------------------------------------------------ */
/*  With counter                                                        */
/* ------------------------------------------------------------------ */

function CounterDemo() {
  const [value, setValue] = useState('');
  const max = 12;
  return (
    <TextInput
      label="Short bio"
      placeholder="Write something..."
      helperText="Keep it brief"
      value={value}
      onChange={(e) => setValue(e.target.value.slice(0, max))}
      counter={`${value.length}/${max}`}
      error={value.length >= max}
      errorText="Character limit reached"
    />
  );
}

export const WithCounter: Story = {
  name: 'With counter',
  render: () => <CounterDemo />,
};

/* ------------------------------------------------------------------ */
/*  Layer 2 (secondary background)                                      */
/* ------------------------------------------------------------------ */
export const Layer2: Story = {
  name: 'Layer 2',
  args: {
    label: 'Label',
    placeholder: 'Placeholder text',
    helperText: 'Optional helper text',
    layer: 2,
  },
};

/* ------------------------------------------------------------------ */
/*  All sizes side by side                                              */
/* ------------------------------------------------------------------ */
export const AllSizes: Story = {
  name: 'All sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {(['x-large', 'large', 'medium', 'small'] as const).map((size) => (
        <div key={size}>
          <p
            style={{
              marginBottom: 8,
              fontSize: 12,
              fontWeight: 600,
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {size}
          </p>
          <TextInput
            size={size}
            label="Label"
            placeholder="Placeholder text"
            helperText="Optional helper text"
          />
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  All states side by side                                             */
/* ------------------------------------------------------------------ */
export const AllStates: Story = {
  name: 'All states',
  render: () => {
    const states = [
      { name: 'Enabled', props: {} },
      { name: 'Focused', props: { 'data-state': 'focused' } },
      { name: 'Disabled', props: { disabled: true } },
      { name: 'Error', props: { error: true, errorText: 'Error text message' } },
      { name: 'Skeleton', props: { skeleton: true } },
    ] as const;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {states.map(({ name, props }) => (
          <div key={name}>
            <p
              style={{
                marginBottom: 8,
                fontSize: 12,
                fontWeight: 600,
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {name}
            </p>
            <TextInput
              label="Label"
              placeholder="Placeholder text"
              helperText="Optional helper text"
              {...props}
            />
          </div>
        ))}
      </div>
    );
  },
};

/* ------------------------------------------------------------------ */
/*  Full feature matrix: sizes x layers (filled)                        */
/* ------------------------------------------------------------------ */
export const SizeLayerMatrix: Story = {
  name: 'Size x Layer matrix (filled)',
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24,
      }}
    >
      {(['x-large', 'large', 'medium', 'small'] as const).map((size) =>
        ([1, 2] as const).map((layer) => (
          <div key={`${size}-${layer}`}>
            <p
              style={{
                marginBottom: 4,
                fontSize: 11,
                fontWeight: 600,
                color: '#888',
                textTransform: 'uppercase',
              }}
            >
              {size} / Layer {layer}
            </p>
            <TextInput
              size={size}
              layer={layer}
              label="Label"
              value="Filled text"
              helperText="Optional helper text"
            />
          </div>
        )),
      )}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Kitchen sink: all features enabled                                  */
/* ------------------------------------------------------------------ */
export const KitchenSink: Story = {
  name: 'Kitchen sink',
  args: {
    label: 'Field label',
    placeholder: 'Placeholder text',
    helperText: 'Helper text here',
    required: true,
    tooltip: 'Additional context for the user',
    counter: '0/100',
    clearable: true,
    value: 'Some value',
  },
};
