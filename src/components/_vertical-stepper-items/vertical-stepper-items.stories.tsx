import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { VerticalStepperItems } from './VerticalStepperItems';
import type { StepperItemState } from './vertical-stepper-items.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → _Vertical stepper items (node 34201:2271)
 * State: Not started, In progress, Completed, Error, Skeleton — all rendered in `FigmaMatrix`.
 */

const STATES: StepperItemState[] = ['not-started', 'in-progress', 'completed', 'error', 'skeleton'];
const stateLabel: Record<StepperItemState, string> = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  completed: 'Completed',
  error: 'Error',
  skeleton: 'Skeleton',
};

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 12, verticalAlign: 'top' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const meta: Meta<typeof VerticalStepperItems> = {
  title: 'Private/_VerticalStepperItems',
  component: VerticalStepperItems,
  parameters: {
    docs: {
      description: {
        component:
          'Private: one step of a vertical Stepper — progress line, 24px indicator and Body 02 step name. ' +
          'Long names truncate with an ellipsis and show the full text in a tooltip.',
      },
    },
  },
  argTypes: {
    state: { name: 'State', control: 'inline-radio', options: STATES },
    step: { control: { type: 'number', min: 1, max: 8 } },
    showLine: { control: 'boolean' },
    label: { name: 'Step name', control: 'text' },
    statusLabel: { control: 'text' },
  },
  args: { state: 'not-started', step: 1, label: 'Step name', showLine: true },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof VerticalStepperItems>;

export const Default: Story = {};

export const NotStarted: Story = { name: 'State: Not started', args: { state: 'not-started' } };
export const InProgress: Story = { name: 'State: In progress', args: { state: 'in-progress' } };
export const Completed: Story = { name: 'State: Completed', args: { state: 'completed' } };
export const ErrorState: Story = { name: 'State: Error', args: { state: 'error' } };
export const Skeleton: Story = { name: 'State: Skeleton', args: { state: 'skeleton' } };

export const WithoutLine: Story = { name: 'First step (no line)', args: { state: 'in-progress', showLine: false } };

const Matrix = ({ showLine = true }: { showLine?: boolean }) => (
  <table style={table}>
    <tbody>
      {STATES.map((s) => (
        <tr key={s}>
          <th style={headCell}>{`State=${stateLabel[s]}`}</th>
          <td style={cell}>
            <VerticalStepperItems state={s} step={1} showLine={showLine} />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export const AllStates: Story = {
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell}>With line</th>
          <th style={headCell}>Without line (first step)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={cell}><Matrix /></td>
          <td style={cell}><Matrix showLine={false} /></td>
        </tr>
      </tbody>
    </table>
  ),
};

export const FigmaMatrix: Story = { name: 'Figma matrix (all 5 variants)', render: () => <Matrix /> };

/* ── Overflow: truncate + tooltip (Figma "Overflow content") ── */

export const LongLabelTruncates: Story = {
  name: 'Overflow: truncates with tooltip',
  args: { state: 'in-progress', label: 'Upload the intraoral scans and review the bite registration' },
  decorators: [(Story) => <div style={{ width: 240, paddingBottom: 120 }}><Story /></div>],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const text = canvas.getByText(/Upload the intraoral scans/);
    await waitFor(() => expect(text.closest('.relative.inline-flex')).not.toBeNull());
    await userEvent.hover(text);
    await waitFor(() => expect(canvas.getByRole('tooltip')).toHaveTextContent('Upload the intraoral scans'));
  },
};
