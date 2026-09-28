import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { DataTableContentItem } from './DataTableContentItem';
import type { DataTableContentItemProps } from './data-table-content-item.types';

const renderItem = (props: DataTableContentItemProps = {}) =>
  render(
    <table>
      <tbody>
        <tr>
          <DataTableContentItem {...props} />
        </tr>
      </tbody>
    </table>,
  );

describe('DataTableContentItem', () => {
  it('renders a text cell by default', () => {
    const { container } = renderItem({ text: 'Cell item text' });
    const cell = container.querySelector('td');
    expect(cell).toHaveAttribute('data-content', 'text');
    expect(screen.getByText('Cell item text')).toBeInTheDocument();
  });

  it.each([
    ['large', '--scanner-data-table-row-height-lg'],
    ['x-large', '--scanner-data-table-row-height-xl'],
    ['2x-large', '--scanner-data-table-row-height-2xl'],
  ] as const)('applies the %s row height', (size, token) => {
    const { container } = renderItem({ size });
    expect(container.querySelector('td')?.className).toContain(token);
  });

  describe('text + subtext', () => {
    it('hides the subtext at Large (Figma renders one line)', () => {
      renderItem({ content: 'text-subtext', text: 'Title', subtext: 'Subtitle' });
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.queryByText('Subtitle')).not.toBeInTheDocument();
    });

    it('shows the subtext above Large', () => {
      renderItem({
        content: 'text-subtext',
        size: 'x-large',
        text: 'Title',
        subtext: 'Subtitle',
      });
      expect(screen.getByText('Subtitle')).toBeInTheDocument();
    });

    it('allows two title lines at 2X-large', () => {
      renderItem({
        content: 'text-subtext',
        size: '2x-large',
        text: 'Title',
        subtext: 'Subtitle',
      });
      expect(screen.getByText('Title').className).toContain('line-clamp-2');
    });
  });

  describe('avatar', () => {
    it('renders the avatar for text content when showAvatar is set', () => {
      renderItem({ text: 'Jane', avatar: { alt: 'Jane Doe', name: 'Jane Doe' }, showAvatar: true });
      expect(screen.getByLabelText('Jane Doe')).toBeInTheDocument();
    });

    it('is not rendered for non-text content', () => {
      renderItem({
        content: 'badge',
        text: 'Badge',
        avatar: { alt: 'Jane Doe', name: 'Jane Doe' },
        showAvatar: true,
      });
      expect(screen.queryByLabelText('Jane Doe')).not.toBeInTheDocument();
    });
  });

  it('renders a link', () => {
    renderItem({ content: 'link', text: 'Open scan', href: '/scan/1' });
    expect(screen.getByRole('link', { name: 'Open scan' })).toHaveAttribute('href', '/scan/1');
  });

  it('renders a badge with the requested status', () => {
    const { container } = renderItem({ content: 'badge', text: 'Completed', badgeStatus: 'success' });
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(container.querySelector('td')).toHaveAttribute('data-content', 'badge');
  });

  describe('progress', () => {
    it('renders a segmented progressbar with the Figma default of 3 segments', () => {
      const { container } = renderItem({ content: 'progress', progress: { value: 2 } });
      const bar = screen.getByRole('progressbar', { name: 'Progress' });
      expect(bar).toHaveAttribute('aria-valuenow', '2');
      expect(bar).toHaveAttribute('aria-valuemax', '3');
      expect(container.querySelectorAll('[data-filled]')).toHaveLength(2);
    });

    it('shows the text above Large and the subtext at 2X-large', () => {
      const { rerender } = renderItem({
        content: 'progress',
        size: 'x-large',
        text: 'Title',
        subtext: 'Subtitle',
      });
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.queryByText('Subtitle')).not.toBeInTheDocument();
      rerender(
        <table>
          <tbody>
            <tr>
              <DataTableContentItem
                content="progress"
                size="2x-large"
                text="Title"
                subtext="Subtitle"
              />
            </tr>
          </tbody>
        </table>,
      );
      expect(screen.getByText('Subtitle')).toBeInTheDocument();
    });
  });

  describe('buttons', () => {
    it('renders icon-only action buttons and calls their handlers', () => {
      const onClick = vi.fn();
      renderItem({
        content: 'buttons',
        actions: [
          { iconName: 'edit', label: 'Edit row', onClick },
          { iconName: 'more-horizontal', label: 'More actions' },
        ],
      });
      const edit = screen.getByRole('button', { name: 'Edit row' });
      fireEvent.click(edit);
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('button', { name: 'More actions' })).toBeInTheDocument();
    });

    it('respects a disabled action', () => {
      renderItem({
        content: 'buttons',
        actions: [{ iconName: 'edit', label: 'Edit row', disabled: true }],
      });
      expect(screen.getByRole('button', { name: 'Edit row' })).toBeDisabled();
    });
  });

  describe('slot', () => {
    it('falls back to the SlotContent placeholder', () => {
      renderItem({ content: 'slot' });
      expect(screen.getByText('Swap me to any component')).toBeInTheDocument();
    });

    it('renders custom children', () => {
      renderItem({ content: 'slot', children: <span>Custom</span> });
      expect(screen.getByText('Custom')).toBeInTheDocument();
    });
  });

  it('forwards the ref to the cell and merges className', () => {
    const ref = createRef<HTMLTableCellElement>();
    render(
      <table>
        <tbody>
          <tr>
            <DataTableContentItem ref={ref} className="custom" />
          </tr>
        </tbody>
      </table>,
    );
    expect(ref.current).toBeInstanceOf(HTMLTableCellElement);
    expect(ref.current).toHaveClass('custom');
  });
});
