import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { Avatar } from './Avatar';
import type { AvatarPixelSize, AvatarProps, AvatarVariant } from './avatar.types';

/*
 * Figma: "06. Scanner core 1.0.0 full" → 01 Avatar (node 20920:34)
 * Variant (Image, Initials, Icon) × Size (28…80) × State (Enabled, Skeleton) + Show status — all in `FigmaMatrix`.
 */

const SAMPLE_IMAGE =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=face';

const SIZES: AvatarPixelSize[] = [28, 32, 36, 40, 44, 48, 52, 60, 80];
const VARIANTS: AvatarVariant[] = ['image', 'initials', 'icon'];
const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Props for one Figma variant. */
function variantProps(variant: AvatarVariant, size: AvatarPixelSize, extra: Partial<AvatarProps> = {}): AvatarProps {
  return {
    alt: 'Alex Doe',
    size,
    src: variant === 'image' ? SAMPLE_IMAGE : undefined,
    initials: variant === 'initials' ? 'AD' : undefined,
    ...extra,
  };
}

const table: React.CSSProperties = { borderCollapse: 'collapse', width: 'max-content' };
const cell: React.CSSProperties = { padding: 10, verticalAlign: 'middle', textAlign: 'center' };
const headCell: React.CSSProperties = {
  ...cell,
  font: '500 12px/16px var(--scanner-font-sans)',
  color: 'var(--scanner-text-secondary)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component:
          'Visual representation of a user or role. Three variants: image, initials (first letter of up to two words) and icon ' +
          '(no user data / generic roles). Sizes 28–80px (80 is the maximum). Not interactive; supports a skeleton state and an ' +
          'online status dot, which is cut out of the avatar with a 2px transparent gap.',
      },
    },
  },
  argTypes: {
    size: { name: 'Size', control: 'select', options: SIZES },
    variant: { name: 'Variant', control: 'inline-radio', options: [undefined, ...VARIANTS] },
    showStatus: { name: 'Show status', control: 'boolean' },
    status: { control: 'select', options: [undefined, 'online', 'offline', 'away', 'busy'] },
    skeleton: { name: 'State: Skeleton', control: 'boolean' },
    src: { control: 'text' },
    initials: { control: 'text' },
    name: { control: 'text' },
    alt: { control: 'text' },
  },
  args: { alt: 'Alex Doe', size: 52, src: SAMPLE_IMAGE },
  decorators: [
    (Story) => (
      <div style={{ padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Avatar>;

/* ── Default ── */

export const Default: Story = {};

/* ── Variants (Figma "Variant") ── */

export const Image: Story = { name: 'Variant: Image' };
export const Initials: Story = { name: 'Variant: Initials', args: { src: undefined, name: 'Alex Doe' } };
export const IconVariant: Story = { name: 'Variant: Icon', args: { src: undefined } };

/* ── Show status ── */

export const WithStatus: Story = { name: 'Show status: True', args: { showStatus: true } };

export const StatusOnEveryVariant: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      {VARIANTS.map((v) => (
        <Avatar key={v} {...variantProps(v, 52, { showStatus: true })} />
      ))}
      {/* Status extensions (not in Figma) */}
      <Avatar {...variantProps('initials', 52, { status: 'busy' })} />
      <Avatar {...variantProps('initials', 52, { status: 'away' })} />
      <Avatar {...variantProps('initials', 52, { status: 'offline' })} />
    </div>
  ),
};

/** The status gap is a transparent cut-out, so it works on any background. */
export const StatusOnColouredBackground: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, padding: 16, background: 'var(--scanner-bg-brand)' }}>
      {VARIANTS.map((v) => (
        <Avatar key={v} {...variantProps(v, 80, { showStatus: true })} />
      ))}
    </div>
  ),
};

/* ── Skeleton (Figma State=Skeleton) ── */

export const Skeleton: Story = { name: 'State: Skeleton', args: { skeleton: true } };

/* ── All sizes — variant rows × size columns ── */

export const AllSizes: Story = {
  render: () => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {SIZES.map((s) => (
            <th key={s} style={headCell}>{s}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {VARIANTS.map((v) => (
          <tr key={v}>
            <th style={headCell}>{label(v)}</th>
            {SIZES.map((s) => (
              <td key={s} style={cell}>
                <Avatar {...variantProps(v, s)} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── All states — Enabled / Show status / Skeleton per variant ── */

export const AllStates: Story = {
  render: ({ size = 52 }) => (
    <table style={table}>
      <thead>
        <tr>
          <th style={headCell} />
          {['Enabled', 'Enabled + status', 'Skeleton'].map((s) => (
            <th key={s} style={headCell}>{s}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {VARIANTS.map((v) => {
          const px = typeof size === 'number' ? size : 52;
          return (
            <tr key={v}>
              <th style={headCell}>{label(v)}</th>
              <td style={cell}><Avatar {...variantProps(v, px)} /></td>
              <td style={cell}><Avatar {...variantProps(v, px, { showStatus: true })} /></td>
              <td style={cell}><Avatar {...variantProps(v, px, { skeleton: true })} /></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  ),
};

/* ── Full Figma matrix: 27 enabled + 9 skeleton variants, each with and without status ── */

export const FigmaMatrix: Story = {
  name: 'Figma matrix (all 36 variants + status)',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ padding: 24 }}>
      <table style={table}>
        <thead>
          <tr>
            <th style={headCell} />
            {SIZES.map((s) => (
              <th key={s} style={headCell}>{`Size=${s}`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {VARIANTS.flatMap((v) =>
            [false, true].map((status) => (
              <tr key={`${v}-${status}`}>
                <th style={headCell}>{`Variant=${label(v)}, State=Enabled${status ? ', Show status' : ''}`}</th>
                {SIZES.map((s) => (
                  <td key={s} style={cell}>
                    <Avatar {...variantProps(v, s, { showStatus: status })} />
                  </td>
                ))}
              </tr>
            )),
          )}
          <tr>
            <th style={headCell}>State=Skeleton</th>
            {SIZES.map((s) => (
              <td key={s} style={cell}>
                <Avatar {...variantProps('image', s, { skeleton: true })} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

/* ── Content rules & fallbacks ── */

export const InitialsFromName: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar name="Alex Doe" alt="Alex Doe" size={48} />
      <Avatar name="Madonna" alt="Madonna" size={48} />
      <Avatar name="mary jane watson" alt="Mary Jane Watson" size={48} />
    </div>
  ),
};

export const ImageErrorFallback: Story = {
  name: 'Image error → initials / icon fallback',
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar src="https://broken-url.invalid/404.jpg" name="Jane Doe" alt="Jane Doe" size={48} />
      <Avatar src="https://broken-url.invalid/404.jpg" alt="Unknown" size={48} />
    </div>
  ),
};

export const LegacySizeNames: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {(['extra-small', 'small', 'medium', 'large', 'extra-large', '2xl', '3xl', '4xl'] as const).map((s) => (
        <Avatar key={s} initials="AD" alt={s} size={s} />
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  Interaction tests                                                 */
/* ------------------------------------------------------------------ */

export const AccessibleName: Story = {
  tags: ['test'],
  args: { src: undefined, name: 'Alex Doe', showStatus: true },
  play: async ({ canvasElement }) => {
    const avatar = within(canvasElement).getByRole('img', { name: 'Alex Doe (online)' });
    await expect(avatar).toHaveAttribute('data-variant', 'initials');
    await expect(avatar).toHaveTextContent('AD');
  },
};

export const SkeletonIsHidden: Story = {
  tags: ['test'],
  args: { skeleton: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('img')).not.toBeInTheDocument();
  },
};
