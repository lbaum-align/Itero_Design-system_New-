import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { DataTableHeaderItem } from './DataTableHeaderItem';
import type { DataTableHeaderItemProps } from './data-table-header-item.types';

const renderItem = (props: DataTableHeaderItemProps = {}) =>
  render(
    <table>
      <thead>
        <tr>
          <DataTableHeaderItem {...props} />
        </tr>
      </thead>
    </table>,
  );

describe('DataTableHeaderItem', () => {
  it('renders a column header with the label and aria-sort="none"', () => {
    renderItem({ children: 'Patient' });
    const header = screen.getByRole('columnheader', { name: 'Patient' });
    expect(header).toHaveAttribute('aria-sort', 'none');
    expect(header).toHaveAttribute('scope', 'col');
  });

  it.each([
    ['ascending', 'sort-ascending'],
    ['descending', 'sort-descending'],
  ] as const)('shows the %s arrow and sets aria-sort', (sorted, icon) => {
    const { container } = renderItem({ children: 'Patient', sorted });
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', sorted);
    expect(container.querySelector(`[data-icon="${icon}"], svg`)).toBeInTheDocument();
  });

  it('shows no arrow when sorted is none', () => {
    const { container } = renderItem({ children: 'Patient', sortable: true });
    expect(container.querySelectorAll('svg')).toHaveLength(0);
  });

  it('renders the label as a button only when sortable', () => {
    renderItem({ children: 'Patient' });
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('cycles none → ascending → descending → none', () => {
    const onSortChange = vi.fn();
    const { rerender } = renderItem({ children: 'Patient', onSortChange });
    fireEvent.click(screen.getByRole('button', { name: 'Patient' }));
    expect(onSortChange).toHaveBeenLastCalledWith('ascending');

    const withSort = (sorted: 'ascending' | 'descending') =>
      rerender(
        <table>
          <thead>
            <tr>
              <DataTableHeaderItem sorted={sorted} onSortChange={onSortChange}>
                Patient
              </DataTableHeaderItem>
            </tr>
          </thead>
        </table>,
      );

    withSort('ascending');
    fireEvent.click(screen.getByRole('button', { name: 'Patient' }));
    expect(onSortChange).toHaveBeenLastCalledWith('descending');

    withSort('descending');
    fireEvent.click(screen.getByRole('button', { name: 'Patient' }));
    expect(onSortChange).toHaveBeenLastCalledWith('none');
  });

  it('does not render a sort button when disabled', () => {
    renderItem({ children: 'Patient', sortable: true, disabled: true });
    expect(screen.queryByRole('button', { name: 'Patient' })).not.toBeInTheDocument();
  });

  describe('filterable', () => {
    it('renders a filter button with a derived accessible name', () => {
      const onFilterClick = vi.fn();
      renderItem({ children: 'Patient', filterable: true, onFilterClick });
      const filter = screen.getByRole('button', { name: 'Filter Patient' });
      fireEvent.click(filter);
      expect(onFilterClick).toHaveBeenCalledTimes(1);
    });

    it('accepts a custom filter label and disables the button', () => {
      renderItem({
        children: 'Patient',
        filterable: true,
        filterLabel: 'Open filters',
        disabled: true,
      });
      expect(screen.getByRole('button', { name: 'Open filters' })).toBeDisabled();
    });

    it('is hidden by default', () => {
      renderItem({ children: 'Patient' });
      expect(screen.queryByRole('button', { name: /filter/i })).not.toBeInTheDocument();
    });
  });

  describe('showDivider', () => {
    it('renders the trailing divider only when enabled', () => {
      const { container, rerender } = renderItem({ children: 'Patient' });
      expect(container.querySelector('[data-divider]')).not.toBeInTheDocument();
      rerender(
        <table>
          <thead>
            <tr>
              <DataTableHeaderItem showDivider>Patient</DataTableHeaderItem>
            </tr>
          </thead>
        </table>,
      );
      expect(container.querySelector('[data-divider]')).toBeInTheDocument();
    });
  });

  it('forwards the ref to the th and merges className', () => {
    const ref = createRef<HTMLTableCellElement>();
    render(
      <table>
        <thead>
          <tr>
            <DataTableHeaderItem ref={ref} className="custom">
              Patient
            </DataTableHeaderItem>
          </tr>
        </thead>
      </table>,
    );
    expect(ref.current).toBeInstanceOf(HTMLTableCellElement);
    expect(ref.current).toHaveClass('custom');
  });
});
