import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Dropdown } from './Dropdown';
import type { DropdownOption, DropdownProps, DropdownSize, DropdownType } from './dropdown.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Dropdowm (sic) (node 20:610, page "Dropdown")
 * Layer set × Size × Type × Selected × State = 192 variants — every combination is rendered in `FigmaMatrix`.
 */

const SIZES: DropdownSize[] = ['x-large', 'large', 'medium', 'small'];
const LAYERS = [1, 2] as const;
const TYPES: DropdownType[] = ['single', 'multi'];
const SELECTED = [false, true] as const;
const STATES = ['enabled', 'hovered', 'focused', 'disabled', 'error', 'skeleton'] as const;
type State = (typeof STATES)[number];

const sizeLabel: Record<DropdownSize, string> = { 'x-large': 'X-Large', large: 'Large', medium: 'Medium', small: 'Small' };
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Figma content: "Option 1" … "Option 8". */
const OPTIONS: DropdownOption[] = Array.from({ length: 8 }, (_, i) => ({ value: `option-${i + 1}`, label: `Option ${i + 1}` }));

/** Props for one Figma variant (Figma defaults: label + helper shown). */
function variantProps(
  size: DropdownSize,
  layer: 1 | 2,
  type: DropdownType,
  selected: boolean,
  state: State,
): DropdownProps {
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

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: {
    docs: {
      description: {
        component:
          'Choose one (Type Single) or several options (Type Multi, shown as tags) from a static list. Use Combobox for searchable lists. ' +
          'Keyboard: Tab focuses; Enter/Space/ArrowDown open; ArrowUp/ArrowDown/Home/End move; Enter/Space select; Escape closes; ' +
          'typing jumps to a matching option. Long values truncate with an ellipsis and show a tooltip.',
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

type Story = StoryObj<typeof Dropdown>;

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

const ControlledDemo = (args: DropdownProps) => {
  const [value, setValue] = useState<string[]>(['option-1']);
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Dropdown {...(args as Omit<DropdownProps, 'type' | 'value' | 'defaultValue' | 'onChange'>)} type="multi" value={value} onChange={setValue} />
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
                  <Fixed><Dropdown {...variantProps(s, args.layer ?? 1, t, sel, 'enabled')} /></Fixed>
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
                  <Fixed><Dropdown {...variantProps(size, layer, t, sel, st)} /></Fixed>
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
                          <Fixed><Dropdown {...variantProps(s, l, t, sel, st)} /></Fixed>
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
                <Fixed><Dropdown {...variantProps(s, 1, 'single', true, st)} required tooltip="Explainer" /></Fixed>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Overflow content: ellipsis + tooltip (Single), wrapping tags (Multi) ── */

const LONG_OPTIONS: DropdownOption[] = [
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
              <Dropdown
                size={s}
                options={LONG_OPTIONS}
                label="A long label that wraps onto a second line in narrow layouts"
                helperText="Hover the value to see the full text."
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
              <Dropdown
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

export const MouseSelect: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const view = within(canvasElement);
    const combobox = view.getByRole('combobox', { name: 'Label' });
    await userEvent.click(combobox);
    await expect(combobox).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(view.getByRole('option', { name: 'Option 3' }));
    await expect(args.onChange).toHaveBeenCalledWith('option-3');
    await expect(combobox).toHaveTextContent('Option 3');
    await expect(view.queryByRole('listbox')).toBeNull();
    await expect(combobox).toHaveFocus();
  },
};

export const KeyboardSelect: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const view = within(canvasElement);
    const combobox = view.getByRole('combobox', { name: 'Label' });
    await userEvent.tab();
    await expect(combobox).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(view.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(combobox).toHaveAttribute('aria-activedescendant', view.getByRole('option', { name: 'Option 3' }).id);
    await userEvent.keyboard('{Enter}');
    await expect(args.onChange).toHaveBeenCalledWith('option-3');
    await userEvent.keyboard('{Enter}');
    await expect(view.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await expect(view.queryByRole('listbox')).toBeNull();
  },
};

export const MultiSelectToggles: Story = {
  tags: ['test'],
  args: { type: 'multi' },
  play: async ({ args, canvasElement }) => {
    const view = within(canvasElement);
    const combobox = view.getByRole('combobox', { name: 'Label' });
    await userEvent.click(combobox);
    await userEvent.click(view.getByRole('option', { name: 'Option 1' }));
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(args.onChange).toHaveBeenLastCalledWith(['option-1', 'option-2']);
    await expect(view.getByRole('listbox')).toBeInTheDocument();
    await userEvent.click(view.getByRole('button', { name: 'Remove Option 1' }));
    await expect(args.onChange).toHaveBeenLastCalledWith(['option-2']);
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

export const DisabledIgnoresClick: Story = {
  tags: ['test'],
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    const view = within(canvasElement);
    const combobox = view.getByRole('combobox', { name: 'Label' });
    await expect(combobox).toBeDisabled();
    await userEvent.click(combobox, { pointerEventsCheck: 0 });
    await expect(view.queryByRole('listbox')).toBeNull();
    await expect(args.onOpenChange).not.toHaveBeenCalled();
  },
};
