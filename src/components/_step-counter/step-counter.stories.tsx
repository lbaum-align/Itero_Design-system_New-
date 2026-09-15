import type { Meta, StoryObj } from '@storybook/react';
import { StepCounter } from './StepCounter';
import type { StepCounterState } from './step-counter.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → _Step counter (node 34201:2238)
 * State × Step — all 16 variants rendered in `FigmaMatrix`.
 */

const STATES: StepCounterState[] = ['not-started', 'in-progress'];
const STEPS = [1, 2, 3, 4, 5, 6, 7, 8];
const stateLabel: Record<StepCounterState, string> = { 'not-started': 'Not started', 'in-progress': 'In progress' };

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 12, verticalAlign: 'middle', textAlign: 'center' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const meta: Meta<typeof StepCounter> = {
  title: 'Private/_StepCounter',
  component: StepCounter,
  parameters: {
    docs: {
      description: {
        component: 'Private 24px step-number indicator for stepper items: outline number (Not started) or filled number (In progress). Decorative.',
      },
    },
  },
  argTypes: {
    state: { name: 'State', control: 'inline-radio', options: STATES },
    step: { name: 'Step', control: { type: 'number', min: 1, max: 8 } },
  },
  args: { state: 'not-started', step: 1 },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof StepCounter>;

export const Default: Story = {};

export const NotStarted: Story = { name: 'State: Not started', args: { state: 'not-started' } };
export const InProgress: Story = { name: 'State: In progress', args: { state: 'in-progress' } };

/** Rows = State, columns = Step (same as the component set). */
const Matrix = () => (
  <table style={table}>
    <thead>
      <tr>
        <th style={headCell} />
        {STEPS.map((s) => (
          <th key={s} style={headCell}>{`Step=${s}`}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {STATES.map((state) => (
        <tr key={state}>
          <th style={headCell}>{`State=${stateLabel[state]}`}</th>
          {STEPS.map((s) => (
            <td key={s} style={cell}>
              <StepCounter state={state} step={s} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export const AllStates: Story = { render: () => <Matrix /> };

export const FigmaMatrix: Story = { name: 'Figma matrix (all 16 variants)', render: () => <Matrix /> };

/** Out-of-range steps clamp to the 1–8 glyphs drawn in Figma. */
export const ClampedSteps: Story = {
  name: 'Edge case: steps outside 1–8 clamp',
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <StepCounter step={0} />
      <StepCounter step={9} state="in-progress" />
    </div>
  ),
};
