import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { RadioButtonItem } from './RadioButtonItem';

describe('RadioButtonItem', () => {
  it('renders a native radio labelled by its value', () => {
    render(<RadioButtonItem label="Email" name="contact" value="email" />);
    const radio = screen.getByRole('radio', { name: 'Email' });
    expect(radio).toHaveAttribute('type', 'radio');
    expect(radio).toHaveAttribute('name', 'contact');
    expect(radio).toHaveAttribute('value', 'email');
  });

  it('reflects `selected` as checked', () => {
    const { rerender } = render(<RadioButtonItem label="Email" selected={false} onChange={() => {}} />);
    expect(screen.getByRole('radio')).not.toBeChecked();
    rerender(<RadioButtonItem label="Email" selected onChange={() => {}} />);
    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('supports uncontrolled use via defaultSelected', () => {
    render(<RadioButtonItem label="Email" defaultSelected />);
    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('calls onChange(true, event) when the value text is clicked', () => {
    const onChange = vi.fn();
    render(<RadioButtonItem label="Email" selected={false} onChange={onChange} />);
    fireEvent.click(screen.getByText('Email'));
    expect(onChange).toHaveBeenCalledWith(true, expect.objectContaining({ type: 'change' }));
  });

  it('forwards the ref to the input and passes input props through', () => {
    const ref = createRef<HTMLInputElement>();
    const onKeyDown = vi.fn();
    render(<RadioButtonItem ref={ref} label="Email" tabIndex={-1} onKeyDown={onKeyDown} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toHaveAttribute('tabindex', '-1');
    fireEvent.keyDown(ref.current!, { key: 'ArrowDown' });
    expect(onKeyDown).toHaveBeenCalled();
  });

  it('merges className onto the root label', () => {
    const { container } = render(<RadioButtonItem label="Email" className="custom" />);
    expect(container.querySelector('label')).toHaveClass('custom');
  });

  describe('disabled', () => {
    it('sets disabled + aria-disabled and ignores clicks', () => {
      const onChange = vi.fn();
      render(<RadioButtonItem label="Email" disabled onChange={onChange} />);
      const radio = screen.getByRole('radio');
      expect(radio).toBeDisabled();
      expect(radio).toHaveAttribute('aria-disabled', 'true');
      fireEvent.click(screen.getByText('Email'));
      expect(onChange).not.toHaveBeenCalled();
    });

    it('uses disabled text colour', () => {
      render(<RadioButtonItem label="Email" disabled />);
      expect(screen.getByText('Email').className).toContain('--scanner-text-disabled');
    });
  });

  describe('Show value', () => {
    it('hides the text and falls back to aria-label', () => {
      render(<RadioButtonItem label="Email" showLabel={false} />);
      expect(screen.queryByText('Email')).not.toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Email' })).toBeInTheDocument();
    });

    it('prefers an explicit aria-label', () => {
      render(<RadioButtonItem showLabel={false} aria-label="Contact by email" />);
      expect(screen.getByRole('radio', { name: 'Contact by email' })).toBeInTheDocument();
    });
  });

  describe('skeleton', () => {
    it('renders a hidden placeholder without an input', () => {
      const { container } = render(<RadioButtonItem label="Email" skeleton selected />);
      expect(screen.queryByRole('radio')).not.toBeInTheDocument();
      const placeholder = container.querySelector('[data-skeleton]');
      expect(placeholder).toHaveAttribute('aria-hidden', 'true');
      expect(container.querySelector('[data-slot="skeleton-value"]')).toHaveClass('animate-pulse');
    });
  });

  it('passes data-state through for the forced focused state', () => {
    const { container } = render(<RadioButtonItem label="Email" data-state="focused" />);
    expect(container.querySelector('label')).toHaveAttribute('data-state', 'focused');
    expect(container.querySelector('[data-slot="radio-indicator"]')?.className).toContain(
      '[--radio-focus-display:block]',
    );
  });
});
