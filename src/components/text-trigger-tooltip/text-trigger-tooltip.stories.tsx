import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { TextTriggerTooltip } from './TextTriggerTooltip';
import type { TextTriggerTooltipPosition } from './text-trigger-tooltip.types';
import type { TooltipAlignment } from '../tooltip';

/*
 * Figma: "06. Scanner core 1.0.0 full" → 03 Text trigger tooltip (node 31059:239)
 * Position × Alignment (× Show tooltip) — every combination is rendered in `FigmaMatrix`.
 */

const POSITIONS: TextTriggerTooltipPosition[] = ['bottom', 'top'];
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

/* ------------------------------------------------------------------ */

const meta: Meta<typeof TextTriggerTooltip> = {
  title: 'Components/TextTriggerTooltip',
  component: TextTriggerTooltip,
  parameters: {
    docs: {
      description: {
        component:
          'Definition tooltip on a term inside text (labels, paragraphs, compact spaces). Opens above or below only, so it does not cover the words around it. ' +
          'Keyboard: Tab focuses the term and shows the tooltip; Escape hides it.',
      },
    },
  },
  argTypes: {
    position: { name: 'Position', control: 'inline-radio', options: POSITIONS },
    alignment: { name: 'Alignment', control: 'inline-radio', options: ALIGNMENTS },
    open: { name: 'Show tooltip (controlled)', control: 'inline-radio', options: [undefined, true, false] },
    children: { name: 'Text value', control: 'text' },
    content: { control: 'text' },
    delay: { control: 'number' },
    'data-state': { name: 'Forced state', control: 'inline-radio', options: [undefined, 'focused'] },
  },
  args: {
    children: 'Definition tooltip',
    content: 'Text message',
    position: 'bottom',
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

type Story = StoryObj<typeof TextTriggerTooltip>;

/* ── Default ── */

export const Default: Story = { decorators: inStage };

/* ── Per position (Figma "Position") ── */

const PositionRow = ({ position }: { position: TextTriggerTooltipPosition }) => (
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
              <TextTriggerTooltip content="Text message" position={position} alignment={a} open>
                Definition tooltip
              </TextTriggerTooltip>
            </div>
          </td>
        ))}
      </tr>
    </tbody>
  </table>
);

export const Bottom: Story = { name: 'Position: Bottom', render: () => <PositionRow position="bottom" /> };
export const Top: Story = { name: 'Position: Top', render: () => <PositionRow position="top" /> };

/* ── All states: Hidden / Visible (Figma docs) + Focused (forced) ── */

export const AllStates: Story = {
 
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          {['Hidden', 'Visible (Show tooltip)', 'Focused (forced)'].map((h) => (
            <th key={h} style={headCell}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {[{ open: false }, { open: true }, { open: true, 'data-state': 'focused' as const }].map((p, i) => (
            <td key={i} style={cell}>
              <div style={stage}>
                <TextTriggerTooltip content="Text message" {...p}>
                  Definition tooltip
                </TextTriggerTooltip>
              </div>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  ),
};

/* ── Figma matrix: 6 variants × Show tooltip ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 6 variants)',
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
              {POSITIONS.map((p) => (
                <tr key={p}>
                  <th style={headCell}>{`Position=${label(p)}`}</th>
                  {ALIGNMENTS.map((a) => (
                    <td key={a} style={cell}>
                      <div style={{ ...stage, height: show ? 140 : 40 }}>
                        <TextTriggerTooltip content="Text message" position={p} alignment={a} open={show}>
                          Definition tooltip
                        </TextTriggerTooltip>
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

/* ── In a paragraph (Figma docs: don't cover adjacent words) ── */

export const InlineInParagraph: Story = {
 
  render: () => (
    <p
      style={{
        maxWidth: 420,
        margin: 80,
        font: '400 14px/20px var(--scanner-font-sans)',
        color: 'var(--scanner-text-primary)',
      }}
    >
      The patient&apos;s{' '}
      <TextTriggerTooltip content="A unique identifier assigned to each patient." position="top">
        Patient ID
      </TextTriggerTooltip>{' '}
      is required for all clinical records. Please also verify the{' '}
      <TextTriggerTooltip content="International Classification of Diseases code." position="bottom">
        ICD code
      </TextTriggerTooltip>{' '}
      before submitting.
    </p>
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
    const term = canvas.getByRole('button', { name: 'Definition tooltip' });
    await userEvent.tab();
    await expect(term).toHaveFocus();
    const tooltip = canvas.getByRole('tooltip');
    await expect(term).toHaveAttribute('aria-describedby', tooltip.id);
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
    await expect(canvas.getByRole('tooltip')).toHaveTextContent('Text message');
    await userEvent.unhover(canvas.getByRole('button'));
    await expect(canvas.queryByRole('tooltip')).not.toBeInTheDocument();
  },
};
