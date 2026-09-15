import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ProgressBar } from './ProgressBar';
import type { ProgressBarProps } from './progress-bar.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Progress bar (node 25486:2635)
 * Progress (0%, 25%, 50%, 75%, 100%, Error) × Show label × Show helper text — all rendered in `FigmaMatrix`.
 */

const PROGRESS = ['0%', '25%', '50%', '75%', '100%', 'Error'] as const;
type Progress = (typeof PROGRESS)[number];

/** Props for one Figma "Progress" value. */
function progressProps(progress: Progress): ProgressBarProps {
  return progress === 'Error' ? { status: 'error', value: 100, onRetry: () => {} } : { value: parseInt(progress, 10) };
}

/* ── Layout helpers (story-only) ── */

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 12, verticalAlign: 'top', width: 288 };
const headCell: React.CSSProperties = {
  padding: 12,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
  verticalAlign: 'top',
};
const column: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 40, width: 288 };

/* ------------------------------------------------------------------ */

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  parameters: {
    docs: {
      description: {
        component:
          'Shows measurable progress of a longer task (e.g. uploading files). Statuses: in progress (0–99%), complete (100%, success) and error. ' +
          'Accepts any value up to `max`. Use a Spinner when progress cannot be estimated. The label describes the task; helper text gives detail such as "42/256 items".',
      },
    },
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max: { control: 'number' },
    status: { control: 'inline-radio', options: [undefined, 'default', 'success', 'error'] },
    label: { name: 'Label text value', control: 'text' },
    showLabel: { name: 'Show label', control: 'boolean' },
    helperText: { name: 'Helper text value', control: 'text' },
    showHelperText: { name: 'Show helper text', control: 'boolean' },
    errorText: { name: 'Error text message', control: 'text' },
    retryLabel: { control: 'text' },
    indeterminate: { control: 'boolean' },
  },
  args: {
    value: 50,
    label: 'Label',
    showLabel: true,
    helperText: 'Optional helper text',
    showHelperText: true,
    errorText: 'Error text message',
    retryLabel: 'Try again',
    onRetry: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 288, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ProgressBar>;

/* ── Default ── */

export const Default: Story = {};

/* ── One story per Figma "Progress" value ── */

export const Progress0: Story = { name: 'Progress: 0%', args: { value: 0 } };
export const Progress25: Story = { name: 'Progress: 25%', args: { value: 25 } };
export const Progress50: Story = { name: 'Progress: 50%', args: { value: 50 } };
export const Progress75: Story = { name: 'Progress: 75%', args: { value: 75 } };
export const Progress100: Story = { name: 'Progress: 100%', args: { value: 100 } };
export const ErrorState: Story = { name: 'Progress: Error', args: { status: 'error', value: 100 } };

/* ── Any value (not only the Figma steps), custom max ── */

export const ArbitraryValues: Story = {
  name: 'Any value (e.g. 42/256 items)',
  render: () => (
    <div style={column}>
      <ProgressBar value={7} label="Exporting" helperText="7%" />
      <ProgressBar value={42} max={256} label="Uploading scans" helperText="42/256 items" />
      <ProgressBar value={99.5} label="Finishing" helperText="Almost done" />
    </div>
  ),
};

/* ── All states: in progress / complete / error ── */

export const AllStates: Story = {
  decorators: [(Story) => <div style={{ padding: 16 }}><Story /></div>],
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          {['In progress', 'Complete', 'Error/Failure', 'Indeterminate (code-only)'].map((h) => (
            <th key={h} style={headCell}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={cell}>
            <ProgressBar value={50} />
          </td>
          <td style={cell}>
            <ProgressBar value={100} />
          </td>
          <td style={cell}>
            <ProgressBar status="error" onRetry={() => {}} />
          </td>
          <td style={cell}>
            <ProgressBar indeterminate label="Loading" helperText="Please wait" />
          </td>
        </tr>
      </tbody>
    </table>
  ),
};

/* ── Figma matrix: 6 × Show label × Show helper text ── */

const TOGGLES = [
  { showLabel: true, showHelperText: true },
  { showLabel: true, showHelperText: false },
  { showLabel: false, showHelperText: true },
  { showLabel: false, showHelperText: false },
];

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 6 variants)',
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ padding: 24 }}><Story /></div>],
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {TOGGLES.map((t) => (
            <th key={`${t.showLabel}-${t.showHelperText}`} style={headCell}>
              {`Show label=${t.showLabel ? 'True' : 'False'}, Show helper text=${t.showHelperText ? 'True' : 'False'}`}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {PROGRESS.map((p) => (
          <tr key={p}>
            <th style={headCell}>{`Progress=${p}`}</th>
            {TOGGLES.map((t) => (
              <td key={`${t.showLabel}-${t.showHelperText}`} style={cell}>
                <ProgressBar {...progressProps(p)} {...t} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Content edge cases ── */

export const LongContent: Story = {
  name: 'Overflow: long label and helper wrap',
  args: {
    value: 60,
    label: 'Uploading the full-arch intraoral scan for patient review',
    helperText: 'Fetching assets from the scanner and preparing the case for the lab…',
  },
};

export const ErrorWithoutRetry: Story = {
  name: 'Error without retry action',
  args: { status: 'error', onRetry: undefined, errorText: 'The upload failed. Check the connection.' },
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const ExposesProgressbarRole: Story = {
  tags: ['test'],
  args: { value: 42, max: 256, label: 'Uploading scans', helperText: '42/256 items' },
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole('progressbar', { name: 'Uploading scans' });
    await expect(bar).toHaveAttribute('aria-valuenow', '42');
    await expect(bar).toHaveAttribute('aria-valuemax', '256');
    await expect(bar).toHaveAccessibleDescription('42/256 items');
  },
};

export const RetryByClickAndKeyboard: Story = {
  tags: ['test'],
  args: { status: 'error' },
  play: async ({ args, canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Try again' });
    await userEvent.click(link);
    await expect(args.onRetry).toHaveBeenCalledTimes(1);
    link.blur();
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onRetry).toHaveBeenCalledTimes(2);
  },
};
