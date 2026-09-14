import type { Meta, StoryObj } from '@storybook/react';
import { AvatarGroup } from './AvatarGroup';
import type { AvatarGroupItem } from './avatar-group.types';
import type { AvatarSize } from '../avatar/avatar.types';

/* ------------------------------------------------------------------ */
/*  Sample data                                                       */
/* ------------------------------------------------------------------ */

const SAMPLE_AVATARS: AvatarGroupItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=face',
    alt: 'Alex Chen',
  },
  {
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=face',
    alt: 'Sarah Miller',
  },
  {
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face',
    alt: 'James Wilson',
  },
  {
    src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&h=160&fit=crop&crop=face',
    alt: 'Emily Davis',
  },
  {
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=face',
    alt: 'Michael Brown',
  },
  {
    initials: 'KL',
    alt: 'Katie Lee',
  },
  {
    initials: 'RJ',
    alt: 'Robert Johnson',
  },
  {
    alt: 'Unknown User',
  },
];

const ALL_SIZES: AvatarSize[] = [
  'extra-small',
  'small',
  'medium',
  'large',
  'extra-large',
  '2xl',
  '3xl',
  '4xl',
];

/* ------------------------------------------------------------------ */
/*  Meta                                                              */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof AvatarGroup> = {
  title: 'Components/AvatarGroup',
  component: AvatarGroup,
  argTypes: {
    size: {
      control: 'select',
      options: ALL_SIZES,
    },
    max: {
      control: { type: 'number', min: 1, max: 10 },
    },
  },
};
export default meta;

type Story = StoryObj<typeof AvatarGroup>;

/* ------------------------------------------------------------------ */
/*  Default                                                           */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  args: {
    avatars: SAMPLE_AVATARS,
    max: 4,
    size: 'medium',
  },
};

/* ------------------------------------------------------------------ */
/*  No Overflow                                                       */
/* ------------------------------------------------------------------ */

export const NoOverflow: Story = {
  name: 'No Overflow (avatars <= max)',
  args: {
    avatars: SAMPLE_AVATARS.slice(0, 3),
    max: 4,
    size: 'medium',
  },
};

/* ------------------------------------------------------------------ */
/*  With Overflow                                                     */
/* ------------------------------------------------------------------ */

export const WithOverflow: Story = {
  name: 'With Overflow (+N indicator)',
  args: {
    avatars: SAMPLE_AVATARS,
    max: 4,
    size: 'large',
  },
};

/* ------------------------------------------------------------------ */
/*  Large Overflow Count                                              */
/* ------------------------------------------------------------------ */

export const LargeOverflowCount: Story = {
  name: 'Large Overflow Count (+N > 9)',
  args: {
    avatars: [
      ...SAMPLE_AVATARS,
      ...Array.from({ length: 12 }, (_, i) => ({
        initials: `U${i}`,
        alt: `User ${i + 9}`,
      })),
    ],
    max: 3,
    size: 'large',
  },
};

/* ------------------------------------------------------------------ */
/*  Mixed Avatar Types                                                */
/* ------------------------------------------------------------------ */

export const MixedTypes: Story = {
  name: 'Mixed Types (image, initials, icon)',
  args: {
    avatars: [
      { src: SAMPLE_AVATARS[0].src, alt: 'Photo avatar' },
      { initials: 'AB', alt: 'Initials avatar' },
      { alt: 'Icon fallback avatar' },
      { src: SAMPLE_AVATARS[1].src, alt: 'Another photo' },
      { initials: 'XY', alt: 'More initials' },
    ],
    max: 4,
    size: 'large',
  },
};

/* ------------------------------------------------------------------ */
/*  All Sizes                                                         */
/* ------------------------------------------------------------------ */

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
      {ALL_SIZES.map((size) => (
        <div key={size} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span
            style={{
              width: '100px',
              fontFamily: 'var(--scanner-font-sans)',
              fontSize: 'var(--scanner-text-xs)',
              color: 'var(--scanner-text-secondary)',
            }}
          >
            {size}
          </span>
          <AvatarGroup avatars={SAMPLE_AVATARS} max={4} size={size} />
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Figma Sizes (matching Figma variant options)                      */
/* ------------------------------------------------------------------ */

const FIGMA_SIZES: AvatarSize[] = [
  'extra-small',
  'small',
  'medium',
  'large',
  'extra-large',
  '2xl',
];

export const FigmaSizes: Story = {
  name: 'Figma Variant Sizes (28–48)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
      {FIGMA_SIZES.map((size) => (
        <div key={size} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span
            style={{
              width: '100px',
              fontFamily: 'var(--scanner-font-sans)',
              fontSize: 'var(--scanner-text-xs)',
              color: 'var(--scanner-text-secondary)',
            }}
          >
            {size}
          </span>
          <AvatarGroup avatars={SAMPLE_AVATARS} max={4} size={size} />
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Single Avatar                                                     */
/* ------------------------------------------------------------------ */

export const SingleAvatar: Story = {
  name: 'Single Avatar (no overflow)',
  args: {
    avatars: [SAMPLE_AVATARS[0]],
    max: 4,
    size: 'large',
  },
};

/* ------------------------------------------------------------------ */
/*  Max = 1 With Many Avatars                                         */
/* ------------------------------------------------------------------ */

export const MaxOne: Story = {
  name: 'Max 1 with overflow',
  args: {
    avatars: SAMPLE_AVATARS,
    max: 1,
    size: 'large',
  },
};
