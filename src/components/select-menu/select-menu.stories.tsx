import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { SelectMenu } from './SelectMenu';
import type { SelectMenuProps, SelectMenuSize } from './select-menu.types';
import { SelectMenuItem } from '../_select-menu-item';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Select menu (node 30409:27826, page "Dropdown").
 * Size (X-Large, Large, Medium, Small) × Scroll — every combination is rendered in `FigmaMatrix`.
 * Options: see Private/_SelectMenuItem.
 */

const SIZES: SelectMenuSize[] = ['x-large', 'large', 'medium', 'small'];
const sizeLabel: Record<SelectMenuSize, string> = { 'x-large': 'X-Large', large: 'Large', medium: 'Medium', small: 'Small' };

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 16, verticalAlign: 'top' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const OPTIONS = Array.from({ length: 8 }, (_, i) => ({ value: `option-${i + 1}`, label: `Option ${i + 1}` }));

/** Figma content: 8 options, "Option 1" … "Option 8". */
const FigmaOptions = ({ count = 8 }: { count?: number }) => (
  <>
    {Array.from({ length: count }, (_, i) => (
      <SelectMenuItem key={i} value={`option-${i + 1}`} optionText={`Option ${i + 1}`} />
    ))}
  </>
);

/* ------------------------------------------------------------------ */

const meta: Meta<typeof SelectMenu> = {
  title: 'Components/SelectMenu',
  component: SelectMenu,
  parameters: {
    docs: {
      description: {
        component:
          'Option list for Dropdown, Combobox and SearchInput (`role="listbox"`). Controlled `value`/`onChange` or `defaultValue`. ' +
          'Keyboard: ArrowUp/ArrowDown move, Home/End jump, Enter/Space select, Escape closes (`onClose`). ' +
          '`focusMode="activedescendant"` keeps focus on the list (or an input) and exposes `aria-activedescendant`.',
      },
    },
  },
  argTypes: {
    size: { name: 'Size', control: 'inline-radio', options: SIZES },
    scroll: { name: 'Scroll', control: 'boolean' },
    maxHeight: { control: 'number' },
    focusMode: { control: 'inline-radio', options: ['roving', 'activedescendant'] },
  },
  args: { size: 'x-large', scroll: false, focusMode: 'roving', onChange: fn(), onClose: fn(), 'aria-label': 'Options' },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: 'var(--scanner-bg-page)', minHeight: 320 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SelectMenu>;

/* ── Default: controlled selection ── */

const Controlled = (args: SelectMenuProps) => {
  const [value, setValue] = useState<string | null>(args.value ?? 'option-2');
  return (
    <SelectMenu
      {...args}
      value={value}
      onChange={(v) => {
        setValue(v);
        args.onChange?.(v);
      }}
    >
      {OPTIONS.slice(0, 5).map((o) => (
        <SelectMenuItem key={o.value} value={o.value} optionText={o.label} disabled={o.value === 'option-4'} />
      ))}
    </SelectMenu>
  );
};

export const Default: Story = { render: (args) => <Controlled {...args} /> };

/* ── Per size ── */

export const XLarge: Story = { name: 'Size: X-Large', args: { size: 'x-large' }, render: (args) => <SelectMenu {...args}><FigmaOptions /></SelectMenu> };
export const Large: Story = { name: 'Size: Large', args: { size: 'large' }, render: (args) => <SelectMenu {...args}><FigmaOptions /></SelectMenu> };
export const Medium: Story = { name: 'Size: Medium', args: { size: 'medium' }, render: (args) => <SelectMenu {...args}><FigmaOptions /></SelectMenu> };
export const Small: Story = { name: 'Size: Small', args: { size: 'small' }, render: (args) => <SelectMenu {...args}><FigmaOptions /></SelectMenu> };

export const AllSizes: Story = {
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          {SIZES.map((s) => (
            <th key={s} style={headCell}>{`Size=${sizeLabel[s]}`}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {SIZES.map((s) => (
            <td key={s} style={cell}>
              <SelectMenu size={s} defaultValue="option-2" aria-label={`${s} options`}>
                <FigmaOptions count={5} />
              </SelectMenu>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  ),
};

/* ── Figma matrix: Size × Scroll ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (4 sizes × Scroll)',
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {SIZES.map((s) => (
            <th key={s} style={headCell}>{`Size=${sizeLabel[s]}`}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[false, true].map((scroll) => (
          <tr key={String(scroll)}>
            <th style={headCell}>{`Scroll=${scroll ? 'True' : 'False'}`}</th>
            {SIZES.map((s) => (
              <td key={s} style={cell}>
                <SelectMenu size={s} scroll={scroll} maxHeight={scroll ? 200 : undefined} aria-label={`${s} options`}>
                  <FigmaOptions count={scroll ? 14 : 8} />
                </SelectMenu>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Option states inside a list (forced) ── */

export const AllStates: Story = {
  render: () => (
    <table style={table}>
      <tbody>
        <tr>
          {SIZES.map((s) => (
            <td key={s} style={cell}>
              <SelectMenu size={s} aria-label={`${s} options`}>
                <SelectMenuItem optionText="Enabled" />
                <SelectMenuItem optionText="Hovered" data-state="hovered" />
                <SelectMenuItem optionText="Focused" data-state="focused" />
                <SelectMenuItem optionText="Disabled" disabled />
                <SelectMenuItem optionText="Selected" selected />
                <SelectMenuItem optionText="Selected hovered" selected data-state="hovered" />
                <SelectMenuItem optionText="Selected focused" selected data-state="focused" />
                <SelectMenuItem optionText="Selected disabled" selected disabled />
              </SelectMenu>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  ),
};

export const WithHeadlinesAndDividers: Story = {
  render: (args) => (
    <SelectMenu {...args} size="large" defaultValue="us">
      <SelectMenuItem value="us" optionText="United States" showHeadline headlineText="Americas" />
      <SelectMenuItem value="ca" optionText="Canada" showDivider />
      <SelectMenuItem value="uk" optionText="United Kingdom" showHeadline headlineText="Europe" />
      <SelectMenuItem value="de" optionText="Germany" showSubtext subheadText="EU member" />
    </SelectMenu>
  ),
};

export const WithScroll: Story = {
  name: 'Scroll (long list)',
  args: { scroll: true, maxHeight: 240, size: 'medium' },
  render: (args) => (
    <SelectMenu {...args}>
      <FigmaOptions count={20} />
    </SelectMenu>
  ),
};

export const LongOptionTruncates: Story = {
  render: (args) => (
    <SelectMenu {...args} defaultValue="long">
      <SelectMenuItem value="long" optionText="Invisalign Outcome Simulator Pro with progress assessment" />
      <SelectMenuItem value="short" optionText="Short" />
    </SelectMenu>
  ),
};

/* ── Active-descendant mode (for Combobox / SearchInput) ── */

export const ActiveDescendant: Story = {
  args: { focusMode: 'activedescendant' },
  render: (args) => <Controlled {...args} />,
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const KeyboardSelection: Story = {
  tags: ['test'],
  render: (args) => <Controlled {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    /* Focus starts on the selected option */
    await expect(canvas.getByRole('option', { name: 'Option 2' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('option', { name: 'Option 3' })).toHaveFocus();
    /* Disabled Option 4 is skipped */
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('option', { name: 'Option 5' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onChange).toHaveBeenCalledWith('option-5');
    await expect(canvas.getByRole('option', { name: 'Option 5' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{Home}');
    await expect(canvas.getByRole('option', { name: 'Option 1' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('option', { name: 'Option 5' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(args.onClose).toHaveBeenCalledTimes(1);
  },
};

export const ClickSelects: Story = {
  tags: ['test'],
  render: (args) => <Controlled {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('option', { name: 'Option 1' }));
    await expect(args.onChange).toHaveBeenCalledWith('option-1');
    await expect(canvas.getByRole('option', { name: 'Option 1' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(canvas.getByRole('option', { name: 'Option 4' }), { pointerEventsCheck: 0 });
    await expect(args.onChange).toHaveBeenCalledTimes(1);
  },
};

export const ActiveDescendantKeyboard: Story = {
  tags: ['test'],
  args: { focusMode: 'activedescendant' },
  render: (args) => <Controlled {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const listbox = canvas.getByRole('listbox');
    await userEvent.tab();
    await expect(listbox).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    const option3 = canvas.getByRole('option', { name: 'Option 3' });
    await expect(listbox).toHaveAttribute('aria-activedescendant', option3.id);
    await userEvent.keyboard(' ');
    await expect(args.onChange).toHaveBeenCalledWith('option-3');
  },
};
