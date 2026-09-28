import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { DataTableExpansionItem } from './DataTableExpansionItem';
import type { DataTableExpansionItemProps } from './data-table-expansion-item.types';

const renderItem = (props: DataTableExpansionItemProps = {}) =>
  render(
    <table>
      <tbody>
        <tr>
          <DataTableExpansionItem {...props} />
        </tr>
      </tbody>
    </table>,
  );

describe('DataTableExpansionItem', () => {
  it('renders a collapsed expander by default', () => {
    const { container } = renderItem();
    expect(container.querySelector('td')).toHaveAttribute('data-data-table-item', 'expansion');
    const button = screen.getByRole('button', { name: 'Expand row' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button.className).not.toContain('rotate-180');
  });

  it('rotates the chevron and renames the button when expanded', () => {
    const { container } = renderItem({ expanded: true });
    const button = screen.getByRole('button', { name: 'Collapse row' });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button.className).toContain('rotate-180');
    expect(container.querySelector('td')).toHaveAttribute('data-expanded', 'true');
  });

  it('links the button to the expanded row with aria-controls', () => {
    renderItem({ expanded: true, 'aria-controls': 'row-1-details' });
    expect(screen.getByRole('button')).toHaveAttribute('aria-controls', 'row-1-details');
  });

  it.each([
    ['large', '--scanner-data-table-row-height-lg'],
    ['x-large', '--scanner-data-table-row-height-xl'],
    ['2x-large', '--scanner-data-table-row-height-2xl'],
  ] as const)('applies the %s row height', (size, token) => {
    const { container } = renderItem({ size });
    expect(container.querySelector('td')?.className).toContain(token);
  });

  it('calls onExpandedChange with the next value', () => {
    const onExpandedChange = vi.fn();
    renderItem({ onExpandedChange });
    fireEvent.click(screen.getByRole('button'));
    expect(onExpandedChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle when disabled', () => {
    const onExpandedChange = vi.fn();
    renderItem({ disabled: true, onExpandedChange });
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(button);
    expect(onExpandedChange).not.toHaveBeenCalled();
  });

  it('uses a custom accessible label', () => {
    renderItem({ label: 'Show scans' });
    expect(screen.getByRole('button', { name: 'Show scans' })).toBeInTheDocument();
  });

  it('forwards the ref to the cell and merges className', () => {
    const ref = createRef<HTMLTableCellElement>();
    render(
      <table>
        <tbody>
          <tr>
            <DataTableExpansionItem ref={ref} className="custom" />
          </tr>
        </tbody>
      </table>,
    );
    expect(ref.current).toBeInstanceOf(HTMLTableCellElement);
    expect(ref.current).toHaveClass('custom');
  });
});
