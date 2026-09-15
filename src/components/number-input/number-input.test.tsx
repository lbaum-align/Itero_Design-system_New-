import { describe, it, expect, vi } from 'vitest';
import { createRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { NumberInput } from './NumberInput';

const getInput = () => screen.getByRole('spinbutton');

describe('NumberInput', () => {
  it('renders a labelled spinbutton with helper text', () => {
    render(<NumberInput label="Quantity" helperText="Between 0 and 10" defaultValue={3} min={0} max={10} />);
    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    expect(input).toHaveValue('3');
    expect(input).toHaveAttribute('aria-valuenow', '3');
    expect(input).toHaveAttribute('aria-valuemin', '0');
    expect(input).toHaveAttribute('aria-valuemax', '10');
    expect(input).toHaveAccessibleDescription('Between 0 and 10');
  });

  it('increments and decrements with the controls', () => {
    const onChange = vi.fn();
    render(<NumberInput defaultValue={1} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Increment' }));
    expect(getInput()).toHaveValue('2');
    expect(onChange).toHaveBeenLastCalledWith(2);
    fireEvent.click(screen.getByRole('button', { name: 'Decrement' }));
    fireEvent.click(screen.getByRole('button', { name: 'Decrement' }));
    expect(getInput()).toHaveValue('0');
  });

  it('keeps the controls out of the tab order', () => {
    render(<NumberInput />);
    expect(screen.getByRole('button', { name: 'Increment' })).toHaveAttribute('tabindex', '-1');
  });

  it('disables controls at min / max', () => {
    render(<NumberInput defaultValue={5} min={5} max={5} />);
    expect(screen.getByRole('button', { name: 'Decrement' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Increment' })).toBeDisabled();
  });

  it('steps with the keyboard (Arrow, Page, Home/End)', () => {
    const onChange = vi.fn();
    render(<NumberInput defaultValue={10} min={0} max={200} step={2} onChange={onChange} />);
    const input = getInput();
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input).toHaveValue('12');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input).toHaveValue('8');
    fireEvent.keyDown(input, { key: 'PageUp' });
    expect(input).toHaveValue('28');
    fireEvent.keyDown(input, { key: 'End' });
    expect(onChange).toHaveBeenLastCalledWith(200);
    fireEvent.keyDown(input, { key: 'Home' });
    expect(input).toHaveValue('0');
  });

  it('avoids floating-point artefacts with decimal steps', () => {
    render(<NumberInput defaultValue={0.1} step={0.2} />);
    fireEvent.keyDown(getInput(), { key: 'ArrowUp' });
    expect(getInput()).toHaveValue('0.3');
  });

  it('lets the field be cleared while typing and reverts empty text on blur', () => {
    const onChange = vi.fn();
    render(<NumberInput defaultValue={7} onChange={onChange} />);
    const input = getInput();
    fireEvent.change(input, { target: { value: '' } });
    expect(input).toHaveValue('');
    fireEvent.blur(input);
    expect(input).toHaveValue('7');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('emits in-range typed values and clamps out-of-range ones on blur', () => {
    const onChange = vi.fn();
    const onBlur = vi.fn();
    render(<NumberInput defaultValue={1} min={0} max={50} onChange={onChange} onBlur={onBlur} />);
    const input = getInput();
    fireEvent.change(input, { target: { value: '42' } });
    expect(onChange).toHaveBeenLastCalledWith(42);
    fireEvent.change(input, { target: { value: '75' } });
    expect(input).toHaveValue('75');
    expect(onChange).toHaveBeenCalledTimes(1);
    fireEvent.blur(input);
    expect(input).toHaveValue('50');
    expect(onChange).toHaveBeenLastCalledWith(50);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('rejects non-numeric characters', () => {
    render(<NumberInput defaultValue={1} />);
    fireEvent.change(getInput(), { target: { value: '1a' } });
    expect(getInput()).toHaveValue('1');
  });

  it('works controlled', () => {
    function Controlled() {
      const [v, setV] = useState(3);
      return <NumberInput value={v} onChange={setV} helperText={`v=${v}`} />;
    }
    render(<Controlled />);
    fireEvent.click(screen.getByRole('button', { name: 'Increment' }));
    expect(screen.getByText('v=4')).toBeInTheDocument();
    expect(getInput()).toHaveValue('4');
  });

  it('calls a consumer onKeyDown and respects preventDefault', () => {
    const onKeyDown = vi.fn((e: React.KeyboardEvent) => e.preventDefault());
    render(<NumberInput defaultValue={1} onKeyDown={onKeyDown} />);
    fireEvent.keyDown(getInput(), { key: 'ArrowUp' });
    expect(onKeyDown).toHaveBeenCalled();
    expect(getInput()).toHaveValue('1');
  });

  describe('states', () => {
    it('disabled: disables input and controls, no stepping', () => {
      const onChange = vi.fn();
      render(<NumberInput label="Qty" helperText="Help" disabled onChange={onChange} />);
      const input = getInput();
      expect(input).toBeDisabled();
      expect(input).toHaveAttribute('aria-disabled', 'true');
      expect(screen.getByRole('button', { name: 'Increment' })).toBeDisabled();
      fireEvent.keyDown(input, { key: 'ArrowUp' });
      expect(onChange).not.toHaveBeenCalled();
      expect(screen.getByText('Qty').className).toContain('--scanner-text-disabled');
    });

    it('readOnly: controls disabled, keyboard ignored', () => {
      render(<NumberInput defaultValue={1} readOnly />);
      fireEvent.keyDown(getInput(), { key: 'ArrowUp' });
      expect(getInput()).toHaveValue('1');
      expect(screen.getByRole('button', { name: 'Increment' })).toBeDisabled();
    });

    it('error: aria-invalid, error message replaces helper', () => {
      render(<NumberInput helperText="Help" error errorText="Too many" />);
      const input = getInput();
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAccessibleDescription('Too many');
      expect(screen.queryByText('Help')).not.toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent('Too many');
    });

    it('skeleton: hidden placeholder with label, field and helper boxes', () => {
      const { container } = render(<NumberInput skeleton label="Qty" helperText="Help" size="small" />);
      expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
      const root = container.querySelector('[data-skeleton]');
      expect(root).toHaveAttribute('aria-hidden', 'true');
      expect(root?.querySelectorAll('.animate-pulse')).toHaveLength(3);
      expect(root?.innerHTML).toContain('--scanner-number-input-height-sm');
    });

    it('forced focused state goes on the field', () => {
      const { container } = render(<NumberInput data-state="focused" />);
      const field = container.querySelector('[data-part="field"]');
      expect(field).toHaveAttribute('data-state', 'focused');
      expect(field?.className).toContain('data-[state=focused]:shadow-[inset_0_0_0_1px_var(--scanner-border-focus)]');
    });
  });

  it.each([
    ['x-large', '--scanner-number-input-height-xl', '--scanner-number-input-icon-size-xl'],
    ['large', '--scanner-number-input-height-lg', '--scanner-number-input-icon-size'],
    ['medium', '--scanner-number-input-height-md', '--scanner-number-input-icon-size'],
    ['small', '--scanner-number-input-height-sm', '--scanner-number-input-icon-size'],
  ] as const)('applies %s field height and icon size', (size, height, icon) => {
    const { container } = render(<NumberInput size={size} />);
    expect(container.querySelector('[data-part="field"]')?.className).toContain(height);
    const svg = screen.getByRole('button', { name: 'Increment' }).querySelector('svg');
    expect(svg?.getAttribute('class')).toContain(icon);
  });

  it('uses the layer background', () => {
    const { container } = render(<NumberInput layer={2} />);
    expect(container.firstElementChild).toHaveAttribute('data-layer', '2');
    expect(container.querySelector('[data-part="field"]')?.className).toContain('--scanner-bg-layer-02');
  });

  it('hides controls with showControls={false}', () => {
    render(<NumberInput showControls={false} />);
    expect(screen.queryByRole('button', { name: 'Increment' })).not.toBeInTheDocument();
  });

  it('shows the explainer only with showExplainer + explainerText', () => {
    const { rerender } = render(<NumberInput label="Qty" explainerText="More info" />);
    expect(screen.queryByRole('button', { name: /Help/ })).not.toBeInTheDocument();
    rerender(<NumberInput label="Qty" showExplainer explainerText="More info" />);
    expect(screen.getByRole('button', { name: 'Help: More info' })).toBeInTheDocument();
  });

  it('forwards the ref, merges className and accepts an id', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(<NumberInput ref={ref} id="qty" className="custom" label="Qty" />);
    expect(ref.current).toBe(getInput());
    expect(ref.current).toHaveAttribute('id', 'qty');
    expect(container.firstElementChild).toHaveClass('custom');
  });
});
