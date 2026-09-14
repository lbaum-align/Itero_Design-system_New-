import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';
import type { AvatarSize } from './avatar.types';

const SAMPLE_IMAGE =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=face';

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

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  argTypes: {
    size: {
      control: 'select',
      options: ALL_SIZES,
    },
    status: {
      control: 'select',
      options: [undefined, 'online', 'offline', 'away', 'busy'],
    },
    skeleton: { control: 'boolean' },
    src: { control: 'text' },
    initials: { control: 'text' },
    alt: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

/* ------------------------------------------------------------------ */
/*  Default (Image)                                                   */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  args: {
    src: SAMPLE_IMAGE,
    alt: 'Jane Doe',
    size: 'medium',
  },
};

/* ------------------------------------------------------------------ */
/*  With Initials                                                     */
/* ------------------------------------------------------------------ */

export const WithInitials: Story = {
  args: {
    initials: 'JD',
    alt: 'Jane Doe',
    size: 'medium',
  },
};

/* ------------------------------------------------------------------ */
/*  With Icon (no src or initials)                                    */
/* ------------------------------------------------------------------ */

export const WithIcon: Story = {
  args: {
    alt: 'Unknown user',
    size: 'medium',
  },
};

/* ------------------------------------------------------------------ */
/*  All Sizes                                                         */
/* ------------------------------------------------------------------ */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'end', gap: 16, flexWrap: 'wrap' }}>
      {ALL_SIZES.map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <Avatar src={SAMPLE_IMAGE} alt={`Size ${s}`} size={s} />
          <span style={{ fontSize: 11, color: '#666' }}>{s}</span>
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  All Sizes — Initials                                              */
/* ------------------------------------------------------------------ */

export const AllSizesInitials: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'end', gap: 16, flexWrap: 'wrap' }}>
      {ALL_SIZES.map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <Avatar initials="AD" alt={`Size ${s}`} size={s} />
          <span style={{ fontSize: 11, color: '#666' }}>{s}</span>
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  All Sizes — Icon                                                  */
/* ------------------------------------------------------------------ */

export const AllSizesIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'end', gap: 16, flexWrap: 'wrap' }}>
      {ALL_SIZES.map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <Avatar alt={`Size ${s}`} size={s} />
          <span style={{ fontSize: 11, color: '#666' }}>{s}</span>
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  With Status                                                       */
/* ------------------------------------------------------------------ */

export const WithStatus: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Avatar src={SAMPLE_IMAGE} alt="Online" size="large" status="online" />
        <span style={{ fontSize: 11, color: '#666' }}>online</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Avatar src={SAMPLE_IMAGE} alt="Offline" size="large" status="offline" />
        <span style={{ fontSize: 11, color: '#666' }}>offline</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Avatar src={SAMPLE_IMAGE} alt="Away" size="large" status="away" />
        <span style={{ fontSize: 11, color: '#666' }}>away</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Avatar src={SAMPLE_IMAGE} alt="Busy" size="large" status="busy" />
        <span style={{ fontSize: 11, color: '#666' }}>busy</span>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  With Status — All Sizes                                           */
/* ------------------------------------------------------------------ */

export const WithStatusAllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'end', gap: 16, flexWrap: 'wrap' }}>
      {ALL_SIZES.map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <Avatar src={SAMPLE_IMAGE} alt={`Size ${s}`} size={s} status="online" />
          <span style={{ fontSize: 11, color: '#666' }}>{s}</span>
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Skeleton                                                          */
/* ------------------------------------------------------------------ */

export const Skeleton: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'end', gap: 16, flexWrap: 'wrap' }}>
      {ALL_SIZES.map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <Avatar alt="Loading" size={s} skeleton />
          <span style={{ fontSize: 11, color: '#666' }}>{s}</span>
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  All Variants Matrix — rows=variant, cols=sizes                    */
/* ------------------------------------------------------------------ */

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Image row */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: '#666' }}>Image</div>
        <div style={{ display: 'flex', alignItems: 'end', gap: 12 }}>
          {ALL_SIZES.map((s) => (
            <Avatar key={s} src={SAMPLE_IMAGE} alt={`Image ${s}`} size={s} />
          ))}
        </div>
      </div>

      {/* Initials row */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: '#666' }}>Initials</div>
        <div style={{ display: 'flex', alignItems: 'end', gap: 12 }}>
          {ALL_SIZES.map((s) => (
            <Avatar key={s} initials="AD" alt={`Initials ${s}`} size={s} />
          ))}
        </div>
      </div>

      {/* Icon row */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: '#666' }}>Icon</div>
        <div style={{ display: 'flex', alignItems: 'end', gap: 12 }}>
          {ALL_SIZES.map((s) => (
            <Avatar key={s} alt={`Icon ${s}`} size={s} />
          ))}
        </div>
      </div>

      {/* Skeleton row */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: '#666' }}>Skeleton</div>
        <div style={{ display: 'flex', alignItems: 'end', gap: 12 }}>
          {ALL_SIZES.map((s) => (
            <Avatar key={s} alt="Loading" size={s} skeleton />
          ))}
        </div>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Image Load Error Fallback                                         */
/* ------------------------------------------------------------------ */

export const ImageErrorFallback: Story = {
  args: {
    src: 'https://broken-url.example/404.jpg',
    initials: 'JD',
    alt: 'Jane Doe',
    size: 'large',
  },
  name: 'Image Error → Initials Fallback',
};
