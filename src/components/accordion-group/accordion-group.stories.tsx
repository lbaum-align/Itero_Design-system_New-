import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AccordionGroup } from './AccordionGroup';
import type { AccordionGroupItem } from './accordion-group.types';
import type { AccordionItemStyle } from '../_accordion-item/accordion-item.types';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

const defaultItems: AccordionGroupItem[] = [
  { id: '1', title: 'Section one', description: LOREM },
  { id: '2', title: 'Section two', description: LOREM },
  { id: '3', title: 'Section three', description: LOREM },
  { id: '4', title: 'Section four', description: LOREM },
];

const meta: Meta<typeof AccordionGroup> = {
  title: 'Components/AccordionGroup',
  component: AccordionGroup,
  argTypes: {
    variant: {
      control: 'select',
      options: ['background-01', 'background-02', 'border', 'line'],
    },
    allowMultiple: { control: 'boolean' },
    skeleton: { control: 'boolean' },
  },
  args: {
    items: defaultItems,
    variant: 'background-01',
    allowMultiple: false,
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

type Story = StoryObj<typeof AccordionGroup>;

/* ------------------------------------------------------------------ */
/*  Default                                                            */
/* ------------------------------------------------------------------ */

export const Default: Story = {};

/* ------------------------------------------------------------------ */
/*  Single item expanded                                               */
/* ------------------------------------------------------------------ */

export const SingleExpanded: Story = {
  args: {
    defaultExpandedIds: ['1'],
  },
};

/* ------------------------------------------------------------------ */
/*  Multiple items expanded                                            */
/* ------------------------------------------------------------------ */

export const MultipleExpanded: Story = {
  args: {
    allowMultiple: true,
    defaultExpandedIds: ['1', '3'],
  },
};

/* ------------------------------------------------------------------ */
/*  Allow multiple                                                     */
/* ------------------------------------------------------------------ */

export const AllowMultiple: Story = {
  args: {
    allowMultiple: true,
  },
};

/* ------------------------------------------------------------------ */
/*  Disabled items                                                     */
/* ------------------------------------------------------------------ */

export const DisabledItems: Story = {
  args: {
    items: [
      { id: '1', title: 'Enabled item', description: LOREM },
      { id: '2', title: 'Disabled item', description: LOREM, disabled: true },
      { id: '3', title: 'Another enabled', description: LOREM },
      { id: '4', title: 'Also disabled', description: LOREM, disabled: true },
    ],
    defaultExpandedIds: ['1', '2'],
  },
};

/* ------------------------------------------------------------------ */
/*  Nested content                                                     */
/* ------------------------------------------------------------------ */

export const NestedContent: Story = {
  args: {
    defaultExpandedIds: ['1'],
    items: [
      {
        id: '1',
        title: 'With custom content',
        content: (
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
            Custom React component here
          </div>
        ),
      },
      { id: '2', title: 'Regular item', description: LOREM },
      { id: '3', title: 'Another item', description: LOREM },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Skeleton                                                           */
/* ------------------------------------------------------------------ */

export const SkeletonState: Story = {
  args: {
    skeleton: true,
  },
};

export const SkeletonExpanded: Story = {
  args: {
    skeleton: true,
    defaultExpandedIds: ['1', '3'],
  },
};

/* ------------------------------------------------------------------ */
/*  Per-variant stories                                                */
/* ------------------------------------------------------------------ */

export const Background01: Story = {
  args: {
    variant: 'background-01',
    defaultExpandedIds: ['1'],
  },
};

export const Background02: Story = {
  args: {
    variant: 'background-02',
    defaultExpandedIds: ['1'],
  },
};

export const Border: Story = {
  args: {
    variant: 'border',
    defaultExpandedIds: ['1'],
  },
};

export const Line: Story = {
  args: {
    variant: 'line',
    defaultExpandedIds: ['1'],
  },
};

/* ------------------------------------------------------------------ */
/*  All Styles — one accordion per style variant                       */
/* ------------------------------------------------------------------ */

const ALL_VARIANTS: AccordionItemStyle[] = [
  'background-01',
  'background-02',
  'border',
  'line',
];

export const AllStyles: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {ALL_VARIANTS.map((v) => (
        <div key={v}>
          <p
            style={{
              marginBottom: 8,
              fontWeight: 600,
              fontFamily: 'system-ui',
            }}
          >
            {v}
          </p>
          <AccordionGroup
            items={defaultItems}
            variant={v}
            defaultExpandedIds={['1']}
          />
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Controlled example                                                 */
/* ------------------------------------------------------------------ */

function ControlledExample() {
  const [expandedIds, setExpandedIds] = useState<string[]>(['1']);
  return (
    <div>
      <p
        style={{
          marginBottom: 8,
          fontFamily: 'system-ui',
          fontSize: 12,
          color: '#666',
        }}
      >
        Expanded: {expandedIds.length > 0 ? expandedIds.join(', ') : 'none'}
      </p>
      <AccordionGroup
        items={defaultItems}
        variant="background-01"
        expandedIds={expandedIds}
        onExpandedChange={setExpandedIds}
        allowMultiple
      />
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
};
