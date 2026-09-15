import { describe, it, expect, vi } from 'vitest';
import { createRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextArea } from './TextArea';

const field = (container: HTMLElement) => container.querySelector('[data-part="field"]') as HTMLElement;

describe('TextArea', () => {
  it('renders a labelled textarea with helper text as description', () => {
    render(<TextArea label="Notes" helperText="Optional" placeholder="Type" />);
    const textarea = screen.getByLabelText('Notes');
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAccessibleDescription('Optional');
  });

  it('forwards the ref to the native textarea', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<TextArea ref={ref} label="Notes" />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('merges className on the root and maps layer to the field background', () => {
    const { container } = render(<TextArea className="custom" layer={2} label="Notes" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('custom');
    expect(root).toHaveAttribute('data-layer', '2');
    expect(field(container).className).toContain('--scanner-bg-layer-02');
  });

  it('draws the subtle stroke when enabled and none when disabled', () => {
    const { container, rerender } = render(<TextArea label="Notes" />);
    expect(field(container).className).toContain('--scanner-border-subtle');
    rerender(<TextArea label="Notes" disabled />);
    expect(field(container).className).not.toContain('--scanner-border-subtle');
    expect(field(container).className).toContain('resize-none');
  });

  it('shows required asterisk and explainer', () => {
    render(<TextArea label="Notes" required tooltipContent="More info" />);
    expect(screen.getByLabelText('Notes')).toHaveAttribute('aria-required', 'true');
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('button', { name: /more info/i })).toBeInTheDocument();
  });

  it('shows the error message instead of helper and sets aria-invalid', () => {
    const { container } = render(<TextArea label="Notes" helperText="Helper" error errorText="Required" />);
    const textarea = screen.getByLabelText('Notes');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAccessibleDescription('Required');
    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    expect(field(container).className).toContain('--scanner-border-error');
  });

  it('counts characters for uncontrolled usage', async () => {
    render(<TextArea label="Notes" showCounter maxLength={50} />);
    expect(screen.getByText('0/50')).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Notes'), 'abcd');
    expect(screen.getByText('4/50')).toBeInTheDocument();
  });

  it('prefers an explicit counter value', () => {
    render(<TextArea label="Notes" counter="12/100" showCounter maxLength={50} />);
    expect(screen.getByText('12/100')).toBeInTheDocument();
  });

  describe('clear button', () => {
    it('is shown only while filled', async () => {
      render(<TextArea label="Notes" />);
      expect(screen.queryByRole('button', { name: 'Clear text' })).not.toBeInTheDocument();
      await userEvent.type(screen.getByLabelText('Notes'), 'a');
      expect(screen.getByRole('button', { name: 'Clear text' })).toBeInTheDocument();
    });

    it('is hidden when clearable is false or disabled', () => {
      const { rerender } = render(<TextArea label="Notes" defaultValue="abc" clearable={false} />);
      expect(screen.queryByRole('button', { name: 'Clear text' })).not.toBeInTheDocument();
      rerender(<TextArea label="Notes" defaultValue="abc" disabled />);
      expect(screen.queryByRole('button', { name: 'Clear text' })).not.toBeInTheDocument();
    });

    it('clears uncontrolled content and calls onClear + onChange', async () => {
      const onClear = vi.fn();
      const onChange = vi.fn();
      render(<TextArea label="Notes" defaultValue="abc" onClear={onClear} onChange={onChange} />);
      await userEvent.click(screen.getByRole('button', { name: 'Clear text' }));
      expect(screen.getByLabelText('Notes')).toHaveValue('');
      expect(screen.getByLabelText('Notes')).toHaveFocus();
      expect(onClear).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('clears controlled content', async () => {
      const Controlled = () => {
        const [value, setValue] = useState('abc');
        return <TextArea label="Notes" value={value} onChange={(e) => setValue(e.target.value)} />;
      };
      render(<Controlled />);
      await userEvent.click(screen.getByRole('button', { name: 'Clear text' }));
      expect(screen.getByLabelText('Notes')).toHaveValue('');
    });
  });

  it('renders a hidden skeleton', () => {
    const { container } = render(<TextArea label="Notes" skeleton />);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(container.querySelector('[data-skeleton]')).toHaveAttribute('aria-hidden', 'true');
  });

  it('passes data-state to the field', () => {
    const { container } = render(<TextArea label="Notes" data-state="focused" />);
    expect(field(container)).toHaveAttribute('data-state', 'focused');
  });

  it('focuses the textarea when the field container is pressed', () => {
    const { container } = render(<TextArea label="Notes" />);
    fireEvent.mouseDown(field(container));
    expect(screen.getByLabelText('Notes')).toHaveFocus();
  });
});
