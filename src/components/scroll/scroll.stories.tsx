import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Scroll } from './Scroll';
import { ScrollArea } from './ScrollArea';
import type { ScrollPosition } from './scroll.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Scroll (node 34025:182957, page "Logos").
 * Position: Horizontal, Vertical. No interactive states in Figma.
 */

const POSITIONS: ScrollPosition[] = ['horizontal', 'vertical'];
const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 12, verticalAlign: 'top' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};
const item: React.CSSProperties = {
  font: '400 16px/24px var(--scanner-font-sans)',
  color: 'var(--scanner-text-primary)',
  padding: '8px 12px',
  whiteSpace: 'nowrap',
};
const panel: React.CSSProperties = {
  background: 'var(--scanner-bg-elevated)',
  borderRadius: 8,
  boxShadow: 'var(--scanner-shadow-depth-01)',
  padding: 4,
};

const ITEMS = Array.from({ length: 20 }, (_, i) => `Menu item ${i + 1}`);

const meta: Meta<typeof Scroll> = {
  title: 'Components/Scroll',
  component: Scroll,
  parameters: {
    docs: {
      description: {
        component:
          '`Scroll` is the Figma scroll bar (4px track + thumb in `border-subtle`). `ScrollArea` (and the exported ' +
          '`scrollbarClassName`) applies the same look to a native scroll container, 4px from its edge.',
      },
    },
  },
  argTypes: {
    position: { name: 'Position', control: 'inline-radio', options: POSITIONS },
    thumbSize: { control: { type: 'range', min: 0.05, max: 1, step: 0.05 } },
    value: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
  },
  args: { position: 'horizontal' },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Scroll>;

export const Default: Story = {
  render: (args) => (
    <div style={args.position === 'vertical' ? { height: 84 } : { width: 108 }}>
      <Scroll {...args} />
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <div style={{ width: 108 }}>
      <Scroll position="horizontal" />
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ height: 84 }}>
      <Scroll position="vertical" />
    </div>
  ),
};

/** No interactive states in Figma — thumb at start / middle / end for both positions. */
export const AllStates: Story = {
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {[0, 0.5, 1].map((v) => (
            <th key={v} style={headCell}>{`value ${v}`}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {POSITIONS.map((p) => (
          <tr key={p}>
            <th style={headCell}>{label(p)}</th>
            {[0, 0.5, 1].map((v) => (
              <td key={v} style={cell}>
                <div style={p === 'vertical' ? { height: 84 } : { width: 108 }}>
                  <Scroll position={p} value={v} />
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/** Laid out like the Figma component set: Horizontal (108×4) above Vertical (4×84). */
export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 2 variants)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40, width: 108 }}>
      <Scroll position="horizontal" />
      <div style={{ height: 84 }}>
        <Scroll position="vertical" />
      </div>
    </div>
  ),
};

/** Native scroll container styled as Figma Scroll — e.g. a menu list. */
export const ScrollAreaVertical: Story = {
  name: 'ScrollArea: vertical (menu)',
  render: () => (
    <div style={{ ...panel, width: 220 }}>
      <ScrollArea aria-label="Menu items" style={{ maxHeight: 240 }}>
        {ITEMS.map((i) => (
          <div key={i} style={item}>
            {i}
          </div>
        ))}
      </ScrollArea>
    </div>
  ),
};

export const ScrollAreaBoth: Story = {
  name: 'ScrollArea: both axes',
  render: () => (
    <ScrollArea
      aria-label="Table"
      orientation="both"
      style={{ width: 320, height: 200, background: 'var(--scanner-bg-layer-01)' }}
    >
      <div style={{ width: 800 }}>
        {ITEMS.map((i) => (
          <div key={i} style={item}>{`${i} — wide row content that overflows horizontally`}</div>
        ))}
      </div>
    </ScrollArea>
  ),
};

/** `Scroll` driven by a custom container (hidden native bar). */
const LinkedDemo = () => {
  const [state, setState] = useState({ value: 0, size: 0.3 });
  return (
    <div style={{ ...panel, width: 220, display: 'flex', gap: 4 }}>
      <div
        id="linked-list"
        tabIndex={0}
        aria-label="Linked list"
        style={{ maxHeight: 200, overflowY: 'auto', scrollbarWidth: 'none', flex: 1 }}
        onScroll={(e) => {
          const el = e.currentTarget;
          const max = el.scrollHeight - el.clientHeight;
          setState({
            value: max > 0 ? el.scrollTop / max : 0,
            size: el.clientHeight / el.scrollHeight,
          });
        }}
      >
        {ITEMS.map((i) => (
          <div key={i} style={item}>
            {i}
          </div>
        ))}
      </div>
      <div style={{ height: 200, padding: '0 0' }}>
        <Scroll
          position="vertical"
          controls="linked-list"
          value={state.value}
          thumbSize={state.size}
        />
      </div>
    </div>
  );
};

export const LinkedToContainer: Story = { render: () => <LinkedDemo /> };

export const ScrollAreaKeyboard: Story = {
  tags: ['test'],
  render: () => (
    <ScrollArea aria-label="Menu items" style={{ maxHeight: 120, width: 200 }}>
      {ITEMS.map((i) => (
        <div key={i} style={item}>
          {i}
        </div>
      ))}
    </ScrollArea>
  ),
  play: async ({ canvasElement }) => {
    const area = within(canvasElement).getByLabelText('Menu items');
    await userEvent.tab();
    await expect(area).toHaveFocus();
    /* Focusable so keyboard users can scroll it with arrow keys / Page Down */
    await expect(area).toHaveAttribute('tabindex', '0');
  },
};
