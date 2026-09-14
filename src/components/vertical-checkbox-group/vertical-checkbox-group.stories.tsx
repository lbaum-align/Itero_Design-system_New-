import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { VerticalCheckboxGroup } from './VerticalCheckboxGroup';
import { CheckboxItem } from '../checkbox-item';

const meta: Meta<typeof VerticalCheckboxGroup> = {
  title: 'Components/VerticalCheckboxGroup',
  component: VerticalCheckboxGroup,
  args: {
    label: 'Label',
    showLabel: true,
    required: false,
    error: false,
    disabled: false,
    skeleton: false,
    levels: 1,
  },
  argTypes: {
    levels: { control: { type: 'inline-radio' }, options: [1, 2] },
    label: { control: 'text' },
    tooltipContent: { control: 'text' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof VerticalCheckboxGroup>;

/* ------------------------------------------------------------------ */
/* Default                                                              */
/* ------------------------------------------------------------------ */
export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = useState<Record<string, boolean>>({
      a: false,
      b: true,
      c: false,
    });
    return (
      <VerticalCheckboxGroup {...args}>
        <CheckboxItem
          label="Option A"
          checked={checked.a}
          onChange={(v) => setChecked((s) => ({ ...s, a: v }))}
          disabled={args.disabled}
        />
        <CheckboxItem
          label="Option B"
          checked={checked.b}
          onChange={(v) => setChecked((s) => ({ ...s, b: v }))}
          disabled={args.disabled}
        />
        <CheckboxItem
          label="Option C"
          checked={checked.c}
          onChange={(v) => setChecked((s) => ({ ...s, c: v }))}
          disabled={args.disabled}
        />
      </VerticalCheckboxGroup>
    );
  },
};

/* ------------------------------------------------------------------ */
/* WithLabelAndHelperText                                               */
/* ------------------------------------------------------------------ */
export const WithLabelAndHelperText: Story = {
  render: () => {
    const [checked, setChecked] = useState<Record<string, boolean>>({
      email: true,
      sms: false,
      push: false,
    });
    return (
      <VerticalCheckboxGroup
        label="Notification preferences"
        helperText="Select how you'd like to be notified"
      >
        <CheckboxItem
          label="Email"
          checked={checked.email}
          onChange={(v) => setChecked((s) => ({ ...s, email: v }))}
        />
        <CheckboxItem
          label="SMS"
          checked={checked.sms}
          onChange={(v) => setChecked((s) => ({ ...s, sms: v }))}
        />
        <CheckboxItem
          label="Push notifications"
          checked={checked.push}
          onChange={(v) => setChecked((s) => ({ ...s, push: v }))}
        />
      </VerticalCheckboxGroup>
    );
  },
};

/* ------------------------------------------------------------------ */
/* WithTooltip                                                          */
/* ------------------------------------------------------------------ */
export const WithTooltip: Story = {
  render: () => {
    const [checked, setChecked] = useState<Record<string, boolean>>({
      terms: false,
      newsletter: false,
    });
    return (
      <VerticalCheckboxGroup
        label="Agreements"
        tooltipContent="Please review each agreement carefully before accepting"
        required
      >
        <CheckboxItem
          label="I accept the terms and conditions"
          checked={checked.terms}
          onChange={(v) => setChecked((s) => ({ ...s, terms: v }))}
        />
        <CheckboxItem
          label="Subscribe to newsletter"
          checked={checked.newsletter}
          onChange={(v) => setChecked((s) => ({ ...s, newsletter: v }))}
        />
      </VerticalCheckboxGroup>
    );
  },
};

/* ------------------------------------------------------------------ */
/* ErrorState                                                           */
/* ------------------------------------------------------------------ */
export const ErrorState: Story = {
  render: () => (
    <VerticalCheckboxGroup
      label="Required selection"
      required
      error
      errorMessage="Please select at least one option"
    >
      <CheckboxItem label="Option A" checked={false} />
      <CheckboxItem label="Option B" checked={false} />
      <CheckboxItem label="Option C" checked={false} />
    </VerticalCheckboxGroup>
  ),
};

/* ------------------------------------------------------------------ */
/* DisabledGroup                                                        */
/* ------------------------------------------------------------------ */
export const DisabledGroup: Story = {
  render: () => (
    <VerticalCheckboxGroup label="Disabled group" disabled>
      <CheckboxItem label="Option A" checked disabled />
      <CheckboxItem label="Option B" checked={false} disabled />
      <CheckboxItem label="Option C" checked disabled />
    </VerticalCheckboxGroup>
  ),
};

/* ------------------------------------------------------------------ */
/* SkeletonState                                                        */
/* ------------------------------------------------------------------ */
export const SkeletonState: Story = {
  render: () => (
    <VerticalCheckboxGroup label="Loading..." skeleton helperText="placeholder">
      <CheckboxItem label="A" skeleton />
      <CheckboxItem label="B" skeleton />
      <CheckboxItem label="C" skeleton />
    </VerticalCheckboxGroup>
  ),
};

/* ------------------------------------------------------------------ */
/* Levels2Nested                                                        */
/* ------------------------------------------------------------------ */
export const Levels2Nested: Story = {
  name: 'Levels = 2 (Nested)',
  render: () => {
    const [checked, setChecked] = useState<Record<string, boolean>>({
      parent: false,
      child1: false,
      child2: false,
      child3: false,
    });

    const allChildren = [checked.child1, checked.child2, checked.child3];
    const allSelected = allChildren.every(Boolean);
    const someSelected = allChildren.some(Boolean) && !allSelected;

    return (
      <VerticalCheckboxGroup label="Features" levels={2}>
        <CheckboxItem
          label="Select all"
          checked={allSelected ? 'selected' : someSelected ? 'indeterminate' : 'unselected'}
          onChange={(v) =>
            setChecked({ parent: v, child1: v, child2: v, child3: v })
          }
        />
        <CheckboxItem
          label="Feature A"
          checked={checked.child1}
          onChange={(v) => setChecked((s) => ({ ...s, child1: v }))}
        />
        <CheckboxItem
          label="Feature B"
          checked={checked.child2}
          onChange={(v) => setChecked((s) => ({ ...s, child2: v }))}
        />
        <CheckboxItem
          label="Feature C"
          checked={checked.child3}
          onChange={(v) => setChecked((s) => ({ ...s, child3: v }))}
        />
      </VerticalCheckboxGroup>
    );
  },
};

/* ------------------------------------------------------------------ */
/* AllStates — side by side matrix                                      */
/* ------------------------------------------------------------------ */
export const AllStates: Story = {
  name: 'All States',
  render: () => (
    <div className="flex flex-wrap gap-[var(--scanner-spacing-8)]">
      {/* Default */}
      <div>
        <p className="scanner-text-label-01 mb-4 text-[color:var(--scanner-text-secondary)]">
          Default
        </p>
        <VerticalCheckboxGroup label="Label">
          <CheckboxItem label="Option A" checked />
          <CheckboxItem label="Option B" checked={false} />
        </VerticalCheckboxGroup>
      </div>

      {/* With tooltip */}
      <div>
        <p className="scanner-text-label-01 mb-4 text-[color:var(--scanner-text-secondary)]">
          With Tooltip
        </p>
        <VerticalCheckboxGroup
          label="Label"
          tooltipContent="Helpful context"
        >
          <CheckboxItem label="Option A" checked />
          <CheckboxItem label="Option B" checked={false} />
        </VerticalCheckboxGroup>
      </div>

      {/* Required */}
      <div>
        <p className="scanner-text-label-01 mb-4 text-[color:var(--scanner-text-secondary)]">
          Required
        </p>
        <VerticalCheckboxGroup label="Label" required>
          <CheckboxItem label="Option A" checked />
          <CheckboxItem label="Option B" checked={false} />
        </VerticalCheckboxGroup>
      </div>

      {/* With helper text */}
      <div>
        <p className="scanner-text-label-01 mb-4 text-[color:var(--scanner-text-secondary)]">
          Helper Text
        </p>
        <VerticalCheckboxGroup
          label="Label"
          helperText="Select your preferences"
        >
          <CheckboxItem label="Option A" checked />
          <CheckboxItem label="Option B" checked={false} />
        </VerticalCheckboxGroup>
      </div>

      {/* Error */}
      <div>
        <p className="scanner-text-label-01 mb-4 text-[color:var(--scanner-text-secondary)]">
          Error
        </p>
        <VerticalCheckboxGroup
          label="Label"
          required
          error
          errorMessage="Selection required"
        >
          <CheckboxItem label="Option A" checked={false} />
          <CheckboxItem label="Option B" checked={false} />
        </VerticalCheckboxGroup>
      </div>

      {/* Disabled */}
      <div>
        <p className="scanner-text-label-01 mb-4 text-[color:var(--scanner-text-secondary)]">
          Disabled
        </p>
        <VerticalCheckboxGroup label="Label" disabled>
          <CheckboxItem label="Option A" checked disabled />
          <CheckboxItem label="Option B" checked={false} disabled />
        </VerticalCheckboxGroup>
      </div>

      {/* Skeleton */}
      <div>
        <p className="scanner-text-label-01 mb-4 text-[color:var(--scanner-text-secondary)]">
          Skeleton
        </p>
        <VerticalCheckboxGroup label="Label" skeleton>
          <CheckboxItem label="Option A" skeleton />
          <CheckboxItem label="Option B" skeleton />
        </VerticalCheckboxGroup>
      </div>

      {/* Levels=2 */}
      <div>
        <p className="scanner-text-label-01 mb-4 text-[color:var(--scanner-text-secondary)]">
          Levels = 2
        </p>
        <VerticalCheckboxGroup label="Label" levels={2}>
          <CheckboxItem label="Parent" checked="indeterminate" />
          <CheckboxItem label="Child A" checked />
          <CheckboxItem label="Child B" checked={false} />
        </VerticalCheckboxGroup>
      </div>

      {/* No label */}
      <div>
        <p className="scanner-text-label-01 mb-4 text-[color:var(--scanner-text-secondary)]">
          No Label
        </p>
        <VerticalCheckboxGroup showLabel={false}>
          <CheckboxItem label="Option A" checked />
          <CheckboxItem label="Option B" checked={false} />
        </VerticalCheckboxGroup>
      </div>
    </div>
  ),
};
