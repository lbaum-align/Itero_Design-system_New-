import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { Calendar } from './Calendar';
import { formatDatePattern, getMonthWeeks, parseDatePattern, addMonths } from './date-utils';

/* Fixed dates: every test passes `today` and a month so nothing depends on the real clock. */
const TODAY = new Date(2024, 6, 8);
const JULY = new Date(2024, 6, 1);
const day = (name: string) => screen.getByRole('button', { name });
const key = (k: string, opts: Partial<KeyboardEventInit> = {}) =>
  fireEvent.keyDown(document.activeElement as Element, { key: k, ...opts });

describe('date-utils', () => {
  it('builds only the weeks the month needs, with empty leading/trailing cells', () => {
    const weeks = getMonthWeeks(JULY, 0);
    expect(weeks).toHaveLength(5);
    expect(weeks[0][0]).toBeNull(); // July 1, 2024 is a Monday
    expect(weeks[0][1]?.getDate()).toBe(1);
    expect(getMonthWeeks(JULY, 1)[0][0]?.getDate()).toBe(1);
  });

  it('formats and parses patterns strictly', () => {
    expect(formatDatePattern(new Date(2024, 6, 12), 'mm.dd.yyyy')).toBe('07.12.2024');
    expect(formatDatePattern(new Date(2024, 6, 12), 'yyyy-mm-dd')).toBe('2024-07-12');
    expect(parseDatePattern('07.12.2024', 'mm.dd.yyyy')).toEqual(new Date(2024, 6, 12));
    expect(parseDatePattern('7.2.2024', 'mm.dd.yyyy')).toEqual(new Date(2024, 6, 2));
    expect(parseDatePattern('31/12/2024', 'dd/mm/yyyy')).toEqual(new Date(2024, 11, 31));
    expect(parseDatePattern('02.30.2024', 'mm.dd.yyyy')).toBeNull();
    expect(parseDatePattern('07.12.24', 'mm.dd.yyyy')).toBeNull();
    expect(parseDatePattern('07-12-2024', 'mm.dd.yyyy')).toBeNull();
  });

  it('addMonths clamps to the target month length', () => {
    expect(addMonths(new Date(2024, 0, 31), 1)).toEqual(new Date(2024, 1, 29));
  });
});

describe('Calendar', () => {
  it('renders the Figma Day view: title, navigation, weekday headers and days', () => {
    render(<Calendar today={TODAY} defaultMonth={JULY} locale="en-US" />);
    expect(screen.getByText('July 2024')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous month' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next month' })).toBeInTheDocument();
    const headers = screen.getAllByRole('columnheader');
    expect(headers.map((h) => h.textContent)).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    expect(screen.getAllByRole('button', { name: /July \d+, 2024/ })).toHaveLength(31);
  });

  it('forwards the ref and merges className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Calendar ref={ref} className="custom" today={TODAY} />);
    expect(ref.current).toHaveClass('custom');
  });

  it('defaults `today` and the visible month to the current date (fake clock)', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2025, 1, 14, 15, 30));
    try {
      render(<Calendar locale="en-US" />);
      expect(screen.getByText('February 2025')).toBeInTheDocument();
      expect(day('Friday, February 14, 2025')).toHaveAttribute('aria-current', 'date');
    } finally {
      vi.useRealTimers();
    }
  });

  it('marks today with aria-current="date"', () => {
    render(<Calendar today={TODAY} defaultMonth={JULY} locale="en-US" />);
    expect(day('Monday, July 8, 2024')).toHaveAttribute('aria-current', 'date');
  });

  it('respects weekStartsOn and locale', () => {
    render(<Calendar today={TODAY} defaultMonth={JULY} locale="de-DE" weekStartsOn={1} />);
    expect(screen.getByText('Juli 2024')).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')[0]).toHaveAttribute('aria-label', 'Montag');
  });

  it('single selection: click selects, sets aria-selected and calls onChange', () => {
    const onChange = vi.fn();
    render(<Calendar today={TODAY} defaultMonth={JULY} locale="en-US" onChange={onChange} />);
    fireEvent.click(day('Friday, July 12, 2024'));
    expect(onChange).toHaveBeenCalledWith(new Date(2024, 6, 12));
    expect(day('Friday, July 12, 2024').closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'true');
    expect(day('Friday, July 12, 2024')).toHaveAttribute('data-selected', 'true');
  });

  it('controlled value is not changed internally', () => {
    const onChange = vi.fn();
    render(<Calendar today={TODAY} value={new Date(2024, 6, 3)} locale="en-US" onChange={onChange} />);
    fireEvent.click(day('Friday, July 12, 2024'));
    expect(onChange).toHaveBeenCalled();
    expect(day('Wednesday, July 3, 2024')).toHaveAttribute('data-selected', 'true');
    expect(day('Friday, July 12, 2024')).not.toHaveAttribute('data-selected');
  });

  it('range selection: start, then end (swapped when earlier), with in-range days', () => {
    const onChange = vi.fn();
    render(<Calendar mode="range" today={TODAY} defaultMonth={JULY} locale="en-US" onChange={onChange} />);
    fireEvent.click(day('Wednesday, July 24, 2024'));
    expect(onChange).toHaveBeenLastCalledWith({ start: new Date(2024, 6, 24), end: null });
    fireEvent.click(day('Friday, July 12, 2024'));
    expect(onChange).toHaveBeenLastCalledWith({ start: new Date(2024, 6, 12), end: new Date(2024, 6, 24) });
    expect(day('Monday, July 15, 2024')).toHaveAttribute('data-in-range', 'true');
    expect(day('Monday, July 15, 2024').closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'true');
    expect(day('Thursday, July 25, 2024')).not.toHaveAttribute('data-in-range');
    // a third click starts a new range
    fireEvent.click(day('Monday, July 1, 2024'));
    expect(onChange).toHaveBeenLastCalledWith({ start: new Date(2024, 6, 1), end: null });
  });

  it('range hover previews in-range days before the second click', () => {
    render(
      <Calendar mode="range" today={TODAY} locale="en-US" defaultValue={{ start: new Date(2024, 6, 10), end: null }} />,
    );
    fireEvent.mouseEnter(day('Saturday, July 13, 2024'));
    expect(day('Thursday, July 11, 2024')).toHaveAttribute('data-in-range', 'true');
  });

  it('min / max / isDateDisabled disable days and navigation', () => {
    const onChange = vi.fn();
    render(
      <Calendar
        today={TODAY}
        defaultMonth={JULY}
        locale="en-US"
        min={new Date(2024, 6, 5)}
        max={new Date(2024, 6, 28)}
        isDateDisabled={(d) => d.getDate() === 17}
        onChange={onChange}
      />,
    );
    expect(day('Thursday, July 4, 2024')).toHaveAttribute('aria-disabled', 'true');
    expect(day('Monday, July 29, 2024')).toHaveAttribute('aria-disabled', 'true');
    expect(day('Wednesday, July 17, 2024')).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(day('Wednesday, July 17, 2024'));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Previous month' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next month' })).toBeDisabled();
  });

  it('previous / next month buttons change the visible month', () => {
    const onMonthChange = vi.fn();
    render(<Calendar today={TODAY} defaultMonth={JULY} locale="en-US" onMonthChange={onMonthChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByText('August 2024')).toBeInTheDocument();
    expect(onMonthChange).toHaveBeenLastCalledWith(new Date(2024, 7, 1));
    fireEvent.click(screen.getByRole('button', { name: 'Previous month' }));
    fireEvent.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByText('June 2024')).toBeInTheDocument();
  });

  describe('keyboard (WAI-ARIA date grid)', () => {
    it('uses a roving tabindex on the selected / today / first day', () => {
      render(<Calendar today={TODAY} defaultMonth={JULY} locale="en-US" />);
      expect(day('Monday, July 8, 2024')).toHaveAttribute('tabindex', '0');
      expect(day('Tuesday, July 9, 2024')).toHaveAttribute('tabindex', '-1');
    });

    it('arrows, Home/End, PageUp/PageDown and Shift+PageUp/PageDown move focus', () => {
      render(<Calendar today={TODAY} defaultValue={new Date(2024, 6, 12)} locale="en-US" />);
      act(() => day('Friday, July 12, 2024').focus());
      key('ArrowRight');
      expect(day('Saturday, July 13, 2024')).toHaveFocus();
      key('ArrowLeft');
      key('ArrowLeft');
      expect(day('Thursday, July 11, 2024')).toHaveFocus();
      key('ArrowDown');
      expect(day('Thursday, July 18, 2024')).toHaveFocus();
      key('ArrowUp');
      expect(day('Thursday, July 11, 2024')).toHaveFocus();
      key('Home');
      expect(day('Sunday, July 7, 2024')).toHaveFocus();
      key('End');
      expect(day('Saturday, July 13, 2024')).toHaveFocus();
      key('PageDown');
      expect(day('Tuesday, August 13, 2024')).toHaveFocus();
      expect(screen.getByText('August 2024')).toBeInTheDocument();
      key('PageUp');
      key('PageUp');
      expect(day('Thursday, June 13, 2024')).toHaveFocus();
      key('PageDown', { shiftKey: true });
      expect(day('Friday, June 13, 2025')).toHaveFocus();
      key('PageUp', { shiftKey: true });
      expect(day('Thursday, June 13, 2024')).toHaveFocus();
    });

    it('crosses month boundaries with arrows and stops at min / max', () => {
      render(<Calendar today={TODAY} defaultValue={new Date(2024, 6, 31)} max={new Date(2024, 7, 2)} locale="en-US" />);
      act(() => day('Wednesday, July 31, 2024').focus());
      key('ArrowRight');
      expect(day('Thursday, August 1, 2024')).toHaveFocus();
      key('ArrowDown');
      expect(day('Friday, August 2, 2024')).toHaveFocus();
    });

    it('focus moves through disabled days (aria-disabled) without selecting them', () => {
      const onChange = vi.fn();
      render(
        <Calendar today={TODAY} defaultValue={new Date(2024, 6, 12)} isDateDisabled={(d) => d.getDate() === 13} locale="en-US" onChange={onChange} />,
      );
      act(() => day('Friday, July 12, 2024').focus());
      key('ArrowRight');
      expect(day('Saturday, July 13, 2024')).toHaveFocus();
      fireEvent.click(day('Saturday, July 13, 2024'));
      expect(onChange).not.toHaveBeenCalled();
    });

    it('autoFocus focuses the active day on mount', () => {
      render(<Calendar today={TODAY} defaultMonth={JULY} locale="en-US" autoFocus />);
      expect(day('Monday, July 8, 2024')).toHaveFocus();
    });
  });

  describe('Month and Year views (Figma Content)', () => {
    it('caret opens Year → pick year opens Month → pick month returns to Day', () => {
      const onViewChange = vi.fn();
      render(
        <Calendar today={TODAY} defaultMonth={JULY} locale="en-US" yearRange={[2015, 2030]} onViewChange={onViewChange} />,
      );
      fireEvent.click(screen.getByRole('button', { name: 'July 2024, Choose month and year' }));
      expect(onViewChange).toHaveBeenLastCalledWith('year');
      expect(screen.getAllByRole('button', { name: /^20\d\d$/ })).toHaveLength(16);
      expect(screen.getByRole('button', { name: '2024' })).toHaveAttribute('aria-current', 'date');
      fireEvent.click(screen.getByRole('button', { name: '2026' }));
      expect(onViewChange).toHaveBeenLastCalledWith('month');
      expect(screen.getAllByRole('button', { name: /2026$/ })).toHaveLength(12);
      fireEvent.click(screen.getByRole('button', { name: 'March 2026' }));
      expect(onViewChange).toHaveBeenLastCalledWith('day');
      expect(screen.getByText('March 2026')).toBeInTheDocument();
    });

    it('month view: arrows move by month / row, Escape returns to Day view', () => {
      render(<Calendar today={TODAY} defaultMonth={JULY} defaultView="month" locale="en-US" />);
      const grid = screen.getByRole('grid');
      expect(within(grid).getByRole('button', { name: 'July 2024' })).toHaveAttribute('tabindex', '0');
      act(() => within(grid).getByRole('button', { name: 'July 2024' }).focus());
      key('ArrowRight');
      expect(screen.getByRole('button', { name: 'August 2024' })).toHaveFocus();
      key('ArrowDown');
      expect(screen.getByRole('button', { name: 'December 2024' })).toHaveFocus();
      key('Home');
      expect(screen.getByRole('button', { name: 'September 2024' })).toHaveFocus();
      key('Escape');
      expect(screen.getByRole('columnheader', { name: 'Sunday' })).toBeInTheDocument();
      expect(screen.getByText('September 2024')).toBeInTheDocument();
    });

    it('month view disables months outside min / max', () => {
      render(<Calendar today={TODAY} defaultMonth={JULY} defaultView="month" min={new Date(2024, 3, 15)} locale="en-US" />);
      expect(screen.getByRole('button', { name: 'March 2024' })).toHaveAttribute('aria-disabled', 'true');
      expect(screen.getByRole('button', { name: 'April 2024' })).not.toHaveAttribute('aria-disabled');
    });
  });
});
