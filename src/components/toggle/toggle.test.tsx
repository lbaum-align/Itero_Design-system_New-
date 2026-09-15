import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toggle } from './Toggle';

describe('Toggle', () => {
  it('renders a switch with aria-checked reflecting selected', () => {
    const { rerender } = render(<Toggle aria-label="Wi-Fi" />);
    const toggle = screen.getByRole('switch', { name: 'Wi-Fi' });
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    expect(toggle).toHaveAttribute('type', 'button');
    rerender(<Toggle aria-label="Wi-Fi" selected />);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('forwards the ref to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Toggle ref={ref} aria-label="Wi-Fi" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('calls onChange with the next value on click', () => {
    const onChange = vi.fn();
    render(<Toggle selected onChange={onChange} aria-label="Wi-Fi" />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('calls onClick and respects preventDefault', () => {
    const onChange = vi.fn();
    const onClick = vi.fn((e: React.MouseEvent) => e.preventDefault());
    render(<Toggle onChange={onChange} onClick={onClick} aria-label="Wi-Fi" />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onClick).toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('toggles with Enter and Space', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Toggle onChange={onChange} aria-label="Wi-Fi" />);
    await user.tab();
    expect(screen.getByRole('switch')).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  describe('value text (Show value / Text value)', () => {
    it('labels the switch and toggles when the text is clicked', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Toggle onChange={onChange}>Notifications</Toggle>);
      expect(screen.getByRole('switch', { name: 'Notifications' })).toBeInTheDocument();
      await user.click(screen.getByText('Notifications'));
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('does not double-fire when the switch itself is clicked inside the label', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Toggle onChange={onChange}>Notifications</Toggle>);
      await user.click(screen.getByRole('switch'));
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('hides the text when showValue is false', () => {
      render(<Toggle showValue={false} aria-label="Notifications">Notifications</Toggle>);
      expect(screen.queryByText('Notifications')).not.toBeInTheDocument();
      expect(screen.getByRole('switch', { name: 'Notifications' })).toBeInTheDocument();
    });

    it('applies className to the label wrapper when text is shown, otherwise to the switch', () => {
      const { container, rerender } = render(<Toggle className="custom">Value</Toggle>);
      expect(container.firstChild).toHaveClass('custom');
      expect((container.firstChild as HTMLElement).tagName).toBe('LABEL');
      rerender(<Toggle className="custom" aria-label="Value" />);
      expect(screen.getByRole('switch')).toHaveClass('custom');
    });
  });

  describe('disabled', () => {
    it('sets disabled + aria-disabled and ignores clicks', () => {
      const onChange = vi.fn();
      render(<Toggle disabled onChange={onChange}>Value</Toggle>);
      const toggle = screen.getByRole('switch');
      expect(toggle).toBeDisabled();
      expect(toggle).toHaveAttribute('aria-disabled', 'true');
      fireEvent.click(toggle);
      fireEvent.click(screen.getByText('Value'));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('skeleton', () => {
    it('renders a hidden placeholder with a value bar', () => {
      const { container } = render(<Toggle skeleton>Value</Toggle>);
      expect(screen.queryByRole('switch')).not.toBeInTheDocument();
      const placeholder = container.querySelector('[data-skeleton]');
      expect(placeholder).toHaveAttribute('aria-hidden', 'true');
      expect(placeholder?.children).toHaveLength(2);
      expect(screen.queryByText('Value')).not.toBeInTheDocument();
    });

    it('omits the value bar when there is no value text', () => {
      const { container } = render(<Toggle skeleton />);
      expect(container.querySelector('[data-skeleton]')?.children).toHaveLength(1);
    });
  });

  it('passes data-state through for forced visual states', () => {
    render(<Toggle data-state="hovered" aria-label="Wi-Fi" />);
    expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'hovered');
  });
});
