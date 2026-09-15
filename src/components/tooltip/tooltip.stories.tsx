import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../button';
import { Tooltip } from './Tooltip';
import { TooltipBubble } from './TooltipBubble';
import type { TooltipAlignment, TooltipPlacement } from './tooltip.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → 01 Tooltip (node 34026:193415)
 * Placement × Alignment (× Show carret) — every combination is rendered in `FigmaMatrix`.
 */

/* Figma component-set order */
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
/** Room for an open tooltip on every side of its trigger. */
const stage: React.CSSProperties = {
  width: 360,
  height: 160,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
const sectionTitle: React.CSSProperties = {
  font: '500 16px/24px var(--scanner-font-sans)',
  color: 'var(--scanner-text-primary)',
  margin: '24px 0 8px',
};

/* ------------------------------------------------------------------ */

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component:
          'Brief, contextual, non-essential information about an element, shown on hover (after a short delay) or keyboard focus. ' +
          'Hidden by default; hides on pointer leave, blur or Escape. Do not put essential content or interactive elements in a tooltip — use a toggletip. ' +
          'The caret always points at the trigger centre; the bubble hugs its text up to 320px and wraps.',
      },
    },
  },
  argTypes: {
    placement: { name: 'Placement', control: 'inline-radio', options: PLACEMENTS },
    alignment: { name: 'Alignment', control: 'inline-radio', options: ALIGNMENTS },
    showCaret: { name: 'Show carret', control: 'boolean' },
    open: { name: 'Show tooltip (controlled)', control: 'inline-radio', options: [undefined, true, false] },
    content: { name: 'Text value', control: 'text' },
    delay: { control: 'number' },
    disabled: { control: 'boolean' },
    position: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  args: {
    content: 'Text message',
    placement: 'bottom',
    alignment: 'middle',
    showCaret: true,
    delay: 300,
    onOpenChange: fn(),
    children: (
      <Button emphasis="secondary" size="small">
        Hover or focus me
      </Button>
    ),
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

type Story = StoryObj<typeof Tooltip>;

const Trigger = ({ text = 'Trigger' }: { text?: string }) => (
  <Button emphasis="secondary" size="small">
    {text}
  </Button>
);

/* ── Default ── */

export const Default: Story = {
  decorators: [
    (Story) => (
      <div style={stage}>
        <Story />
      </div>
    ),
  ],
};

/* ── Per placement (Figma "Placement") — shown open ── */

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
              <Tooltip content="Text message" placement={placement} alignment={a} open>
                <Trigger />
              </Tooltip>
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

/* ── Per alignment (Figma "Alignment") ── */

const AlignmentColumn = ({ alignment }: { alignment: TooltipAlignment }) => (
  <table style={table}>
    <tbody>
      {PLACEMENTS.map((p) => (
        <tr key={p}>
          <th style={headCell}>{`Placement=${label(p)}`}</th>
          <td style={cell}>
            <div style={stage}>
              <Tooltip content="Text message" placement={p} alignment={alignment} open>
                <Trigger />
              </Tooltip>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export const Start: Story = { name: 'Alignment: Start', render: () => <AlignmentColumn alignment="start" /> };
export const Middle: Story = { name: 'Alignment: Middle', render: () => <AlignmentColumn alignment="middle" /> };
export const End: Story = { name: 'Alignment: End', render: () => <AlignmentColumn alignment="end" /> };

/* ── Show carret ── */

export const WithoutCaret: Story = {
  name: 'Show carret: False',
  render: () => (
    <div style={stage}>
      <Tooltip content="Text message" placement="bottom" showCaret={false} open>
        <Trigger />
      </Tooltip>
    </div>
  ),
};

/* ── All states (Figma docs: Hidden / Visible) ── */

export const AllStates: Story = {
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          <th style={headCell}>Hidden</th>
          <th style={headCell}>Visible</th>
          <th style={headCell}>Visible · Show carret=False</th>
        </tr>
      </thead>
      <tbody>
        {PLACEMENTS.map((p) => (
          <tr key={p}>
            <th style={headCell}>{label(p)}</th>
            <td style={cell}>
              <div style={stage}>
                <Tooltip content="Text message" placement={p} open={false}>
                  <Trigger />
                </Tooltip>
              </div>
            </td>
            <td style={cell}>
              <div style={stage}>
                <Tooltip content="Text message" placement={p} open>
                  <Trigger />
                </Tooltip>
              </div>
            </td>
            <td style={cell}>
              <div style={stage}>
                <Tooltip content="Text message" placement={p} showCaret={false} open>
                  <Trigger />
                </Tooltip>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Figma matrix: 12 variants × Show carret, laid out like the component set ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 12 variants)',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ padding: 24 }}>
      {[true, false].map((caret) => (
        <section key={String(caret)}>
          <h3 style={sectionTitle}>{`Show carret=${caret ? 'True' : 'False'}`}</h3>
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
                    <td key={a} style={{ ...cell, padding: '8px 24px 24px 8px' }}>
                      <TooltipBubble placement={p} alignment={a} showCaret={caret}>
                        Text message
                      </TooltipBubble>
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

/* ── Content edge cases ── */

export const LongContent: Story = {
  name: 'Overflow: long text wraps at 320px',
  render: () => (
    <div style={{ ...stage, width: 480, height: 240, alignItems: 'flex-start' }}>
      <Tooltip
        content="Try to keep the content short, ideally one or two sentences. Tooltips are meant for brief explanations or clarifications."
        placement="bottom"
        open
      >
        <Trigger text="Long text" />
      </Tooltip>
    </div>
  ),
};

export const LongWord: Story = {
  name: 'Overflow: unbroken word',
  render: () => (
    <div style={{ ...stage, width: 480, alignItems: 'flex-start' }}>
      <Tooltip content="Superlongwordwithoutanyspacesthatmustbreakatthemaximumwidth" placement="bottom" open>
        <Trigger text="Long word" />
      </Tooltip>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const HoverShowsAfterDelay: Story = {
  tags: ['test'],
  args: { delay: 300 },
  decorators: [(Story) => <div style={stage}><Story /></div>],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Hover or focus me' });
    await userEvent.hover(trigger);
    await expect(canvas.queryByRole('tooltip')).not.toBeInTheDocument();
    await waitFor(() => expect(canvas.getByRole('tooltip')).toHaveTextContent('Text message'));
    await expect(trigger).toHaveAttribute('aria-describedby', canvas.getByRole('tooltip').id);
    await expect(args.onOpenChange).toHaveBeenCalledWith(true);
    await userEvent.unhover(trigger);
    await waitFor(() => expect(canvas.queryByRole('tooltip')).not.toBeInTheDocument());
  },
};

export const FocusShowsEscapeHides: Story = {
  tags: ['test'],
  decorators: [(Story) => <div style={stage}><Story /></div>],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole('button')).toHaveFocus();
    await expect(canvas.getByRole('tooltip')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('tooltip')).not.toBeInTheDocument();
    await userEvent.tab();
    await expect(canvas.queryByRole('tooltip')).not.toBeInTheDocument();
  },
};

export const DisabledNeverShows: Story = {
  tags: ['test'],
  args: { disabled: true, delay: 0 },
  decorators: [(Story) => <div style={stage}><Story /></div>],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(canvas.getByRole('button'));
    await userEvent.tab();
    await expect(canvas.queryByRole('tooltip', { hidden: true })).not.toBeInTheDocument();
  },
};
