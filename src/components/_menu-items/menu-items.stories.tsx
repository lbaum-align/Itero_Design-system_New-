import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { MenuItems } from './MenuItems';

const meta: Meta<typeof MenuItems> = {
  title: 'Private/MenuItems',
  component: MenuItems,
  argTypes: {
    size: { control: 'select', options: ['large', 'medium', 'small'] },
    type: { control: 'select', options: ['neutral', 'destructive'] },
    disabled: { control: 'boolean' },
    showDivider: { control: 'boolean' },
    showHeadline: { control: 'boolean' },
    showSubtext: { control: 'boolean' },
    indented: { control: 'boolean' },
    selected: { control: 'boolean' },
    showTrailingElement: { control: 'boolean' },
  },
  args: { onClick: fn() },
  decorators: [
    (Story) => (
      <div style={{ width: 288, background: 'var(--scanner-bg-elevated, white)', padding: 4 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof MenuItems>;

/* ── Default ── */

export const Default: Story = {
  args: { label: 'Option' },
};

/* ── With icons (selected checkmark) ── */

export const Selected: Story = {
  args: { label: 'Selected option', selected: true },
};

export const SelectedDisabled: Story = {
  args: { label: 'Selected disabled', selected: true, disabled: true },
};

/* ── With keyboard shortcuts ── */

export const WithShortcut: Story = {
  args: {
    label: 'Copy',
    showTrailingElement: true,
    trailingElementProps: { shortcutKeys: ['⌘', 'C'] },
  },
};

/* ── With toggle items ── */

export const WithToggle: Story = {
  args: {
    label: 'Dark mode',
    showTrailingElement: true,
    trailingElementProps: { toggle: true, toggleSelected: false },
  },
};

export const WithToggleOn: Story = {
  args: {
    label: 'Dark mode',
    showTrailingElement: true,
    trailingElementProps: { toggle: true, toggleSelected: true },
  },
};

/* ── With submenu indicator ── */

export const WithSubmenu: Story = {
  args: {
    label: 'More options',
    showTrailingElement: true,
    trailingElementProps: { icon: 'chevron-right' },
  },
};

export const WithSubmenuAndLabel: Story = {
  args: {
    label: 'Theme',
    showTrailingElement: true,
    trailingElementProps: { icon: 'chevron-right', label: 'Light', showLabel: true },
  },
};

/* ── With headline ── */

export const WithHeadline: Story = {
  args: { label: 'Option', showHeadline: true, headline: 'Section Title' },
};

/* ── With subtext ── */

export const WithSubtext: Story = {
  args: { label: 'Option', showSubtext: true, subtext: 'Description text' },
};

/* ── With divider ── */

export const WithDivider: Story = {
  args: { label: 'Option', showDivider: true },
};

/* ── Indented ── */

export const Indented: Story = {
  args: { label: 'Indented option', indented: true },
};

/* ── Destructive ── */

export const Destructive: Story = {
  args: { label: 'Delete', type: 'destructive' },
};

export const DestructiveDisabled: Story = {
  args: { label: 'Delete', type: 'destructive', disabled: true },
};

/* ── Disabled ── */

export const Disabled: Story = {
  args: { label: 'Disabled option', disabled: true },
};

/* ── All sizes ── */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'start' }}>
      {(['large', 'medium', 'small'] as const).map((s) => (
        <div key={s} style={{ width: 288 }}>
          <div style={{ fontWeight: 600, marginBottom: 8, textTransform: 'capitalize' }}>{s}</div>
          <MenuItems size={s} label={`${s} option`} />
        </div>
      ))}
    </div>
  ),
};

/* ── All States × Types matrix ── */

export const AllStates: Story = {
  render: () => {
    const types = ['neutral', 'destructive'] as const;
    const states: Array<{
      label: string;
      props: Record<string, unknown>;
    }> = [
      { label: 'Enabled', props: {} },
      { label: 'Hovered', props: { 'data-state': 'hovered' } },
      { label: 'Focused', props: { 'data-state': 'focused' } },
      { label: 'Disabled', props: { disabled: true } },
    ];

    return (
      <div style={{ display: 'grid', gridTemplateColumns: `120px repeat(${states.length}, 288px)`, gap: '12px 16px', alignItems: 'start' }}>
        {/* Header */}
        <div />
        {states.map(({ label }) => (
          <div key={label} style={{ fontWeight: 600 }}>{label}</div>
        ))}

        {/* Rows */}
        {types.map((t) => (
          <>
            <div key={`label-${t}`} style={{ fontWeight: 600, textTransform: 'capitalize', paddingTop: 8 }}>{t}</div>
            {states.map(({ label, props }) => (
              <MenuItems
                key={`${t}-${label}`}
                type={t}
                label={`${t} ${label.toLowerCase()}`}
                {...props}
              />
            ))}
          </>
        ))}
      </div>
    );
  },
};

/* ── Full-featured item ── */

export const FullFeatured: Story = {
  args: {
    label: 'Full featured',
    showHeadline: true,
    headline: 'Actions',
    showSubtext: true,
    subtext: 'Performs an action',
    selected: true,
    showTrailingElement: true,
    trailingElementProps: { shortcutKeys: ['⌘', 'A'] },
    showDivider: true,
  },
};
