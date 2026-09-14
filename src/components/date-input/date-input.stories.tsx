import type { Meta, StoryObj } from '@storybook/react';
import { DateInput } from './DateInput';
import type { DateInputSize } from './date-input.types';

const meta: Meta<typeof DateInput> = {
  title: 'Components/DateInput',
  component: DateInput,
  args: {
    size: 'large',
    layer: 1,
    label: 'Label',
    showLabel: true,
    required: false,
    helperText: 'Optional helper text',
    errorText: 'Error text message',
    showHelper: true,
    showExplainer: false,
    explainerText: 'This is an explainer tooltip',
    error: false,
    disabled: false,
    skeleton: false,
    placeholder: 'mm / dd / yyyy',
  },
  argTypes: {
    size: { control: 'select', options: ['large', 'medium', 'small'] },
    layer: { control: 'select', options: [1, 2] },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DateInput>;

/* ------------------------------------------------------------------ */
/*  Default                                                           */
/* ------------------------------------------------------------------ */

export const Default: Story = {};

/* ------------------------------------------------------------------ */
/*  With label and helper text                                        */
/* ------------------------------------------------------------------ */

export const WithLabelAndHelper: Story = {
  name: 'With Label & Helper',
  args: {
    label: 'Start date',
    helperText: 'Enter the project start date',
    showLabel: true,
    showHelper: true,
  },
};

/* ------------------------------------------------------------------ */
/*  Filled                                                            */
/* ------------------------------------------------------------------ */

export const Filled: Story = {
  args: {
    defaultValue: '07.12.2024',
    label: 'Due date',
  },
};

/* ------------------------------------------------------------------ */
/*  With Explainer                                                    */
/* ------------------------------------------------------------------ */

export const WithExplainer: Story = {
  name: 'With Explainer Tooltip',
  args: {
    showExplainer: true,
    explainerText: 'Pick the date when this task is due',
    label: 'Due date',
  },
};

/* ------------------------------------------------------------------ */
/*  Required                                                          */
/* ------------------------------------------------------------------ */

export const Required: Story = {
  args: {
    required: true,
    label: 'Birth date',
  },
};

/* ------------------------------------------------------------------ */
/*  Focused (autoFocus to trigger focus-within)                       */
/* ------------------------------------------------------------------ */

export const Focused: Story = {
  args: {
    autoFocus: true,
    label: 'Start date',
  },
};

/* ------------------------------------------------------------------ */
/*  Error                                                             */
/* ------------------------------------------------------------------ */

export const Error: Story = {
  args: {
    error: true,
    errorText: 'Please enter a valid date',
    label: 'Start date',
  },
};

/* ------------------------------------------------------------------ */
/*  Disabled                                                          */
/* ------------------------------------------------------------------ */

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Start date',
  },
};

/* ------------------------------------------------------------------ */
/*  Disabled Filled                                                   */
/* ------------------------------------------------------------------ */

export const DisabledFilled: Story = {
  name: 'Disabled Filled',
  args: {
    disabled: true,
    defaultValue: '07.12.2024',
    label: 'Start date',
  },
};

/* ------------------------------------------------------------------ */
/*  Skeleton                                                          */
/* ------------------------------------------------------------------ */

export const Skeleton: Story = {
  args: {
    skeleton: true,
  },
};

/* ------------------------------------------------------------------ */
/*  Layer Set 2                                                       */
/* ------------------------------------------------------------------ */

export const LayerSet2: Story = {
  name: 'Layer Set 2',
  args: {
    layer: 2,
    label: 'End date',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          maxWidth: 320,
          padding: 24,
          background: 'var(--scanner-bg-primary)',
          borderRadius: 8,
        }}
      >
        <Story />
      </div>
    ),
  ],
};

/* ------------------------------------------------------------------ */
/*  All Sizes                                                         */
/* ------------------------------------------------------------------ */

const sizes: DateInputSize[] = ['large', 'medium', 'small'];

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      {sizes.map((s) => (
        <div key={s} style={{ width: 288 }}>
          <p
            style={{
              marginBottom: 8,
              fontWeight: 500,
              textTransform: 'capitalize',
            }}
          >
            {s}
          </p>
          <DateInput size={s} label="Label" />
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  All Sizes — Filled                                                */
/* ------------------------------------------------------------------ */

export const AllSizesFilled: Story = {
  name: 'All Sizes — Filled',
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      {sizes.map((s) => (
        <div key={s} style={{ width: 288 }}>
          <p
            style={{
              marginBottom: 8,
              fontWeight: 500,
              textTransform: 'capitalize',
            }}
          >
            {s}
          </p>
          <DateInput size={s} label="Label" defaultValue="07.12.2024" />
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  All States                                                        */
/* ------------------------------------------------------------------ */

export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {/* Unfilled — Layer Set 1 */}
      <div>
        <h3 style={{ marginBottom: 16, fontWeight: 600 }}>
          Unfilled — Layer Set 1
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 288px)',
            gap: 24,
          }}
        >
          <div>
            <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12 }}>Enabled</p>
            <DateInput label="Label" />
          </div>
          <div>
            <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12 }}>Focused</p>
            <DateInput label="Label" autoFocus />
          </div>
          <div>
            <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12 }}>Disabled</p>
            <DateInput label="Label" disabled />
          </div>
          <div>
            <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12 }}>Error</p>
            <DateInput label="Label" error />
          </div>
          <div>
            <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12 }}>Skeleton</p>
            <DateInput label="Label" skeleton />
          </div>
        </div>
      </div>

      {/* Filled — Layer Set 1 */}
      <div>
        <h3 style={{ marginBottom: 16, fontWeight: 600 }}>
          Filled — Layer Set 1
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 288px)',
            gap: 24,
          }}
        >
          <div>
            <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12 }}>Enabled</p>
            <DateInput label="Label" defaultValue="07.12.2024" />
          </div>
          <div>
            <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12 }}>Focused</p>
            <DateInput label="Label" defaultValue="07.12.2024" autoFocus />
          </div>
          <div>
            <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12 }}>Disabled</p>
            <DateInput label="Label" defaultValue="07.12.2024" disabled />
          </div>
          <div>
            <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12 }}>Error</p>
            <DateInput label="Label" defaultValue="07.12.2024" error />
          </div>
          <div>
            <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12 }}>Skeleton</p>
            <DateInput label="Label" skeleton />
          </div>
        </div>
      </div>

      {/* Unfilled — Layer Set 2 */}
      <div>
        <h3 style={{ marginBottom: 16, fontWeight: 600 }}>
          Unfilled — Layer Set 2
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 288px)',
            gap: 24,
          }}
        >
          <div>
            <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12 }}>Enabled</p>
            <DateInput label="Label" layer={2} />
          </div>
          <div>
            <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12 }}>Focused</p>
            <DateInput label="Label" layer={2} autoFocus />
          </div>
          <div>
            <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12 }}>Disabled</p>
            <DateInput label="Label" layer={2} disabled />
          </div>
          <div>
            <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12 }}>Error</p>
            <DateInput label="Label" layer={2} error />
          </div>
          <div>
            <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12 }}>Skeleton</p>
            <DateInput label="Label" layer={2} skeleton />
          </div>
        </div>
      </div>

      {/* Filled — Layer Set 2 */}
      <div>
        <h3 style={{ marginBottom: 16, fontWeight: 600 }}>
          Filled — Layer Set 2
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 288px)',
            gap: 24,
          }}
        >
          <div>
            <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12 }}>Enabled</p>
            <DateInput label="Label" layer={2} defaultValue="07.12.2024" />
          </div>
          <div>
            <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12 }}>Focused</p>
            <DateInput label="Label" layer={2} defaultValue="07.12.2024" autoFocus />
          </div>
          <div>
            <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12 }}>Disabled</p>
            <DateInput label="Label" layer={2} defaultValue="07.12.2024" disabled />
          </div>
          <div>
            <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12 }}>Error</p>
            <DateInput label="Label" layer={2} defaultValue="07.12.2024" error />
          </div>
          <div>
            <p style={{ marginBottom: 8, fontWeight: 500, fontSize: 12 }}>Skeleton</p>
            <DateInput label="Label" layer={2} skeleton />
          </div>
        </div>
      </div>
    </div>
  ),
};
