import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { KeyboardShortcut } from './KeyboardShortcut';

/*
 * Figma: "06. Scanner core 1.0.0 full" → _Keyboard shortcut (node 30412:28270, page "Logos").
 * One component with layer toggles: glyphs Command / Option / Shift / Erase and letters X / Y / Z.
 */

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 8, verticalAlign: 'middle' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const meta: Meta<typeof KeyboardShortcut> = {
  title: 'Private/_KeyboardShortcut',
  component: KeyboardShortcut,
  parameters: {
    docs: {
      description: {
        component:
          'Key combination shown in a menu item. Modifier keys render as Figma glyphs (⌘ ⌥ ⇧ ⌫) with a screen-reader label; ' +
          'other keys render as 12/16 text. Right-aligned, no gap, no key caps.',
      },
    },
  },
  argTypes: {
    keys: { control: 'object', description: 'Keys in order' },
    disabled: { control: 'boolean' },
  },
  args: { keys: ['⌘', 'X'], disabled: false },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof KeyboardShortcut>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };

/** Every glyph layer in the Figma component, plus the letter layers. */
export const Glyphs: Story = {
  render: (args) => (
    <table style={table}>
      <tbody>
        {[
          ['Command', ['⌘']],
          ['Option', ['⌥']],
          ['Shift', ['⇧']],
          ['Erase', ['⌫']],
          ['X / Y / Z', ['X', 'Y', 'Z']],
        ].map(([name, keys]) => (
          <tr key={name as string}>
            <th style={headCell}>{name as string}</th>
            <td style={cell}>
              <KeyboardShortcut keys={keys as string[]} disabled={args.disabled} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const AllStates: Story = {
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          <th style={headCell}>Enabled</th>
          <th style={headCell}>Disabled (menu item)</th>
        </tr>
      </thead>
      <tbody>
        {[['⌘', 'X'], ['⇧', '⌘', 'Z'], ['⌥', '⌫'], ['Ctrl', '+', 'P']].map((keys) => (
          <tr key={keys.join('')}>
            <th style={headCell}>{keys.join(' ')}</th>
            <td style={cell}>
              <KeyboardShortcut keys={keys} />
            </td>
            <td style={cell}>
              <KeyboardShortcut keys={keys} disabled />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/** The single Figma variant (Command + X visible) and the combinations its hidden layers allow. */
export const FigmaMatrix: Story = {
  name: 'Figma matrix (1 component + layer options)',
  render: () => (
    <table style={table}>
      <tbody>
        <tr>
          <th style={headCell}>Figma default (⌘X)</th>
          <td style={cell}>
            <KeyboardShortcut keys={['⌘', 'X']} />
          </td>
        </tr>
        <tr>
          <th style={headCell}>All glyph layers + letters</th>
          <td style={cell}>
            <KeyboardShortcut keys={['⌘', '⌥', '⇧', '⌫', 'X', 'Y', 'Z']} />
          </td>
        </tr>
      </tbody>
    </table>
  ),
};

export const CommonShortcuts: Story = {
  render: () => (
    <table style={table}>
      <tbody>
        {(
          [
            ['Cut', ['⌘', 'X']],
            ['Copy', ['⌘', 'C']],
            ['Paste', ['⌘', 'V']],
            ['Redo', ['⇧', '⌘', 'Z']],
            ['Delete', ['⌘', '⌫']],
            ['Windows', ['Ctrl', 'Shift', 'P']],
            ['Escape', ['Esc']],
          ] as const
        ).map(([name, keys]) => (
          <tr key={name}>
            <th style={headCell}>{name}</th>
            <td style={cell}>
              <KeyboardShortcut keys={[...keys]} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const GlyphsHaveAccessibleNames: Story = {
  tags: ['test'],
  args: { keys: ['⇧', '⌘', 'Z'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Shift')).toBeInTheDocument();
    await expect(canvas.getByText('Command')).toBeInTheDocument();
    await expect(canvas.getByText('Z')).toBeVisible();
    await expect(canvasElement.querySelectorAll('svg')).toHaveLength(2);
  },
};
