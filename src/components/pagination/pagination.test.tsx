import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { Pagination } from './Pagination';
import { getVisiblePages } from './pagination-range';

describe('getVisiblePages', () => {
  it('shows every page up to 7', () => {
    expect(getVisiblePages(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(getVisiblePages(1, 0)).toEqual([]);
  });

  it('collapses the end near the start (Figma: 1 2 3 4 5 … 10)', () => {
    expect(getVisiblePages(1, 10)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 10]);
    expect(getVisiblePages(4, 10)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 10]);
  });

  it('collapses both sides in the middle', () => {
    expect(getVisiblePages(10, 20)).toEqual([1, 'ellipsis', 9, 10, 11, 'ellipsis', 20]);
  });

  it('collapses the start near the end', () => {
    expect(getVisiblePages(17, 20)).toEqual([1, 'ellipsis', 16, 17, 18, 19, 20]);
  });
});

describe('Pagination', () => {
  it('renders a nav landmark with prev, pages, ellipsis and next', () => {
    const { container } = render(<Pagination currentPage={1} totalPages={10} />);
    const nav = screen.getByRole('navigation', { name: 'Pagination' });
    const buttons = within(nav).getAllByRole('button');
    expect(buttons.map((b) => b.getAttribute('aria-label'))).toEqual([
      'Previous page',
      'Page 1',
      'Page 2',
      'Page 3',
      'Page 4',
      'Page 5',
      'Page 10',
      'Next page',
    ]);
    expect(container.querySelectorAll('[data-part="ellipsis"]')).toHaveLength(1);
  });

  it('marks the current page and disables prev on the first page', () => {
    render(<Pagination currentPage={1} totalPages={10} />);
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled();
  });

  it('disables next on the last page', () => {
    render(<Pagination currentPage={10} totalPages={10} />);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('calls onPageChange from page items and prev/next', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Page 6' }));
    expect(onPageChange).toHaveBeenLastCalledWith(6);
    fireEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(4);
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(6);
  });

  it('does not re-select the current page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Page 2' }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('moves with ArrowLeft / ArrowRight', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={10} onPageChange={onPageChange} />);
    const nav = screen.getByRole('navigation');
    fireEvent.keyDown(nav, { key: 'ArrowRight' });
    expect(onPageChange).toHaveBeenLastCalledWith(4);
    fireEvent.keyDown(nav, { key: 'ArrowLeft' });
    expect(onPageChange).toHaveBeenLastCalledWith(2);
  });

  it('ignores ArrowLeft on the first page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);
    fireEvent.keyDown(screen.getByRole('navigation'), { key: 'ArrowLeft' });
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('disables everything when disabled', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={10} disabled onPageChange={onPageChange} />);
    for (const b of screen.getAllByRole('button')) expect(b).toBeDisabled();
    fireEvent.keyDown(screen.getByRole('navigation'), { key: 'ArrowRight' });
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('renders a hidden skeleton instead of the nav', () => {
    const { container } = render(<Pagination currentPage={1} totalPages={10} skeleton />);
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(container.querySelector('[data-skeleton]')).toHaveAttribute('aria-hidden', 'true');
  });

  it.each([
    ['x-large', '--scanner-pagination-item-size-xl', '--scanner-pagination-icon-size-xl'],
    ['large', '--scanner-pagination-item-size-lg', '--scanner-pagination-icon-size'],
    ['medium', '--scanner-pagination-item-size-md', '--scanner-pagination-icon-size'],
    ['small', '--scanner-pagination-item-size-sm', '--scanner-pagination-icon-size'],
  ] as const)('sizes prev/next to the %s item box and caret', (size, box, icon) => {
    render(<Pagination currentPage={2} totalPages={3} size={size} />);
    const next = screen.getByRole('button', { name: 'Next page' });
    expect(next.className).toContain(`size-[var(${box})]`);
    expect(next.className).not.toContain('--scanner-button-min-width');
    expect(next.querySelector('svg')?.getAttribute('class')).toContain(icon);
  });

  it('accepts a custom aria-label, forwards the ref and merges className', () => {
    const ref = createRef<HTMLElement>();
    render(<Pagination ref={ref} currentPage={1} totalPages={3} aria-label="Results pages" className="custom" />);
    const nav = screen.getByRole('navigation', { name: 'Results pages' });
    expect(ref.current).toBe(nav);
    expect(nav).toHaveClass('custom');
  });
});
