import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { TabGroup } from './TabGroup';
import { TabItem } from '../_tab-item/TabItem';
import { Badge } from '../badge';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Tab group (node 25501:14769)
 * One variant (Scrollable=False). "Show previews" / "Show next" have no layers bound in Figma.
 */

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 12, verticalAlign: 'middle' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const meta: Meta<typeof TabGroup> = {
  title: 'Components/TabGroup',
  component: TabGroup,
  parameters: {
    docs: {
      description: {
        component:
          'Organises related content into views. Keyboard: Tab focuses the selected tab; Left/Right arrows move between tabs ' +
          '(skipping disabled ones); Home/End jump to the first/last tab. Not for primary navigation or step-by-step flows (use Stepper).',
      },
    },
  },
  argTypes: {
    activeIndex: { control: { type: 'number', min: 0 } },
    activationMode: { control: 'inline-radio', options: ['automatic', 'manual'] },
    children: { table: { disable: true } },
  },
  args: { onChange: fn(), 'aria-label': 'Sections' },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <TabGroup {...args}>
      <TabItem>Tab item</TabItem>
      <TabItem>Tab item</TabItem>
      <TabItem>Tab item</TabItem>
    </TabGroup>
  ),
};
export default meta;

type Story = StoryObj<typeof TabGroup>;

/** Uncontrolled — click or use arrow keys. */
export const Default: Story = {};

/** Figma "Scrollable=False" — the only variant. */
export const FigmaMatrix: Story = {
  name: 'Figma matrix (Scrollable=False)',
  args: { activeIndex: 0 },
};

const InteractiveTabs = () => {
  const [active, setActive] = useState(0);
  return (
    <TabGroup activeIndex={active} onChange={setActive} aria-label="Patient sections">
      <TabItem>Overview</TabItem>
      <TabItem>Scans</TabItem>
      <TabItem disabled>Billing</TabItem>
      <TabItem>Team</TabItem>
    </TabGroup>
  );
};

/** Controlled with `useState`; "Billing" is disabled and skipped by arrow keys. */
export const Controlled: Story = { render: () => <InteractiveTabs /> };

export const AllStates: Story = {
  render: () => (
    <table style={table}>
      <tbody>
        <tr>
          <th style={headCell}>Selected · Enabled · Hovered · Focused · Disabled</th>
          <td style={cell}>
            <TabGroup activeIndex={0} aria-label="States">
              <TabItem>Selected</TabItem>
              <TabItem>Enabled</TabItem>
              <TabItem data-state="hovered">Hovered</TabItem>
              <TabItem data-state="focused">Focused</TabItem>
              <TabItem disabled>Disabled</TabItem>
            </TabGroup>
          </td>
        </tr>
        <tr>
          <th style={headCell}>With badges</th>
          <td style={cell}>
            <TabGroup activeIndex={1} aria-label="Badges">
              <TabItem badge={<Badge status="info">2</Badge>}>Scans</TabItem>
              <TabItem badge={<Badge status="warning">5</Badge>}>Tasks</TabItem>
              <TabItem>Notes</TabItem>
            </TabGroup>
          </td>
        </tr>
      </tbody>
    </table>
  ),
};

/** Figma ships 12 item slots; long rows simply extend (Scrollable=True isn't defined). */
export const ManyTabs: Story = {
  render: (args) => (
    <TabGroup {...args}>
      {Array.from({ length: 12 }, (_, i) => (
        <TabItem key={i}>{`Tab ${i + 1}`}</TabItem>
      ))}
    </TabGroup>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const ArrowKeyNavigation: Story = {
  tags: ['test'],
  render: () => <InteractiveTabs />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [overview, scans, billing, team] = canvas.getAllByRole('tab');
    await userEvent.tab();
    await expect(overview).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(scans).toHaveFocus();
    await expect(scans).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowRight}');
    await expect(billing).not.toHaveFocus();
    await expect(team).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(overview).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(team).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{Home}');
    await expect(overview).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowLeft}');
    await expect(team).toHaveFocus();
  },
};

export const ClickSelects: Story = {
  tags: ['test'],
  render: () => <InteractiveTabs />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const scans = canvas.getByRole('tab', { name: 'Scans' });
    await userEvent.click(scans);
    await expect(scans).toHaveAttribute('aria-selected', 'true');
    await expect(scans).toHaveAttribute('tabindex', '0');
    const billing = canvas.getByRole('tab', { name: 'Billing' });
    await userEvent.click(billing, { pointerEventsCheck: 0 });
    await expect(billing).toHaveAttribute('aria-selected', 'false');
  },
};
