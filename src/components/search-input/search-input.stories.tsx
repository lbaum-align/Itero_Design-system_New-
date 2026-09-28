import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { SelectMenuItem } from '../_select-menu-item';
import { SearchInput } from './SearchInput';
import type { SearchInputProps, SearchInputSize } from './search-input.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Search input (node 849:95, page 15305:6748)
 * Size × Layer set × Filled × State = 36 variants — every combination is rendered in `FigmaMatrix`.
 */

const SIZES: SearchInputSize[] = ['large', 'medium', 'small'];
const LAYERS = [1, 2] as const;
/** Figma variant columns: Enabled (Filled=False), Filled (Filled=True), Focused ×2, Skeleton ×2 */
const COMBOS = [
  { state: 'enabled', filled: false, label: 'Filled=False, State=Enabled' },
  { state: 'filled', filled: true, label: 'Filled=True, State=Filled' },
  { state: 'focused', filled: false, label: 'Filled=False, State=Focused' },
  { state: 'focused', filled: true, label: 'Filled=True, State=Focused' },
  { state: 'skeleton', filled: false, label: 'Filled=False, State=Skeleton' },
  { state: 'skeleton', filled: true, label: 'Filled=True, State=Skeleton' },
] as const;
type State = (typeof COMBOS)[number]['state'];

const sizeLabel: Record<SearchInputSize, string> = { large: 'Large', medium: 'Medium', small: 'Small' };

/** Props for one Figma variant (Figma "Filled text value" default: "Search"). */
function variantProps(size: SearchInputSize, layer: 1 | 2, filled: boolean, state: State): SearchInputProps {
  return {
    size,
    layer,
    defaultValue: filled ? 'Search' : undefined,
    skeleton: state === 'skeleton',
    'data-state': state === 'focused' ? 'focused' : undefined,
  };
}

const FRUITS = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Mango', 'Orange'];

/* ── Layout helpers (story-only) ── */

const FIELD_WIDTH = 288;
const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 12, verticalAlign: 'top', width: FIELD_WIDTH };
const headCell: React.CSSProperties = {
  padding: 12,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  verticalAlign: 'top',
  whiteSpace: 'nowrap',
};
const sectionTitle: React.CSSProperties = {
  font: '500 16px/24px var(--scanner-font-sans)',
  color: 'var(--scanner-text-primary)',
  margin: '24px 0 8px',
};
/** Neutral accent background so both Set 01 (white) and Set 02 (grey) fields are visible */
const canvas: React.CSSProperties = { background: 'var(--scanner-bg-accent)', padding: 16 };

/* ------------------------------------------------------------------ */

const meta: Meta<typeof SearchInput> = {
  title: 'Components/SearchInput',
  component: SearchInput,
  parameters: {
    docs: {
      description: {
        component:
          'Lets users enter a search query to find content, data or items. Shows a clear (×) action once filled. ' +
          'Keyboard: Tab focuses the field; Enter runs `onSearch`; Escape closes the suggestions menu, then clears the field. ' +
          'With `suggestions` the input is a combobox: ArrowDown/ArrowUp highlight options, Enter picks one.',
      },
    },
  },
  argTypes: {
    size: { name: 'Size', control: 'inline-radio', options: SIZES },
    layer: { name: 'Layer set', control: 'inline-radio', options: [1, 2] },
    placeholder: { control: 'text' },
    defaultValue: { name: 'Filled text value', control: 'text' },
    skeleton: { control: 'boolean' },
    'data-state': { name: 'Forced state', control: 'inline-radio', options: [undefined, 'focused'] },
    showMenu: { name: 'Show menu', control: 'boolean' },
    menuSize: { control: 'inline-radio', options: ['x-large', 'large', 'medium', 'small'] },
    clearLabel: { control: 'text' },
  },
  args: {
    size: 'large',
    layer: 1,
    placeholder: 'Search',
    onChange: fn(),
    onClear: fn(),
    onSearch: fn(),
  },
  decorators: [
    (Story, { parameters }) => (
      <div style={canvas}>
        <div style={parameters.layout === 'fullscreen' ? undefined : { width: FIELD_WIDTH }}>
          <Story />
        </div>
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SearchInput>;

/* ── Default ── */

export const Default: Story = {};

/* ── Sizes ── */

export const Large: Story = { name: 'Size: Large', args: { size: 'large' } };
export const Medium: Story = { name: 'Size: Medium', args: { size: 'medium' } };
export const Small: Story = { name: 'Size: Small', args: { size: 'small' } };

/* ── Layer set ── */

export const LayerSet01: Story = { name: 'Layer set: Set 01', args: { layer: 1 } };
export const LayerSet02: Story = { name: 'Layer set: Set 02', args: { layer: 2 } };

/* ── States ── */

export const Enabled: Story = { name: 'State: Enabled' };
export const Filled: Story = { name: 'State: Filled', args: { defaultValue: 'Search' } };
export const Focused: Story = { name: 'State: Focused', args: { 'data-state': 'focused' } };
export const FocusedFilled: Story = {
  name: 'State: Focused (Filled)',
  args: { 'data-state': 'focused', defaultValue: 'Search' },
};
export const Skeleton: Story = { name: 'State: Skeleton', args: { skeleton: true } };

/* ── Show menu ── */

const fruitItems = (query: string) =>
  FRUITS.filter((f) => f.toLowerCase().includes(query.toLowerCase())).map((f) => (
    <SelectMenuItem key={f} value={f} optionText={f} />
  ));

export const ShowMenu: Story = {
  name: 'Show menu',
  parameters: { layout: 'fullscreen' },
  args: { showMenu: true, defaultValue: 'a', 'data-state': 'focused' },
  render: (args) => (
    <div style={{ width: FIELD_WIDTH, height: 420 }}>
      <SearchInput {...args} suggestions={fruitItems('')} />
    </div>
  ),
};

const SuggestionsDemo = (args: SearchInputProps) => {
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div style={{ width: FIELD_WIDTH, height: 420 }}>
      <SearchInput
        {...args}
        aria-label="Search fruit"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        suggestions={query ? fruitItems(query) : null}
        onSuggestionSelect={setPicked}
      />
      <p style={{ font: '14px/20px var(--scanner-font-sans)', color: 'var(--scanner-text-secondary)', marginTop: 8 }}>
        {picked ? `Picked: ${picked}` : 'Type "a", then use ArrowDown + Enter'}
      </p>
    </div>
  );
};

export const WithSuggestions: Story = {
  name: 'Suggestions (interactive)',
  parameters: { layout: 'fullscreen' },
  render: (args) => <SuggestionsDemo {...args} />,
};

/* ── All sizes ── */

export const AllSizes: Story = {
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          <th style={headCell}>Filled: False</th>
          <th style={headCell}>Filled: True</th>
        </tr>
      </thead>
      <tbody>
        {SIZES.map((s) => (
          <tr key={s}>
            <th style={headCell}>{sizeLabel[s]}</th>
            <td style={cell}>
              <SearchInput {...variantProps(s, args.layer ?? 1, false, 'enabled')} />
            </td>
            <td style={cell}>
              <SearchInput {...variantProps(s, args.layer ?? 1, true, 'filled')} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── All states — rows: states, columns: Layer set × Filled ── */

export const AllStates: Story = {
  parameters: { layout: 'fullscreen' },
  render: ({ size = 'large' }) => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {LAYERS.map((l) => (
            <th key={l} style={headCell}>{`Set 0${l}`}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {COMBOS.map((c) => (
          <tr key={c.label}>
            <th style={headCell}>{c.label}</th>
            {LAYERS.map((l) => (
              <td key={l} style={cell}>
                <SearchInput {...variantProps(size, l, c.filled, c.state)} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Full Figma matrix: all 36 variants, laid out like the component set ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 36 variants)',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div>
      {SIZES.map((s) => (
        <section key={s}>
          <h3 style={sectionTitle}>{`Size=${sizeLabel[s]}`}</h3>
          <table style={table}>
            <thead>
              <tr>
                <th style={headCell} />
                {LAYERS.map((l) => (
                  <th key={l} style={headCell}>{`Layer set=Set 0${l}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMBOS.map((c) => (
                <tr key={c.label}>
                  <th style={headCell}>{c.label}</th>
                  {LAYERS.map((l) => (
                    <td key={l} style={cell}>
                      <SearchInput {...variantProps(s, l, c.filled, c.state)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  ),
};

/* ── Overflow: long query scrolls inside the field, ellipsis when not focused ── */

export const LongQuery: Story = {
  name: 'Overflow content',
  args: { defaultValue: 'A very long search query that does not fit inside the field width' },
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const TypingAndEnterSearches: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole('searchbox', { name: 'Search' });
    await userEvent.click(input);
    await expect(input).toHaveFocus();
    await userEvent.type(input, 'abc{Enter}');
    await expect(input).toHaveValue('abc');
    await expect(args.onChange).toHaveBeenCalledTimes(3);
    await expect(args.onSearch).toHaveBeenCalledWith('abc');
  },
};

export const ClearButtonClears: Story = {
  tags: ['test'],
  args: { defaultValue: 'Search' },
  play: async ({ args, canvasElement }) => {
    const view = within(canvasElement);
    const input = view.getByRole('searchbox');
    await userEvent.click(view.getByRole('button', { name: 'Clear search' }));
    await expect(input).toHaveValue('');
    await expect(input).toHaveFocus();
    await expect(args.onClear).toHaveBeenCalledTimes(1);
    await expect(view.queryByRole('button', { name: 'Clear search' })).toBeNull();
  },
};

export const EscapeClears: Story = {
  tags: ['test'],
  args: { defaultValue: 'Search' },
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole('searchbox');
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(input).toHaveValue('');
    await expect(args.onClear).toHaveBeenCalled();
  },
};

export const KeyboardSuggestions: Story = {
  tags: ['test'],
  parameters: { layout: 'fullscreen' },
  render: (args) => <SuggestionsDemo {...args} />,
  play: async ({ canvasElement }) => {
    const view = within(canvasElement);
    const input = view.getByRole('combobox', { name: 'Search fruit' }) as HTMLInputElement;
    await userEvent.click(input);
    await userEvent.type(input, 'ap');
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{ArrowDown}');
    const first = view.getByRole('option', { name: 'Apple' });
    await expect(input).toHaveAttribute('aria-activedescendant', first.id);
    await expect(input).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(input).toHaveValue('Apricot');
    await expect(view.getByText('Picked: Apricot')).toBeInTheDocument();
    await expect(input).toHaveAttribute('aria-expanded', 'false');
  },
};

export const ClickSuggestion: Story = {
  tags: ['test'],
  parameters: { layout: 'fullscreen' },
  render: (args) => <SuggestionsDemo {...args} />,
  play: async ({ canvasElement }) => {
    const view = within(canvasElement);
    const input = view.getByRole('combobox');
    await userEvent.type(input, 'ban');
    await userEvent.click(view.getByRole('option', { name: 'Banana' }));
    await expect(input).toHaveValue('Banana');
    await expect(input).toHaveFocus();
  },
};
