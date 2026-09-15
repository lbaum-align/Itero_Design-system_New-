import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { NotificationAction } from './NotificationAction';
import type { NotificationActionType } from './notification-action.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → .Notification action (node 34305:10071)
 * Type: Link, Button — both variants are rendered in `FigmaMatrix`; `InToast` shows how Toast (34305:10008) uses it.
 */

const TYPES: NotificationActionType[] = ['link', 'button'];
const typeLabel: Record<NotificationActionType, string> = { link: 'Link', button: 'Button' };

/* ── Layout helpers (story-only) ── */

const headCell: React.CSSProperties = {
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  margin: '0 0 4px',
  whiteSpace: 'nowrap',
};
/* Outline shows the component bounds (incl. the 16px top padding) */
const bounds: React.CSSProperties = { outline: '1px dashed var(--scanner-border-default)', width: 'max-content' };

/* ------------------------------------------------------------------ */

const meta: Meta<typeof NotificationAction> = {
  title: 'Private/NotificationAction',
  component: NotificationAction,
  parameters: {
    docs: {
      description: {
        component:
          'Action area of a Toast / inline notification, placed under the message. ' +
          'Keyboard: Tab moves between the action(s) and the close icon; Enter/Space trigger the action.',
      },
    },
  },
  argTypes: {
    type: { name: 'Type', control: 'inline-radio', options: TYPES },
    linkText: { control: 'text', if: { arg: 'type', eq: 'link' } },
    linkHref: { control: 'text', if: { arg: 'type', eq: 'link' } },
    linkExternal: { control: 'boolean', if: { arg: 'type', eq: 'link' } },
    primaryButtonText: { control: 'text', if: { arg: 'type', eq: 'button' } },
    secondaryButtonText: { control: 'text', if: { arg: 'type', eq: 'button' } },
    children: { control: false },
  },
  args: {
    type: 'link',
    linkText: 'Link',
    linkHref: '#',
    primaryButtonText: 'Button text',
    secondaryButtonText: 'Button text',
    onLinkClick: fn(),
    onPrimaryButtonClick: fn(),
    onSecondaryButtonClick: fn(),
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

type Story = StoryObj<typeof NotificationAction>;

/* ── Default ── */

export const Default: Story = {};

/* ── Per type (Figma "Type") ── */

export const LinkType: Story = { name: 'Type: Link', args: { type: 'link' } };
export const ButtonType: Story = { name: 'Type: Button', args: { type: 'button' } };

/* ── Full Figma matrix: both variants ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 2 variants)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {TYPES.map((t) => (
        <div key={t}>
          <p style={headCell}>{`Type=${typeLabel[t]}`}</p>
          <div style={bounds}>
            <NotificationAction type={t} linkHref="#" />
          </div>
        </div>
      ))}
    </div>
  ),
};

/* ── States of the building blocks (Link / Button own their states) ── */

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <p style={headCell}>Link: enabled · external</p>
        <div style={{ display: 'flex', gap: 24 }}>
          <NotificationAction linkText="View details" linkHref="#" />
          <NotificationAction linkText="Open guide" linkHref="#" linkExternal />
        </div>
      </div>
      <div>
        <p style={headCell}>Button: two actions · single action (secondaryButtonText=null)</p>
        <div style={{ display: 'flex', gap: 24 }}>
          <NotificationAction type="button" primaryButtonText="Retry" secondaryButtonText="Dismiss" />
          <NotificationAction type="button" primaryButtonText="Retry" secondaryButtonText={null} />
        </div>
      </div>
    </div>
  ),
};

/* ── Overflow: buttons wrap to a new line in a narrow toast ── */

export const ButtonsWrap: Story = {
  render: () => (
    <div style={{ width: 226, outline: '1px dashed var(--scanner-border-default)' }}>
      <NotificationAction type="button" primaryButtonText="Try again" secondaryButtonText="Contact support" />
    </div>
  ),
};

/* ── In context: the content column of a Toast (Figma "Type=Toast, Status=Warning") ── */

export const InToast: Story = {
  name: 'In Toast content (reference layout)',
  render: () => (
    <div
      style={{
        width: 350,
        boxSizing: 'border-box',
        padding: 'var(--scanner-spacing-6)',
        borderRadius: 'var(--scanner-radius-xl)',
        background: 'var(--scanner-bg-elevated)',
        boxShadow: '0 2px 12px var(--scanner-border-subtle)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--scanner-spacing-5)', paddingLeft: 36 }}>
        <p className="scanner-text-heading-03" style={{ margin: 0, color: 'var(--scanner-text-primary)' }}>Title</p>
        <p className="scanner-text-body-02" style={{ margin: 0, color: 'var(--scanner-text-secondary)' }}>
          Message text goes here
        </p>
      </div>
      <NotificationAction type="button" style={{ paddingLeft: 36 }} />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const LinkKeyboardActivation: Story = {
  tags: ['test'],
  args: { linkHref: undefined },
  play: async ({ args, canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Link' });
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onLinkClick).toHaveBeenCalledTimes(1);
  },
};

export const ButtonsTabAndActivate: Story = {
  tags: ['test'],
  args: { type: 'button', primaryButtonText: 'Retry', secondaryButtonText: 'Dismiss' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Retry' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onPrimaryButtonClick).toHaveBeenCalledTimes(1);
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Dismiss' })).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(args.onSecondaryButtonClick).toHaveBeenCalledTimes(1);
  },
};
