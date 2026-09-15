import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Menu, MenuDivider } from './Menu';
import { MenuItems } from '../_menu-items';
import type { MenuProps } from './menu.types';

const Actions = (props: MenuProps & { ref?: React.Ref<HTMLDivElement> }) => (
  <Menu aria-label="Actions" {...props}>
    <MenuItems label="Cut" />
    <MenuItems label="Copy" disabled />
    <MenuItems label="Paste" />
    <MenuDivider />
    <MenuItems label="Bold" selected={false} />
  </Menu>
);

describe('Menu', () => {
  it('renders role="menu" with items and forwards ref / className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Actions ref={ref} className="custom" />);
    const menu = screen.getByRole('menu', { name: 'Actions' });
    expect(ref.current).toBe(menu);
    expect(menu).toHaveClass('custom');
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
    expect(screen.getByRole('menuitemcheckbox')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('Large adds the border-subtle stroke; Medium/Small do not', () => {
    const { rerender } = render(<Actions size="large" />);
    expect(screen.getByRole('menu').className).toContain('ring-[var(--scanner-border-subtle)]');
    rerender(<Actions size="medium" />);
    expect(screen.getByRole('menu').className).not.toContain('ring-[var(--scanner-border-subtle)]');
  });

  it('focusing the menu moves focus to the first item; container leaves the tab order', () => {
    render(<Actions />);
    const menu = screen.getByRole('menu');
    expect(menu).toHaveAttribute('tabindex', '0');
    act(() => menu.focus());
    expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
    expect(menu).toHaveAttribute('tabindex', '-1');
  });

  it('arrow keys skip disabled items and wrap; Home / End jump', () => {
    render(<Actions />);
    act(() => screen.getByRole('menu').focus());
    const key = (k: string) => fireEvent.keyDown(document.activeElement as Element, { key: k });
    key('ArrowDown');
    expect(screen.getByRole('menuitem', { name: 'Paste' })).toHaveFocus();
    key('ArrowDown');
    expect(screen.getByRole('menuitemcheckbox', { name: 'Bold' })).toHaveFocus();
    key('ArrowDown');
    expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
    key('ArrowUp');
    expect(screen.getByRole('menuitemcheckbox', { name: 'Bold' })).toHaveFocus();
    key('Home');
    expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
    key('End');
    expect(screen.getByRole('menuitemcheckbox', { name: 'Bold' })).toHaveFocus();
  });

  it('Enter activates the focused item and Escape calls onClose', () => {
    const onClose = vi.fn();
    const onCut = vi.fn();
    render(
      <Menu aria-label="Actions" onClose={onClose}>
        <MenuItems label="Cut" onClick={onCut} />
      </Menu>,
    );
    act(() => screen.getByRole('menu').focus());
    fireEvent.keyDown(document.activeElement as Element, { key: 'Enter' });
    expect(onCut).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(document.activeElement as Element, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('autoFocus="last" focuses the last enabled item on mount', () => {
    render(<Actions autoFocus="last" />);
    expect(screen.getByRole('menuitemcheckbox', { name: 'Bold' })).toHaveFocus();
  });

  it('scroll + maxHeight make the menu scrollable', () => {
    render(<Actions scroll maxHeight={200} />);
    const menu = screen.getByRole('menu');
    expect(menu).toHaveStyle({ maxHeight: '200px' });
    expect(menu).toHaveClass('overflow-y-auto');
  });

  it('propagates size to items', () => {
    const { container } = render(<Actions size="medium" />);
    expect(container.querySelectorAll('[role="none"][data-size="medium"]')).toHaveLength(4);
  });
});
