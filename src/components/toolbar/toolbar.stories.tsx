import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Toolbar } from './Toolbar';
import { ToolbarButton } from './ToolbarButton';
import { ToolbarDivider } from './ToolbarDivider';

/*
 * Toolbar is not a Figma component — sizes come from the product spec
 * (60px buttons, 48px icons, 8px radius, 4px gaps, white surface).
 */

const cell: React.CSSProperties = { padding: 12, verticalAlign: 'middle' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};
const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };

const Tools = () => (
  <>
    <ToolbarButton iconName="edit" label="Edit" />
    <ToolbarButton iconName="filter" label="Filter" />
    <ToolbarButton iconName="search" label="Search" />
  </>
);

const meta: Meta<typeof Toolbar> = {
  title: 'Components/Toolbar',
  component: Toolbar,
  parameters: {
    docs: {
      description: {
        component:
          'A bar of 60×60 icon buttons (48px icons) with an optional expand/collapse button and divider at the start. ' +
          'Not from Figma: sizes come from the product spec, colours are semantic tokens. ' +
          'Keyboard: one tab stop, arrow keys move between buttons, Home/End jump to the ends.',
      },
    },
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    collapsible: { control: 'boolean' },
    collapsed: { control: 'boolean' },
    layer: { control: 'inline-radio', options: [1, 2] },
  },
  args: {
    orientation: 'horizontal',
    collapsible: true,
    'aria-label': 'Scan tools',
    onCollapsedChange: fn(),
    children: <Tools />,
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: 'var(--scanner-bg-page)' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Toolbar>;

export const Default: Story = {};

export const Horizontal: Story = { args: { orientation: 'horizontal' } };
export const Vertical: Story = { args: { orientation: 'vertical' } };

export const WithoutCollapse: Story = { args: { collapsible: false } };

export const Collapsed: Story = { args: { collapsed: true } };

export const WithSelectedButton: Story = {
  args: {
    children: (
      <>
        <ToolbarButton iconName="edit" label="Edit" />
        <ToolbarButton iconName="filter" label="Filter" selected />
        <ToolbarButton iconName="search" label="Search" />
      </>
    ),
  },
};

export const WithGroups: Story = {
  name: 'With divider between groups',
  args: {
    children: (
      <>
        <ToolbarButton iconName="edit" label="Edit" />
        <ToolbarButton iconName="copy" label="Duplicate" />
        <ToolbarDivider />
        <ToolbarButton iconName="close" label="Delete" />
      </>
    ),
  },
};

export const DisabledButton: Story = {
  args: {
    children: (
      <>
        <ToolbarButton iconName="edit" label="Edit" />
        <ToolbarButton iconName="filter" label="Filter" disabled />
        <ToolbarButton iconName="search" label="Search" />
      </>
    ),
  },
};

/* ── Button states ── */

export const AllStates: Story = {
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {['Enabled', 'Hovered', 'Focused', 'Pressed', 'Disabled'].map((s) => (
            <th key={s} style={headCell}>{s}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[false, true].map((selected) => (
          <tr key={String(selected)}>
            <th style={headCell}>{selected ? 'Selected' : 'Default'}</th>
            {(['enabled', 'hovered', 'focused', 'pressed', 'disabled'] as const).map((state) => (
              <td key={state} style={cell}>
                <Toolbar aria-label={`${selected ? 'Selected' : 'Default'} ${state}`}>
                  <ToolbarButton
                    iconName="edit"
                    label="Edit"
                    selected={selected}
                    disabled={state === 'disabled'}
                    data-state={
                      state === 'hovered' || state === 'focused' || state === 'pressed' ? state : undefined
                    }
                  />
                </Toolbar>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const Orientations: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      {(['horizontal', 'vertical'] as const).map((orientation) => (
        <Toolbar key={orientation} orientation={orientation} collapsible aria-label={orientation}>
          <Tools />
        </Toolbar>
      ))}
    </div>
  ),
};

export const Layers: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 32 }}>
      {([1, 2] as const).map((layer) => (
        <Toolbar key={layer} layer={layer} collapsible aria-label={`Layer ${layer}`}>
          <Tools />
        </Toolbar>
      ))}
    </div>
  ),
};

const CollapseDemo = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <Toolbar collapsible collapsed={collapsed} onCollapsedChange={setCollapsed} aria-label="Scan tools">
        <Tools />
      </Toolbar>
      <p style={{ margin: 0, font: '12px/16px var(--scanner-font-sans)', color: 'var(--scanner-text-secondary)' }}>
        {collapsed ? 'Collapsed' : 'Expanded'}
      </p>
    </div>
  );
};

export const Controlled: Story = { render: () => <CollapseDemo /> };

export const ManyButtons: Story = {
  args: {
    children: (
      <>
        <ToolbarButton iconName="edit" label="Edit" />
        <ToolbarButton iconName="copy" label="Duplicate" />
        <ToolbarButton iconName="filter" label="Filter" />
        <ToolbarButton iconName="search" label="Search" />
        <ToolbarButton iconName="settings" label="Settings" />
        <ToolbarDivider />
        <ToolbarButton iconName="close" label="Delete" />
      </>
    ),
  },
};

/* ── Interaction tests ── */

export const CollapseTogglesButtons: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Collapse toolbar' }));
    await expect(args.onCollapsedChange).toHaveBeenCalledWith(true);
    await expect(canvas.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Expand toolbar' })).toBeInTheDocument();
  },
};

export const ArrowKeysMoveBetweenButtons: Story = {
  tags: ['test'],
  args: { collapsible: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [edit, filter, search] = ['Edit', 'Filter', 'Search'].map((name) =>
      canvas.getByRole('button', { name }),
    );
    edit.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(filter).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(search).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(edit).toHaveFocus();
  },
};

export const DisabledButtonIsSkipped: Story = {
  tags: ['test'],
  args: {
    collapsible: false,
    children: (
      <>
        <ToolbarButton iconName="edit" label="Edit" />
        <ToolbarButton iconName="filter" label="Filter" disabled />
        <ToolbarButton iconName="search" label="Search" />
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button', { name: 'Edit' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: 'Search' })).toHaveFocus();
  },
};
