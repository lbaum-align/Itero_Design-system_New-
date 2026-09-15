import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { Status } from './Status';
import type { StatusPixelSize, StatusType } from './status.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → _Status (node 20920:33) — one variant: State=Online (16px, icon-success).
 * Private: used by Avatar, not exported from the package.
 */

const SIZES: StatusPixelSize[] = [6, 8, 10, 12, 16];
const STATUSES: StatusType[] = ['online', 'offline', 'away', 'busy'];

const caption: React.CSSProperties = { font: '400 12px/16px var(--scanner-font-sans)', color: 'var(--scanner-text-secondary)' };

const meta: Meta<typeof Status> = {
  title: 'Private/_Status',
  component: Status,
  argTypes: {
    status: { name: 'State', control: 'select', options: STATUSES },
    size: { control: 'select', options: SIZES },
  },
  args: { status: 'online', size: 16 },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Status>;

/** Figma State=Online — the only Figma variant. */
export const Default: Story = {};
export const Online: Story = { name: 'State: Online' };

/** Figma matrix: 1 variant (Online, 16px). */
export const FigmaMatrix: Story = { name: 'Figma matrix (1 variant)', args: { status: 'online', size: 16 } };

/** Sizes Avatar uses (6/8/10 from Figma, 12/16 extrapolated for 60/80px avatars). */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      {SIZES.map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <Status size={s} />
          <span style={caption}>{s}px</span>
        </div>
      ))}
    </div>
  ),
};

/** Online is from Figma; offline / away / busy are code extensions. */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      {STATUSES.map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <Status status={s} />
          <span style={caption}>{s}</span>
        </div>
      ))}
    </div>
  ),
};

export const HasAccessibleLabel: Story = {
  tags: ['test'],
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('img', { name: 'online' })).toBeInTheDocument();
  },
};
