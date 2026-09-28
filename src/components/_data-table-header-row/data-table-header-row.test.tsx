import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { DataTableHeaderRow } from './DataTableHeaderRow';
import { DataTableHeaderItem } from '../_data-table-header-item';
import type { DataTableHeaderRowProps } from './data-table-header-row.types';

const columns = (
  <>
    <DataTableHeaderItem>Patient</DataTableHeaderItem>
    <DataTableHeaderItem>Status</DataTableHeaderItem>
  </>
);

const renderRow = (props: DataTableHeaderRowProps = {}) =>
  render(
    <table>
      <thead>
        <DataTableHeaderRow {...props}>{props.children ?? columns}</DataTableHeaderRow>
      </thead>
    </table>,
  );

describe('DataTableHeaderRow', () => {
  it('renders the header cells and no leading columns by default', () => {
    const { container } = renderRow();
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    expect(container.querySelectorAll('[data-spacer]')).toHaveLength(0);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('reserves a drag column when draggable', () => {
    const { container } = renderRow({ draggable: true });
    expect(container.querySelector('[data-spacer="drag"]')).toBeInTheDocument();
    /* The header has no drag handle of its own — only the reserved column */
    expect(screen.queryByRole('button', { name: /drag/i })).not.toBeInTheDocument();
  });

  it('reserves an expansion column when Expansion=Indend', () => {
    const { container } = renderRow({ expansion: 'indend' });
    expect(container.querySelector('[data-spacer="expansion"]')).toBeInTheDocument();
  });

  it.each([
    ['unselected', false, 'false'],
    ['selected', true, 'true'],
    ['indeterminate', false, 'mixed'],
  ] as const)('renders the select-all checkbox for %s', (selection, checked, ariaChecked) => {
    renderRow({ selection });
    const checkbox = screen.getByRole('checkbox', { name: 'Select all rows' });
    expect(checkbox).toHaveAttribute('aria-checked', ariaChecked);
    if (checked) expect(checkbox).toBeChecked();
  });

  it('calls onSelectionChange when the select-all checkbox is toggled', () => {
    const onSelectionChange = vi.fn();
    renderRow({ selection: 'unselected', onSelectionChange });
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onSelectionChange).toHaveBeenCalledWith(true);
  });

  it('renders every leading column in order: drag, expansion, checkbox', () => {
    const { container } = renderRow({
      draggable: true,
      expansion: 'indend',
      selection: 'unselected',
    });
    const cells = Array.from(container.querySelectorAll('tr > *'));
    expect(cells[0]).toHaveAttribute('data-spacer', 'drag');
    expect(cells[1]).toHaveAttribute('data-spacer', 'expansion');
    expect(cells[2]).toHaveAttribute('data-data-table-item', 'checkbox');
    expect(cells).toHaveLength(5);
  });

  it('exposes the Figma variant on data attributes', () => {
    const { container } = renderRow({
      selection: 'selected',
      expansion: 'indend',
      draggable: true,
    });
    const row = container.querySelector('tr');
    expect(row).toHaveAttribute('data-selection', 'selected');
    expect(row).toHaveAttribute('data-expansion', 'indend');
    expect(row).toHaveAttribute('data-draggable', 'true');
  });

  it('forwards the ref to the row and merges className', () => {
    const ref = createRef<HTMLTableRowElement>();
    render(
      <table>
        <thead>
          <DataTableHeaderRow ref={ref} className="custom">
            {columns}
          </DataTableHeaderRow>
        </thead>
      </table>,
    );
    expect(ref.current).toBeInstanceOf(HTMLTableRowElement);
    expect(ref.current).toHaveClass('custom');
  });
});
