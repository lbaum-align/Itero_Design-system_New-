import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../button';
import { SlotContent } from '../slot-content';
import { Popover } from './Popover';
import { PopoverBubble } from './PopoverBubble';
import type { PopoverAlignment, PopoverPlacement } from './popover.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Popover (component set 33048:29710, page "Popover" 24156:42899).
 * Placement (Left, Right, Top, Bottom) × Alignment (Start, Middle, End) = 12 variants, + Show carret.
 * Docs states: Hidden (default) / Visible. Every combination is rendered in `FigmaMatrix`.
 */

/** Figma component-set row order */
const PLACEMENTS: PopoverPlacement[] = ['bottom', 'top', 'right', 'left'];
const ALIGNMENTS: PopoverAlignment[] = ['start', 'middle', 'end'];
const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 16, verticalAlign: 'middle' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};
const sectionTitle: React.CSSProperties = {
  font: '500 16px/24px var(--scanner-font-sans)',
  color: 'var(--scanner-text-primary)',
  margin: '24px 0 8px',
};
/** Figma docs place examples on a 1px dashed card; a light page colour makes the white container visible. */
const stage: React.CSSProperties = {
  background: 'var(--scanner-bg-page)',
  padding: 16,
  width: 'max-content',
};
/** Room around an anchored popover; the trigger sits where the popover has space to grow. */
const anchorCell = (
  placement: PopoverPlacement,
  alignment: PopoverAlignment = 'middle',
): React.CSSProperties => {
  const vertical = placement === 'top' || placement === 'bottom';
  const textAlign = vertical
    ? alignment === 'start'
      ? 'left'
      : alignment === 'end'
        ? 'right'
        : 'center'
    : placement === 'right'
      ? 'left'
      : 'right';
  return {
    ...cell,
    width: 360,
    height: vertical ? 150 : 110,
    textAlign,
    verticalAlign: placement === 'top' ? 'bottom' : placement === 'bottom' ? 'top' : 'middle',
    paddingTop: placement === 'top' ? 120 : 16,
    paddingBottom: placement === 'bottom' ? 120 : 16,
  };
};

const Trigger = (props: React.ComponentProps<typeof Button>) => (
  <Button emphasis="secondary" iconName="settings" iconOnly aria-label="Settings" {...props} />
);

/* ------------------------------------------------------------------ */

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Floating container with richer, interactive content anchored to a trigger (quick editing, section filters). ' +
          'Non-modal `role="dialog"`; the trigger gets `aria-haspopup="dialog"` / `aria-expanded` / `aria-controls`. ' +
          'Click mode: Enter/Space/click toggles, focus moves into the popover, Escape closes and returns focus, ' +
          'outside click or Tab-away closes. Hover mode: opens on hover or keyboard focus. ' +
          'Width hugs content up to 320px (four grid columns). Figma draws no shadow — override `--scanner-popover-shadow` if needed.',
      },
    },
  },
  argTypes: {
    placement: { name: 'Placement', control: 'inline-radio', options: PLACEMENTS },
    alignment: { name: 'Alignment', control: 'inline-radio', options: ALIGNMENTS },
    showCaret: { name: 'Show carret', control: 'boolean' },
    triggerMode: { control: 'inline-radio', options: ['click', 'hover'] },
    open: { control: 'select', options: [undefined, true, false] },
    defaultOpen: { control: 'boolean' },
    closeOnOutsideClick: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    label: { control: 'text' },
    content: { control: false },
    children: { control: false },
  },
  args: {
    placement: 'bottom',
    alignment: 'start',
    showCaret: true,
    triggerMode: 'click',
    label: 'Settings',
    content: <SlotContent />,
    children: <Trigger />,
    onOpenChange: fn(),
  },
  decorators: [
    /* Matrix stories set `parameters.matrix` and only need the page-coloured stage */
    (Story, { parameters }) => (
      <div
        style={
          parameters.matrix
            ? stage
            : { ...stage, width: '100%', minHeight: 360, padding: '160px 360px', boxSizing: 'border-box' }
        }
      >
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Popover>;

/* ── Default ── */

export const Default: Story = {};

export const Visible: Story = { name: 'State: Visible', args: { defaultOpen: true } };
export const Hidden: Story = { name: 'State: Hidden', args: { defaultOpen: false } };

/* ── Per placement (Figma "Placement") ── */

export const Bottom: Story = { args: { placement: 'bottom', defaultOpen: true } };
export const Top: Story = { args: { placement: 'top', defaultOpen: true } };
export const Right: Story = { args: { placement: 'right', defaultOpen: true } };
export const Left: Story = { args: { placement: 'left', defaultOpen: true } };

/* ── Per alignment (Figma "Alignment") ── */

export const Start: Story = { args: { alignment: 'start', defaultOpen: true } };
export const Middle: Story = { args: { alignment: 'middle', defaultOpen: true } };
export const End: Story = { args: { alignment: 'end', defaultOpen: true } };

export const WithoutCaret: Story = {
  name: 'Show carret: false',
  args: { showCaret: false, defaultOpen: true },
};

/* ── All states: Hidden / Visible × placement, anchored to a trigger like the Figma docs ── */

export const AllStates: Story = {
  parameters: { matrix: true },
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          <th style={headCell}>Hidden</th>
          {ALIGNMENTS.map((a) => (
            <th key={a} style={headCell}>{`Visible · ${label(a)}`}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {PLACEMENTS.map((p) => (
          <tr key={p}>
            <th style={headCell}>{label(p)}</th>
            <td style={anchorCell(p)}>
              <Popover placement={p} content={<SlotContent />} label="Settings">
                <Trigger />
              </Popover>
            </td>
            {ALIGNMENTS.map((a) => (
              <td key={a} style={anchorCell(p, a)}>
                <Popover
                  placement={p}
                  alignment={a}
                  content={<SlotContent />}
                  label="Settings"
                  defaultOpen
                >
                  <Trigger />
                </Popover>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Full Figma matrix: 12 variants × Show carret, laid out like the component set ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 12 variants × Show carret)',
  parameters: { matrix: true },
  render: () => (
    <div>
      {[true, false].map((caret) => (
        <section key={String(caret)}>
          <h3 style={sectionTitle}>{`Show carret = ${caret}`}</h3>
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
                    <td key={a} style={{ ...cell, padding: '16px 0' }}>
                      <PopoverBubble placement={p} alignment={a} showCaret={caret}>
                        <SlotContent />
                      </PopoverBubble>
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

/* ── Usage examples ── */

const FiltersContent = ({ onDone }: { onDone?: () => void }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 240 }}>
    <h2 id="filters-title" style={{ font: '500 18px/28px var(--scanner-font-sans)', margin: 0 }}>
      Filters
    </h2>
    <label style={{ font: '400 16px/24px var(--scanner-font-sans)', display: 'flex', gap: 8 }}>
      <input type="checkbox" /> Only my scans
    </label>
    <Button size="small" onClick={onDone}>
      Apply
    </Button>
  </div>
);

const ControlledDemo = () => {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      labelledBy="filters-title"
      content={<FiltersContent onDone={() => setOpen(false)} />}
    >
      <Button emphasis="secondary" iconName="filter">
        Filters
      </Button>
    </Popover>
  );
};

/** Controlled popover with a small form; "Apply" closes it and focus returns to the trigger. */
export const ControlledWithForm: Story = { render: () => <ControlledDemo /> };

export const HoverTrigger: Story = {
  name: 'Trigger mode: hover',
  args: { triggerMode: 'hover', content: <SlotContent>Hover or focus the trigger</SlotContent> },
};

export const LongContentWraps: Story = {
  args: {
    defaultOpen: true,
    content: (
      <p style={{ margin: 0, font: '400 16px/24px var(--scanner-font-sans)' }}>
        Popover width hugs its content and stops at 320px (four grid columns), so longer supporting
        copy wraps onto multiple lines instead of growing the container.
      </p>
    ),
  },
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const ClickOpensAndMovesFocus: Story = {
  tags: ['test'],
  args: { content: <FiltersContent /> },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Settings' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    const dialog = canvas.getByRole('dialog', { name: 'Settings' });
    await expect(dialog).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(args.onOpenChange).toHaveBeenCalledWith(true);
    await waitFor(() => expect(canvas.getByRole('checkbox')).toHaveFocus());
  },
};

export const KeyboardEscapeReturnsFocus: Story = {
  tags: ['test'],
  args: { content: <FiltersContent /> },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Settings' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('checkbox')).toHaveFocus());
    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
    await expect(trigger).toHaveFocus();
  },
};

export const OutsideClickCloses: Story = {
  tags: ['test'],
  args: { defaultOpen: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('dialog')).toBeVisible();
    await userEvent.click(canvasElement.ownerDocument.body);
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const HoverOpensAndCloses: Story = {
  tags: ['test'],
  args: { triggerMode: 'hover' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Settings' });
    await userEvent.hover(trigger);
    await expect(canvas.getByRole('dialog')).toBeVisible();
    await userEvent.unhover(trigger);
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  },
};
