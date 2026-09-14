import type { Meta, StoryObj } from '@storybook/react';
import { SelectMenuItem } from './SelectMenuItem';
import type { SelectMenuItemSize } from './select-menu-item.types';

const meta: Meta<typeof SelectMenuItem> = {
  title: 'Private/SelectMenuItem',
  component: SelectMenuItem,
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'x-large'] satisfies SelectMenuItemSize[],
    },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    showHeadline: { control: 'boolean' },
    showSubtext: { control: 'boolean' },
    showDivider: { control: 'boolean' },
    optionText: { control: 'text' },
    headlineText: { control: 'text' },
    subheadText: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 288 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SelectMenuItem>;

/* ── Default ── */

export const Default: Story = {
  args: {
    optionText: 'Option',
    size: 'x-large',
  },
};

/* ── Selected ── */

export const Selected: Story = {
  args: {
    optionText: 'Selected option',
    selected: true,
    size: 'large',
  },
};

/* ── With Checkmark (Selected, X-Large) ── */

export const WithCheckmark: Story = {
  args: {
    optionText: 'Option with checkmark',
    selected: true,
    size: 'x-large',
  },
};

/* ── Disabled ── */

export const Disabled: Story = {
  args: {
    optionText: 'Disabled option',
    disabled: true,
    size: 'large',
  },
};

/* ── Disabled + Selected ── */

export const DisabledSelected: Story = {
  args: {
    optionText: 'Disabled selected',
    disabled: true,
    selected: true,
    size: 'large',
  },
};

/* ── Hovered (via data-state) ── */

export const Hovered: Story = {
  args: {
    optionText: 'Hovered option',
    size: 'large',
    'data-state': 'hovered',
  } as Record<string, unknown>,
};

/* ── Focused (via data-state) ── */

export const Focused: Story = {
  args: {
    optionText: 'Focused option',
    size: 'large',
    'data-state': 'focused',
  } as Record<string, unknown>,
};

/* ── With Headline ── */

export const WithHeadline: Story = {
  args: {
    optionText: 'Option',
    headlineText: 'Group headline',
    showHeadline: true,
    size: 'x-large',
  },
};

/* ── With Subtext ── */

export const WithSubtext: Story = {
  args: {
    optionText: 'Option',
    subheadText: 'Supporting description',
    showSubtext: true,
    size: 'large',
  },
};

/* ── With Divider ── */

export const WithDivider: Story = {
  args: {
    optionText: 'Option with divider',
    showDivider: true,
    size: 'large',
  },
};

/* ── Full featured ── */

export const FullFeatured: Story = {
  args: {
    optionText: 'Full option',
    headlineText: 'Section headline',
    subheadText: 'Helpful subtext',
    showHeadline: true,
    showSubtext: true,
    showDivider: true,
    selected: true,
    size: 'x-large',
  },
};

/* ── All Sizes ── */

const sizes: SelectMenuItemSize[] = ['small', 'medium', 'large', 'x-large'];

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {sizes.map((s) => (
        <div key={s}>
          <div style={{ marginBottom: 4, fontSize: 11, fontWeight: 600, color: '#666' }}>
            {s}
          </div>
          <SelectMenuItem optionText={`Option (${s})`} size={s} />
        </div>
      ))}
    </div>
  ),
};

/* ── All Sizes — Selected ── */

export const AllSizesSelected: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {sizes.map((s) => (
        <div key={s}>
          <div style={{ marginBottom: 4, fontSize: 11, fontWeight: 600, color: '#666' }}>
            {s} — selected
          </div>
          <SelectMenuItem optionText={`Option (${s})`} size={s} selected />
        </div>
      ))}
    </div>
  ),
};

/* ── All States (matrix) ── */

type StateLabel = 'enabled' | 'hovered' | 'focused' | 'disabled';
const states: StateLabel[] = ['enabled', 'hovered', 'focused', 'disabled'];

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Unselected rows */}
      <div>
        <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700 }}>Unselected</div>
        <div style={{ display: 'grid', gridTemplateColumns: `100px repeat(${states.length}, 288px)`, gap: 8, alignItems: 'start' }}>
          {/* Header row */}
          <div />
          {states.map((st) => (
            <div key={st} style={{ fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'capitalize' }}>
              {st}
            </div>
          ))}

          {/* Size rows */}
          {sizes.map((s) => (
            <>
              <div key={`label-${s}`} style={{ fontSize: 11, fontWeight: 600, color: '#666', paddingTop: 4 }}>
                {s}
              </div>
              {states.map((st) => (
                <SelectMenuItem
                  key={`${s}-${st}`}
                  optionText="Option"
                  size={s}
                  disabled={st === 'disabled'}
                  data-state={st === 'enabled' ? undefined : st}
                />
              ))}
            </>
          ))}
        </div>
      </div>

      {/* Selected rows */}
      <div>
        <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700 }}>Selected</div>
        <div style={{ display: 'grid', gridTemplateColumns: `100px repeat(${states.length}, 288px)`, gap: 8, alignItems: 'start' }}>
          {/* Header row */}
          <div />
          {states.map((st) => (
            <div key={st} style={{ fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'capitalize' }}>
              {st}
            </div>
          ))}

          {/* Size rows */}
          {sizes.map((s) => (
            <>
              <div key={`label-sel-${s}`} style={{ fontSize: 11, fontWeight: 600, color: '#666', paddingTop: 4 }}>
                {s}
              </div>
              {states.map((st) => (
                <SelectMenuItem
                  key={`sel-${s}-${st}`}
                  optionText="Option"
                  size={s}
                  selected
                  disabled={st === 'disabled'}
                  data-state={st === 'enabled' ? undefined : st}
                />
              ))}
            </>
          ))}
        </div>
      </div>
    </div>
  ),
};
