import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { NotificationTextContent } from './NotificationTextContent';

/*
 * Figma: "06. Scanner core 1.0.0 full" → .Notification text content (node 34305:10065)
 * Show title: True, False — both variants are rendered in `FigmaMatrix`.
 */

const headCell: React.CSSProperties = {
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  margin: '0 0 4px',
  whiteSpace: 'nowrap',
};
/* Outline shows the component bounds */
const bounds: React.CSSProperties = { outline: '1px dashed var(--scanner-border-default)', width: 'max-content' };

const meta: Meta<typeof NotificationTextContent> = {
  title: 'Private/NotificationTextContent',
  component: NotificationTextContent,
  parameters: {
    docs: {
      description: {
        component:
          'Title + message block of a Toast / inline notification. With a title the message uses the secondary ' +
          'text colour; without one it is primary. Text wraps (titles 3–6 words, messages 20–30 words per Figma docs).',
      },
    },
  },
  argTypes: {
    showTitle: { name: 'Show title', control: 'boolean' },
    title: { name: 'Title text value', control: 'text' },
    message: { name: 'Subtitle / Text value', control: 'text' },
  },
  args: {
    showTitle: true,
    title: 'Title',
    message: 'Message text goes here',
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

type Story = StoryObj<typeof NotificationTextContent>;

export const Default: Story = {};

export const ShowTitleTrue: Story = { name: 'Show title: True', args: { showTitle: true } };
export const ShowTitleFalse: Story = { name: 'Show title: False', args: { showTitle: false } };

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 2 variants)',
  render: () => (
    <div style={{ display: 'flex', gap: 40 }}>
      {[true, false].map((showTitle) => (
        <div key={String(showTitle)}>
          <p style={headCell}>{`Show title=${showTitle ? 'True' : 'False'}`}</p>
          <div style={bounds}>
            <NotificationTextContent showTitle={showTitle} title="Title" message="Message text goes here" />
          </div>
        </div>
      ))}
    </div>
  ),
};

/* The component is static text — "states" are the title/message combinations. */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 320 }}>
      <div>
        <p style={headCell}>Title + message</p>
        <NotificationTextContent title="Upload failed" message="Your file could not be uploaded." />
      </div>
      <div>
        <p style={headCell}>Message only (showTitle=false)</p>
        <NotificationTextContent showTitle={false} title="Ignored" message="Changes saved." />
      </div>
      <div>
        <p style={headCell}>Message only (no title)</p>
        <NotificationTextContent message="Your profile has been updated." />
      </div>
    </div>
  ),
};

export const LongContent: Story = {
  render: () => (
    <div style={{ width: 226, outline: '1px dashed var(--scanner-border-default)' }}>
      <NotificationTextContent
        title="Scanner calibration is required before the next scan"
        message="Your file could not be uploaded due to a network error. Please check the connection and try again. We're sorry for the inconvenience. Averyveryveryverylongunbrokenword"
      />
    </div>
  ),
};

export const TitleVisibilityTest: Story = {
  tags: ['test'],
  args: { title: 'Saved', message: 'All changes are saved.' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Saved')).toBeVisible();
    await expect(canvas.getByText('All changes are saved.')).toBeVisible();
  },
};
