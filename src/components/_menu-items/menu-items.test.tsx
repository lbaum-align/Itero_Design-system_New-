import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MenuItems } from './MenuItems';
import { Menu } from '../menu';

describe('MenuItems', () => {
  it('renders a focusable menuitem named by the option text', () => {
    render(<MenuItems label="Copy" />);
    const item = screen.getByRole('menuitem', { name: 'Copy' });
    expect(item).toHaveAttribute('tabindex', '0');
  });

  it('forwards the ref to the item row and merges className on the wrapper', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<MenuItems ref={ref} label="Copy" className="custom" />);
    expect(ref.current).toBe(screen.getByRole('menuitem'));
    expect(container.firstElementChild).toHaveClass('custom');
  });

  it('activates on click, Enter and Space', () => {
    const onClick = vi.fn();
    render(<MenuItems label="Copy" onClick={onClick} />);
    const item = screen.getByRole('menuitem');
    fireEvent.click(item);
    fireEvent.keyDown(item, { key: 'Enter' });
    fireEvent.keyDown(item, { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('disabled: aria-disabled, not tabbable, ignores activation, disabled text colour', () => {
    const onClick = vi.fn();
    render(<MenuItems label="Copy" disabled onClick={onClick} />);
    const item = screen.getByRole('menuitem');
    expect(item).toHaveAttribute('aria-disabled', 'true');
    expect(item).toHaveAttribute('tabindex', '-1');
    fireEvent.click(item);
    fireEvent.keyDown(item, { key: 'Enter' });
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByText('Copy').className).toContain('--scanner-text-disabled');
  });

  it('uses text-error for Destructive', () => {
    render(<MenuItems label="Delete" type="destructive" />);
    expect(screen.getByText('Delete').className).toContain('--scanner-text-error');
  });

  it('Selected shows a checkmark and becomes a checked menuitemcheckbox (Neutral only)', () => {
    const { container, rerender } = render(<MenuItems label="Bold" selected />);
    expect(screen.getByRole('menuitemcheckbox', { name: 'Bold' })).toHaveAttribute('aria-checked', 'true');
    expect(container.querySelector('[data-checkmark]')).toBeInTheDocument();
    rerender(<MenuItems label="Bold" selected={false} />);
    expect(screen.getByRole('menuitemcheckbox')).toHaveAttribute('aria-checked', 'false');
    expect(container.querySelector('[data-checkmark]')).not.toBeInTheDocument();
    rerender(<MenuItems label="Delete" type="destructive" selected />);
    expect(container.querySelector('[data-checkmark]')).not.toBeInTheDocument();
  });

  it('Indented adds the 20px leading space', () => {
    const { container } = render(<MenuItems label="Option" indented />);
    expect(container.querySelector('[data-indent]')).toBeInTheDocument();
  });

  it('shows headline, subtext (as description) and divider', () => {
    render(<MenuItems label="Option" showHeadline headline="Group" showSubtext subtext="Details" showDivider />);
    expect(screen.getByText('Group')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Option' })).toHaveAccessibleDescription('Details');
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('keyboard shortcut trailing element sets aria-keyshortcuts', () => {
    render(<MenuItems label="Cut" showTrailingElement trailingElementProps={{ shortcutKeys: ['⌘', 'X'] }} />);
    expect(screen.getByRole('menuitem')).toHaveAttribute('aria-keyshortcuts', 'Meta+X');
  });

  it('ignores trailingElementProps unless showTrailingElement', () => {
    render(<MenuItems label="Cut" trailingElementProps={{ shortcutKeys: ['⌘', 'X'] }} />);
    expect(screen.queryByText('Command')).not.toBeInTheDocument();
  });

  it('toggle trailing element makes the row a menuitemcheckbox that toggles on activation', () => {
    const onToggleChange = vi.fn();
    render(
      <MenuItems
        label="Auto-save"
        showTrailingElement
        trailingElementProps={{ toggle: true, toggleSelected: false, onToggleChange }}
      />,
    );
    const item = screen.getByRole('menuitemcheckbox', { name: 'Auto-save' });
    expect(item).toHaveAttribute('aria-checked', 'false');
    fireEvent.keyDown(item, { key: ' ' });
    expect(onToggleChange).toHaveBeenCalledWith(true);
  });

  it('submenu items get aria-haspopup and open with ArrowRight', () => {
    const onClick = vi.fn();
    render(<MenuItems label="Share" onClick={onClick} showTrailingElement trailingElementProps={{ type: 'submenu' }} />);
    const item = screen.getByRole('menuitem');
    expect(item).toHaveAttribute('aria-haspopup', 'menu');
    fireEvent.keyDown(item, { key: 'ArrowRight' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('takes its size from the parent Menu and uses roving tabindex there', () => {
    const { container } = render(
      <Menu size="small">
        <MenuItems label="One" />
      </Menu>,
    );
    expect(container.querySelector('[data-size="small"][role="none"]')).toBeInTheDocument();
    expect(screen.getByRole('menuitem')).toHaveAttribute('tabindex', '-1');
  });

  it('passes data-state through for forced visual states', () => {
    render(<MenuItems label="Option" data-state="focused" />);
    expect(screen.getByRole('menuitem')).toHaveAttribute('data-state', 'focused');
  });
});
