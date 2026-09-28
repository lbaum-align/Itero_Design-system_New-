import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../button';
import { Toast } from './Toast';
import { ToastProvider } from './ToastProvider';
import { useToast } from './useToast';
import type { ToastPlacement, ToastProps, ToastStatus, ToastType } from './toast.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → Toast (node 34305:10008)
 * Type × Status = 8 variants (+ Show action, Closable) — every variant is rendered in `FigmaMatrix`.
 */

const TYPES: ToastType[] = ['toast', 'inline'];
const STATUSES: ToastStatus[] = ['information', 'success', 'warning', 'error'];
const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const LINK_ACTION: ToastProps['action'] = { type: 'link', linkText: 'Link', linkHref: '#' };
const BUTTON_ACTION: ToastProps['action'] = { type: 'button', primaryButtonText: 'Button text', secondaryButtonText: 'Button text' };

/* ── Layout helpers (story-only) ── */

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 12, verticalAlign: 'top' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};
/* Figma lays the variants out at 350px */
const FIGMA_WIDTH = 350;

/* ------------------------------------------------------------------ */

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    docs: {
      description: {
        component:
          'Brief, non-modal notification. `type="toast"` floats at the top right (use `ToastProvider` + `useToast`), ' +
          '`type="inline"` sits at the top of the content area. Information/success use `role="status"`, ' +
          'warning/error `role="alert"`. Keyboard: Tab moves between the action(s) and the close icon; Enter/Space activate.',
      },
    },
  },
  argTypes: {
    type: { name: 'Type', control: 'inline-radio', options: TYPES },
    status: { name: 'Status', control: 'inline-radio', options: STATUSES },
    showTitle: { name: 'Show title', control: 'boolean' },
    title: { control: 'text' },
    message: { control: 'text' },
    showAction: { name: 'Show action', control: 'boolean' },
    action: { control: 'object' },
    closable: { name: 'Closable', control: 'boolean' },
    closeLabel: { control: 'text' },
    statusLabel: { control: 'text' },
  },
  args: {
    type: 'toast',
    status: 'information',
    showTitle: true,
    title: 'Title',
    message: 'Message text goes here',
    showAction: true,
    action: LINK_ACTION,
    closable: true,
    onClose: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Toast>;

/* ── Default ── */

export const Default: Story = {};

/* ── Per type (Figma "Type") ── */

export const TypeToast: Story = { name: 'Type: Toast', args: { type: 'toast' } };
export const TypeInline: Story = { name: 'Type: Inline', args: { type: 'inline' } };

/* ── Per status (Figma "Status") ── */

export const StatusInformation: Story = { name: 'Status: Information', args: { status: 'information' } };
export const StatusSuccess: Story = { name: 'Status: Success', args: { status: 'success' } };
export const StatusWarning: Story = { name: 'Status: Warning', args: { status: 'warning', action: BUTTON_ACTION } };
export const StatusError: Story = { name: 'Status: Error', args: { status: 'error' } };

/* ── Full Figma matrix: Type × Status ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 8 variants)',
  decorators: [(Story) => <Story />],
  render: () => (
    <div style={{ padding: 24, width: 'max-content', background: 'var(--scanner-bg-page)' }}>
      <table style={table}>
        <thead>
          <tr>
            <th style={headCell} />
            {TYPES.map((t) => (
              <th key={t} style={headCell}>{`Type=${label(t)}`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {STATUSES.map((s) => (
            <tr key={s}>
              <th style={headCell}>{`Status=${label(s)}`}</th>
              {TYPES.map((t) => (
                <td key={t} style={cell}>
                  <Toast
                    type={t}
                    status={s}
                    title="Title"
                    message="Message text goes here"
                    /* Figma: only the Warning toast uses the Button action */
                    action={t === 'toast' && s === 'warning' ? BUTTON_ACTION : LINK_ACTION}
                    style={t === 'toast' && s === 'warning' ? undefined : { width: FIGMA_WIDTH }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

/* ── AllStates: status × boolean combinations ── */

const COMBOS: { name: string; props: Partial<ToastProps> }[] = [
  { name: 'Default', props: {} },
  { name: 'Show action: False', props: { showAction: false } },
  { name: 'Closable: False', props: { closable: false } },
  { name: 'Show title: False', props: { showTitle: false, showAction: false } },
  { name: 'Button action', props: { action: BUTTON_ACTION } },
];

export const AllStates: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <div style={{ padding: 24 }}>
      {TYPES.map((t) => (
        <table key={t} style={{ ...table, marginBottom: 24 }}>
          <thead>
            <tr>
              <th style={headCell}>{`Type=${label(t)}`}</th>
              {COMBOS.map((c) => (
                <th key={c.name} style={headCell}>{c.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STATUSES.map((s) => (
              <tr key={s}>
                <th style={headCell}>{label(s)}</th>
                {COMBOS.map((c) => (
                  <td key={c.name} style={cell}>
                    <Toast
                      type={t}
                      status={s}
                      title="Title"
                      message="Message text goes here"
                      action={LINK_ACTION}
                      style={{ width: FIGMA_WIDTH }}
                      {...c.props}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </div>
  ),
};

/* ── Overflow: long title / message wrap; toast caps at 400px, inline fills its container ── */

export const LongContent: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, width: 640 }}>
      <Toast
        status="error"
        title="Your file could not be uploaded to the scanner"
        message="Your file could not be uploaded due to a network error. Please check your connection and try again. We're sorry for the inconvenience."
        action={{ type: 'button', primaryButtonText: 'Try again', secondaryButtonText: 'Contact support' }}
      />
      <Toast
        type="inline"
        status="warning"
        title="Unsaved changes will be lost"
        message="You have unsaved changes in the treatment plan. Leaving this page will discard them. Save the plan first if you want to keep your work."
        action={LINK_ACTION}
      />
      <div style={{ width: 296 }}>
        <Toast type="inline" status="success" title="Uploaded" message="Averyveryveryverylongfilenamewithoutspaces.stl" showAction={false} />
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Toast queue                                                       */
/* ------------------------------------------------------------------ */

const SAMPLES: Record<ToastStatus, { title: string; message: string }> = {
  information: { title: 'Profile updated', message: 'Your profile has been updated.' },
  success: { title: 'Upload complete', message: 'Your file has been uploaded successfully.' },
  warning: { title: 'Unsaved changes', message: 'Unsaved changes will be lost.' },
  error: { title: 'Save failed', message: 'Failed to save changes.' },
};

function QueueDemo() {
  const toast = useToast();
  const [lastId, setLastId] = useState<string | null>(null);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {STATUSES.map((s) => (
        <Button key={s} emphasis="secondary" onClick={() => setLastId(toast.show({ status: s, ...SAMPLES[s] }))}>
          {`Show ${s}`}
        </Button>
      ))}
      <Button
        emphasis="secondary"
        onClick={() =>
          setLastId(
            toast.show({
              status: 'error',
              ...SAMPLES.error,
              action: { type: 'link', linkText: 'Retry', onLinkClick: () => toast.show({ status: 'success', ...SAMPLES.success }) },
            }),
          )
        }
      >
        Show with action (persistent)
      </Button>
      <Button emphasis="ghost" disabled={!lastId} onClick={() => lastId && toast.dismiss(lastId)}>
        Dismiss last
      </Button>
      <Button emphasis="ghost" onClick={() => toast.dismissAll()}>
        Dismiss all
      </Button>
    </div>
  );
}

type QueueArgs = { placement: ToastPlacement; duration: number; limit: number };

export const Queue: StoryObj<QueueArgs> = {
  name: 'Toast queue (ToastProvider + useToast)',
  parameters: {
    docs: {
      description: {
        story:
          'Newest toast on top, 16px apart, top right by default. Auto-dismiss after 7s (pauses on hover/focus); ' +
          'toasts with an action stay until closed.',
      },
    },
  },
  argTypes: {
    placement: {
      control: 'select',
      options: ['top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center'],
    },
    duration: { control: { type: 'number', step: 1000 } },
    limit: { control: { type: 'number', min: 1 } },
  },
  args: { placement: 'top-right', duration: 7000, limit: 5 },
  render: (args) => (
    <ToastProvider placement={args.placement} duration={args.duration} limit={args.limit}>
      <QueueDemo />
    </ToastProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Show success' }));
    const status = await body.findByRole('status');
    await expect(status).toHaveTextContent('Upload complete');
    await userEvent.click(canvas.getByRole('button', { name: 'Show error' }));
    const alert = await body.findByRole('alert');
    /* Newest first */
    const region = body.getByRole('region', { name: 'Notifications' });
    await expect(region.firstElementChild).toBe(alert);
    await userEvent.click(within(alert).getByRole('button', { name: 'Close notification' }));
    await waitFor(() => expect(body.queryByRole('alert')).not.toBeInTheDocument());
    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss all' }));
    await waitFor(() => expect(body.queryByRole('status')).not.toBeInTheDocument());
  },
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const DismissAndAction: Story = {
  tags: ['test'],
  args: {
    status: 'warning',
    action: { type: 'button', primaryButtonText: 'Retry', secondaryButtonText: 'Dismiss', onPrimaryButtonClick: fn() },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const alert = canvas.getByRole('alert');
    await expect(within(alert).getByRole('img', { name: 'Warning' })).toBeInTheDocument();
    /* Tab order: actions, then the close icon */
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Retry' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.action?.onPrimaryButtonClick).toHaveBeenCalledTimes(1);
    await userEvent.tab();
    await userEvent.tab();
    const close = canvas.getByRole('button', { name: 'Close notification' });
    await expect(close).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(args.onClose).toHaveBeenCalledTimes(1);
  },
};

export const LinkAction: Story = {
  tags: ['test'],
  args: { status: 'success', action: { type: 'link', linkText: 'View', onLinkClick: fn() } },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toHaveAttribute('data-status', 'success');
    await userEvent.click(canvas.getByRole('link', { name: 'View' }));
    await expect(args.action?.onLinkClick).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Close notification' }));
    await expect(args.onClose).toHaveBeenCalledTimes(1);
  },
};
