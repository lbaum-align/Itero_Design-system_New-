import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { IconTriggerTooltip } from './IconTriggerTooltip';
import type { TooltipAlignment, TooltipPlacement } from '../tooltip';

/*
 * Figma: "06. Scanner core 1.0.0 full" → 02 Icon trigger tooltip (node 33957:20415)
 * Placement × Alignment (× Show tooltip) — every combination is rendered in `FigmaMatrix`.
 */

const PLACEMENTS: TooltipPlacement[] = ['bottom', 'top', 'right', 'left'];
const ALIGNMENTS: TooltipAlignment[] = ['start', 'middle', 'end'];
const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* ── Layout helpers (story-only) ── */

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 8, verticalAlign: 'middle' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};
const stage: React.CSSProperties = {
  width: 320,
  height: 140,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
const sectionTitle: React.CSSProperties = {
  font: '500 16px/24px var(--scanner-font-sans)',
  color: 'var(--scanner-text-primary)',
  margin: '24px 0 8px',
};
const fieldLabel: React.CSSProperties = {
  font: '400 18px/28px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
};

/* ------------------------------------------------------------------ */

const meta: Meta<typeof IconTriggerTooltip> = {
  title: 'Components/IconTriggerTooltip',
  component: IconTriggerTooltip,
  parameters: {
    docs: {
      description: {
        component:
          'A 16px help icon that shows a tooltip on hover (after a short delay) or keyboard focus — the "explainer" next to form labels. ' +
          'Keyboard: Tab focuses the icon and shows the tooltip; Escape hides it.',
      },
    },
  },
  argTypes: {
    placement: { name: 'Placement', control: 'inline-radio', options: PLACEMENTS },
    alignment: { name: 'Alignment', control: 'inline-radio', options: ALIGNMENTS },
    open: { name: 'Show tooltip (controlled)', control: 'inline-radio', options: [undefined, true, false] },
    content: { name: 'Text value', control: 'text' },
    iconName: { control: 'select', options: ['help', 'info'] },
    disabled: { control: 'boolean' },
    delay: { control: 'number' },
    triggerLabel: { control: 'text' },
    'data-state': { name: 'Forced state', control: 'inline-radio', options: [undefined, 'focused'] },
    position: { table: { disable: true } },
  },
  args: {
    content: 'Text message',
    placement: 'bottom',
    alignment: 'middle',
    onOpenChange: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

/** Room around a single trigger for its open tooltip. */
const inStage = [(Story: React.ComponentType) => (<div style={stage}><Story /></div>)];

type Story = StoryObj<typeof IconTriggerTooltip>;

/* ── Default ── */

export const Default: Story = { decorators: inStage };

/* ── Per placement (Figma "Placement") ── */

const PlacementRow = ({ placement }: { placement: TooltipPlacement }) => (
  <table style={table}>
    <thead>
      <tr>
        {ALIGNMENTS.map((a) => (
          <th key={a} style={headCell}>{`Alignment=${label(a)}`}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      <tr>
        {ALIGNMENTS.map((a) => (
          <td key={a} style={cell}>
            <div style={stage}>
              <IconTriggerTooltip content="Text message" placement={placement} alignment={a} open />
            </div>
          </td>
        ))}
      </tr>
    </tbody>
  </table>
);


export const Bottom: Story = { name: 'Placement: Bottom', render: () => <PlacementRow placement="bottom" /> };
export const Top: Story = { name: 'Placement: Top', render: () => <PlacementRow placement="top" /> };
export const Right: Story = { name: 'Placement: Right', render: () => <PlacementRow placement="right" /> };
export const Left: Story = { name: 'Placement: Left', render: () => <PlacementRow placement="left" /> };

/* ── All states: Hidden / Visible (Figma docs) + trigger Focused / Disabled ── */

export const AllStates: Story = {
 
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          {['Hidden', 'Visible (Show tooltip)', 'Focused (forced)', 'Disabled (code-only)'].map((h) => (
            <th key={h} style={headCell}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={cell}>
            <div style={stage}>
              <IconTriggerTooltip content="Text message" open={false} />
            </div>
          </td>
          <td style={cell}>
            <div style={stage}>
              <IconTriggerTooltip content="Text message" open />
            </div>
          </td>
          <td style={cell}>
            <div style={stage}>
              <IconTriggerTooltip content="Text message" open data-state="focused" />
            </div>
          </td>
          <td style={cell}>
            <div style={stage}>
              <IconTriggerTooltip content="Text message" disabled />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  ),
};

/* ── Figma matrix: 12 variants × Show tooltip ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 12 variants)',
  parameters: { layout: 'fullscreen' },
 
  render: () => (
    <div style={{ padding: 24 }}>
      {[true, false].map((show) => (
        <section key={String(show)}>
          <h3 style={sectionTitle}>{`Show tooltip=${show ? 'True' : 'False'}`}</h3>
          <table style={table}>
            <thead>
              <tr>
                <th style={headCell} />
                {ALIGNMENTS.map((a) => (
                  <th key={a} style={headCell}>{`Alignment=${label(a)}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLACEMENTS.map((p) => (
                <tr key={p}>
                  <th style={headCell}>{`Placement=${label(p)}`}</th>
                  {ALIGNMENTS.map((a) => (
                    <td key={a} style={cell}>
                      <div style={{ ...stage, height: show ? 140 : 40 }}>
                        <IconTriggerTooltip content="Text message" placement={p} alignment={a} open={show} />
                      </div>
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

/* ── In context: explainer next to a field label ── */

export const InlineWithLabel: Story = {
  decorators: inStage,
  name: 'Explainer next to a label',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={fieldLabel}>First name</span>
      <IconTriggerTooltip content="Enter your legal first name" placement="top" alignment="start" />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const KeyboardShowsAndEscapeHides: Story = {
  tags: ['test'],
  decorators: inStage,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Help: Text message' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    const tooltip = canvas.getByRole('tooltip');
    await expect(tooltip).toHaveTextContent('Text message');
    await expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
    await expect(args.onOpenChange).toHaveBeenCalledWith(true);
    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('tooltip')).not.toBeInTheDocument();
  },
};

export const HoverShows: Story = {
  tags: ['test'],
  decorators: inStage,
  args: { delay: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(canvas.getByRole('button'));
    await expect(canvas.getByRole('tooltip')).toBeVisible();
    await userEvent.unhover(canvas.getByRole('button'));
    await expect(canvas.queryByRole('tooltip')).not.toBeInTheDocument();
  },
};

export const DisabledIsInert: Story = {
  tags: ['test'],
  decorators: inStage,
  args: { disabled: true, delay: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');
    await expect(trigger).toBeDisabled();
    await userEvent.hover(trigger, { pointerEventsCheck: 0 });
    await userEvent.tab();
    await expect(trigger).not.toHaveFocus();
    await expect(canvas.queryByRole('tooltip')).not.toBeInTheDocument();
  },
};
