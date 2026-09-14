import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { NotificationAction } from './NotificationAction';

const meta: Meta<typeof NotificationAction> = {
  title: 'Private/NotificationAction',
  component: NotificationAction,
  argTypes: {
    type: {
      control: 'radio',
      options: ['link', 'button'],
    },
  },
  args: {
    onLinkClick: fn(),
    onPrimaryButtonClick: fn(),
    onSecondaryButtonClick: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof NotificationAction>;

/* ── Default (Link type) ── */

export const Default: Story = {
  args: {
    type: 'link',
    linkText: 'View details',
    linkHref: '#',
  },
};

/* ── Per-type variants ── */

export const LinkType: Story = {
  name: 'Type: Link',
  args: {
    type: 'link',
    linkText: 'Learn more',
    linkHref: '#',
  },
};

export const ButtonType: Story = {
  name: 'Type: Button',
  args: {
    type: 'button',
    primaryButtonText: 'Confirm',
    secondaryButtonText: 'Dismiss',
  },
};

/* ── All Variants ── */

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <span
          style={{
            fontWeight: 600,
            marginBottom: 8,
            display: 'block',
            fontSize: 14,
            color: 'var(--scanner-text-secondary)',
          }}
        >
          Type: Link
        </span>
        <NotificationAction
          type="link"
          linkText="View details"
          linkHref="#"
        />
      </div>
      <div>
        <span
          style={{
            fontWeight: 600,
            marginBottom: 8,
            display: 'block',
            fontSize: 14,
            color: 'var(--scanner-text-secondary)',
          }}
        >
          Type: Button
        </span>
        <NotificationAction
          type="button"
          primaryButtonText="Confirm"
          secondaryButtonText="Dismiss"
        />
      </div>
      <div>
        <span
          style={{
            fontWeight: 600,
            marginBottom: 8,
            display: 'block',
            fontSize: 14,
            color: 'var(--scanner-text-secondary)',
          }}
        >
          Type: Button (custom labels)
        </span>
        <NotificationAction
          type="button"
          primaryButtonText="Retry"
          secondaryButtonText="Cancel"
        />
      </div>
    </div>
  ),
};
