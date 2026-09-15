import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { CheckboxItem } from './CheckboxItem';
import { CheckboxGroupContext } from './checkbox-group-context';

describe('CheckboxItem', () => {
  it('renders a native checkbox labelled by the value text', () => {
    render(<CheckboxItem label="Upper jaw" />);
    expect(screen.getByRole('checkbox', { name: 'Upper jaw' })).not.toBeChecked();
  });

  it('forwards the ref to the input and merges className on the root', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(<CheckboxItem ref={ref} label="A" className="custom" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('maps checked values (boolean and Figma names) to the input state', () => {
    const { rerender } = render(<CheckboxItem label="A" checked />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    rerender(<CheckboxItem label="A" checked="unselected" />);
    expect(checkbox).not.toBeChecked();
    rerender(<CheckboxItem label="A" checked="indeterminate" />);
    expect(checkbox).toBePartiallyChecked();
    expect((checkbox as HTMLInputElement).indeterminate).toBe(true);
    rerender(<CheckboxItem label="A" checked="selected" />);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    expect((checkbox as HTMLInputElement).indeterminate).toBe(false);
  });

  it('renders the matching indicator glyph', () => {
    const { container, rerender } = render(<CheckboxItem label="A" checked="selected" />);
    expect(container.querySelector('[data-glyph]')).toHaveAttribute('data-glyph', 'selected');
    rerender(<CheckboxItem label="A" checked="indeterminate" />);
    expect(container.querySelector('[data-glyph]')).toHaveAttribute('data-glyph', 'indeterminate');
  });

  it('controlled: calls onChange with the next value', () => {
    const onChange = vi.fn();
    render(<CheckboxItem label="A" checked={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('indeterminate resolves to selected', () => {
    const onChange = vi.fn();
    render(<CheckboxItem label="A" checked="indeterminate" onChange={onChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('uncontrolled: toggles its own state, starting from defaultChecked', () => {
    render(<CheckboxItem label="A" defaultChecked />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    fireEvent.click(screen.getByText('A'));
    expect(checkbox).not.toBeChecked();
  });

  it('toggles with Enter (Figma keyboard spec)', () => {
    const onChange = vi.fn();
    render(<CheckboxItem label="A" onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole('checkbox'), { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('disabled: sets disabled + aria-disabled and ignores interaction', () => {
    const onChange = vi.fn();
    render(<CheckboxItem label="A" disabled onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(checkbox);
    fireEvent.keyDown(checkbox, { key: 'Enter' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('inherits disabled from a checkbox group', () => {
    render(
      <CheckboxGroupContext.Provider value={{ disabled: true }}>
        <CheckboxItem label="A" />
      </CheckboxGroupContext.Provider>,
    );
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('hidden value text keeps an accessible name', () => {
    render(<CheckboxItem label="Upper jaw" showLabel={false} />);
    expect(screen.getByRole('checkbox', { name: 'Upper jaw' })).toBeInTheDocument();
    expect(screen.queryByText('Upper jaw')).not.toBeInTheDocument();
  });

  it('skeleton: renders a hidden placeholder without an input', () => {
    const { container } = render(<CheckboxItem label="A" skeleton />);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(container.querySelector('[data-skeleton]')).toHaveAttribute('aria-hidden', 'true');
  });

  it('passes data-state through for forced visual states', () => {
    const { container } = render(<CheckboxItem label="A" data-state="focused" />);
    expect(container.firstChild).toHaveAttribute('data-state', 'focused');
  });

  it('passes name and value to the input', () => {
    render(<CheckboxItem label="A" name="jaw" value="upper" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('name', 'jaw');
    expect(checkbox).toHaveAttribute('value', 'upper');
  });
});
