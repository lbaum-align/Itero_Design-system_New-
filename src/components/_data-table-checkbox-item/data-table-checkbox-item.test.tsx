import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { DataTableCheckboxItem } from './DataTableCheckboxItem';
import type { DataTableCheckboxItemProps } from './data-table-checkbox-item.types';

const renderItem = (props: DataTableCheckboxItemProps = {}) =>
  render(
    <table>
      <tbody>
        <tr>
          <DataTableCheckboxItem {...props} />
        </tr>
      </tbody>
    </table>,
  );

describe('DataTableCheckboxItem', () => {
  it('renders a table cell with a checkbox and no visible label', () => {
    const { container } = renderItem();
    const cell = container.querySelector('td');
    expect(cell).toHaveAttribute('data-data-table-item', 'checkbox');
    const checkbox = screen.getByRole('checkbox', { name: 'Select row' });
    expect(checkbox).not.toBeChecked();
    expect(screen.queryByText('Select row')).not.toBeInTheDocument();
  });

  it('uses a custom accessible label', () => {
    renderItem({ label: 'Select patient Jane Doe' });
    expect(screen.getByRole('checkbox', { name: 'Select patient Jane Doe' })).toBeInTheDocument();
  });

  it.each([
    ['large', '--scanner-data-table-row-height-lg'],
    ['x-large', '--scanner-data-table-row-height-xl'],
    ['2x-large', '--scanner-data-table-row-height-2xl'],
  ] as const)('applies the %s row height', (size, token) => {
    const { container } = renderItem({ size });
    expect(container.querySelector('td')?.className).toContain(token);
  });

  it('reflects the selected state', () => {
    renderItem({ checked: 'selected' });
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('reflects the indeterminate state as aria-checked="mixed"', () => {
    renderItem({ checked: 'indeterminate' });
    const checkbox = screen.getByRole<HTMLInputElement>('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    expect(checkbox.indeterminate).toBe(true);
  });

  it('calls onChange when toggled', () => {
    const onChange = vi.fn();
    renderItem({ onChange });
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle when disabled', () => {
    const onChange = vi.fn();
    renderItem({ disabled: true, onChange });
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
    fireEvent.click(checkbox);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders a skeleton placeholder instead of a checkbox', () => {
    const { container } = renderItem({ skeleton: true });
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(container.querySelector('[data-skeleton]')).toBeInTheDocument();
  });

  it('forwards the ref to the cell and merges className', () => {
    const ref = createRef<HTMLTableCellElement>();
    render(
      <table>
        <tbody>
          <tr>
            <DataTableCheckboxItem ref={ref} className="custom" />
          </tr>
        </tbody>
      </table>,
    );
    expect(ref.current).toBeInstanceOf(HTMLTableCellElement);
    expect(ref.current).toHaveClass('custom');
  });
});
