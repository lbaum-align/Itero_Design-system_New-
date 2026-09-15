import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { ButtonGroup } from './ButtonGroup';
import { Button } from '../button';
import { SplitButton } from '../split-button';
import type { ButtonGroupPosition, ButtonGroupSize } from './button-group.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → 02 Buttons group (node 36403:6370)
 * Size × Position — every combination is rendered in `FigmaMatrix`.
 * Figma fills the group with Secondary / Text only buttons.
 */

const SIZES: ButtonGroupSize[] = ['large', 'medium', 'small'];
const POSITIONS: ButtonGroupPosition[] = ['horizontal', 'vertical'];
const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 16, verticalAlign: 'top' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const meta: Meta<typeof ButtonGroup> = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  parameters: {
    docs: {
      description: {
        component:
          'Groups related buttons. Gap is 16px for Large/Horizontal and 8px otherwise. ' +
          'The group `size` is passed to child `Button`/`SplitButton`s that don’t set their own.',
      },
    },
  },
  argTypes: {
    size: { name: 'Size', control: 'inline-radio', options: SIZES },
    position: { name: 'Position', control: 'inline-radio', options: POSITIONS },
    orientation: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  args: { size: 'large', position: 'horizontal' },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <ButtonGroup {...args}>
      <Button emphasis="secondary">Button text</Button>
      <Button emphasis="secondary">Button text</Button>
    </ButtonGroup>
  ),
};
export default meta;

type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {};

export const Horizontal: Story = { args: { position: 'horizontal' } };
export const Vertical: Story = { args: { position: 'vertical' } };

export const Large: Story = { args: { size: 'large' } };
export const Medium: Story = { args: { size: 'medium' } };
export const Small: Story = { args: { size: 'small' } };

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {SIZES.map((s) => (
        <ButtonGroup key={s} position={args.position} size={s}>
          <Button emphasis="secondary">Button text</Button>
          <Button emphasis="secondary">Button text</Button>
        </ButtonGroup>
      ))}
    </div>
  ),
};

/** Figma has no states on the group itself — this shows child button states inside a group. */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <ButtonGroup size="medium">
        <Button emphasis="secondary">Enabled</Button>
        <Button emphasis="secondary" data-state="hovered">Hovered</Button>
        <Button emphasis="secondary" data-state="focused">Focused</Button>
        <Button emphasis="secondary" data-state="pressed">Pressed</Button>
        <Button emphasis="secondary" disabled>Disabled</Button>
        <Button emphasis="secondary" loading>Loading</Button>
        <Button emphasis="secondary" skeleton>Skeleton</Button>
      </ButtonGroup>
    </div>
  ),
};

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 6 variants)',
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
        {POSITIONS.map((p) => (
          <tr key={p}>
            <th style={headCell}>{`Position=${label(p)}`}</th>
            {SIZES.map((s) => (
              <td key={s} style={cell}>
                <ButtonGroup size={s} position={p}>
                  <Button emphasis="secondary">Button text</Button>
                  <Button emphasis="secondary">Button text</Button>
                </ButtonGroup>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/** Figma's Large/Horizontal group has slots for up to 9 buttons. */
export const ManyButtons: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      {Array.from({ length: 9 }, (_, i) => (
        <Button key={i} emphasis="secondary">{`Button ${i + 1}`}</Button>
      ))}
    </ButtonGroup>
  ),
};

/** Mixed emphases + a split button; a wrapped label stretches its row neighbours. */
export const MixedContent: Story = {
  render: () => (
    <ButtonGroup size="medium" style={{ maxWidth: 480 }}>
      <Button variant="danger" emphasis="ghost">Delete</Button>
      <Button emphasis="secondary" style={{ maxWidth: 140 }}>Cancel and discard changes</Button>
      <SplitButton>Save</SplitButton>
    </ButtonGroup>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const KeyboardTabsThroughButtons: Story = {
  tags: ['test'],
  render: () => (
    <ButtonGroup aria-label="Dialog actions">
      <Button emphasis="secondary">Cancel</Button>
      <Button>Save</Button>
    </ButtonGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('group', { name: 'Dialog actions' })).toBeInTheDocument();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Save' })).toHaveFocus();
  },
};

export const SizePropagatesToButtons: Story = {
  tags: ['test'],
  args: { size: 'small' },
  play: async ({ canvasElement }) => {
    const buttons = within(canvasElement).getAllByRole('button');
    for (const b of buttons) {
      await expect(b.getBoundingClientRect().height).toBe(36);
    }
  },
};
