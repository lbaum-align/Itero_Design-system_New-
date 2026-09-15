import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { MenuTrailingElements } from './MenuTrailingElements';
import type { MenuTrailingElementsProps, MenuTrailingType } from './menu-trailing-elements.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → _Menu trailing elements (node 31214:149912, page "Menu").
 * Type (Submenu, Keyboard shortcut, Toggle) × Show label — every combination is rendered in `FigmaMatrix`.
 */

const TYPES: MenuTrailingType[] = ['submenu', 'shortcut', 'toggle'];
const typeLabel: Record<MenuTrailingType, string> = {
  submenu: 'Submenu',
  shortcut: 'Keyboard shortcut',
  toggle: 'Toggle',
};

function variantProps(type: MenuTrailingType, showLabel: boolean, disabled = false): MenuTrailingElementsProps {
  return {
    type,
    shortcutKeys: ['⌘', 'X'],
    label: 'Label',
    showLabel,
    toggleAriaLabel: 'Setting',
    disabled,
  };
}

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 12, verticalAlign: 'middle' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const meta: Meta<typeof MenuTrailingElements> = {
  title: 'Private/_MenuTrailingElements',
  component: MenuTrailingElements,
  parameters: {
    docs: {
      description: {
        component:
          'Trailing slot of a menu item: keyboard shortcut, toggle (regular 51.2×32 Toggle, no value text) or submenu chevron with an optional label.',
      },
    },
  },
  argTypes: {
    type: { name: 'Type', control: 'inline-radio', options: TYPES },
    showLabel: { name: 'Show label', control: 'boolean' },
    label: { control: 'text' },
    shortcutKeys: { control: 'object' },
    toggleSelected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    type: 'shortcut',
    shortcutKeys: ['⌘', 'X'],
    label: 'Label',
    showLabel: false,
    toggleSelected: false,
    onToggleChange: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof MenuTrailingElements>;

export const Default: Story = {};

export const KeyboardShortcut: Story = { name: 'Type: Keyboard shortcut', args: { type: 'shortcut' } };
export const Toggle: Story = { name: 'Type: Toggle', args: { type: 'toggle', toggleAriaLabel: 'Setting' } };
export const Submenu: Story = { name: 'Type: Submenu', args: { type: 'submenu' } };
export const SubmenuWithLabel: Story = {
  name: 'Type: Submenu, Show label',
  args: { type: 'submenu', showLabel: true },
};

/** Figma has no states; menu items pass `disabled` down. */
export const AllStates: Story = {
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          <th style={headCell}>Enabled</th>
          <th style={headCell}>Disabled (menu item)</th>
        </tr>
      </thead>
      <tbody>
        {TYPES.map((t) => (
          <tr key={t}>
            <th style={headCell}>{typeLabel[t]}</th>
            <td style={cell}>
              <MenuTrailingElements {...variantProps(t, t === 'submenu')} />
            </td>
            <td style={cell}>
              <MenuTrailingElements {...variantProps(t, t === 'submenu', true)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 3 variants × Show label)',
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          <th style={headCell}>Show label: False</th>
          <th style={headCell}>Show label: True</th>
        </tr>
      </thead>
      <tbody>
        {TYPES.map((t) => (
          <tr key={t}>
            <th style={headCell}>{`Type=${typeLabel[t]}`}</th>
            <td style={cell}>
              <MenuTrailingElements {...variantProps(t, false)} />
            </td>
            <td style={cell}>
              <MenuTrailingElements {...variantProps(t, true)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/** Toggle selected on/off and multi-key shortcuts. */
export const Options: Story = {
  render: () => (
    <table style={table}>
      <tbody>
        <tr>
          <th style={headCell}>Toggle on</th>
          <td style={cell}>
            <MenuTrailingElements type="toggle" toggleSelected toggleAriaLabel="Setting" />
          </td>
        </tr>
        <tr>
          <th style={headCell}>Shortcut ⇧⌘Z</th>
          <td style={cell}>
            <MenuTrailingElements shortcutKeys={['⇧', '⌘', 'Z']} />
          </td>
        </tr>
        <tr>
          <th style={headCell}>Long submenu label</th>
          <td style={cell}>
            <MenuTrailingElements type="submenu" label="Portable Network Graphics" showLabel />
          </td>
        </tr>
      </tbody>
    </table>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

const ControlledToggle = (props: MenuTrailingElementsProps) => {
  const [on, setOn] = useState(false);
  return (
    <MenuTrailingElements
      {...props}
      type="toggle"
      toggleSelected={on}
      onToggleChange={(next) => {
        setOn(next);
        props.onToggleChange?.(next);
      }}
    />
  );
};

export const ToggleChanges: Story = {
  tags: ['test'],
  args: { toggleAriaLabel: 'Setting' },
  render: (args) => <ControlledToggle {...args} />,
  play: async ({ args, canvasElement }) => {
    const toggle = within(canvasElement).getByRole('switch', { name: 'Setting' });
    await userEvent.click(toggle);
    await expect(args.onToggleChange).toHaveBeenCalledWith(true);
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
  },
};
