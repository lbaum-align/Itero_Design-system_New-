import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { Stepper } from './Stepper';
import type { StepItem, StepperOrientation } from './stepper.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Stepper (node 34201:2333)
 * Position: Horizontal stepper, Vertical — both rendered in `FigmaMatrix` (4 steps, step 1 in progress, as in Figma).
 */

const ORIENTATIONS: StepperOrientation[] = ['horizontal', 'vertical'];
const figmaSteps: StepItem[] = Array.from({ length: 4 }, () => ({ label: 'Step name' }));
const wizardSteps: StepItem[] = [
  { label: 'Personal info' },
  { label: 'Address' },
  { label: 'Payment' },
  { label: 'Review' },
];

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 16, verticalAlign: 'top' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
  parameters: {
    docs: {
      description: {
        component:
          'Progress indicator for a linear multi-step task (form wizards, onboarding). Not interactive. ' +
          'States per step: not started, in progress, completed, error, skeleton. Avoid more than 8 steps. ' +
          'Long step names truncate with an ellipsis and a tooltip.',
      },
    },
  },
  argTypes: {
    orientation: { name: 'Position', control: 'inline-radio', options: ORIENTATIONS },
    currentStep: { control: { type: 'number', min: 0, max: 8 } },
    error: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    position: { table: { disable: true } },
  },
  args: {
    steps: wizardSteps,
    currentStep: 1,
    orientation: 'horizontal',
    error: false,
    skeleton: false,
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

type Story = StoryObj<typeof Stepper>;

/* ── Default ── */

export const Default: Story = {};

/* ── Figma "Position" ── */

export const Horizontal: Story = { name: 'Position: Horizontal stepper', args: { orientation: 'horizontal' } };
export const Vertical: Story = { name: 'Position: Vertical', args: { orientation: 'vertical' } };

/* ── All states: every item state in both positions ── */

const allStateSteps: StepItem[] = [
  { label: 'Completed', state: 'completed' },
  { label: 'Error', state: 'error' },
  { label: 'In progress', state: 'in-progress' },
  { label: 'Not started', state: 'not-started' },
  { label: 'Skeleton', state: 'skeleton' },
];

export const AllStates: Story = {
  render: () => (
    <table style={table}>
      <tbody>
        {ORIENTATIONS.map((o) => (
          <tr key={o}>
            <th style={headCell}>{o === 'horizontal' ? 'Horizontal stepper' : 'Vertical'}</th>
            <td style={cell}>
              <Stepper orientation={o} steps={allStateSteps} currentStep={2} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Progression through a flow ── */

export const Progression: Story = {
  name: 'Progression (step 1 → all completed, error, skeleton)',
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          <th style={headCell}>Horizontal stepper</th>
          <th style={headCell}>Vertical</th>
        </tr>
      </thead>
      <tbody>
        {[
          { name: 'Step 1 in progress', props: { currentStep: 0 } },
          { name: 'Step 3 in progress', props: { currentStep: 2 } },
          { name: 'All completed', props: { currentStep: 4 } },
          { name: 'Error on step 2', props: { currentStep: 1, error: true } },
          { name: 'Skeleton', props: { skeleton: true } },
        ].map((row) => (
          <tr key={row.name}>
            <th style={headCell}>{row.name}</th>
            {ORIENTATIONS.map((o) => (
              <td key={o} style={cell}>
                <Stepper orientation={o} steps={wizardSteps} {...row.props} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Figma matrix: both Position variants as drawn in Figma ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 2 variants)',
  render: () => (
    <table style={table}>
      <tbody>
        {ORIENTATIONS.map((o) => (
          <tr key={o}>
            <th style={headCell}>{`Position=${o === 'horizontal' ? 'Horizontal stepper' : 'Vertical'}`}</th>
            <td style={cell}>
              <Stepper position={o} steps={figmaSteps} currentStep={0} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Edge cases ── */

export const EightSteps: Story = {
  name: 'Maximum: 8 steps',
  args: {
    steps: Array.from({ length: 8 }, (_, i) => ({ label: `Step ${i + 1}` })),
    currentStep: 5,
  },
};

export const LongLabelsTruncate: Story = {
  name: 'Overflow: long labels truncate with tooltip',
  render: () => (
    <div style={{ display: 'flex', gap: 48 }}>
      <div style={{ width: 760 }}>
        <Stepper
          steps={[
            { label: 'Patient details and medical history' },
            { label: 'Intraoral scan of upper and lower jaw' },
            { label: 'Review' },
          ]}
          currentStep={1}
        />
      </div>
      <div style={{ width: 200 }}>
        <Stepper
          orientation="vertical"
          steps={[{ label: 'Patient details and medical history' }, { label: 'Scan' }]}
          currentStep={0}
        />
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction / a11y tests (the stepper itself is not interactive)  */
/* ------------------------------------------------------------------ */

export const AnnouncesProgress: Story = {
  tags: ['test'],
  args: { currentStep: 2, error: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole('list', { name: 'Progress' });
    const items = within(list).getAllByRole('listitem');
    await expect(items).toHaveLength(4);
    await expect(items[0]).toHaveTextContent('Personal info, completed');
    await expect(items[2]).toHaveAttribute('aria-current', 'step');
    await expect(items[2]).toHaveTextContent('Payment, error');
    await expect(items[3]).toHaveTextContent('Review, not started');
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
};
