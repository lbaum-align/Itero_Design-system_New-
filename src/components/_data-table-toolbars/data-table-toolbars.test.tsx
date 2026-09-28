import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { DataTableToolbars } from './DataTableToolbars';
import type { DataTableToolbarAction } from './data-table-toolbars.types';

const actions: DataTableToolbarAction[] = [
  { id: 'filter', label: 'Filter', iconName: 'filter', iconOnly: true },
  { id: 'add', label: 'Add patient', emphasis: 'primary' },
];

const bulkActionItems: DataTableToolbarAction[] = [
  { id: 'a1', label: 'Action 1' },
  { id: 'a2', label: 'Action 2' },
];

describe('DataTableToolbars', () => {
  it('renders the search input by default', () => {
    render(<DataTableToolbars />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('hides the search input with showSearch={false}', () => {
    render(<DataTableToolbars showSearch={false} />);
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  });

  it('forwards searchProps to the SearchInput', () => {
    const onChange = vi.fn();
    render(<DataTableToolbars searchProps={{ 'aria-label': 'Search patients', placeholder: 'Find', onChange }} />);
    const input = screen.getByRole('searchbox', { name: 'Search patients' });
    expect(input).toHaveAttribute('placeholder', 'Find');
    fireEvent.change(input, { target: { value: 'sm' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('renders filters next to the search input', () => {
    render(<DataTableToolbars filters={<button type="button">Status</button>} />);
    expect(screen.getByRole('button', { name: 'Status' })).toBeInTheDocument();
  });

  it('forwards the ref and merges className', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<DataTableToolbars ref={ref} className="custom" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstElementChild).toHaveClass('custom');
  });

  describe('Bulk actions = False', () => {
    it('renders the actions, icon-only ones keeping an accessible name', () => {
      render(<DataTableToolbars actions={actions} />);
      expect(screen.getByRole('button', { name: 'Filter' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add patient' })).toBeInTheDocument();
    });

    it('calls the action onClick', () => {
      const onClick = vi.fn();
      render(<DataTableToolbars actions={[{ id: 'add', label: 'Add', onClick }]} />);
      fireEvent.click(screen.getByRole('button', { name: 'Add' }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('disables an action', () => {
      render(<DataTableToolbars actions={[{ id: 'add', label: 'Add', disabled: true }]} />);
      expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();
    });

    it('sets data-bulk-actions="false"', () => {
      const { container } = render(<DataTableToolbars actions={actions} />);
      expect(container.firstElementChild).toHaveAttribute('data-bulk-actions', 'false');
    });
  });

  describe('Bulk actions = True', () => {
    it('switches on a selection and shows the summary as a live region', () => {
      const { container } = render(
        <DataTableToolbars actions={actions} selectedCount={2} bulkActionItems={bulkActionItems} />,
      );
      expect(container.firstElementChild).toHaveAttribute('data-bulk-actions', 'true');
      const status = screen.getByRole('status');
      expect(status).toHaveTextContent('2 items selected');
      expect(status).toHaveAttribute('aria-live', 'polite');
      expect(screen.queryByRole('button', { name: 'Add patient' })).not.toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Bulk actions' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument();
    });

    it('uses the singular for one selected item', () => {
      render(<DataTableToolbars selectedCount={1} />);
      expect(screen.getByRole('status')).toHaveTextContent('1 item selected');
    });

    it('accepts a custom selectedLabel', () => {
      render(<DataTableToolbars selectedCount={3} selectedLabel={(n) => `${n} rows`} />);
      expect(screen.getByRole('status')).toHaveTextContent('3 rows');
    });

    it('can be forced on with bulkActions even without a selection', () => {
      render(<DataTableToolbars bulkActions actions={actions} bulkActionItems={bulkActionItems} />);
      expect(screen.getByRole('status')).toHaveTextContent('0 items selected');
      expect(screen.queryByRole('button', { name: 'Add patient' })).not.toBeInTheDocument();
    });

    it('can be forced off with bulkActions={false} despite a selection', () => {
      render(<DataTableToolbars bulkActions={false} selectedCount={2} actions={actions} />);
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add patient' })).toBeInTheDocument();
    });

    it('calls a bulk action onClick', () => {
      const onClick = vi.fn();
      render(<DataTableToolbars selectedCount={2} bulkActionItems={[{ id: 'del', label: 'Delete', onClick }]} />);
      fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('renders Cancel only with onCancel and calls it', () => {
      const onCancel = vi.fn();
      const { rerender } = render(<DataTableToolbars selectedCount={2} />);
      expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();

      rerender(<DataTableToolbars selectedCount={2} onCancel={onCancel} cancelLabel="Clear" />);
      fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('keeps the search input in bulk mode', () => {
      render(<DataTableToolbars selectedCount={2} />);
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });
  });
});
