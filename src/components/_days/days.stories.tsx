import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Days } from './Days';
import type { DaysProps, DaysState } from './days.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → _Days (node 6607:12895)
 * State (7) × Today (boolean) = 14 combinations — every one is rendered in `FigmaMatrix`.
 */

const STATES: DaysState[] = ['enabled', 'hovered', 'pressed', 'focused', 'selected', 'in-range', 'disabled'];
const stateLabel: Record<DaysState, string> = {
  enabled: 'Enabled',
  hovered: 'Hovered',
  pressed: 'Pressed',
  focused: 'Focused',
  selected: 'Selected',
  'in-range': 'In range',
  disabled: 'Disabled',
};

/** Props for one Figma variant. */
function variantProps(state: DaysState, today: boolean): Omit<DaysProps, 'children'> {
  return {
    today,
    selected: state === 'selected',
    inRange: state === 'in-range',
    disabled: state === 'disabled',
    'data-state': state === 'hovered' || state === 'pressed' || state === 'focused' ? state : undefined,
  };
}

/* ── Layout helpers (story-only) ── */

const CELL_WIDTH = 52;
const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 8, verticalAlign: 'middle', width: CELL_WIDTH };
const headCell: React.CSSProperties = {
  padding: 8,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

/* ------------------------------------------------------------------ */

const meta: Meta<typeof Days> = {
  title: 'Private/_Days',
  component: Days,
  parameters: {
    docs: {
      description: {
        component:
          'Private calendar cell used by `Calendar` for days, months and years. 52px cell with a 50×50 picker; ' +
          'Selected = brand fill, In range = layer-selected fill, Today = 24×2 indicator under the label.',
      },
    },
  },
  argTypes: {
    children: { control: 'text' },
    selected: { control: 'boolean' },
    inRange: { name: 'In range', control: 'boolean' },
    today: { name: 'Today', control: 'boolean' },
    disabled: { control: 'boolean' },
    'data-state': { name: 'Forced state', control: 'inline-radio', options: [undefined, 'hovered', 'pressed', 'focused'] },
  },
  args: { children: '1', onClick: fn() },
  decorators: [
    (Story) => (
      <div style={{ padding: 16, width: CELL_WIDTH }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Days>;

export const Default: Story = {};

/* ── One story per Figma State ── */

export const Enabled: Story = { name: 'State: Enabled' };
export const Hovered: Story = { name: 'State: Hovered', args: { 'data-state': 'hovered' } };
export const Pressed: Story = { name: 'State: Pressed', args: { 'data-state': 'pressed' } };
export const Focused: Story = { name: 'State: Focused', args: { 'data-state': 'focused' } };
export const Selected: Story = { name: 'State: Selected', args: { selected: true } };
export const InRange: Story = { name: 'State: In range', args: { inRange: true } };
export const Disabled: Story = { name: 'State: Disabled', args: { disabled: true } };
export const Today: Story = { name: 'Today: True', args: { today: true } };
export const TodaySelected: Story = { name: 'Today: True, State: Selected', args: { today: true, selected: true } };

/* ── All states (Today false / true rows) ── */

const Matrix = () => (
  <table style={table}>
    <thead>
      <tr>
        <th style={headCell} />
        {STATES.map((s) => (
          <th key={s} style={headCell}>
            {stateLabel[s]}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {[false, true].map((today) => (
        <tr key={String(today)}>
          <th style={headCell}>{`Today=${today ? 'True' : 'False'}`}</th>
          {STATES.map((s) => (
            <td key={s} style={cell}>
              <Days {...variantProps(s, today)}>1</Days>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export const AllStates: Story = {
  decorators: [(Story) => <div style={{ padding: 16 }}><Story /></div>],
  render: () => <Matrix />,
};

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 7 states × Today)',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ padding: 24 }}>
      <Matrix />
    </div>
  ),
};

/** Month and year labels as used by the Calendar's Month / Year views (90px cells). */
export const PeriodLabels: Story = {
  decorators: [(Story) => <div style={{ padding: 16 }}><Story /></div>],
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 90px)' }}>
      {['Jan', 'Feb', 'Mar', 'Apr'].map((m, i) => (
        <Days key={m} className="h-[var(--scanner-calendar-period-cell-height)]" today={i === 2} selected={i === 1}>
          {m}
        </Days>
      ))}
      {['2023', '2024', '2025', '2026'].map((y, i) => (
        <Days key={y} className="h-[var(--scanner-calendar-period-cell-height)]" inRange={i === 3} disabled={i === 0}>
          {y}
        </Days>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const ClickSelects: Story = {
  tags: ['test'],
  args: { 'aria-label': 'July 1, 2024' },
  play: async ({ args, canvasElement }) => {
    const day = within(canvasElement).getByRole('button', { name: 'July 1, 2024' });
    await userEvent.click(day);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const KeyboardActivation: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const day = within(canvasElement).getByRole('button', { name: '1' });
    await userEvent.tab();
    await expect(day).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

export const DisabledIgnoresClick: Story = {
  tags: ['test'],
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    const day = within(canvasElement).getByRole('button', { name: '1' });
    await expect(day).toBeDisabled();
    await expect(day).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(day, { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const TodayHasAriaCurrent: Story = {
  tags: ['test'],
  args: { today: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'date');
  },
};
