import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { DatePicker } from './DatePicker';

/* Fixed dates: `today` is passed explicitly so nothing depends on the real clock. */
const TODAY = new Date(2024, 6, 8);
const FIRST = new Date(2024, 6, 12);
const SECOND = new Date(2024, 6, 24);
const combobox = (name: string | RegExp = 'Label') => screen.getByRole('combobox', { name });
const day = (name: string) => screen.getByRole('button', { name });

describe('DatePicker', () => {
  it('renders label, placeholder (format), calendar icon and helper text', () => {
    render(<DatePicker label="Label" helperText="Optional helper text" today={TODAY} />);
    const input = combobox();
    expect(input).toHaveAttribute('placeholder', 'mm.dd.yyyy');
    expect(input).toHaveAttribute('aria-haspopup', 'dialog');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: 'Open calendar' }).querySelector('svg')).toHaveAttribute('data-icon', 'calendar');
    expect(screen.getByText('Optional helper text')).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('helper'));
  });

  it('forwards the ref to the root and merges className; sets data-layer', () => {
    const ref = createRef<HTMLDivElement>();
    render(<DatePicker ref={ref} className="custom" layer={2} label="Label" />);
    expect(ref.current).toHaveClass('custom');
    expect(ref.current).toHaveAttribute('data-layer', '2');
    expect(ref.current?.querySelector('[data-part="field"]')?.className).toContain('bg-[var(--scanner-bg-layer-02)]');
  });

  it('Selected: shows the formatted value', () => {
    render(<DatePicker label="Label" defaultValue={FIRST} />);
    expect(combobox()).toHaveValue('07.12.2024');
  });

  it('clicking the field opens the calendar at the selected month; picking a date closes it', () => {
    const onChange = vi.fn();
    const onOpenChange = vi.fn();
    render(<DatePicker label="Label" today={TODAY} locale="en-US" defaultValue={FIRST} onChange={onChange} onOpenChange={onOpenChange} />);
    fireEvent.click(combobox());
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(combobox()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('July 2024')).toBeInTheDocument();
    fireEvent.click(day('Saturday, July 20, 2024'));
    expect(onChange).toHaveBeenCalledWith(new Date(2024, 6, 20));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(combobox()).toHaveValue('07.20.2024');
    expect(combobox()).toHaveFocus();
  });

  it('ArrowDown / Enter open the calendar and move focus to the active day', () => {
    render(<DatePicker label="Label" today={TODAY} locale="en-US" defaultValue={FIRST} />);
    act(() => combobox().focus());
    fireEvent.keyDown(combobox(), { key: 'ArrowDown' });
    expect(day('Friday, July 12, 2024')).toHaveFocus();
    fireEvent.keyDown(document.activeElement as Element, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(combobox()).toHaveFocus();
    fireEvent.keyDown(combobox(), { key: 'Enter' });
    expect(day('Friday, July 12, 2024')).toHaveFocus();
  });

  it('outside pointerdown closes the panel', () => {
    render(
      <div>
        <button type="button">outside</button>
        <DatePicker label="Label" today={TODAY} defaultOpen />
      </div>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.pointerDown(screen.getByRole('button', { name: 'outside' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('tabbing out of the component closes the panel', () => {
    render(
      <div>
        <DatePicker label="Label" today={TODAY} defaultOpen />
        <button type="button">next</button>
      </div>,
    );
    fireEvent.blur(combobox(), { relatedTarget: screen.getByRole('button', { name: 'next' }) });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('typing a complete valid date commits it; invalid text reverts on blur', () => {
    const onChange = vi.fn();
    render(<DatePicker label="Label" onChange={onChange} min={new Date(2024, 0, 1)} />);
    fireEvent.change(combobox(), { target: { value: '08.03.2024' } });
    expect(onChange).toHaveBeenLastCalledWith(new Date(2024, 7, 3));
    fireEvent.change(combobox(), { target: { value: '13.40.2024' } });
    expect(onChange).toHaveBeenCalledTimes(1);
    fireEvent.change(combobox(), { target: { value: '08.03.2023' } }); // before min
    expect(onChange).toHaveBeenCalledTimes(1);
    fireEvent.blur(combobox());
    expect(combobox()).toHaveValue('08.03.2024');
    fireEvent.change(combobox(), { target: { value: '' } });
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it('supports other formats', () => {
    const onChange = vi.fn();
    render(<DatePicker label="Label" format="dd/mm/yyyy" defaultValue={FIRST} onChange={onChange} />);
    expect(combobox()).toHaveValue('12/07/2024');
    expect(combobox()).toHaveAttribute('placeholder', 'dd/mm/yyyy');
    fireEvent.change(combobox(), { target: { value: '31/12/2024' } });
    expect(onChange).toHaveBeenLastCalledWith(new Date(2024, 11, 31));
  });

  it('allowTyping=false makes the input read-only', () => {
    render(<DatePicker label="Label" allowTyping={false} />);
    expect(combobox()).toHaveAttribute('readonly');
  });

  describe('Ranged', () => {
    it('renders start → end inputs with values', () => {
      render(<DatePicker type="ranged" label="Label" defaultValue={{ start: FIRST, end: SECOND }} />);
      expect(combobox('Label, start date')).toHaveValue('07.12.2024');
      expect(combobox('Label, end date')).toHaveValue('07.24.2024');
      expect(screen.getByText('→')).toHaveAttribute('aria-hidden', 'true');
    });

    it('stays open after the first pick and closes after the second', () => {
      const onChange = vi.fn();
      render(<DatePicker type="ranged" label="Label" today={TODAY} locale="en-US" onChange={onChange} />);
      fireEvent.click(combobox('Label, start date'));
      fireEvent.click(day('Friday, July 12, 2024'));
      expect(onChange).toHaveBeenLastCalledWith({ start: FIRST, end: null });
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      fireEvent.click(day('Wednesday, July 24, 2024'));
      expect(onChange).toHaveBeenLastCalledWith({ start: FIRST, end: SECOND });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(combobox('Label, end date')).toHaveValue('07.24.2024');
    });

    it('typing into the end input updates only the end date', () => {
      const onChange = vi.fn();
      render(<DatePicker type="ranged" label="Label" defaultValue={{ start: FIRST, end: null }} onChange={onChange} />);
      fireEvent.change(combobox('Label, end date'), { target: { value: '07.24.2024' } });
      expect(onChange).toHaveBeenLastCalledWith({ start: FIRST, end: SECOND });
    });
  });

  describe('states', () => {
    it('Focused: forced data-state on the field', () => {
      const { container } = render(<DatePicker label="Label" data-state="focused" />);
      expect(container.querySelector('[data-part="field"]')).toHaveAttribute('data-state', 'focused');
    });

    it('Disabled: disables the inputs and never opens', () => {
      const onOpenChange = vi.fn();
      render(<DatePicker label="Label" disabled onOpenChange={onOpenChange} defaultOpen />);
      expect(combobox()).toBeDisabled();
      expect(combobox()).toHaveAttribute('aria-disabled', 'true');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      fireEvent.click(combobox());
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('Error: aria-invalid, error stroke and error message replaces helper', () => {
      const { container } = render(
        <DatePicker label="Label" error errorText="Error text message" helperText="Optional helper text" />,
      );
      expect(combobox()).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByRole('alert')).toHaveTextContent('Error text message');
      expect(screen.queryByText('Optional helper text')).not.toBeInTheDocument();
      expect(container.querySelector('[data-part="field"]')?.className).toContain('var(--scanner-border-error)');
    });

    it('Required: asterisk and aria-required', () => {
      render(<DatePicker label="Label" required />);
      expect(combobox()).toHaveAttribute('aria-required', 'true');
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('Skeleton: hidden placeholder, no inputs', () => {
      const { container } = render(<DatePicker label="Label" helperText="Helper" skeleton />);
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
      expect(container.querySelector('[data-skeleton]')).toHaveAttribute('aria-hidden', 'true');
    });

    it('Show label / Show helper false hide them', () => {
      render(<DatePicker label="Label" helperText="Helper" showLabel={false} showHelper={false} />);
      expect(screen.queryByText('Label')).not.toBeInTheDocument();
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    });
  });
});
