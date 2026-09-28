import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { DataTablePagination } from './DataTablePagination';

const setup = (props: Partial<React.ComponentProps<typeof DataTablePagination>> = {}) =>
  render(<DataTablePagination totalItems={104} {...props} />);

const previous = () => screen.getByRole('button', { name: 'Previous page' });
const next = () => screen.getByRole('button', { name: 'Next page' });

describe('DataTablePagination', () => {
  it('renders a labelled nav landmark', () => {
    setup();
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });

  it('renders the range, page count and the two dropdowns', () => {
    setup({ page: 1, pageSize: 10 });
    expect(screen.getByText('1–10 of 104 items')).toBeInTheDocument();
    expect(screen.getByText('of 11 pages')).toBeInTheDocument();
    expect(screen.getByText('Items per page')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Items per page' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Page' })).toBeInTheDocument();
  });

  it('marks the range as a polite live region', () => {
    const { container } = setup();
    expect(container.querySelector('[data-part="range"]')).toHaveAttribute('aria-live', 'polite');
  });

  it('forwards the ref and merges className', () => {
    const ref = createRef<HTMLElement>();
    const { container } = setup({ ref, className: 'custom' });
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(container.firstElementChild).toHaveClass('custom');
  });

  describe('range', () => {
    it('shows the last partial page', () => {
      setup({ page: 11, pageSize: 10 });
      expect(screen.getByText('101–104 of 104 items')).toBeInTheDocument();
    });

    it('handles an empty table', () => {
      setup({ totalItems: 0 });
      expect(screen.getByText('0–0 of 0 items')).toBeInTheDocument();
      expect(screen.getByText('of 1 page')).toBeInTheDocument();
      expect(previous()).toBeDisabled();
      expect(next()).toBeDisabled();
    });

    it('accepts custom label formatters', () => {
      setup({ page: 1, pageSize: 10, rangeLabel: (s, e, t) => `${s}/${e}/${t}`, pagesLabel: (p) => `${p} Seiten` });
      expect(screen.getByText('1/10/104')).toBeInTheDocument();
      expect(screen.getByText('11 Seiten')).toBeInTheDocument();
    });

    it('clamps an out-of-range page', () => {
      setup({ page: 99, pageSize: 10 });
      expect(screen.getByText('101–104 of 104 items')).toBeInTheDocument();
    });
  });

  describe('previous / next', () => {
    it('disables previous on the first page and next on the last', () => {
      const { rerender } = setup({ page: 1, pageSize: 10 });
      expect(previous()).toBeDisabled();
      expect(next()).toBeEnabled();

      rerender(<DataTablePagination totalItems={104} page={11} pageSize={10} />);
      expect(previous()).toBeEnabled();
      expect(next()).toBeDisabled();
    });

    it('calls onPageChange with the next / previous page', () => {
      const onPageChange = vi.fn();
      setup({ page: 5, pageSize: 10, onPageChange });
      fireEvent.click(next());
      expect(onPageChange).toHaveBeenCalledWith(6);
      fireEvent.click(previous());
      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it('updates itself when uncontrolled', () => {
      setup({ defaultPage: 1, defaultPageSize: 10 });
      fireEvent.click(next());
      expect(screen.getByText('11–20 of 104 items')).toBeInTheDocument();
      fireEvent.click(previous());
      expect(screen.getByText('1–10 of 104 items')).toBeInTheDocument();
    });

    it('does not change page when controlled without onPageChange', () => {
      setup({ page: 1, pageSize: 10 });
      fireEvent.click(next());
      expect(screen.getByText('1–10 of 104 items')).toBeInTheDocument();
    });

    it('moves focus to the other button when the pressed one disables', () => {
      setup({ defaultPage: 2, defaultPageSize: 10 });
      previous().focus();
      fireEvent.click(previous());
      expect(previous()).toBeDisabled();
      expect(next()).toHaveFocus();
    });

    it('disables every control with `disabled`', () => {
      setup({ page: 3, pageSize: 10, disabled: true });
      expect(previous()).toBeDisabled();
      expect(next()).toBeDisabled();
      expect(screen.getByRole('combobox', { name: 'Items per page' })).toBeDisabled();
      expect(screen.getByRole('combobox', { name: 'Page' })).toBeDisabled();
    });

    it('uses custom button labels', () => {
      setup({ previousLabel: 'Zurück', nextLabel: 'Weiter' });
      expect(screen.getByRole('button', { name: 'Zurück' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Weiter' })).toBeInTheDocument();
    });
  });

  describe('page size', () => {
    it('lists the page size options and marks the current one', () => {
      setup({ page: 1, pageSize: 20, pageSizeOptions: [10, 20, 50] });
      fireEvent.click(screen.getByRole('combobox', { name: 'Items per page' }));
      const options = screen.getAllByRole('option');
      expect(options.map((o) => o.textContent)).toEqual(['10', '20', '50']);
      expect(screen.getByRole('option', { name: '20' })).toHaveAttribute('aria-selected', 'true');
    });

    it('adds a page size that is not in the options', () => {
      setup({ page: 1, pageSize: 25, pageSizeOptions: [10, 20, 50] });
      fireEvent.click(screen.getByRole('combobox', { name: 'Items per page' }));
      expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['10', '20', '25', '50']);
    });

    it('calls onPageSizeChange and keeps the first visible row', () => {
      const onPageSizeChange = vi.fn();
      const onPageChange = vi.fn();
      setup({ page: 3, pageSize: 10, onPageSizeChange, onPageChange });
      fireEvent.click(screen.getByRole('combobox', { name: 'Items per page' }));
      fireEvent.click(screen.getByRole('option', { name: '20' }));
      expect(onPageSizeChange).toHaveBeenCalledWith(20);
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('keeps the page when the first visible row stays on it', () => {
      const onPageChange = vi.fn();
      setup({ page: 1, pageSize: 10, onPageChange, onPageSizeChange: vi.fn() });
      fireEvent.click(screen.getByRole('combobox', { name: 'Items per page' }));
      fireEvent.click(screen.getByRole('option', { name: '50' }));
      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('updates the range when uncontrolled', () => {
      setup({ defaultPage: 1, defaultPageSize: 10 });
      fireEvent.click(screen.getByRole('combobox', { name: 'Items per page' }));
      fireEvent.click(screen.getByRole('option', { name: '50' }));
      expect(screen.getByText('1–50 of 104 items')).toBeInTheDocument();
      expect(screen.getByText('of 3 pages')).toBeInTheDocument();
    });
  });

  describe('page dropdown', () => {
    it('lists every page and selects one', () => {
      const onPageChange = vi.fn();
      setup({ page: 1, pageSize: 50, onPageChange });
      fireEvent.click(screen.getByRole('combobox', { name: 'Page' }));
      expect(screen.getAllByRole('option')).toHaveLength(3);
      fireEvent.click(screen.getByRole('option', { name: '3' }));
      expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it('uses a custom page label', () => {
      setup({ pageLabel: 'Seite' });
      expect(screen.getByRole('combobox', { name: 'Seite' })).toBeInTheDocument();
    });
  });
});
