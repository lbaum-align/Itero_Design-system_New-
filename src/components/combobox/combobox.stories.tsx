import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Combobox } from './Combobox';
import type { ComboboxOption, ComboboxProps, ComboboxSize, ComboboxType } from './combobox.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Combobox (node 34220:8533, page "Dropdown")
 * Layer set × Size × Type × Selected × State = 192 variants — every combination is rendered in `FigmaMatrix`.
 */

const SIZES: ComboboxSize[] = ['x-large', 'large', 'medium', 'small'];
const LAYERS = [1, 2] as const;
const TYPES: ComboboxType[] = ['single', 'multi'];
const SELECTED = [false, true] as const;
const STATES = ['enabled', 'hovered', 'focused', 'disabled', 'error', 'skeleton'] as const;
type State = (typeof STATES)[number];

const sizeLabel: Record<ComboboxSize, string> = { 'x-large': 'X-Large', large: 'Large', medium: 'Medium', small: 'Small' };
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Figma content: "Option 1" … "Option 8". */
const OPTIONS: ComboboxOption[] = Array.from({ length: 8 }, (_, i) => ({ value: `option-${i + 1}`, label: `Option ${i + 1}` }));

/** Props for one Figma variant (Figma defaults: label + helper shown). */
function variantProps(
  size: ComboboxSize,
  layer: 1 | 2,
  type: ComboboxType,
  selected: boolean,
  state: State,
): ComboboxProps {
  const base = {
    size,
    layer,
    options: OPTIONS,
    label: 'Label',
    helperText: 'Optional helper text',
    errorText: 'Error text message',
    disabled: state === 'disabled',
    error: state === 'error',
    skeleton: state === 'skeleton',
    'data-state': state === 'hovered' || state === 'focused' ? state : undefined,
  } as const;
  return type === 'multi'
    ? { ...base, type: 'multi', defaultValue: selected ? ['option-1', 'option-2'] : [] }
    : { ...base, type: 'single', defaultValue: selected ? 'option-1' : null };
}

/* ── Layout helpers (story-only) ── */

const FIELD_WIDTH = 288;
const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 12, verticalAlign: 'top' };
/** Fixed Figma width (288) regardless of table cell sizing */
const Fixed = ({ children }: { children: React.ReactNode }) => <div style={{ width: FIELD_WIDTH }}>{children}</div>;
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
const canvas: React.CSSProperties = { background: 'var(--scanner-bg-accent)', padding: 16, minHeight: 440 };

/* ------------------------------------------------------------------ */

const meta: Meta<typeof Combobox> = {
  title: 'Components/Combobox',
  component: Combobox,
  parameters: {
    docs: {
      description: {
        component:
          'Editable field that filters a list of options as the user types — one value (Type Single) or several shown as tags (Type Multi). ' +
          'Keyboard: typing filters and opens; ArrowUp/ArrowDown open and move; Enter selects; Escape closes, then clears; ' +
          'Backspace in an empty Multi input removes the last tag. Leaving the field restores the selected label.',
      },
    },
  },
  argTypes: {
    size: { name: 'Size', control: 'inline-radio', options: SIZES },
    layer: { name: 'Layer set', control: 'inline-radio', options: [1, 2] },
    type: { name: 'Type', control: 'inline-radio', options: TYPES },
    label: { name: 'Label text value', control: 'text' },
    placeholder: { name: 'Placeholder text value', control: 'text' },
    helperText: { name: 'Helper text value', control: 'text' },
    errorText: { name: 'Error text value', control: 'text' },
    required: { name: 'Required field', control: 'boolean' },
    tooltip: { name: 'Explainer (tooltip)', control: 'text' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    menuMaxHeight: { control: 'number' },
    noResultsText: { control: 'text' },
    'data-state': { name: 'Forced state', control: 'inline-radio', options: [undefined, 'hovered', 'focused'] },
    options: { control: false },
  },
  args: {
    size: 'x-large',
    layer: 1,
    type: 'single',
    options: OPTIONS,
    label: 'Label',
    helperText: 'Optional helper text',
    errorText: 'Error text message',
    onChange: fn(),
    onOpenChange: fn(),
  },
  decorators: [
    /* Single-field stories get the Figma 288px width; matrix stories (layout: fullscreen) size themselves */
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

type Story = StoryObj<typeof Combobox>;

/* ── Default ── */

export const Default: Story = {};

/* ── Sizes ── */

export const XLarge: Story = { name: 'Size: X-Large', args: { size: 'x-large' } };
export const Large: Story = { name: 'Size: Large', args: { size: 'large' } };
export const Medium: Story = { name: 'Size: Medium', args: { size: 'medium' } };
export const Small: Story = { name: 'Size: Small', args: { size: 'small' } };

/* ── Type × Selected ── */

export const Single: Story = { name: 'Type: Single', args: { type: 'single', defaultValue: 'option-1' } };
export const Multi: Story = { name: 'Type: Multi', args: { type: 'multi', defaultValue: ['option-1', 'option-2'] } };
export const SelectedFalse: Story = { name: 'Selected: False' };

/* ── Layer set ── */

export const LayerSet01: Story = { name: 'Layer set: Set 01', args: { layer: 1 } };
export const LayerSet02: Story = { name: 'Layer set: Set 02', args: { layer: 2 } };

/* ── States ── */

export const Hovered: Story = { name: 'State: Hovered', args: { 'data-state': 'hovered' } };
export const Focused: Story = { name: 'State: Focused', args: { 'data-state': 'focused' } };
export const Disabled: Story = { name: 'State: Disabled', args: { disabled: true, defaultValue: 'option-1' } };
export const ErrorState: Story = { name: 'State: Error', args: { error: true } };
export const Skeleton: Story = { name: 'State: Skeleton', args: { skeleton: true } };

/* ── Boolean properties ── */

export const Required: Story = { name: 'Required field', args: { required: true } };
export const WithExplainer: Story = { name: 'Show explainer', args: { tooltip: 'Additional context for this field' } };
export const NoLabelNoHelper: Story = {
  name: 'Show label: False, Show helper: False',
  args: { label: undefined, helperText: undefined, 'aria-label': 'Options' },
};

/* ── Menu ── */

export const OpenSingle: Story = { name: 'Menu open: Single', args: { defaultOpen: true, defaultValue: 'option-2' } };
export const OpenMulti: Story = {
  name: 'Menu open: Multi',
  args: { type: 'multi', defaultOpen: true, defaultValue: ['option-1', 'option-3'] },
};
export const NoResults: Story = { name: 'Menu: no results', args: { defaultOpen: true, options: [] } };
export const ScrollingMenu: Story = { name: 'Menu: Scroll', args: { defaultOpen: true, menuMaxHeight: 240 } };
export const OptionExtras: Story = {
  name: 'Menu: headline, subtext, divider, disabled',
  args: {
    defaultOpen: true,
    options: [
      { value: 'upper', label: 'Upper jaw', headline: 'Arches', subtext: 'Maxillary' },
      { value: 'lower', label: 'Lower jaw', subtext: 'Mandibular', divider: true },
      { value: 'both', label: 'Both jaws' },
      { value: 'none', label: 'Unavailable', disabled: true },
    ],
  },
};

const ControlledDemo = (args: ComboboxProps) => {
  const [value, setValue] = useState<string[]>(['option-1']);
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Combobox {...(args as Omit<ComboboxProps, 'type' | 'value' | 'defaultValue' | 'onChange'>)} type="multi" value={value} onChange={setValue} />
      <p style={{ margin: 0, font: '12px/16px var(--scanner-font-sans)' }}>Value: {JSON.stringify(value)}</p>
    </div>
  );
};

export const Controlled: Story = { name: 'Controlled (Multi)', render: (args) => <ControlledDemo {...args} /> };

/* ── All sizes — rows: sizes, columns: Type × Selected ── */

export const AllSizes: Story = {
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {TYPES.flatMap((t) =>
            SELECTED.map((sel) => <th key={`${t}-${sel}`} style={headCell}>{`${cap(t)} · Selected: ${cap(String(sel))}`}</th>),
          )}
        </tr>
      </thead>
      <tbody>
        {SIZES.map((s) => (
          <tr key={s}>
            <th style={headCell}>{sizeLabel[s]}</th>
            {TYPES.flatMap((t) =>
              SELECTED.map((sel) => (
                <td key={`${t}-${sel}`} style={cell}>
                  <Fixed><Combobox {...variantProps(s, args.layer ?? 1, t, sel, 'enabled')} /></Fixed>
                </td>
              )),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── All states — rows: Type × Selected, columns: states ── */

export const AllStates: Story = {
  parameters: { layout: 'fullscreen' },
  render: ({ size = 'x-large', layer = 1 }) => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {STATES.map((st) => (
            <th key={st} style={headCell}>{cap(st)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {TYPES.flatMap((t) =>
          SELECTED.map((sel) => (
            <tr key={`${t}-${sel}`}>
              <th style={headCell}>{`${cap(t)} · Selected: ${cap(String(sel))}`}</th>
              {STATES.map((st) => (
                <td key={st} style={cell}>
                  <Fixed><Combobox {...variantProps(size, layer, t, sel, st)} /></Fixed>
                </td>
              ))}
            </tr>
          )),
        )}
      </tbody>
    </table>
  ),
};

/* ── Full Figma matrix: all 192 variants ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 192 variants)',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div>
      {LAYERS.flatMap((l) =>
        SIZES.map((s) => (
          <section key={`${l}-${s}`}>
            <h3 style={sectionTitle}>{`Layer set=Set 0${l}, Size=${sizeLabel[s]}`}</h3>
            <table style={table}>
              <thead>
                <tr>
                  <th style={headCell} />
                  {STATES.map((st) => (
                    <th key={st} style={headCell}>{`State=${cap(st)}`}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TYPES.flatMap((t) =>
                  SELECTED.map((sel) => (
                    <tr key={`${t}-${sel}`}>
                      <th style={headCell}>{`Type=${cap(t)}, Selected=${cap(String(sel))}`}</th>
                      {STATES.map((st) => (
                        <td key={st} style={cell}>
                          <Fixed><Combobox {...variantProps(s, l, t, sel, st)} /></Fixed>
                        </td>
                      ))}
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </section>
        )),
      )}
    </div>
  ),
};

/* ── Figma component properties per size: Required / Explainer ── */

export const OptionalElements: Story = {
  name: 'Optional elements per size',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <table style={table}>
      <tbody>
        {SIZES.map((s) => (
          <tr key={s}>
            <th style={headCell}>{sizeLabel[s]}</th>
            {(['enabled', 'disabled', 'error'] as const).map((st) => (
              <td key={st} style={cell}>
                <Fixed><Combobox {...variantProps(s, 1, 'single', true, st)} required tooltip="Explainer" /></Fixed>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Overflow content: ellipsis + tooltip (Single), wrapping tags (Multi) ── */

const LONG_OPTIONS: ComboboxOption[] = [
  { value: 'long', label: 'A very long option label that does not fit into the field width' },
  ...OPTIONS,
];

export const LongContent: Story = {
  name: 'Overflow content',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <table style={table}>
      <tbody>
        <tr>
          {SIZES.map((s) => (
            <td key={s} style={cell}>
              <Fixed>
              <Combobox
                size={s}
                options={LONG_OPTIONS}
                label="A long label that wraps onto a second line in narrow layouts"
                helperText="The input scrolls horizontally; tags truncate with a tooltip."
                defaultValue="long"
              />
              </Fixed>
            </td>
          ))}
        </tr>
        <tr>
          {SIZES.map((s) => (
            <td key={s} style={cell}>
              <Fixed>
              <Combobox
                size={s}
                type="multi"
                options={LONG_OPTIONS}
                label="Multi"
                defaultValue={['option-1', 'option-2', 'option-3', 'long']}
              />
              </Fixed>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const TypeToFilterAndSelect: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const view = within(canvasElement);
    const input = view.getByRole('combobox', { name: 'Label' });
    await userEvent.type(input, '3');
    await expect(view.getAllByRole('option')).toHaveLength(1);
    await expect(input).toHaveAttribute('aria-activedescendant', view.getByRole('option', { name: 'Option 3' }).id);
    await userEvent.keyboard('{Enter}');
    await expect(args.onChange).toHaveBeenCalledWith('option-3');
    await expect(input).toHaveValue('Option 3');
    await expect(view.queryByRole('listbox')).toBeNull();
  },
};

export const MouseSelect: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const view = within(canvasElement);
    const input = view.getByRole('combobox', { name: 'Label' });
    await userEvent.click(input);
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(view.getByRole('option', { name: 'Option 2' }));
    await expect(args.onChange).toHaveBeenCalledWith('option-2');
    await expect(input).toHaveValue('Option 2');
    await expect(input).toHaveFocus();
  },
};

export const KeyboardNavigation: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const view = within(canvasElement);
    const input = view.getByRole('combobox', { name: 'Label' });
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(input).toHaveAttribute('aria-activedescendant', view.getByRole('option', { name: 'Option 2' }).id);
    await userEvent.keyboard('{Enter}');
    await expect(args.onChange).toHaveBeenCalledWith('option-2');
    await userEvent.keyboard('{Escape}');
    await expect(input).toHaveValue('');
    await expect(args.onChange).toHaveBeenLastCalledWith(null);
  },
};

export const MultiTypeAndRemove: Story = {
  tags: ['test'],
  args: { type: 'multi' },
  play: async ({ args, canvasElement }) => {
    const view = within(canvasElement);
    const input = view.getByRole('combobox', { name: 'Label' });
    await userEvent.type(input, '1');
    await userEvent.keyboard('{Enter}');
    await userEvent.type(input, '4');
    await userEvent.keyboard('{Enter}');
    await expect(args.onChange).toHaveBeenLastCalledWith(['option-1', 'option-4']);
    await expect(input).toHaveValue('');
    await expect(view.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{Backspace}');
    await expect(args.onChange).toHaveBeenLastCalledWith(['option-1']);
    await userEvent.click(view.getByRole('button', { name: 'Remove Option 1' }));
    await expect(args.onChange).toHaveBeenLastCalledWith([]);
  },
};

export const ClickOutsideCloses: Story = {
  tags: ['test'],
  args: { defaultOpen: true },
  play: async ({ canvasElement }) => {
    const view = within(canvasElement);
    await expect(view.getByRole('listbox')).toBeInTheDocument();
    await userEvent.click(canvasElement);
    await expect(view.queryByRole('listbox')).toBeNull();
  },
};

export const DisabledIgnoresInput: Story = {
  tags: ['test'],
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    const view = within(canvasElement);
    const input = view.getByRole('combobox', { name: 'Label' });
    await expect(input).toBeDisabled();
    await userEvent.type(input, 'abc', { pointerEventsCheck: 0 });
    await expect(input).toHaveValue('');
    await expect(view.queryByRole('listbox')).toBeNull();
    await expect(args.onOpenChange).not.toHaveBeenCalled();
  },
};
