import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Header, HeaderAction, HeaderDivider } from './Header';
import type { HeaderForcedState, HeaderMenu, HeaderNavItemData } from './header.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Header (node 34193:2652, page "Header")
 * Menu = Visible | Hidden — both rendered in `FigmaMatrix`.
 */

const MENUS: HeaderMenu[] = ['visible', 'hidden'];
const STATES = ['enabled', 'hovered', 'focused', 'pressed', 'disabled'] as const;
type State = (typeof STATES)[number];

const NAV_ITEMS: HeaderNavItemData[] = [
  { id: 'item-1', label: 'Button text', href: '#item-1' },
  { id: 'item-2', label: 'Button text', href: '#item-2' },
  { id: 'item-3', label: 'Button text', href: '#item-3' },
  { id: 'item-4', label: 'Button text', href: '#item-4' },
  { id: 'item-5', label: 'Button text', href: '#item-5' },
  { id: 'item-6', label: 'Button text', href: '#item-6' },
  { id: 'item-7', label: 'Button text', href: '#item-7' },
  /* An 8th entry makes the Figma "More horizontal" overflow trigger appear after the 7 visible entries */
  { id: 'item-8', label: 'Button text', href: '#item-8' },
];

const LONG_NAV_ITEMS: HeaderNavItemData[] = [
  { id: 'patients', label: 'Patients', href: '#patients' },
  { id: 'orders', label: 'Orders', href: '#orders' },
  { id: 'scans', label: 'Scans', href: '#scans' },
  { id: 'treatments', label: 'Treatment plans', href: '#treatments' },
  { id: 'appliances', label: 'Appliances', href: '#appliances' },
  { id: 'reports', label: 'Reports', href: '#reports' },
  { id: 'practice', label: 'Practice settings', href: '#practice' },
  { id: 'billing', label: 'Billing', href: '#billing' },
  { id: 'support', label: 'Support', href: '#support' },
  { id: 'academy', label: 'iTero Academy', href: '#academy' },
];

/** The Figma header's right-hand side: two slot buttons · divider · three slot buttons · search / notifications / settings. */
const Actions = () => (
  <>
    <HeaderAction icon="add" label="Slot action 1" />
    <HeaderAction icon="add" label="Slot action 2" />
    <HeaderDivider />
    <HeaderAction icon="add" label="Slot action 3" />
    <HeaderAction icon="add" label="Slot action 4" />
    <HeaderAction icon="add" label="Slot action 5" />
    <HeaderAction icon="search" label="Search" />
    <HeaderAction icon="notification-outline" label="Notifications" />
    <HeaderAction icon="settings" label="Settings" />
  </>
);

/* ── Layout helpers (story-only) ── */

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 8, verticalAlign: 'middle' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};
const sectionTitle: React.CSSProperties = {
  font: '500 16px/24px var(--scanner-font-sans)',
  color: 'var(--scanner-text-primary)',
  margin: '24px 0 8px',
};
const frame: React.CSSProperties = { width: 1100, background: 'var(--scanner-bg-page)' };

/* ------------------------------------------------------------------ */

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Application header: logo, primary navigation and global actions. `menu="visible"` renders the ' +
          'navigation inline (Figma "Menu=Visible"); `menu="hidden"` replaces it with a hamburger trigger ' +
          'for an app-owned navigation panel (Figma "Menu=Hidden"). Entries beyond `maxVisibleNavItems` ' +
          '(7 in Figma) move into the overflow menu behind the "…" trigger.',
      },
    },
  },
  argTypes: {
    menu: { name: 'Menu', control: 'inline-radio', options: MENUS },
    logoVariation: {
      name: 'Logo variation',
      control: 'select',
      options: ['itero', 'align', 'align-xray-insight', 'invisalign', 'invisalign-first', 'vivera-retainers', 'itero-exocad', 'all-logos'],
    },
    logoHeight: { control: { type: 'number', min: 16, max: 48 } },
    logoHref: { control: 'text' },
    maxVisibleNavItems: { control: { type: 'number', min: 0, max: 12 } },
    activeItemId: { control: 'text' },
    defaultActiveItemId: { control: 'text' },
    navLabel: { control: 'text' },
    overflowLabel: { control: 'text' },
    menuButtonLabel: { control: 'text' },
    menuOpen: { control: 'boolean' },
    defaultMenuOpen: { control: 'boolean' },
  },
  args: {
    menu: 'visible',
    logoVariation: 'itero',
    navItems: NAV_ITEMS,
    actions: <Actions />,
    user: <HeaderAction icon="account" label="Account" />,
    onNavItemSelect: fn((_id, _item, event) => event.preventDefault()),
    onMenuOpenChange: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof Header>;

/** Playground with controls for every prop. */
export const Default: Story = {};

/** Figma "Menu=Visible" — navigation rendered inline next to the logo. */
export const MenuVisible: Story = {
  args: { menu: 'visible' },
};

/** Figma "Menu=Hidden" — hamburger trigger for an app-owned navigation panel. */
export const MenuHidden: Story = {
  args: { menu: 'hidden', menuControls: 'app-nav-panel' },
};

/** Both Figma variants, one above the other, exactly as the Figma component set is laid out. */
export const FigmaMatrix: Story = {
  render: (args) => (
    <div style={{ padding: 16 }}>
      {MENUS.map((menu) => (
        <div key={menu}>
          <p style={sectionTitle}>Menu = {menu === 'visible' ? 'Visible' : 'Hidden'}</p>
          <div style={frame}>
            <Header {...args} menu={menu} />
          </div>
        </div>
      ))}
    </div>
  ),
};

/** Navigation entries in every interactive state (forced via `data-state`), plus the current entry. */
export const AllStates: Story = {
  render: (args) => (
    <div style={{ padding: 16 }}>
      <p style={sectionTitle}>Navigation entries</p>
      <table style={table}>
        <tbody>
          {STATES.map((state: State) => (
            <tr key={state}>
              <th scope="row" style={headCell}>
                {state}
              </th>
              <td style={cell}>
                <div style={frame}>
                  <Header
                    {...args}
                    navItems={[
                      {
                        id: 'item-1',
                        label: 'Button text',
                        href: '#item-1',
                        disabled: state === 'disabled',
                        'data-state':
                          state === 'enabled' || state === 'disabled'
                            ? undefined
                            : (state as HeaderForcedState),
                      },
                      { id: 'item-2', label: 'Current page', href: '#item-2' },
                    ]}
                    defaultActiveItemId="item-2"
                    actions={
                      <>
                        <HeaderAction
                          icon="search"
                          label="Search"
                          disabled={state === 'disabled'}
                          data-state={
                            state === 'enabled' || state === 'disabled'
                              ? undefined
                              : (state as HeaderForcedState)
                          }
                        />
                        <HeaderDivider />
                        <HeaderAction icon="settings" label="Settings" />
                      </>
                    }
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

/** Ten entries with a `maxVisibleNavItems` of 7 — the rest move into the overflow menu. */
export const LongNavigation: Story = {
  args: {
    navItems: LONG_NAV_ITEMS,
    defaultActiveItemId: 'patients',
    maxVisibleNavItems: 7,
  },
};

/** The active entry lives inside the overflow menu — the "…" trigger carries the current background. */
export const OverflowMenuOpen: Story = {
  args: {
    navItems: LONG_NAV_ITEMS,
    defaultActiveItemId: 'academy',
    maxVisibleNavItems: 4,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'More' }));
    await waitFor(() => expect(canvas.getByRole('menu', { name: 'More' })).toBeInTheDocument());
  },
};

/** Dark theme (Figma renders the header set in "Align dark"). */
export const DarkTheme: Story = {
  render: (args) => (
    <div data-theme="dark" style={{ ...frame, width: '100%', padding: 16 }}>
      <Header {...args} />
    </div>
  ),
};

/** Only a logo and actions — no navigation, no hamburger. */
export const LogoAndActionsOnly: Story = {
  args: {
    navItems: [],
    actions: (
      <>
        <HeaderAction icon="notification-outline" label="Notifications" />
        <HeaderAction icon="settings" label="Settings" />
      </>
    ),
  },
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

/** Clicking a navigation entry activates it (`aria-current="page"`) and fires `onNavItemSelect`. */
export const NavigationActivation: Story = {
  args: {
    defaultActiveItemId: 'item-1',
    onNavItemSelect: fn((_id, _item, event) => event.preventDefault()),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const links = canvas.getAllByRole('link');
    await expect(links[0]).toHaveAttribute('aria-current', 'page');

    await userEvent.click(links[2]);
    await expect(args.onNavItemSelect).toHaveBeenCalled();
    await waitFor(() => expect(links[2]).toHaveAttribute('aria-current', 'page'));
    await expect(links[0]).not.toHaveAttribute('aria-current');
  },
};

/** The overflow trigger opens and closes the menu with the mouse and with the keyboard. */
export const OverflowMenuKeyboard: Story = {
  args: { navItems: LONG_NAV_ITEMS, maxVisibleNavItems: 4 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'More' });
    await expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    /* Mouse: open then close again */
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    /* Keyboard: ArrowDown opens with the first item focused, Escape closes and restores focus */
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    const menu = await canvas.findByRole('menu', { name: 'More' });
    await waitFor(() => expect(within(menu).getAllByRole('menuitem')[0]).toHaveFocus());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};

/** The hamburger toggles `aria-expanded` and reports the new state. */
export const MenuTriggerToggles: Story = {
  args: { menu: 'hidden', menuControls: 'app-nav-panel', onMenuOpenChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Main menu' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveAttribute('aria-controls', 'app-nav-panel');

    await userEvent.click(trigger);
    await expect(args.onMenuOpenChange).toHaveBeenCalledWith(true);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  },
};
