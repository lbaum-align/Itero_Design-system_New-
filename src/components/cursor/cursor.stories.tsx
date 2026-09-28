import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { Cursor } from './Cursor';
import { cursorAssets } from './cursor-assets';
import { cursorValue } from './cursor-value';
import type { CursorType } from './cursor.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Cursor (node 24097:47335, page "Logos").
 * Type (11 values). Pressed variants are separate Types in Figma, not states.
 */

/** Figma component-set order */
const TYPES = Object.keys(cursorAssets) as CursorType[];

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 8, verticalAlign: 'middle' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};
const hoverArea: React.CSSProperties = {
  width: 96,
  height: 48,
  borderRadius: 8,
  background: 'var(--scanner-bg-layer-02)',
  font: '400 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const meta: Meta<typeof Cursor> = {
  title: 'Components/Cursor',
  component: Cursor,
  parameters: {
    docs: {
      description: {
        component:
          'Figma cursors. Product code applies them with `cursorValue(type)` / `cursorStyle(type)` ' +
          '(SVG data URI + hotspot + native fallback keyword). `<Cursor>` renders the glyph inline for docs and hints.',
      },
    },
  },
  argTypes: {
    type: { name: 'Type', control: 'select', options: TYPES },
    size: { control: { type: 'number', min: 16, max: 96 } },
    label: { control: 'text' },
  },
  args: { type: 'pointer', size: 24 },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Cursor>;

export const Default: Story = {};

export const Pointer: Story = { args: { type: 'pointer' } };
export const PointerPressed: Story = { name: 'Pointer pressed', args: { type: 'pointer-pressed' } };
export const HandOpen: Story = { name: 'Hand open', args: { type: 'hand-open' } };
export const HandClosed: Story = { name: 'Hand closed', args: { type: 'hand-closed' } };
export const Text: Story = { args: { type: 'text' } };
export const TextPressed: Story = { name: 'Text pressed', args: { type: 'text-pressed' } };
export const Arrow: Story = { args: { type: 'arrow' } };
export const ArrowNotAllowed: Story = {
  name: 'Arrow not allowed',
  args: { type: 'arrow-not-allowed' },
};
export const ResizeWidth: Story = { name: 'Resize width', args: { type: 'resize-width' } };
export const ResizeHeight: Story = { name: 'Resize height', args: { type: 'resize-height' } };
export const ResizeDiagonal: Story = { name: 'Resize diagonal', args: { type: 'resize-diagonal' } };

/** Every type: glyph at 1× and 3×, hotspot, fallback, and a live area using the real CSS cursor. */
export const AllStates: Story = {
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          {['Type', '24px', '72px', 'Hotspot', 'Fallback', 'Hover to try'].map((h) => (
            <th key={h} style={headCell}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {TYPES.map((t) => (
          <tr key={t}>
            <th style={headCell}>{cursorAssets[t].figmaName}</th>
            <td style={{ ...cell, background: 'var(--scanner-bg-layer-02)' }}>
              <Cursor type={t} />
            </td>
            <td style={{ ...cell, background: 'var(--scanner-bg-layer-02)' }}>
              <Cursor type={t} size={72} />
            </td>
            <td style={headCell}>{cursorAssets[t].hotspot.join(', ')}</td>
            <td style={headCell}>{cursorAssets[t].fallback}</td>
            <td style={cell}>
              <div style={{ ...hoverArea, cursor: cursorValue(t) }} data-testid={`area-${t}`}>
                Hover
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/** Laid out like the Figma component set (24px glyphs, 40px apart). */
export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 11 variants)',
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 40,
        background: 'var(--scanner-bg-layer-02)',
        padding: 16,
        width: 'max-content',
      }}
    >
      {TYPES.map((t) => (
        <Cursor key={t} type={t} label={cursorAssets[t].figmaName} />
      ))}
    </div>
  ),
};

export const AppliesCssCursor: Story = {
  tags: ['test'],
  render: () => (
    <div data-testid="area" style={{ ...hoverArea, cursor: cursorValue('hand-open') }}>
      Drag
    </div>
  ),
  play: async ({ canvasElement }) => {
    const area = within(canvasElement).getByTestId('area');
    await expect(area.style.cursor).toContain('data:image/svg+xml');
    await expect(area.style.cursor).toContain('grab');
  },
};
