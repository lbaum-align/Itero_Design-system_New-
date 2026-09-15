import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from './Button';
import type {
  ButtonContent,
  ButtonEmphasis,
  ButtonProps,
  ButtonSize,
  ButtonType,
} from './button.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → 01 Button (node 36403:6395)
 * Type × Emphasis × Size × Content × State — every combination is rendered in `FigmaMatrix`.
 */

const TYPES: ButtonType[] = ['brand', 'danger', 'success'];
const EMPHASES: ButtonEmphasis[] = ['primary', 'secondary', 'ghost'];
const SIZES: ButtonSize[] = ['large', 'medium', 'small'];
const CONTENTS: ButtonContent[] = ['text-only', 'text-icon', 'icon-only'];
const STATES = ['enabled', 'hovered', 'focused', 'pressed', 'disabled', 'loading', 'skeleton'] as const;
type State = (typeof STATES)[number];

const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ');
const contentLabel: Record<ButtonContent, string> = {
  'text-only': 'Text only',
  'text-icon': 'Text + icon',
  'icon-only': 'Icon only',
};

/** Props for one Figma variant. */
function variantProps(
  variant: ButtonType,
  emphasis: ButtonEmphasis,
  size: ButtonSize,
  content: ButtonContent,
  state: State,
): ButtonProps {
  return {
    variant,
    emphasis,
    size,
    iconName: content === 'text-only' ? undefined : 'add',
    iconOnly: content === 'icon-only',
    'aria-label': content === 'icon-only' ? 'Add' : undefined,
    disabled: state === 'disabled',
    loading: state === 'loading',
    skeleton: state === 'skeleton',
    'data-state':
      state === 'hovered' || state === 'focused' || state === 'pressed' ? state : undefined,
    children: content === 'icon-only' ? undefined : 'Button text',
  };
}

/* ── Layout helpers (story-only) ── */

/* max-content keeps matrix columns from squeezing labels into wrapping */
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

/* ------------------------------------------------------------------ */

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'Triggers an action (submit, open modal, delete…). Use `Link` for navigation. ' +
          'Labels wrap to a second line instead of truncating. Keyboard: Tab to focus, Enter/Space to trigger.',
      },
    },
  },
  argTypes: {
    variant: { name: 'Type', control: 'inline-radio', options: TYPES },
    emphasis: { name: 'Emphasis', control: 'inline-radio', options: EMPHASES },
    size: { name: 'Size', control: 'inline-radio', options: SIZES },
    iconName: { control: 'select', options: [undefined, 'add', 'edit', 'search', 'check', 'close'] },
    iconOnly: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    'data-state': {
      name: 'Forced state',
      control: 'inline-radio',
      options: [undefined, 'hovered', 'focused', 'pressed'],
    },
    children: { control: 'text' },
  },
  args: {
    variant: 'brand',
    emphasis: 'primary',
    size: 'medium',
    children: 'Button text',
    onClick: fn(),
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

type Story = StoryObj<typeof Button>;

/* ── Default ── */

export const Default: Story = {};

/* ── Content (Figma "Content") ── */

export const TextOnly: Story = { name: 'Content: Text only' };

export const TextAndIcon: Story = {
  name: 'Content: Text + icon',
  args: { iconName: 'add' },
};

export const IconOnly: Story = {
  name: 'Content: Icon only',
  args: { iconName: 'add', iconOnly: true, 'aria-label': 'Add item', children: undefined },
};

/* ── Per type (Figma "Type") — emphasis × content ── */

const TypeGrid = ({ variant }: { variant: ButtonType }) => (
  <table style={table}>
    <thead>
      <tr>
        <th style={headCell} />
        {CONTENTS.map((c) => (
          <th key={c} style={headCell}>{contentLabel[c]}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {EMPHASES.map((e) => (
        <tr key={e}>
          <th style={headCell}>{label(e)}</th>
          {CONTENTS.map((c) => (
            <td key={c} style={cell}>
              <Button {...variantProps(variant, e, 'medium', c, 'enabled')} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export const Brand: Story = { render: () => <TypeGrid variant="brand" /> };
export const Danger: Story = { render: () => <TypeGrid variant="danger" /> };
export const Success: Story = { render: () => <TypeGrid variant="success" /> };

/* ── Per emphasis (Figma "Emphasis") — type × content ── */

const EmphasisGrid = ({ emphasis }: { emphasis: ButtonEmphasis }) => (
  <table style={table}>
    <thead>
      <tr>
        <th style={headCell} />
        {CONTENTS.map((c) => (
          <th key={c} style={headCell}>{contentLabel[c]}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {TYPES.map((t) => (
        <tr key={t}>
          <th style={headCell}>{label(t)}</th>
          {CONTENTS.map((c) => (
            <td key={c} style={cell}>
              <Button {...variantProps(t, emphasis, 'medium', c, 'enabled')} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export const Primary: Story = { render: () => <EmphasisGrid emphasis="primary" /> };
export const Secondary: Story = { render: () => <EmphasisGrid emphasis="secondary" /> };
export const Ghost: Story = { render: () => <EmphasisGrid emphasis="ghost" /> };

/* ── All sizes — size × content ── */

export const AllSizes: Story = {
  render: (args) => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {CONTENTS.map((c) => (
            <th key={c} style={headCell}>{contentLabel[c]}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {SIZES.map((s) => (
          <tr key={s}>
            <th style={headCell}>{label(s)}</th>
            {CONTENTS.map((c) => (
              <td key={c} style={cell}>
                <Button {...variantProps(args.variant ?? 'brand', args.emphasis ?? 'primary', s, c, 'enabled')} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── All states — type × emphasis rows, 7 state columns ── */

export const AllStates: Story = {
  args: { iconName: 'add' },
  render: ({ size = 'medium', iconOnly, iconName }) => {
    const content: ButtonContent = iconOnly ? 'icon-only' : iconName ? 'text-icon' : 'text-only';
    return (
      <table style={table}>
        <thead>
          <tr>
            <th style={headCell} />
            {STATES.map((s) => (
              <th key={s} style={headCell}>{label(s)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TYPES.flatMap((t) =>
            EMPHASES.map((e) => (
              <tr key={`${t}-${e}`}>
                <th style={headCell}>{`${label(t)} / ${label(e)}`}</th>
                {STATES.map((s) => (
                  <td key={s} style={cell}>
                    <Button {...variantProps(t, e, size, content, s)} />
                  </td>
                ))}
              </tr>
            )),
          )}
        </tbody>
      </table>
    );
  },
};

/* ── Individual states ── */

const StateRow = ({ state }: { state: State }) => (
  <table style={table}>
    <tbody>
      {TYPES.map((t) => (
        <tr key={t}>
          <th style={headCell}>{label(t)}</th>
          {EMPHASES.map((e) => (
            <td key={e} style={cell}>
              <Button {...variantProps(t, e, 'medium', 'text-icon', state)} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export const Hovered: Story = { render: () => <StateRow state="hovered" /> };
export const Focused: Story = { render: () => <StateRow state="focused" /> };
export const Pressed: Story = { render: () => <StateRow state="pressed" /> };
export const Disabled: Story = { render: () => <StateRow state="disabled" /> };
export const Loading: Story = { render: () => <StateRow state="loading" /> };
export const Skeleton: Story = { render: () => <StateRow state="skeleton" /> };

/* ── Full Figma matrix: all 567 variants, laid out like the component set ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 567 variants)',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ padding: 24 }}>
      {TYPES.map((t) =>
        EMPHASES.map((e) => (
          <section key={`${t}-${e}`}>
            <h3 style={sectionTitle}>{`Type=${label(t)}, Emphasis=${label(e)}`}</h3>
            <table style={table}>
              <thead>
                <tr>
                  <th style={headCell} />
                  {SIZES.flatMap((s) =>
                    CONTENTS.map((c) => (
                      <th key={`${s}-${c}`} style={headCell}>{`${label(s)} · ${contentLabel[c]}`}</th>
                    )),
                  )}
                </tr>
              </thead>
              <tbody>
                {STATES.map((st) => (
                  <tr key={st}>
                    <th style={headCell}>{label(st)}</th>
                    {SIZES.flatMap((s) =>
                      CONTENTS.map((c) => (
                        <td key={`${s}-${c}`} style={cell}>
                          <Button {...variantProps(t, e, s, c, st)} />
                        </td>
                      )),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )),
      )}
    </div>
  ),
};

/* ── Overflow content: labels wrap, never truncate ── */

export const LongLabelWraps: Story = {
  render: () => (
    <div style={{ width: 200, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {SIZES.map((s) => (
        <Button key={s} size={s} iconName="add" style={{ maxWidth: '100%' }}>
          Create a new scan for this patient
        </Button>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const ClickTriggersAction: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Button text' });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const KeyboardActivation: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Button text' });
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

export const DisabledIgnoresClick: Story = {
  tags: ['test'],
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Button text' });
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(button, { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const LoadingIgnoresClick: Story = {
  tags: ['test'],
  args: { loading: true },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Button text' });
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
    /* Loading keeps the button focusable so focus isn't lost mid-action */
    await expect(button).toHaveFocus();
  },
};
