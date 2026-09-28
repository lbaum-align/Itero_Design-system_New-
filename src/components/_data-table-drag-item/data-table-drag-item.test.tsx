import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { DataTableDragItem } from './DataTableDragItem';
import type { DataTableDragItemProps } from './data-table-drag-item.types';

const renderItem = (props: DataTableDragItemProps = {}) =>
  render(
    <table>
      <tbody>
        <tr>
          <DataTableDragItem {...props} />
        </tr>
      </tbody>
    </table>,
  );

describe('DataTableDragItem', () => {
  it('renders a table cell with a drag handle button', () => {
    const { container } = renderItem();
    const cell = container.querySelector('td');
    expect(cell).toBeInTheDocument();
    expect(cell).toHaveAttribute('data-data-table-item', 'drag');
    expect(screen.getByRole('button', { name: 'Drag to reorder row' })).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('uses a custom accessible label', () => {
    renderItem({ label: 'Reorder patient row' });
    expect(screen.getByRole('button', { name: 'Reorder patient row' })).toBeInTheDocument();
  });

  it.each([
    ['large', '--scanner-data-table-row-height-lg'],
    ['x-large', '--scanner-data-table-row-height-xl'],
    ['2x-large', '--scanner-data-table-row-height-2xl'],
  ] as const)('applies the %s row height', (size, token) => {
    const { container } = renderItem({ size });
    expect(container.querySelector('td')?.className).toContain(token);
  });

  it('calls onHandleActivate on Enter and Space', () => {
    const onHandleActivate = vi.fn();
    renderItem({ onHandleActivate });
    const handle = screen.getByRole('button');
    fireEvent.keyDown(handle, { key: 'Enter' });
    fireEvent.keyDown(handle, { key: ' ' });
    expect(onHandleActivate).toHaveBeenCalledTimes(2);
  });

  it('ignores other keys', () => {
    const onHandleActivate = vi.fn();
    renderItem({ onHandleActivate });
    fireEvent.keyDown(screen.getByRole('button'), { key: 'a' });
    expect(onHandleActivate).not.toHaveBeenCalled();
  });

  describe('disabled', () => {
    it('sets disabled + aria-disabled and ignores the keyboard', () => {
      const onHandleActivate = vi.fn();
      renderItem({ disabled: true, onHandleActivate });
      const handle = screen.getByRole('button');
      expect(handle).toBeDisabled();
      expect(handle).toHaveAttribute('aria-disabled', 'true');
      fireEvent.keyDown(handle, { key: 'Enter' });
      expect(onHandleActivate).not.toHaveBeenCalled();
    });
  });

  it('forwards the forced state to the cell and the handle', () => {
    const { container } = renderItem({ 'data-state': 'hovered' });
    expect(container.querySelector('td')).toHaveAttribute('data-state', 'hovered');
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'hovered');
  });

  it('forwards the ref to the cell and merges className', () => {
    const ref = createRef<HTMLTableCellElement>();
    render(
      <table>
        <tbody>
          <tr>
            <DataTableDragItem ref={ref} className="custom" />
          </tr>
        </tbody>
      </table>,
    );
    expect(ref.current).toBeInstanceOf(HTMLTableCellElement);
    expect(ref.current).toHaveClass('custom');
  });
});
