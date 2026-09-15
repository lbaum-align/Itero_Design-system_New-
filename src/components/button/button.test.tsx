import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders a native button with type="button" by default', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('type', 'button');
  });

  it('maps htmlType to the native type attribute', () => {
    render(<Button htmlType="submit">Send</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('forwards the ref to the button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Save</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('merges className', () => {
    render(<Button className="custom">Save</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom');
  });

  describe('disabled', () => {
    it('sets disabled + aria-disabled and ignores clicks', () => {
      const onClick = vi.fn();
      render(<Button disabled onClick={onClick}>Save</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
      fireEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('loading', () => {
    it('shows a spinner, sets aria-busy and ignores clicks while staying focusable', () => {
      const onClick = vi.fn();
      render(<Button loading onClick={onClick}>Save</Button>);
      const button = screen.getByRole('button', { name: /save/i });
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).not.toBeDisabled();
      fireEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe('skeleton', () => {
    it('renders a hidden placeholder instead of a button', () => {
      const { container } = render(<Button skeleton>Save</Button>);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      const placeholder = container.querySelector('[data-skeleton]');
      expect(placeholder).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('content', () => {
    it('renders text + icon', () => {
      const { container } = render(<Button iconName="add">Add</Button>);
      expect(container.querySelector('svg')).toBeInTheDocument();
      expect(screen.getByText('Add')).toBeInTheDocument();
    });

    it('renders icon only with an accessible name', () => {
      render(<Button iconName="add" iconOnly aria-label="Add item">Hidden</Button>);
      const button = screen.getByRole('button', { name: 'Add item' });
      expect(button.querySelector('svg')).toBeInTheDocument();
      expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
    });

    it('uses a 24px icon at every size', () => {
      for (const size of ['large', 'medium', 'small'] as const) {
        const { container, unmount } = render(<Button size={size} iconName="add">Add</Button>);
        expect(container.querySelector('svg')).toHaveAttribute('width', '24');
        unmount();
      }
    });
  });

  it('passes data-state through for forced visual states', () => {
    render(<Button data-state="hovered">Save</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'hovered');
  });
});
