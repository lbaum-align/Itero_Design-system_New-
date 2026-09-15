import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { AccordionGroup } from './AccordionGroup';
import type { AccordionGroupItem } from './accordion-group.types';
import type { AccordionItemStyle } from '../_accordion-item/accordion-item.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → 02 Accordion group (node 36403:2957)
 * Style: Line, Background 01, Background 02, Border — every variant is rendered in `FigmaMatrix`.
 */

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

/* Figma group instances: four "Title" items, all collapsed */
const figmaItems: AccordionGroupItem[] = [1, 2, 3, 4].map((n) => ({ id: String(n), title: 'Title', description: LOREM }));

const defaultItems: AccordionGroupItem[] = [
  { id: '1', title: 'Section one', description: LOREM },
  { id: '2', title: 'Section two', description: LOREM },
  { id: '3', title: 'Section three', description: LOREM },
  { id: '4', title: 'Section four', description: LOREM },
];

const STYLES: AccordionItemStyle[] = ['line', 'background-01', 'background-02', 'border'];
const styleLabel: Record<AccordionItemStyle, string> = {
  'background-01': 'Background 01',
  'background-02': 'Background 02',
  border: 'Border',
  line: 'Line',
};

/* ── Layout helpers (story-only) ── */

/* Figma group is 288px wide; the accent backdrop keeps Background 01/02 fills visible */
const GROUP_WIDTH = 288;
const backdrop: React.CSSProperties = { background: 'var(--scanner-bg-accent)', padding: 24 };
const headCell: React.CSSProperties = {
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  margin: '0 0 8px',
  whiteSpace: 'nowrap',
};

/* ------------------------------------------------------------------ */

const meta: Meta<typeof AccordionGroup> = {
  title: 'Components/AccordionGroup',
  component: AccordionGroup,
  parameters: {
    docs: {
      description: {
        component:
          'Vertically stacked sections that expand and collapse. By default several sections can be open at once ' +
          '(Figma docs); set `allowMultiple={false}` for single-expand. Keyboard: Tab to a header, Enter/Space toggles, ' +
          'Arrow Up/Down move between headers, Home/End jump to the first/last header.',
      },
    },
  },
  argTypes: {
    variant: { name: 'Style', control: 'inline-radio', options: STYLES },
    allowMultiple: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    headingLevel: { control: 'select', options: [1, 2, 3, 4, 5, 6] },
  },
  args: {
    items: defaultItems,
    variant: 'background-01',
    allowMultiple: true,
    skeleton: false,
    onExpandedChange: fn(),
  },
  decorators: [
    (Story, { parameters }) => (
      <div style={backdrop}>
        <div style={{ width: (parameters.groupWidth as number | string | undefined) ?? GROUP_WIDTH }}>
          <Story />
        </div>
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof AccordionGroup>;

/* ── Default ── */

export const Default: Story = {};

/* ── Per style (Figma "Style") ── */

export const Line: Story = { name: 'Style: Line', args: { variant: 'line', defaultExpandedIds: ['1'] } };
export const Background01: Story = { name: 'Style: Background 01', args: { variant: 'background-01', defaultExpandedIds: ['1'] } };
export const Background02: Story = { name: 'Style: Background 02', args: { variant: 'background-02', defaultExpandedIds: ['1'] } };
export const Border: Story = { name: 'Style: Border', args: { variant: 'border', defaultExpandedIds: ['1'] } };

/* ── Full Figma matrix: all 4 variants side by side ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 4 variants)',
  parameters: { groupWidth: 'max-content' },
  render: () => (
    <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
      {STYLES.map((v) => (
        <div key={v} style={{ width: GROUP_WIDTH }}>
          <p style={headCell}>{`Style=${styleLabel[v]}`}</p>
          <AccordionGroup variant={v} items={figmaItems} />
        </div>
      ))}
    </div>
  ),
};

/* ── All states — every style with enabled, expanded, disabled items and skeleton ── */

const stateItems: AccordionGroupItem[] = [
  { id: 'enabled', title: 'Enabled', description: LOREM },
  { id: 'expanded', title: 'Expanded', description: LOREM },
  { id: 'disabled', title: 'Disabled', description: LOREM, disabled: true },
  { id: 'disabled-expanded', title: 'Disabled expanded', description: LOREM, disabled: true },
];

export const AllStates: Story = {
  parameters: { groupWidth: 'max-content' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {STYLES.map((v) => (
        <div key={v} style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
          <div style={{ width: GROUP_WIDTH }}>
            <p style={headCell}>{`${styleLabel[v]} — states`}</p>
            <AccordionGroup variant={v} items={stateItems} defaultExpandedIds={['expanded', 'disabled-expanded']} />
          </div>
          <div style={{ width: GROUP_WIDTH }}>
            <p style={headCell}>{`${styleLabel[v]} — skeleton`}</p>
            <AccordionGroup variant={v} items={figmaItems} skeleton defaultExpandedIds={['2']} />
          </div>
        </div>
      ))}
    </div>
  ),
};

/* ── Expand modes ── */

export const MultipleExpanded: Story = {
  name: 'Multiple expand (default)',
  args: { defaultExpandedIds: ['1', '3'] },
};

export const SingleExpand: Story = {
  name: 'Single expand',
  args: { allowMultiple: false, defaultExpandedIds: ['1'] },
};

/* ── Swap content ── */

export const WithSwapContent: Story = {
  name: 'Show swap content',
  args: {
    defaultExpandedIds: ['1'],
    items: [
      {
        id: '1',
        title: 'With swap content',
        description: LOREM,
        content: (
          <div
            style={{
              border: '1px dashed var(--scanner-border-interactive)',
              borderRadius: 'var(--scanner-radius-md)',
              padding: 'var(--scanner-spacing-5)',
              color: 'var(--scanner-text-link)',
              font: '400 14px/20px var(--scanner-font-sans)',
            }}
          >
            Swap me to any component
          </div>
        ),
      },
      { id: '2', title: 'Regular item', description: LOREM },
    ],
  },
};

/* ── Skeleton ── */

export const Skeleton: Story = { args: { skeleton: true, defaultExpandedIds: ['1'] } };

/* ── Controlled ── */

function ControlledExample() {
  const [expandedIds, setExpandedIds] = useState<string[]>(['1']);
  return (
    <div>
      <p style={headCell}>Expanded: {expandedIds.length > 0 ? expandedIds.join(', ') : 'none'}</p>
      <AccordionGroup items={defaultItems} expandedIds={expandedIds} onExpandedChange={setExpandedIds} />
    </div>
  );
}

export const Controlled: Story = { render: () => <ControlledExample /> };

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const ArrowKeyNavigation: Story = {
  tags: ['test'],
  args: {
    items: [
      { id: '1', title: 'Section one', description: LOREM },
      { id: '2', title: 'Section two', description: LOREM, disabled: true },
      { id: '3', title: 'Section three', description: LOREM },
      { id: '4', title: 'Section four', description: LOREM },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const one = canvas.getByRole('button', { name: 'Section one' });
    const three = canvas.getByRole('button', { name: 'Section three' });
    const four = canvas.getByRole('button', { name: 'Section four' });
    await userEvent.tab();
    await expect(one).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(three).toHaveFocus(); // disabled "Section two" is skipped
    await userEvent.keyboard('{End}');
    await expect(four).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(one).toHaveFocus(); // wraps
    await userEvent.keyboard('{ArrowUp}');
    await expect(four).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(one).toHaveFocus();
  },
};

export const MultipleExpandToggles: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const one = canvas.getByRole('button', { name: 'Section one' });
    const two = canvas.getByRole('button', { name: 'Section two' });
    await userEvent.click(one);
    await userEvent.click(two);
    await expect(one).toHaveAttribute('aria-expanded', 'true');
    await expect(two).toHaveAttribute('aria-expanded', 'true');
    await expect(args.onExpandedChange).toHaveBeenLastCalledWith(['1', '2']);
  },
};

export const SingleExpandCollapsesOthers: Story = {
  tags: ['test'],
  args: { allowMultiple: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const one = canvas.getByRole('button', { name: 'Section one' });
    const two = canvas.getByRole('button', { name: 'Section two' });
    await userEvent.click(one);
    await userEvent.keyboard('{ArrowDown}');
    await expect(two).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(two).toHaveAttribute('aria-expanded', 'true');
    await expect(one).toHaveAttribute('aria-expanded', 'false');
  },
};
