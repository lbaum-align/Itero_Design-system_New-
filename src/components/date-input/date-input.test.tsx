import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { DateInput } from './DateInput';

describe('DateInput', () => {
  it('renders a labelled text input with the date placeholder and helper', () => {
    render(<DateInput label="Birth date" helperText="Format: MM/DD/YYYY" />);
    const input = screen.getByRole('textbox', { name: 'Birth date' });
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('placeholder', 'mm / dd / yyyy');
    expect(input).toHaveAccessibleDescription('Format: MM/DD/YYYY');
  });

  it('renders no label or helper when no text is given', () => {
    const { container } = render(<DateInput />);
    expect(container.querySelector('label')).not.toBeInTheDocument();
    expect(container.querySelector('[data-part="helper"]')).not.toBeInTheDocument();
  });

  it('hides label and helper with showLabel / showHelper false', () => {
    render(<DateInput label="Date" helperText="Help" showLabel={false} showHelper={false} aria-label="Date" />);
    expect(screen.queryByText('Help')).not.toBeInTheDocument();
    expect(document.querySelector('label')).not.toBeInTheDocument();
  });

  it('fires onChange while typing (Filled derives from the value)', () => {
    const onChange = vi.fn();
    render(<DateInput label="Date" onChange={onChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '07.12.2024' } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('07.12.2024');
  });

  it('shows the required indicator', () => {
    const { container } = render(<DateInput label="Date" required />);
    const input = screen.getByRole('textbox', { name: 'Date' });
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(container.querySelector('span[aria-hidden="true"]')).toHaveTextContent('*');
  });

  it('shows the explainer only with showExplainer + explainerText', () => {
    const { rerender } = render(<DateInput label="Date" explainerText="Info" />);
    expect(screen.queryByRole('button', { name: 'Help: Info' })).not.toBeInTheDocument();
    rerender(<DateInput label="Date" showExplainer explainerText="Info" />);
    expect(screen.getByRole('button', { name: 'Help: Info' })).toBeInTheDocument();
  });

  describe('states', () => {
    it('error: aria-invalid and error message replaces helper', () => {
      render(<DateInput label="Date" helperText="Help" error errorText="Invalid date" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAccessibleDescription('Invalid date');
      expect(screen.queryByText('Help')).not.toBeInTheDocument();
      expect(document.querySelector('[data-part="field"]')?.className).toContain('--scanner-border-error');
    });

    it('disabled: disabled input, disabled label and helper colours', () => {
      render(<DateInput label="Date" helperText="Help" disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
      expect(input).toHaveAttribute('aria-disabled', 'true');
      expect(screen.getByText('Date').className).toContain('--scanner-text-disabled');
      expect(screen.getByText('Help').className).toContain('--scanner-text-disabled');
    });

    it('skeleton: hidden placeholder with label, field and helper boxes', () => {
      const { container } = render(<DateInput skeleton label="Date" helperText="Help" size="small" />);
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      const root = container.querySelector('[data-skeleton]');
      expect(root).toHaveAttribute('aria-hidden', 'true');
      expect(root?.querySelectorAll('.animate-pulse')).toHaveLength(3);
      expect(root?.innerHTML).toContain('--scanner-date-input-height-sm');
    });

    it('forced focused state goes on the field', () => {
      const { container } = render(<DateInput data-state="focused" />);
      const field = container.querySelector('[data-part="field"]');
      expect(field).toHaveAttribute('data-state', 'focused');
      expect(field?.className).toContain('focus-within:shadow-[inset_0_0_0_1px_var(--scanner-border-focus)]');
    });
  });

  it.each([
    ['large', '--scanner-date-input-height-lg', 'p-[var(--scanner-spacing-5)]'],
    ['medium', '--scanner-date-input-height-md', 'px-[var(--scanner-spacing-4)]'],
    ['small', '--scanner-date-input-height-sm', 'px-[var(--scanner-spacing-3)]'],
  ] as const)('applies %s field height and padding', (size, height, padding) => {
    const { container } = render(<DateInput size={size} />);
    const cls = container.querySelector('[data-part="field"]')?.className ?? '';
    expect(cls).toContain(height);
    expect(cls).toContain(padding);
  });

  it('uses the layer background', () => {
    const { container } = render(<DateInput layer={2} />);
    expect(container.firstElementChild).toHaveAttribute('data-layer', '2');
    expect(container.querySelector('[data-part="field"]')?.className).toContain('--scanner-bg-layer-02');
  });

  it('focuses the input when the field container is pressed', () => {
    const { container } = render(<DateInput label="Date" />);
    fireEvent.mouseDown(container.querySelector('[data-part="field"]') as Element);
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('merges aria-describedby, forwards the ref and merges className', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(
      <DateInput ref={ref} id="d" label="Date" helperText="Help" aria-describedby="extra" className="custom" />,
    );
    expect(ref.current).toBe(screen.getByRole('textbox'));
    expect(ref.current).toHaveAttribute('aria-describedby', 'extra d-helper');
    expect(container.firstElementChild).toHaveClass('custom');
  });
});
