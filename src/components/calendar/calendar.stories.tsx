import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Calendar } from './Calendar';
import type { CalendarView, DateRange } from './calendar.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → 02 Calendar (node 20628:32152)
 * Content = Day, Month, Year — every variant is rendered in `FigmaMatrix` with the Figma data (July 2024, today = July 8).
 * Stories pass a fixed `today` so they don't depend on the current date.
 */

const FIGMA_TODAY = new Date(2024, 6, 8);
const FIGMA_MONTH = new Date(2024, 6, 1);
const VIEWS: CalendarView[] = ['day', 'month', 'year'];
const viewLabel: Record<CalendarView, string> = { day: 'Day', month: 'Month', year: 'Year' };

/* ── Layout helpers (story-only) ── */

const row: React.CSSProperties = { display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' };
const caption: React.CSSProperties = {
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  margin: '0 0 8px',
};
const output: React.CSSProperties = {
  font: '400 14px/20px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  marginTop: 12,
};

const fmt = (d: Date | null | undefined) => (d ? d.toDateString() : '—');

/* ------------------------------------------------------------------ */

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: {
    docs: {
      description: {
        component:
          'Month grid for picking a date or a date range, with Month and Year views (click the month title). ' +
          'Used by `DatePicker`. Keyboard: Tab between header buttons and the grid; arrows move by day/week; ' +
          'Home/End start/end of week; PageUp/PageDown month; Shift+PageUp/PageDown year; Enter/Space select; ' +
          'Escape returns from the Month/Year views.',
      },
    },
  },
  argTypes: {
    mode: { control: 'inline-radio', options: ['single', 'range'] },
    defaultView: { name: 'Content', control: 'inline-radio', options: VIEWS },
    locale: { control: 'select', options: [undefined, 'en-US', 'en-GB', 'de-DE', 'fr-FR', 'he-IL', 'ja-JP'] },
    weekStartsOn: { control: 'inline-radio', options: [0, 1, 6] },
    min: { control: 'date' },
    max: { control: 'date' },
    today: { control: 'date' },
  },
  args: {
    today: FIGMA_TODAY,
    defaultMonth: FIGMA_MONTH,
    locale: 'en-US',
    onChange: fn(),
    onMonthChange: fn(),
    onViewChange: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Calendar>;

/* Storybook's date control passes timestamps — normalise to Date */
const toDate = (v: Date | number | undefined) => (v === undefined ? undefined : new Date(v));

export const Default: Story = {
  render: ({ min, max, today, ...args }) => (
    <Calendar {...args} min={toDate(min)} max={toDate(max)} today={toDate(today)} />
  ),
};

/* ── Figma "Content" ── */

export const ContentDay: Story = { name: 'Content: Day' };
export const ContentMonth: Story = { name: 'Content: Month', args: { defaultView: 'month' } };
export const ContentYear: Story = { name: 'Content: Year', args: { defaultView: 'year', yearRange: [2015, 2030] } };

/* ── Selection ── */

export const SingleSelected: Story = {
  name: 'Single: selected date',
  args: { defaultValue: new Date(2024, 6, 12) },
};

const RangeDemo = () => {
  const [range, setRange] = useState<DateRange>({ start: new Date(2024, 6, 12), end: new Date(2024, 6, 24) });
  return (
    <div>
      <Calendar mode="range" value={range} onChange={setRange} today={FIGMA_TODAY} defaultMonth={FIGMA_MONTH} locale="en-US" />
      <p style={output}>{`Start: ${fmt(range.start)} · End: ${fmt(range.end)}`}</p>
    </div>
  );
};

export const RangeSelection: Story = {
  name: 'Range selection',
  parameters: { docs: { description: { story: 'Click a start and an end date; hover previews the range before the second click.' } } },
  render: () => <RangeDemo />,
};

export const MinMax: Story = {
  name: 'Min / max and disabled dates',
  args: {
    min: new Date(2024, 6, 5),
    max: new Date(2024, 7, 20),
    isDateDisabled: (d: Date) => d.getDay() === 0 || d.getDay() === 6,
  },
  parameters: {
    docs: { description: { story: 'July 5 – August 20, 2024; weekends disabled. Arrows stop at the bounds; month arrows disable.' } },
  },
};

export const Locales: Story = {
  render: () => (
    <div style={row}>
      {[
        { locale: 'en-US', weekStartsOn: 0 as const },
        { locale: 'en-GB', weekStartsOn: 1 as const },
        { locale: 'de-DE', weekStartsOn: 1 as const },
        { locale: 'fr-FR', weekStartsOn: 1 as const },
        { locale: 'he-IL', weekStartsOn: 0 as const },
        { locale: 'ja-JP', weekStartsOn: 0 as const },
      ].map((l) => (
        <div key={l.locale}>
          <p style={caption}>{`${l.locale} · weekStartsOn ${l.weekStartsOn}`}</p>
          <Calendar {...l} today={FIGMA_TODAY} defaultMonth={FIGMA_MONTH} defaultValue={new Date(2024, 6, 12)} />
        </div>
      ))}
    </div>
  ),
};

/* ── All Figma variants ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 3 variants)',
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ padding: 24 }}><Story /></div>],
  render: () => (
    <div style={row}>
      {VIEWS.map((v) => (
        <div key={v}>
          <p style={caption}>{`Content=${viewLabel[v]}`}</p>
          <Calendar
            defaultView={v}
            today={FIGMA_TODAY}
            defaultMonth={FIGMA_MONTH}
            locale="en-US"
            yearRange={[2015, 2030]}
          />
        </div>
      ))}
    </div>
  ),
};

/** Day cells in every _Days state inside a real calendar: today, selected, range, disabled, forced focus. */
export const AllStates: Story = {
  render: () => (
    <div style={row}>
      <div>
        <p style={caption}>Selected + today</p>
        <Calendar today={FIGMA_TODAY} defaultMonth={FIGMA_MONTH} defaultValue={FIGMA_TODAY} locale="en-US" />
      </div>
      <div>
        <p style={caption}>Range (start, in range, end) + disabled after the 26th</p>
        <Calendar
          mode="range"
          today={FIGMA_TODAY}
          defaultMonth={FIGMA_MONTH}
          defaultValue={{ start: new Date(2024, 6, 3), end: new Date(2024, 6, 17) }}
          max={new Date(2024, 6, 26)}
          locale="en-US"
        />
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const ClickSelectsDate: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Friday, July 12, 2024' }));
    await expect(args.onChange).toHaveBeenCalledWith(new Date(2024, 6, 12));
    await expect(canvas.getByRole('button', { name: 'Friday, July 12, 2024' }).closest('[role="gridcell"]')).toHaveAttribute(
      'aria-selected',
      'true',
    );
  },
};

export const KeyboardNavigation: Story = {
  tags: ['test'],
  args: { defaultValue: new Date(2024, 6, 12) },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab(); // previous month
    await userEvent.tab(); // month / year switch
    await userEvent.tab(); // next month
    await userEvent.tab(); // grid — selected day
    await expect(canvas.getByRole('button', { name: 'Friday, July 12, 2024' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: 'Saturday, July 13, 2024' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('button', { name: 'Saturday, July 20, 2024' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(canvas.getByRole('button', { name: 'Sunday, July 14, 2024' })).toHaveFocus();
    await userEvent.keyboard('{PageDown}');
    await expect(canvas.getByRole('button', { name: 'Wednesday, August 14, 2024' })).toHaveFocus();
    await userEvent.keyboard('{Shift>}{PageUp}{/Shift}');
    await expect(canvas.getByRole('button', { name: 'Monday, August 14, 2023' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onChange).toHaveBeenCalledWith(new Date(2023, 7, 14));
  },
};

export const MonthAndYearViews: Story = {
  tags: ['test'],
  args: { yearRange: [2015, 2030] },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /July 2024, Choose month and year/ }));
    await expect(args.onViewChange).toHaveBeenLastCalledWith('year');
    await userEvent.click(canvas.getByRole('button', { name: '2026' }));
    await expect(args.onViewChange).toHaveBeenLastCalledWith('month');
    await userEvent.click(canvas.getByRole('button', { name: 'March 2026' }));
    await expect(args.onViewChange).toHaveBeenLastCalledWith('day');
    await expect(canvas.getByRole('button', { name: /March 2026, Choose month and year/ })).toBeVisible();
  },
};

export const RangeByClicks: Story = {
  tags: ['test'],
  args: { mode: 'range' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Wednesday, July 24, 2024' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Friday, July 12, 2024' }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ start: new Date(2024, 6, 12), end: new Date(2024, 6, 24) });
  },
};

export const DisabledDatesIgnored: Story = {
  tags: ['test'],
  args: { min: new Date(2024, 6, 10) },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const day = canvas.getByRole('button', { name: 'Tuesday, July 9, 2024' });
    await expect(day).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(day);
    await expect(args.onChange).not.toHaveBeenCalled();
    await expect(canvas.getByRole('button', { name: 'Previous month' })).toBeDisabled();
  },
};
