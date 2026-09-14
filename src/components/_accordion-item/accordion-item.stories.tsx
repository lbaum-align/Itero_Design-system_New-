import type { Meta, StoryObj } from '@storybook/react';
import { AccordionItem } from './AccordionItem';
import type { AccordionItemStyle } from './accordion-item.types';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

const meta: Meta<typeof AccordionItem> = {
  title: 'Private/_AccordionItem',
  component: AccordionItem,
  argTypes: {
    variant: {
      control: 'select',
      options: ['background-01', 'background-02', 'border', 'line'],
    },
    expanded: { control: 'boolean' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
  },
  args: {
    id: 'demo-item',
    title: 'Title',
    description: LOREM,
    variant: 'background-01',
    expanded: false,
    disabled: false,
    skeleton: false,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400, padding: 24, background: '#e8e8e8' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof AccordionItem>;

/* ------------------------------------------------------------------ */
/*  Default                                                            */
/* ------------------------------------------------------------------ */

export const Default: Story = {};

/* ------------------------------------------------------------------ */
/*  Single item expanded                                               */
/* ------------------------------------------------------------------ */

export const Expanded: Story = {
  args: { expanded: true },
};

/* ------------------------------------------------------------------ */
/*  Disabled                                                           */
/* ------------------------------------------------------------------ */

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledExpanded: Story = {
  args: { disabled: true, expanded: true },
};

/* ------------------------------------------------------------------ */
/*  Skeleton                                                           */
/* ------------------------------------------------------------------ */

export const Skeleton: Story = {
  args: { skeleton: true },
};

export const SkeletonExpanded: Story = {
  args: { skeleton: true, expanded: true },
};

/* ------------------------------------------------------------------ */
/*  Nested content                                                     */
/* ------------------------------------------------------------------ */

export const NestedContent: Story = {
  args: {
    expanded: true,
    children: undefined,
  },
  render: (args) => (
    <AccordionItem {...args}>
      <div
        style={{
          padding: 16,
          border: '1px dashed var(--scanner-border-interactive, #009ace)',
          borderRadius: 8,
          color: 'var(--scanner-text-link, #009ace)',
          fontFamily: 'var(--scanner-font-sans)',
          fontSize: 14,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        Custom swappable content goes here
      </div>
    </AccordionItem>
  ),
};

/* ------------------------------------------------------------------ */
/*  Per-variant stories                                                */
/* ------------------------------------------------------------------ */

export const Background01: Story = {
  args: { variant: 'background-01', expanded: true },
};

export const Background02: Story = {
  args: { variant: 'background-02', expanded: true },
};

export const Border: Story = {
  args: { variant: 'border', expanded: true },
};

export const Line: Story = {
  args: { variant: 'line', expanded: true },
};

/* ------------------------------------------------------------------ */
/*  All States — matrix: rows = variants, columns = states             */
/* ------------------------------------------------------------------ */

const VARIANTS: AccordionItemStyle[] = [
  'background-01',
  'background-02',
  'border',
  'line',
];

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {VARIANTS.map((variant) => (
        <div key={variant}>
          <p style={{ marginBottom: 12, fontWeight: 600, fontFamily: 'system-ui' }}>
            {variant}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Collapsed states */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ width: 288 }}>
                <p style={{ fontSize: 11, marginBottom: 4, color: '#666' }}>
                  Enabled (collapsed)
                </p>
                <AccordionItem
                  id={`${variant}-enabled-c`}
                  title="Title"
                  description={LOREM}
                  variant={variant}
                />
              </div>
              <div style={{ width: 288 }}>
                <p style={{ fontSize: 11, marginBottom: 4, color: '#666' }}>
                  Hovered (collapsed)
                </p>
                <AccordionItem
                  id={`${variant}-hovered-c`}
                  title="Title"
                  description={LOREM}
                  variant={variant}
                />
              </div>
              <div style={{ width: 288 }}>
                <p style={{ fontSize: 11, marginBottom: 4, color: '#666' }}>
                  Disabled (collapsed)
                </p>
                <AccordionItem
                  id={`${variant}-disabled-c`}
                  title="Title"
                  description={LOREM}
                  variant={variant}
                  disabled
                />
              </div>
              <div style={{ width: 288 }}>
                <p style={{ fontSize: 11, marginBottom: 4, color: '#666' }}>
                  Skeleton (collapsed)
                </p>
                <AccordionItem
                  id={`${variant}-skeleton-c`}
                  title="Title"
                  description={LOREM}
                  variant={variant}
                  skeleton
                />
              </div>
            </div>

            {/* Expanded states */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ width: 288 }}>
                <p style={{ fontSize: 11, marginBottom: 4, color: '#666' }}>
                  Enabled (expanded)
                </p>
                <AccordionItem
                  id={`${variant}-enabled-e`}
                  title="Title"
                  description={LOREM}
                  variant={variant}
                  expanded
                />
              </div>
              <div style={{ width: 288 }}>
                <p style={{ fontSize: 11, marginBottom: 4, color: '#666' }}>
                  Hovered (expanded)
                </p>
                <AccordionItem
                  id={`${variant}-hovered-e`}
                  title="Title"
                  description={LOREM}
                  variant={variant}
                  expanded
                />
              </div>
              <div style={{ width: 288 }}>
                <p style={{ fontSize: 11, marginBottom: 4, color: '#666' }}>
                  Disabled (expanded)
                </p>
                <AccordionItem
                  id={`${variant}-disabled-e`}
                  title="Title"
                  description={LOREM}
                  variant={variant}
                  disabled
                  expanded
                />
              </div>
              <div style={{ width: 288 }}>
                <p style={{ fontSize: 11, marginBottom: 4, color: '#666' }}>
                  Skeleton (expanded)
                </p>
                <AccordionItem
                  id={`${variant}-skeleton-e`}
                  title="Title"
                  description={LOREM}
                  variant={variant}
                  skeleton
                  expanded
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
};
