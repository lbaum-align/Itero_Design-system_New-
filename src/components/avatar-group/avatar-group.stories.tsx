import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { AvatarGroup } from './AvatarGroup';
import type { AvatarGroupItem } from './avatar-group.types';
import type { AvatarPixelSize } from '../avatar/avatar.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → 02 Avatars group (node 24505:108025)
 * Size: 28, 32, 36, 40, 44, 48, 52 — Figma shows 4 image avatars + a "+4" counter at every size.
 */

const photo = (id: string) => `https://images.unsplash.com/${id}?w=160&h=160&fit=crop&crop=face`;

const SAMPLE_AVATARS: AvatarGroupItem[] = [
  { src: photo('photo-1472099645785-5658abf4ff4e'), alt: 'Alex Chen' },
  { src: photo('photo-1494790108377-be9c29b29330'), alt: 'Sarah Miller' },
  { src: photo('photo-1507003211169-0a1dd7228f2d'), alt: 'James Wilson' },
  { src: photo('photo-1438761681033-6461ffad8d80'), alt: 'Emily Davis' },
  { src: photo('photo-1500648767791-00dcc994a43e'), alt: 'Michael Brown' },
  { name: 'Katie Lee', alt: 'Katie Lee' },
  { name: 'Robert Johnson', alt: 'Robert Johnson' },
  { alt: 'Unknown user' },
];

const FIGMA_SIZES: AvatarPixelSize[] = [28, 32, 36, 40, 44, 48, 52];

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 12, verticalAlign: 'middle' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const meta: Meta<typeof AvatarGroup> = {
  title: 'Components/AvatarGroup',
  component: AvatarGroup,
  parameters: {
    docs: {
      description: {
        component:
          'Overlapping avatars, each separated by a 1px white (border-on-color-strong) ring, ending with a "+N" counter ' +
          'for avatars beyond `max`. Not interactive.',
      },
    },
  },
  argTypes: {
    size: { name: 'Size', control: 'select', options: [...FIGMA_SIZES, 60, 80] },
    max: { control: { type: 'number', min: 0, max: 10 } },
  },
  args: { avatars: SAMPLE_AVATARS, max: 4, size: 40 },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof AvatarGroup>;

/* ── Default (Figma: 4 avatars + "+4") ── */

export const Default: Story = {};

/* ── Per size (Figma "Size") ── */

export const Size28: Story = { name: 'Size: 28', args: { size: 28 } };
export const Size32: Story = { name: 'Size: 32', args: { size: 32 } };
export const Size36: Story = { name: 'Size: 36', args: { size: 36 } };
export const Size40: Story = { name: 'Size: 40', args: { size: 40 } };
export const Size44: Story = { name: 'Size: 44', args: { size: 44 } };
export const Size48: Story = { name: 'Size: 48', args: { size: 48 } };
export const Size52: Story = { name: 'Size: 52', args: { size: 52 } };

/* ── All sizes / Figma matrix (7 variants) ── */

export const AllSizes: Story = {
  render: () => (
    <table style={table}>
      <tbody>
        {FIGMA_SIZES.map((s) => (
          <tr key={s}>
            <th style={headCell}>{`Size=${s}`}</th>
            <td style={cell}>
              <AvatarGroup avatars={SAMPLE_AVATARS} max={4} size={s} />
            </td>
          </tr>
        ))}
        {([60, 80] as const).map((s) => (
          <tr key={s}>
            <th style={headCell}>{`${s} (extrapolated, not in Figma)`}</th>
            <td style={cell}>
              <AvatarGroup avatars={SAMPLE_AVATARS} max={4} size={s} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 7 variants)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {FIGMA_SIZES.map((s) => (
        <AvatarGroup key={s} avatars={SAMPLE_AVATARS.slice(0, 8)} max={4} size={s} />
      ))}
    </div>
  ),
};

/** No distinct interactive states exist in Figma; the group shows overflow vs. no overflow. */
export const AllStates: Story = {
  render: () => (
    <table style={table}>
      <tbody>
        <tr>
          <th style={headCell}>No overflow</th>
          <td style={cell}><AvatarGroup avatars={SAMPLE_AVATARS.slice(0, 3)} size={40} /></td>
        </tr>
        <tr>
          <th style={headCell}>Overflow (+N)</th>
          <td style={cell}><AvatarGroup avatars={SAMPLE_AVATARS} size={40} /></td>
        </tr>
        <tr>
          <th style={headCell}>Mixed variants</th>
          <td style={cell}><AvatarGroup avatars={SAMPLE_AVATARS.slice(4)} size={40} /></td>
        </tr>
        <tr>
          <th style={headCell}>On coloured background</th>
          <td style={{ ...cell, background: 'var(--scanner-bg-brand)' }}>
            <AvatarGroup avatars={SAMPLE_AVATARS} size={40} />
          </td>
        </tr>
      </tbody>
    </table>
  ),
};

/* ── Edge cases ── */

export const LargeOverflowCount: Story = {
  args: {
    avatars: [
      ...SAMPLE_AVATARS,
      ...Array.from({ length: 120 }, (_, i) => ({ name: `User ${i}`, alt: `User ${i + 9}` })),
    ],
    max: 3,
    size: 28,
  },
};

export const SingleAvatar: Story = { args: { avatars: SAMPLE_AVATARS.slice(0, 1) } };

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const OverflowIsAnnounced: Story = {
  tags: ['test'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('group', { name: 'Group of 8 avatars' })).toBeInTheDocument();
    await expect(canvas.getByRole('img', { name: '4 more' })).toHaveTextContent('+4');
    await expect(canvas.getByRole('img', { name: 'Alex Chen' })).toBeInTheDocument();
  },
};
