import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { SplitButton } from './SplitButton';
import type { ButtonEmphasis, ButtonSize } from '../button';

/*
 * Figma: "06. Scanner core 1.0.0 full" → 02 Split button (node 36407:15124)
 * Emphasis × Size × Opened — every combination is rendered in `FigmaMatrix`.
 */

const EMPHASES: ButtonEmphasis[] = ['primary', 'secondary', 'ghost'];
const SIZES: ButtonSize[] = ['large', 'medium', 'small'];
const OPENED = [false, true] as const;
const STATES = ['enabled', 'disabled', 'loading', 'skeleton'] as const;

const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 12, verticalAlign: 'middle' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const meta: Meta<typeof SplitButton> = {
  title: 'Components/SplitButton',
  component: SplitButton,
  parameters: {
    docs: {
      description: {
        component:
          'A main action with a dropdown trigger for related actions. Built from two `Button`s (Text only + Icon only) ' +
          'separated by 1px. `opened` flips the chevron and sets `aria-expanded`; the consumer renders the menu.',
      },
    },
  },
  argTypes: {
    emphasis: { name: 'Emphasis', control: 'inline-radio', options: EMPHASES },
    size: { name: 'Size', control: 'inline-radio', options: SIZES },
    opened: { name: 'Opened', control: 'boolean' },
    variant: { control: 'inline-radio', options: ['brand', 'danger', 'success'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    dropdownLabel: { control: 'text' },
    children: { control: 'text' },
  },
  args: {
    emphasis: 'primary',
    size: 'large',
    opened: false,
    children: 'Button text',
    onMainClick: fn(),
    onDropdownClick: fn(),
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

type Story = StoryObj<typeof SplitButton>;

export const Default: Story = {};

/* ── Per emphasis ── */

const EmphasisRow = ({ emphasis }: { emphasis: ButtonEmphasis }) => (
  <table style={table}>
    <tbody>
      {OPENED.map((o) => (
        <tr key={String(o)}>
          <th style={headCell}>{`Opened=${label(String(o))}`}</th>
          {SIZES.map((s) => (
            <td key={s} style={cell}>
              <SplitButton emphasis={emphasis} size={s} opened={o}>Button text</SplitButton>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export const Primary: Story = { render: () => <EmphasisRow emphasis="primary" /> };
export const Secondary: Story = { render: () => <EmphasisRow emphasis="secondary" /> };
export const Ghost: Story = { render: () => <EmphasisRow emphasis="ghost" /> };

export const Opened: Story = { args: { opened: true } };

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      {SIZES.map((s) => (
        <SplitButton key={s} {...args} size={s} />
      ))}
    </div>
  ),
};

/* ── States (code-only: Figma has no state variants for the split button) ── */

export const AllStates: Story = {
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {STATES.map((st) => (
            <th key={st} style={headCell}>{label(st)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {EMPHASES.map((e) => (
          <tr key={e}>
            <th style={headCell}>{label(e)}</th>
            {STATES.map((st) => (
              <td key={st} style={cell}>
                <SplitButton
                  emphasis={e}
                  size="medium"
                  disabled={st === 'disabled'}
                  loading={st === 'loading'}
                  skeleton={st === 'skeleton'}
                >
                  Button text
                </SplitButton>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Full Figma matrix: all 18 variants, laid out like the component set ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 18 variants)',
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {SIZES.map((s) => (
            <th key={s} style={headCell}>{`Size=${label(s)}`}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {EMPHASES.flatMap((e) =>
          OPENED.map((o) => (
            <tr key={`${e}-${o}`}>
              <th style={headCell}>{`Emphasis=${label(e)}, Opened=${label(String(o))}`}</th>
              {SIZES.map((s) => (
                <td key={s} style={cell}>
                  <SplitButton emphasis={e} size={s} opened={o}>Button text</SplitButton>
                </td>
              ))}
            </tr>
          )),
        )}
      </tbody>
    </table>
  ),
};

export const LongLabelWraps: Story = {
  render: () => (
    <div style={{ width: 220 }}>
      <SplitButton size="medium">Create a new scan for this patient</SplitButton>
    </div>
  ),
};

/* ── Controlled example ── */

const ControlledSplitButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <SplitButton opened={open} onDropdownClick={() => setOpen((v) => !v)} size="medium">
      Save
    </SplitButton>
  );
};

export const Controlled: Story = { render: () => <ControlledSplitButton /> };

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const MainClickTriggersAction: Story = {
  tags: ['test'],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Button text' }));
    await expect(args.onMainClick).toHaveBeenCalledTimes(1);
    await expect(args.onDropdownClick).not.toHaveBeenCalled();
  },
};

export const DropdownToggleKeyboard: Story = {
  tags: ['test'],
  render: () => <ControlledSplitButton />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Save' })).toHaveFocus();
    await userEvent.tab();
    const trigger = canvas.getByRole('button', { name: 'More options' });
    await expect(trigger).toHaveFocus();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.keyboard('{Enter}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard(' ');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};

export const DisabledIgnoresClicks: Story = {
  tags: ['test'],
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');
    for (const b of buttons) {
      await expect(b).toBeDisabled();
      await userEvent.click(b, { pointerEventsCheck: 0 });
    }
    await expect(args.onMainClick).not.toHaveBeenCalled();
    await expect(args.onDropdownClick).not.toHaveBeenCalled();
  },
};
