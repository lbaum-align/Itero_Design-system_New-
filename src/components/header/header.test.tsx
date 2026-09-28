import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header, HeaderAction, HeaderDivider } from './Header';
import type { HeaderNavItemData } from './header.types';

const items: HeaderNavItemData[] = [
  { id: 'a', label: 'Alpha', href: '#a' },
  { id: 'b', label: 'Beta', href: '#b' },
  { id: 'c', label: 'Gamma', href: '#c' },
];

describe('Header', () => {
  it('renders a header landmark with the logo', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /itero/i })).toBeInTheDocument();
  });

  it('forwards the ref and merges className', () => {
    const ref = createRef<HTMLElement>();
    render(<Header ref={ref} className="custom" />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(screen.getByRole('banner')).toHaveClass('custom');
  });

  it('renders the requested logo variation and wraps it in a link when logoHref is set', () => {
    render(<Header logoVariation="invisalign" logoHref="/home" logoLabel="Go home" />);
    expect(screen.getByRole('link', { name: 'Go home' })).toHaveAttribute('href', '/home');
  });

  it('accepts a custom logo node', () => {
    render(<Header logo={<span>Custom brand</span>} />);
    expect(screen.getByText('Custom brand')).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: /itero/i })).not.toBeInTheDocument();
  });

  describe('menu variants', () => {
    it('Menu=Visible renders the nav landmark and no hamburger', () => {
      render(<Header navItems={items} />);
      expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Main menu' })).not.toBeInTheDocument();
      expect(screen.getByRole('banner')).toHaveAttribute('data-menu', 'visible');
    });

    it('Menu=Hidden renders the hamburger and hides the nav', () => {
      render(<Header menu="hidden" navItems={items} />);
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Main menu' })).toBeInTheDocument();
      expect(screen.getByRole('banner')).toHaveAttribute('data-menu', 'hidden');
    });

    it('hamburger exposes aria-expanded / aria-controls and toggles (uncontrolled)', async () => {
      const user = userEvent.setup();
      const onMenuOpenChange = vi.fn();
      render(<Header menu="hidden" menuControls="panel" onMenuOpenChange={onMenuOpenChange} />);
      const trigger = screen.getByRole('button', { name: 'Main menu' });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('aria-controls', 'panel');

      await user.click(trigger);
      expect(onMenuOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('hamburger respects the controlled menuOpen prop', async () => {
      const user = userEvent.setup();
      const onMenuOpenChange = vi.fn();
      render(<Header menu="hidden" menuOpen onMenuOpenChange={onMenuOpenChange} />);
      const trigger = screen.getByRole('button', { name: 'Main menu' });
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      await user.click(trigger);
      expect(onMenuOpenChange).toHaveBeenCalledWith(false);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('navigation', () => {
    it('renders items as links when they have an href and as buttons otherwise', () => {
      render(<Header navItems={[items[0], { id: 'x', label: 'Action' }]} />);
      expect(screen.getByRole('link', { name: 'Alpha' })).toHaveAttribute('href', '#a');
      expect(screen.getByRole('button', { name: 'Action' })).toHaveAttribute('type', 'button');
    });

    it('marks the active item with aria-current and updates it on click (uncontrolled)', async () => {
      const user = userEvent.setup();
      const onNavItemSelect = vi.fn((_id, _item, event) => event.preventDefault());
      render(<Header navItems={items} defaultActiveItemId="a" onNavItemSelect={onNavItemSelect} />);

      expect(screen.getByRole('link', { name: 'Alpha' })).toHaveAttribute('aria-current', 'page');
      await user.click(screen.getByRole('link', { name: 'Beta' }));

      expect(onNavItemSelect).toHaveBeenCalledWith('b', items[1], expect.anything());
      expect(screen.getByRole('link', { name: 'Beta' })).toHaveAttribute('aria-current', 'page');
      expect(screen.getByRole('link', { name: 'Alpha' })).not.toHaveAttribute('aria-current');
    });

    it('does not change the active item when activeItemId is controlled', async () => {
      const user = userEvent.setup();
      const onNavItemSelect = vi.fn((_id, _item, event) => event.preventDefault());
      render(<Header navItems={items} activeItemId="a" onNavItemSelect={onNavItemSelect} />);

      await user.click(screen.getByRole('link', { name: 'Beta' }));
      expect(onNavItemSelect).toHaveBeenCalled();
      expect(screen.getByRole('link', { name: 'Alpha' })).toHaveAttribute('aria-current', 'page');
      expect(screen.getByRole('link', { name: 'Beta' })).not.toHaveAttribute('aria-current');
    });

    it('calls the per-item onClick handler', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn((event) => event.preventDefault());
      render(<Header navItems={[{ id: 'a', label: 'Alpha', onClick }]} />);
      await user.click(screen.getByRole('button', { name: 'Alpha' }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('disables items and ignores their activation', async () => {
      const user = userEvent.setup();
      const onNavItemSelect = vi.fn();
      render(
        <Header
          navItems={[{ id: 'a', label: 'Alpha', href: '#a', disabled: true }]}
          onNavItemSelect={onNavItemSelect}
        />,
      );
      const link = screen.getByText('Alpha').closest('a')!;
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).not.toHaveAttribute('href');
      await user.click(link);
      expect(onNavItemSelect).not.toHaveBeenCalled();
    });

    it('activates a nav item with the keyboard', async () => {
      const user = userEvent.setup();
      const onNavItemSelect = vi.fn((_id, _item, event) => event.preventDefault());
      render(<Header navItems={[{ id: 'a', label: 'Alpha' }]} onNavItemSelect={onNavItemSelect} />);
      await user.tab();
      expect(screen.getByRole('button', { name: 'Alpha' })).toHaveFocus();
      await user.keyboard('{Enter}');
      expect(onNavItemSelect).toHaveBeenCalledTimes(1);
    });

    it('forwards a forced data-state onto the item', () => {
      render(<Header navItems={[{ id: 'a', label: 'Alpha', 'data-state': 'hovered' }]} />);
      expect(screen.getByRole('button', { name: 'Alpha' })).toHaveAttribute('data-state', 'hovered');
    });

    it('renders no nav landmark when there are no items', () => {
      render(<Header navItems={[]} />);
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });
  });

  describe('overflow menu', () => {
    const many: HeaderNavItemData[] = [
      ...items,
      { id: 'd', label: 'Delta', href: '#d' },
      { id: 'e', label: 'Epsilon', href: '#e' },
    ];

    it('keeps maxVisibleNavItems inline and moves the rest into the menu', async () => {
      const user = userEvent.setup();
      render(<Header navItems={many} maxVisibleNavItems={3} />);
      expect(screen.getAllByRole('link')).toHaveLength(3);

      const trigger = screen.getByRole('button', { name: 'More' });
      expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      await user.click(trigger);
      const menu = screen.getByRole('menu', { name: 'More' });
      expect(within(menu).getAllByRole('menuitem')).toHaveLength(2);
      expect(within(menu).getByText('Delta')).toBeInTheDocument();
    });

    it('renders no overflow trigger when everything fits', () => {
      render(<Header navItems={items} maxVisibleNavItems={7} />);
      expect(screen.queryByRole('button', { name: 'More' })).not.toBeInTheDocument();
    });

    it('selects an overflow item, closes the menu and restores focus', async () => {
      const user = userEvent.setup();
      const onNavItemSelect = vi.fn();
      render(
        <Header navItems={many} maxVisibleNavItems={3} onNavItemSelect={onNavItemSelect} />,
      );
      const trigger = screen.getByRole('button', { name: 'More' });
      await user.click(trigger);
      await user.click(screen.getByText('Epsilon'));

      expect(onNavItemSelect).toHaveBeenCalledWith('e', many[4], expect.anything());
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });

    it('opens with ArrowDown and closes with Escape', async () => {
      const user = userEvent.setup();
      render(<Header navItems={many} maxVisibleNavItems={3} />);
      const trigger = screen.getByRole('button', { name: 'More' });
      trigger.focus();

      await user.keyboard('{ArrowDown}');
      const menu = screen.getByRole('menu', { name: 'More' });
      expect(within(menu).getAllByRole('menuitem')[0]).toHaveFocus();

      await user.keyboard('{Escape}');
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });

    it('closes on an outside click', async () => {
      const user = userEvent.setup();
      render(<Header navItems={many} maxVisibleNavItems={3} />);
      await user.click(screen.getByRole('button', { name: 'More' }));
      expect(screen.getByRole('menu')).toBeInTheDocument();

      fireEvent.pointerDown(document.body);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('marks the active overflow item as current', async () => {
      const user = userEvent.setup();
      render(<Header navItems={many} maxVisibleNavItems={3} defaultActiveItemId="e" />);
      await user.click(screen.getByRole('button', { name: 'More' }));
      const item = screen.getByText('Epsilon').closest('[role="menuitemcheckbox"]')!;
      expect(item).toHaveAttribute('aria-current', 'page');
      expect(item).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('actions', () => {
    it('renders the action and user slots', () => {
      render(
        <Header
          actions={
            <>
              <HeaderAction icon="search" label="Search" />
              <HeaderDivider />
              <HeaderAction icon="settings" label="Settings" />
            </>
          }
          user={<HeaderAction icon="account" label="Account" />}
        />,
      );
      expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Account' })).toBeInTheDocument();
    });

    it('HeaderAction forwards its ref, click handler and disabled state', async () => {
      const user = userEvent.setup();
      const ref = createRef<HTMLButtonElement>();
      const onClick = vi.fn();
      const { rerender } = render(
        <HeaderAction ref={ref} icon="search" label="Search" onClick={onClick} />,
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      await user.click(screen.getByRole('button', { name: 'Search' }));
      expect(onClick).toHaveBeenCalledTimes(1);

      rerender(<HeaderAction icon="search" label="Search" onClick={onClick} disabled />);
      const button = screen.getByRole('button', { name: 'Search' });
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('HeaderAction marks a selected action with aria-pressed', () => {
      render(<HeaderAction icon="settings" label="Settings" selected />);
      expect(screen.getByRole('button', { name: 'Settings' })).toHaveAttribute('aria-pressed', 'true');
    });

    it('HeaderDivider is decorative and merges className', () => {
      const { container } = render(<HeaderDivider className="custom" />);
      const divider = container.querySelector('[data-header-divider]')!;
      expect(divider).toHaveAttribute('aria-hidden', 'true');
      expect(divider).toHaveClass('custom');
    });
  });
});
