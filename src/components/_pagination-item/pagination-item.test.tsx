import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { PaginationItem } from './PaginationItem';

describe('PaginationItem', () => {
  it('renders a button labelled with the page number', () => {
    render(<PaginationItem page={4} />);
    const item = screen.getByRole('button', { name: 'Page 4' });
    expect(item).toHaveAttribute('type', 'button');
    expect(item).toHaveTextContent('4');
    expect(item).not.toHaveAttribute('aria-current');
  });

  it('marks the selected item as the current page', () => {
    render(<PaginationItem page={2} selected />);
    const item = screen.getByRole('button', { name: 'Page 2' });
    expect(item).toHaveAttribute('aria-current', 'page');
    expect(item.className).toContain('--scanner-border-interactive');
  });

  it('uses the subtle stroke with a hover stroke when not selected', () => {
    render(<PaginationItem page={1} />);
    const cls = screen.getByRole('button').className;
    expect(cls).toContain('shadow-[inset_0_0_0_1px_var(--scanner-border-subtle)]');
    expect(cls).toContain('data-[state=hovered]:shadow-[inset_0_0_0_1px_var(--scanner-border-subtle-hover)]');
  });

  it('calls onClick', () => {
    const onClick = vi.fn();
    render(<PaginationItem page={1} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('supports disabled', () => {
    const onClick = vi.fn();
    render(<PaginationItem page={1} disabled onClick={onClick} />);
    const item = screen.getByRole('button');
    expect(item).toBeDisabled();
    expect(item).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(item);
    expect(onClick).not.toHaveBeenCalled();
  });

  it.each([
    ['x-large', '--scanner-pagination-item-size-xl', '--scanner-text-base'],
    ['large', '--scanner-pagination-item-size-lg', '--scanner-text-sm'],
    ['medium', '--scanner-pagination-item-size-md', '--scanner-text-sm'],
    ['small', '--scanner-pagination-item-size-sm', '--scanner-text-sm'],
  ] as const)('applies %s size box and typography', (size, box, type) => {
    render(<PaginationItem page={1} size={size} />);
    const cls = screen.getByRole('button').className;
    expect(cls).toContain(`h-[var(${box})]`);
    expect(cls).toContain(`min-w-[var(${box})]`);
    expect(cls).toContain(type);
  });

  it('renders a focus ring that can be forced with data-state', () => {
    const { container } = render(<PaginationItem page={1} data-state="focused" />);
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'focused');
    const ring = container.querySelector('[aria-hidden="true"]');
    expect(ring?.className).toContain('group-data-[state=focused]:block');
  });

  it('allows overriding the accessible label', () => {
    render(<PaginationItem page={1} aria-label="Go to page 1" />);
    expect(screen.getByRole('button', { name: 'Go to page 1' })).toBeInTheDocument();
  });

  it('forwards the ref and merges className', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<PaginationItem ref={ref} page={1} className="custom" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveClass('custom');
  });
});
