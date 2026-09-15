import { describe, it, expect, vi } from 'vitest';
import { createRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextInput } from './TextInput';

const field = (container: HTMLElement) => container.querySelector('[data-part="field"]') as HTMLElement;

describe('TextInput', () => {
  it('renders a labelled text input with helper text as description', () => {
    render(<TextInput label="Email" helperText="We never share it" placeholder="you@example.com" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('placeholder', 'you@example.com');
    expect(input).toHaveAccessibleDescription('We never share it');
  });

  it('forwards the ref to the native input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextInput ref={ref} label="Name" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('merges className on the root and sets data-layer', () => {
    const { container } = render(<TextInput className="custom" layer={2} label="Name" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('custom');
    expect(root).toHaveAttribute('data-layer', '2');
    expect(field(container).className).toContain('--scanner-bg-layer-02');
  });

  it('uses layer-01 background by default', () => {
    const { container } = render(<TextInput label="Name" />);
    expect(field(container).className).toContain('--scanner-bg-layer-01');
  });

  it.each([
    ['x-large', '--scanner-text-input-height-xl'],
    ['large', '--scanner-text-input-height-lg'],
    ['medium', '--scanner-text-input-height-md'],
    ['small', '--scanner-text-input-height-sm'],
  ] as const)('applies the %s field height', (size, token) => {
    const { container } = render(<TextInput size={size} label="Name" />);
    expect(field(container).className).toContain(token);
  });

  it('shows the required asterisk and sets aria-required', () => {
    render(<TextInput label="Name" required />);
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-required', 'true');
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders the explainer tooltip trigger', () => {
    render(<TextInput label="Name" tooltip="More info" />);
    expect(screen.getByRole('button', { name: /more info/i })).toBeInTheDocument();
  });

  describe('error', () => {
    it('replaces helper with the error message and sets aria-invalid', () => {
      const { container } = render(<TextInput label="Name" helperText="Helper" error errorText="Required" />);
      const input = screen.getByLabelText('Name');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAccessibleDescription('Required');
      expect(screen.getByRole('alert')).toHaveTextContent('Required');
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
      expect(field(container).className).toContain('--scanner-border-error');
    });
  });

  describe('disabled', () => {
    it('disables the input and hides the clear button', () => {
      render(<TextInput label="Name" disabled clearable defaultValue="abc" />);
      const input = screen.getByLabelText('Name');
      expect(input).toBeDisabled();
      expect(input).toHaveAttribute('aria-disabled', 'true');
      expect(screen.queryByRole('button', { name: 'Clear input' })).not.toBeInTheDocument();
    });
  });

  describe('skeleton', () => {
    it('renders a hidden placeholder instead of an input', () => {
      const { container } = render(<TextInput label="Name" helperText="Helper" skeleton />);
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(container.querySelector('[data-skeleton]')).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('counter', () => {
    it('renders an explicit counter value', () => {
      render(<TextInput label="Name" counter="0/12" />);
      expect(screen.getByText('0/12')).toBeInTheDocument();
    });

    it('counts characters automatically with showCounter + maxLength', async () => {
      render(<TextInput label="Name" showCounter maxLength={10} />);
      expect(screen.getByText('0/10')).toBeInTheDocument();
      await userEvent.type(screen.getByLabelText('Name'), 'abc');
      expect(screen.getByText('3/10')).toBeInTheDocument();
    });
  });

  describe('clearable', () => {
    it('only shows the clear button while filled', async () => {
      render(<TextInput label="Name" clearable />);
      expect(screen.queryByRole('button', { name: 'Clear input' })).not.toBeInTheDocument();
      await userEvent.type(screen.getByLabelText('Name'), 'a');
      expect(screen.getByRole('button', { name: 'Clear input' })).toBeInTheDocument();
    });

    it('clears an uncontrolled value, fires onChange + onClear and refocuses the input', async () => {
      const onChange = vi.fn();
      const onClear = vi.fn();
      render(<TextInput label="Name" clearable defaultValue="abc" onChange={onChange} onClear={onClear} />);
      await userEvent.click(screen.getByRole('button', { name: 'Clear input' }));
      const input = screen.getByLabelText('Name');
      expect(input).toHaveValue('');
      expect(input).toHaveFocus();
      expect(onClear).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('clears a controlled value through onChange', async () => {
      const Controlled = () => {
        const [value, setValue] = useState('abc');
        return <TextInput label="Name" clearable value={value} onChange={(e) => setValue(e.target.value)} />;
      };
      render(<Controlled />);
      await userEvent.click(screen.getByRole('button', { name: 'Clear input' }));
      expect(screen.getByLabelText('Name')).toHaveValue('');
    });

    it('clears on Escape', () => {
      const onClear = vi.fn();
      render(<TextInput label="Name" clearable defaultValue="abc" onClear={onClear} />);
      const input = screen.getByLabelText('Name');
      fireEvent.keyDown(input, { key: 'Escape' });
      expect(input).toHaveValue('');
      expect(onClear).toHaveBeenCalled();
    });

    it('does not clear on Escape when not clearable', () => {
      render(<TextInput label="Name" defaultValue="abc" />);
      const input = screen.getByLabelText('Name');
      fireEvent.keyDown(input, { key: 'Escape' });
      expect(input).toHaveValue('abc');
    });
  });

  it('passes data-state to the field for forced visual states', () => {
    const { container } = render(<TextInput label="Name" data-state="focused" />);
    expect(field(container)).toHaveAttribute('data-state', 'focused');
    expect(screen.getByLabelText('Name')).not.toHaveAttribute('data-state');
  });

  it('focuses the input when the field container is pressed', () => {
    const { container } = render(<TextInput label="Name" />);
    fireEvent.mouseDown(field(container));
    expect(screen.getByLabelText('Name')).toHaveFocus();
  });

  it('is reachable with Tab', async () => {
    render(<TextInput label="Name" />);
    await userEvent.tab();
    expect(screen.getByLabelText('Name')).toHaveFocus();
  });
});
