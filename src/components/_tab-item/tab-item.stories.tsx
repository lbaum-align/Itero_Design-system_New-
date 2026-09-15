import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { TabItem } from './TabItem';
import { Badge } from '../badge';
import type { TabItemProps } from './tab-item.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → _Tab item (node 28:1602)
 * State × Show badge — every combination is rendered in `FigmaMatrix`.
 */

const STATES = ['enabled', 'hovered', 'focused', 'selected', 'disabled'] as const;
type State = (typeof STATES)[number];
const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const stateProps = (state: State): Partial<TabItemProps> => ({
  selected: state === 'selected',
  disabled: state === 'disabled',
  'data-state': state === 'hovered' || state === 'focused' ? state : undefined,
});

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 12, verticalAlign: 'middle' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const meta: Meta<typeof TabItem> = {
  title: 'Private/_TabItem',
  component: TabItem,
  argTypes: {
    children: { name: 'Text value', control: 'text' },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    badge: { table: { disable: true } },
    'data-state': { name: 'Forced state', control: 'inline-radio', options: [undefined, 'hovered', 'focused'] },
  },
  args: { children: 'Tab item', onClick: fn() },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof TabItem>;

export const Default: Story = {};

export const Enabled: Story = {};
export const Hovered: Story = { args: { 'data-state': 'hovered' } };
export const Focused: Story = { args: { 'data-state': 'focused' } };
export const Selected: Story = { args: { selected: true } };
export const Disabled: Story = { args: { disabled: true } };
export const ShowBadge: Story = { name: 'Show badge: True', args: { badge: <Badge status="info">3</Badge> } };
export const Skeleton: Story = { name: 'Skeleton (code-only)', args: { skeleton: true } };

export const AllStates: Story = {
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          {STATES.map((s) => (
            <th key={s} style={headCell}>{label(s)}</th>
          ))}
          <th style={headCell}>Selected + Focused</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          {STATES.map((s) => (
            <td key={s} style={cell}>
              <TabItem {...stateProps(s)}>Tab item</TabItem>
            </td>
          ))}
          <td style={cell}>
            <TabItem selected data-state="focused">Tab item</TabItem>
          </td>
        </tr>
      </tbody>
    </table>
  ),
};

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all variants)',
  render: () => (
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
        {[false, true].map((b) => (
          <tr key={String(b)}>
            <th style={headCell}>{`Show badge=${b ? 'True' : 'False'}`}</th>
            {STATES.map((s) => (
              <td key={s} style={cell}>
                <TabItem {...stateProps(s)} badge={b ? <Badge status="info">3</Badge> : undefined}>
                  Tab item
                </TabItem>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const ClickAndKeyboard: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const tab = within(canvasElement).getByRole('tab', { name: 'Tab item' });
    await userEvent.click(tab);
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(3);
  },
};

export const DisabledIgnoresClick: Story = {
  tags: ['test'],
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    const tab = within(canvasElement).getByRole('tab', { name: 'Tab item' });
    await expect(tab).toBeDisabled();
    await userEvent.click(tab, { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
