import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { DataTableContentRow } from './DataTableContentRow';
import { DataTableContentItem } from '../_data-table-content-item';
import type { DataTableContentRowProps } from './data-table-content-row.types';

const cells = (
  <>
    <DataTableContentItem text="Jane Doe" />
    <DataTableContentItem text="Completed" />
  </>
);

const renderRow = (props: DataTableContentRowProps = {}) =>
  render(
    <table>
      <tbody>
        <DataTableContentRow {...props}>{props.children ?? cells}</DataTableContentRow>
      </tbody>
    </table>,
  );

describe('DataTableContentRow', () => {
  it('renders the content cells and no leading columns by default', () => {
    const { container } = renderRow();
    expect(container.querySelectorAll('tr')).toHaveLength(1);
    expect(container.querySelectorAll('td')).toHaveLength(2);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders every leading column in order: drag, expansion, checkbox', () => {
    const { container } = renderRow({
      draggable: true,
      expansion: 'collapsed',
      selection: 'unselected',
    });
    const leading = Array.from(container.querySelectorAll('tr > td')).slice(0, 3);
    expect(leading[0]).toHaveAttribute('data-data-table-item', 'drag');
    expect(leading[1]).toHaveAttribute('data-data-table-item', 'expansion');
    expect(leading[2]).toHaveAttribute('data-data-table-item', 'checkbox');
  });

  it('reserves an empty expansion column for Expansion=Indend', () => {
    const { container } = renderRow({ expansion: 'indend' });
    expect(container.querySelector('[data-spacer="expansion"]')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /expand/i })).not.toBeInTheDocument();
  });

  describe('selection', () => {
    it('reflects selected rows on aria-selected and data-selected', () => {
      const { container } = renderRow({ selection: 'selected' });
      const row = container.querySelector('tr');
      expect(row).toHaveAttribute('aria-selected', 'true');
      expect(row).toHaveAttribute('data-selected', 'true');
      expect(screen.getByRole('checkbox', { name: 'Select row' })).toBeChecked();
    });

    it('does not set aria-selected when the table has no selection column', () => {
      const { container } = renderRow({ selection: 'none' });
      expect(container.querySelector('tr')).not.toHaveAttribute('aria-selected');
    });

    it('calls onSelectionChange', () => {
      const onSelectionChange = vi.fn();
      renderRow({ selection: 'unselected', onSelectionChange });
      fireEvent.click(screen.getByRole('checkbox'));
      expect(onSelectionChange).toHaveBeenCalledWith(true);
    });
  });

  describe('expansion', () => {
    it('renders a collapsed expander without the expanded row', () => {
      const { container } = renderRow({ expansion: 'collapsed' });
      expect(screen.getByRole('button', { name: 'Expand row' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
      expect(container.querySelectorAll('tr')).toHaveLength(1);
    });

    it('renders the expanded content row with the slot placeholder', () => {
      const { container } = renderRow({ expansion: 'expanded' });
      expect(container.querySelectorAll('tr')).toHaveLength(2);
      expect(screen.getByText('Swap me to any component')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Collapse row' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    });

    it('renders custom expanded content and links it with aria-controls', () => {
      const { container } = renderRow({
        expansion: 'expanded',
        expandedContent: <span>Scan details</span>,
        expandedContentId: 'row-1-details',
      });
      expect(screen.getByText('Scan details')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Collapse row' })).toHaveAttribute(
        'aria-controls',
        'row-1-details',
      );
      expect(container.querySelector('#row-1-details')).toHaveAttribute(
        'data-data-table-row',
        'expanded-content',
      );
    });

    it('spans the expanded cell across every content column', () => {
      const { container } = renderRow({ expansion: 'expanded' });
      const expandedCell = container.querySelector('[data-data-table-row] td:last-child');
      expect(expandedCell).toHaveAttribute('colspan', '2');
    });

    it('repeats the leading spacer columns in the expanded row', () => {
      const { container } = renderRow({
        expansion: 'expanded',
        draggable: true,
        selection: 'unselected',
      });
      const expandedRow = container.querySelector('[data-data-table-row="expanded-content"]');
      expect(expandedRow?.querySelectorAll('[data-spacer]')).toHaveLength(3);
    });

    it('calls onExpandedChange', () => {
      const onExpandedChange = vi.fn();
      renderRow({ expansion: 'collapsed', onExpandedChange });
      fireEvent.click(screen.getByRole('button', { name: 'Expand row' }));
      expect(onExpandedChange).toHaveBeenCalledWith(true);
    });
  });

  describe('draggable', () => {
    it('renders the drag handle and forwards keyboard activation', () => {
      const onDragHandleActivate = vi.fn();
      renderRow({ draggable: true, onDragHandleActivate });
      const handle = screen.getByRole('button', { name: 'Drag to reorder row' });
      fireEvent.keyDown(handle, { key: 'Enter' });
      expect(onDragHandleActivate).toHaveBeenCalledTimes(1);
    });
  });

  it.each([
    ['large', '--scanner-data-table-row-height-lg'],
    ['x-large', '--scanner-data-table-row-height-xl'],
    ['2x-large', '--scanner-data-table-row-height-2xl'],
  ] as const)('applies the %s row height', (size, token) => {
    const { container } = renderRow({ size });
    expect(container.querySelector('tr')?.className).toContain(token);
  });

  it('exposes the Figma variant on data attributes', () => {
    const { container } = renderRow({
      selection: 'selected',
      expansion: 'collapsed',
      draggable: true,
    });
    const row = container.querySelector('tr');
    expect(row).toHaveAttribute('data-selection', 'selected');
    expect(row).toHaveAttribute('data-expansion', 'collapsed');
    expect(row).toHaveAttribute('data-draggable', 'true');
  });

  it('forwards the ref to the row and merges className', () => {
    const ref = createRef<HTMLTableRowElement>();
    render(
      <table>
        <tbody>
          <DataTableContentRow ref={ref} className="custom">
            {cells}
          </DataTableContentRow>
        </tbody>
      </table>,
    );
    expect(ref.current).toBeInstanceOf(HTMLTableRowElement);
    expect(ref.current).toHaveClass('custom');
  });
});
