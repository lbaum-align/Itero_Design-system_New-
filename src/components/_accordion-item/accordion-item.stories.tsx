import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { AccordionItem } from './AccordionItem';
import type { AccordionItemProps, AccordionItemStyle } from './accordion-item.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → _01 Accordion item (node 36403:3026)
 * Style × State × Expanded — every combination is rendered in `FigmaMatrix`.
 */

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

const STYLES: AccordionItemStyle[] = ['background-01', 'background-02', 'border', 'line'];
const STATES = ['enabled', 'hovered', 'focused', 'disabled', 'skeleton'] as const;
type State = (typeof STATES)[number];

const styleLabel: Record<AccordionItemStyle, string> = {
  'background-01': 'Background 01',
  'background-02': 'Background 02',
  border: 'Border',
  line: 'Line',
};
const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Props for one Figma variant. */
function variantProps(variant: AccordionItemStyle, state: State, expanded: boolean): AccordionItemProps {
  return {
    variant,
    expanded,
    title: 'Title',
    description: LOREM,
    disabled: state === 'disabled',
    skeleton: state === 'skeleton',
    'data-state': state === 'hovered' || state === 'focused' ? state : undefined,
  };
}

/* ── Layout helpers (story-only) ── */

/* Figma items are 288px wide; the accent backdrop keeps Background 01/02 fills visible */
const ITEM_WIDTH = 288;
const backdrop: React.CSSProperties = { background: 'var(--scanner-bg-accent)', padding: 24 };
const table: React.CSSProperties = { borderCollapse: 'separate', borderSpacing: 16, width: 'max-content' };
const cell: React.CSSProperties = { width: ITEM_WIDTH, verticalAlign: 'top' };
const headCell: React.CSSProperties = {
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
  verticalAlign: 'top',
};
const sectionTitle: React.CSSProperties = {
  font: '500 16px/24px var(--scanner-font-sans)',
  color: 'var(--scanner-text-primary)',
  margin: '8px 16px 0',
};

/* ------------------------------------------------------------------ */

const meta: Meta<typeof AccordionItem> = {
  title: 'Private/_AccordionItem',
  component: AccordionItem,
  parameters: {
    docs: {
      description: {
        component:
          'One expandable section of an `AccordionGroup`. Click anywhere in the header to toggle. ' +
          'Keyboard: Tab to focus the header, Enter/Space to expand or collapse.',
      },
    },
  },
  argTypes: {
    variant: { name: 'Style', control: 'inline-radio', options: STYLES },
    expanded: { name: 'Expanded', control: 'boolean' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    'data-state': { name: 'Forced state', control: 'inline-radio', options: [undefined, 'hovered', 'focused'] },
    title: { name: 'Title text value', control: 'text' },
    description: { name: 'Description text value', control: 'text' },
    children: { name: 'Swap content', control: false },
    headingLevel: { control: 'select', options: [1, 2, 3, 4, 5, 6] },
  },
  args: {
    title: 'Title',
    description: LOREM,
    variant: 'background-01',
    disabled: false,
    skeleton: false,
    onToggle: fn(),
  },
  decorators: [
    (Story, { parameters }) => (
      <div style={backdrop}>
        {/* Single items get the Figma width; matrices opt out with `parameters.itemWidth` */}
        <div style={{ width: (parameters.itemWidth as number | string | undefined) ?? ITEM_WIDTH }}>
          <Story />
        </div>
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof AccordionItem>;

/* ── Default (uncontrolled: click to toggle) ── */

export const Default: Story = {};

/* ── Expanded (Figma "Expanded") ── */

export const Collapsed: Story = { name: 'Expanded: False', args: { expanded: false } };
export const Expanded: Story = { name: 'Expanded: True', args: { expanded: true } };

/* ── Per style (Figma "Style") — collapsed + expanded ── */

const StylePair = ({ variant }: { variant: AccordionItemStyle }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <AccordionItem {...variantProps(variant, 'enabled', false)} />
    <AccordionItem {...variantProps(variant, 'enabled', true)} />
  </div>
);

export const Background01: Story = { name: 'Style: Background 01', render: () => <StylePair variant="background-01" /> };
export const Background02: Story = { name: 'Style: Background 02', render: () => <StylePair variant="background-02" /> };
export const Border: Story = { name: 'Style: Border', render: () => <StylePair variant="border" /> };
export const Line: Story = { name: 'Style: Line', render: () => <StylePair variant="line" /> };

/* ── Individual states — every style, collapsed ── */

const StateColumn = ({ state }: { state: State }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    {STYLES.map((s) => (
      <AccordionItem key={s} {...variantProps(s, state, false)} />
    ))}
  </div>
);

export const Hovered: Story = { render: () => <StateColumn state="hovered" /> };
export const Focused: Story = { render: () => <StateColumn state="focused" /> };
export const Disabled: Story = { render: () => <StateColumn state="disabled" /> };
export const Skeleton: Story = { render: () => <StateColumn state="skeleton" /> };

/* ── All states — style rows × state columns (uses the Expanded control) ── */

export const AllStates: Story = {
  parameters: { itemWidth: 'max-content' },
  args: { expanded: false },
  render: ({ expanded = false }) => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {STATES.map((s) => (
            <th key={s} style={headCell}>{label(s)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {STYLES.map((v) => (
          <tr key={v}>
            <th style={headCell}>{styleLabel[v]}</th>
            {STATES.map((s) => (
              <td key={s} style={cell}>
                <AccordionItem {...variantProps(v, s, expanded)} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Full Figma matrix: all 40 variants, laid out like the component set ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 40 variants)',
  parameters: { layout: 'fullscreen', itemWidth: 'max-content' },
  render: () => (
    <div>
      {STYLES.map((v) => (
        <section key={v}>
          <h3 style={sectionTitle}>{`Style=${styleLabel[v]}`}</h3>
          <table style={table}>
            <thead>
              <tr>
                <th style={headCell} />
                {STATES.map((s) => (
                  <th key={s} style={headCell}>{`State=${label(s)}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[false, true].map((expanded) => (
                <tr key={String(expanded)}>
                  <th style={headCell}>{`Expanded=${expanded ? 'True' : 'False'}`}</th>
                  {STATES.map((s) => (
                    <td key={s} style={cell}>
                      <AccordionItem {...variantProps(v, s, expanded)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  ),
};

/* ── Show swap content: slot below the description ── */

const SlotPlaceholder = () => (
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
);

export const WithSwapContent: Story = {
  name: 'Show swap content',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {STYLES.map((v) => (
        <AccordionItem key={v} variant={v} title={styleLabel[v]} description={LOREM} expanded>
          <SlotPlaceholder />
        </AccordionItem>
      ))}
    </div>
  ),
};

/* ── Overflow: long titles wrap, chevron stays centred ── */

export const LongTitleWraps: Story = {
  args: {
    title: 'How do I calibrate the scanner wand before the first scan of the day?',
    expanded: true,
  },
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const ClickToggles: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const header = within(canvasElement).getByRole('button', { name: 'Title' });
    await expect(header).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(header);
    await expect(header).toHaveAttribute('aria-expanded', 'true');
    await expect(within(canvasElement).getByRole('region', { name: 'Title' })).toBeVisible();
    await expect(args.onToggle).toHaveBeenLastCalledWith(true);
    await userEvent.click(header);
    await expect(header).toHaveAttribute('aria-expanded', 'false');
    await expect(args.onToggle).toHaveBeenLastCalledWith(false);
  },
};

export const KeyboardToggles: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const header = within(canvasElement).getByRole('button', { name: 'Title' });
    await userEvent.tab();
    await expect(header).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(header).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard(' ');
    await expect(header).toHaveAttribute('aria-expanded', 'false');
    await expect(args.onToggle).toHaveBeenCalledTimes(2);
  },
};

export const DisabledIgnoresClick: Story = {
  tags: ['test'],
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    const header = within(canvasElement).getByRole('button', { name: 'Title' });
    await expect(header).toBeDisabled();
    await expect(header).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(header, { pointerEventsCheck: 0 });
    await expect(header).toHaveAttribute('aria-expanded', 'false');
    await expect(args.onToggle).not.toHaveBeenCalled();
  },
};
