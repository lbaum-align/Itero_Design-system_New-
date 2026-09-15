import { forwardRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import type { IconSize } from '../../icons/icon.types';
import { Status } from '../_status';
import type { StatusPixelSize } from '../_status/status.types';
import type { AvatarPixelSize, AvatarProps, AvatarVariant } from './avatar.types';
import { getInitials, toPixelSize } from './avatar.utils';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → 01 Avatar (node 20920:34)
 * Variant (Image, Initials, Icon) × Size (28…80) × State Enabled = 27, plus 9 Skeleton = 36 variants.
 *
 * Status: Figma subtracts a circle (dot + 2px gap) from the avatar and places the
 * _Status dot inside the hole, so the ring is transparent on any background.
 * Reproduced with a CSS radial-gradient mask driven by per-size custom properties.
 */

type SizeConfig = {
  /** Box size + per-size custom properties for the status dot / cut-out */
  box: string;
  /** Initials text style (Figma Heading 01/02/03) */
  text: string;
  icon: IconSize;
  status: StatusPixelSize;
};

const sizeConfig: Record<AvatarPixelSize, SizeConfig> = {
  28: {
    box: 'size-[var(--scanner-avatar-size-28)] [--avatar-status-size:var(--scanner-avatar-status-size-xs)] [--avatar-status-offset:var(--scanner-avatar-status-offset)]',
    text: 'scanner-text-heading-01',
    icon: 16,
    status: 6,
  },
  32: {
    /* Figma places the 32px dot 2px from the edge (1px at every other size) */
    box: 'size-[var(--scanner-avatar-size-32)] [--avatar-status-size:var(--scanner-avatar-status-size-xs)] [--avatar-status-offset:var(--scanner-spacing-1)]',
    text: 'scanner-text-heading-01',
    icon: 16,
    status: 6,
  },
  36: {
    box: 'size-[var(--scanner-avatar-size-36)] [--avatar-status-size:var(--scanner-avatar-status-size-sm)] [--avatar-status-offset:var(--scanner-avatar-status-offset)]',
    text: 'scanner-text-heading-01',
    icon: 20,
    status: 8,
  },
  40: {
    box: 'size-[var(--scanner-avatar-size-40)] [--avatar-status-size:var(--scanner-avatar-status-size-sm)] [--avatar-status-offset:var(--scanner-avatar-status-offset)]',
    text: 'scanner-text-heading-02',
    icon: 20,
    status: 8,
  },
  44: {
    box: 'size-[var(--scanner-avatar-size-44)] [--avatar-status-size:var(--scanner-avatar-status-size-md)] [--avatar-status-offset:var(--scanner-avatar-status-offset)]',
    text: 'scanner-text-heading-02',
    icon: 24,
    status: 10,
  },
  48: {
    box: 'size-[var(--scanner-avatar-size-48)] [--avatar-status-size:var(--scanner-avatar-status-size-md)] [--avatar-status-offset:var(--scanner-avatar-status-offset)]',
    text: 'scanner-text-heading-02',
    icon: 24,
    status: 10,
  },
  52: {
    box: 'size-[var(--scanner-avatar-size-52)] [--avatar-status-size:var(--scanner-avatar-status-size-md)] [--avatar-status-offset:var(--scanner-avatar-status-offset)]',
    text: 'scanner-text-heading-02',
    icon: 24,
    status: 10,
  },
  60: {
    box: 'size-[var(--scanner-avatar-size-60)] [--avatar-status-size:var(--scanner-avatar-status-size-lg)] [--avatar-status-offset:var(--scanner-avatar-status-offset)]',
    text: 'scanner-text-heading-02',
    icon: 24,
    status: 12,
  },
  80: {
    box: 'size-[var(--scanner-avatar-size-80)] [--avatar-status-size:var(--scanner-avatar-status-size-xl)] [--avatar-status-offset:var(--scanner-avatar-status-offset)]',
    text: 'scanner-text-heading-03',
    icon: 32,
    status: 16,
  },
};

/* Hole centre (from the bottom-right edge) and radius: dot radius + 2px gap */
const CUT_CENTER = 'calc(100% - var(--avatar-status-offset) - var(--avatar-status-size) / 2)';
const CUT_RADIUS = 'calc(var(--avatar-status-size) / 2 + var(--scanner-spacing-1))';
const STATUS_CUTOUT = `radial-gradient(circle at ${CUT_CENTER} ${CUT_CENTER}, transparent ${CUT_RADIUS}, black calc(${CUT_RADIUS} + 0.5px))`;

/**
 * Avatar — visual representation of a user or role. Not interactive.
 *
 * Figma props → React:
 * - Variant → derived from `src` / `initials` / `name` (override with `variant`)
 * - Size → `size` (28…80, legacy names accepted)
 * - Show status → `status` / `showStatus`
 * - State=Skeleton → `skeleton`
 *
 * @example
 * <Avatar src="/photo.jpg" alt="Jane Doe" size={40} />
 * <Avatar name="Jane Doe" alt="Jane Doe" showStatus />
 * <Avatar alt="Guest" size={28} />
 * <Avatar alt="Loading" skeleton />
 */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      initials,
      name,
      variant,
      size = 36,
      status,
      showStatus = false,
      skeleton = false,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const px = toPixelSize(size);
    const cfg = sizeConfig[px];
    const [failedSrc, setFailedSrc] = useState<string>();

    /* ── Skeleton ── */
    if (skeleton) {
      return (
        <div
          ref={ref}
          aria-hidden="true"
          data-skeleton=""
          data-size={px}
          className={cn(
            'inline-block shrink-0 animate-pulse rounded-[var(--scanner-radius-full)]',
            'bg-[var(--scanner-bg-highlight-gray)]',
            cfg.box,
            className,
          )}
          style={style}
          {...rest}
        />
      );
    }

    const text = initials?.trim().slice(0, 2).toUpperCase() || (name ? getInitials(name) : '');
    const imageOk = !!src && failedSrc !== src;

    /* Forced variant wins only when its content exists (Image needs a loadable src, Initials need text) */
    const resolved: AvatarVariant =
      variant === 'icon' || (variant === 'initials' && text)
        ? variant
        : imageOk
          ? 'image'
          : text
            ? 'initials'
            : 'icon';

    const presence = status ?? (showStatus ? 'online' : undefined);

    return (
      <div
        ref={ref}
        role="img"
        aria-label={presence ? `${alt} (${presence})` : alt}
        data-variant={resolved}
        data-size={px}
        className={cn('relative inline-flex shrink-0', cfg.box, className)}
        style={style}
        {...rest}
      >
        {/* ── Circle (clips the image; cut out under the status dot) ── */}
        <div
          data-slot="avatar-circle"
          className={cn(
            'flex size-full items-center justify-center overflow-hidden rounded-[var(--scanner-radius-full)]',
            resolved !== 'image' &&
              'bg-[var(--scanner-bg-highlight-gray)] shadow-[inset_0_0_0_var(--scanner-avatar-stroke-width)_var(--scanner-border-highlight-gray)]',
          )}
          style={presence ? { maskImage: STATUS_CUTOUT, WebkitMaskImage: STATUS_CUTOUT } : undefined}
        >
          {resolved === 'image' && (
            <img
              src={src}
              alt=""
              draggable={false}
              className="size-full object-cover"
              onError={() => setFailedSrc(src)}
            />
          )}

          {resolved === 'initials' && (
            <span
              aria-hidden="true"
              className={cn('select-none text-center text-[color:var(--scanner-text-primary)]', cfg.text)}
            >
              {text}
            </span>
          )}

          {resolved === 'icon' && (
            <Icon name="user" size={cfg.icon} focusable="false" className="text-[color:var(--scanner-icon-primary)]" />
          )}
        </div>

        {presence && (
          <Status
            status={presence}
            size={cfg.status}
            label={null}
            className="absolute right-[var(--avatar-status-offset)] bottom-[var(--avatar-status-offset)]"
          />
        )}
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';
