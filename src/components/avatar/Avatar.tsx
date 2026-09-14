import { forwardRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import { Status } from '../_status';
import type { AvatarProps, AvatarSize } from './avatar.types';
import type { StatusSize } from '../_status/status.types';
import type { IconSize } from '../../icons/icon.types';

/* ------------------------------------------------------------------ */
/*  Size configuration — pixel values from Figma "01 Avatar"          */
/* ------------------------------------------------------------------ */

type SizeConfig = {
  /** CSS size class for the avatar container */
  dimension: string;
  /** Raw pixel value */
  px: number;
  /** Font size for initials text */
  fontSize: string;
  /** Line height for initials text */
  lineHeight: string;
  /** Icon size for the user-icon fallback */
  iconSize: IconSize;
  /** Status dot size */
  statusSize: StatusSize;
  /** Bottom offset for status dot (px) */
  statusBottom: number;
  /** Right offset for status dot (px) */
  statusRight: number;
};

const sizeConfig: Record<AvatarSize, SizeConfig> = {
  'extra-small': {
    dimension: 'size-[28px]',
    px: 28,
    fontSize: 'text-[16px]',
    lineHeight: 'leading-[var(--scanner-leading-md)]',      // 24px
    iconSize: 16,
    statusSize: 'small',
    statusBottom: -1,
    statusRight: -1,
  },
  small: {
    dimension: 'size-[32px]',
    px: 32,
    fontSize: 'text-[16px]',
    lineHeight: 'leading-[var(--scanner-leading-md)]',
    iconSize: 16,
    statusSize: 'small',
    statusBottom: 0,
    statusRight: 0,
  },
  medium: {
    dimension: 'size-[36px]',
    px: 36,
    fontSize: 'text-[16px]',
    lineHeight: 'leading-[var(--scanner-leading-md)]',
    iconSize: 20,
    statusSize: 'small',
    statusBottom: -1,
    statusRight: -1,
  },
  large: {
    dimension: 'size-[40px]',
    px: 40,
    fontSize: 'text-[length:var(--scanner-text-md)]',       // 17px → rounds to 18
    lineHeight: 'leading-[var(--scanner-leading-lg)]',       // 28px
    iconSize: 20,
    statusSize: 'small',
    statusBottom: -1,
    statusRight: -1,
  },
  'extra-large': {
    dimension: 'size-[44px]',
    px: 44,
    fontSize: 'text-[length:var(--scanner-text-md)]',
    lineHeight: 'leading-[var(--scanner-leading-lg)]',
    iconSize: 20,
    statusSize: 'medium',
    statusBottom: -2,
    statusRight: -2,
  },
  '2xl': {
    dimension: 'size-[48px]',
    px: 48,
    fontSize: 'text-[length:var(--scanner-text-md)]',
    lineHeight: 'leading-[var(--scanner-leading-lg)]',
    iconSize: 24,
    statusSize: 'medium',
    statusBottom: -1,
    statusRight: -1,
  },
  '3xl': {
    dimension: 'size-[60px]',
    px: 60,
    fontSize: 'text-[length:var(--scanner-text-md)]',
    lineHeight: 'leading-[var(--scanner-leading-lg)]',
    iconSize: 24,
    statusSize: 'medium',
    statusBottom: 3,
    statusRight: 3,
  },
  '4xl': {
    dimension: 'size-[80px]',
    px: 80,
    fontSize: 'text-[length:var(--scanner-text-lg)]',        // 20px
    lineHeight: 'leading-[var(--scanner-leading-xl)]',        // 32px
    iconSize: 32,
    statusSize: 'medium',
    statusBottom: 5,
    statusRight: 5,
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

/**
 * Avatar — circular user representation.
 *
 * Three visual modes (derived automatically from props):
 * 1. **Image** — when `src` is provided, renders a photo.
 * 2. **Initials** — when `initials` is provided (no src), renders 1–2 letters.
 * 3. **Icon** — fallback when neither src nor initials is given.
 *
 * Optionally shows a `_Status` dot (online/offline/away/busy) bottom-right.
 *
 * @example
 * <Avatar src="/photo.jpg" alt="Jane Doe" size="large" />
 * <Avatar initials="JD" alt="Jane Doe" status="online" />
 * <Avatar alt="Unknown user" size="small" />
 * <Avatar alt="Loading" skeleton />
 */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      initials,
      size = 'medium',
      status,
      skeleton = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const cfg = sizeConfig[size];
    const [imgError, setImgError] = useState(false);

    /* ── Skeleton ── */
    if (skeleton) {
      return (
        <div
          ref={ref}
          className={cn(
            'inline-block shrink-0 animate-pulse rounded-[var(--scanner-radius-full)]',
            'bg-[var(--scanner-bg-tertiary)]',
            cfg.dimension,
            className,
          )}
          aria-hidden="true"
          {...rest}
        />
      );
    }

    /* ── Determine variant ── */
    const hasImage = !!src && !imgError;
    const hasInitials = !!initials && !hasImage;
    const showIcon = !hasImage && !hasInitials;

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex shrink-0 items-center justify-center',
          cfg.dimension,
          className,
        )}
        {...rest}
      >
        {/* ── Circle container (clips image) ── */}
        <div
          className={cn(
            'flex size-full items-center justify-center',
            'overflow-hidden rounded-[var(--scanner-radius-full)]',
            /* Background for initials / icon variants */
            !hasImage && 'bg-[var(--scanner-bg-tertiary)]',
          )}
          role={!hasImage ? 'img' : undefined}
          aria-label={!hasImage ? alt : undefined}
        >
          {/* ── Image ── */}
          {hasImage && (
            <img
              src={src}
              alt={alt}
              className="size-full object-cover"
              onError={() => setImgError(true)}
            />
          )}

          {/* ── Initials ── */}
          {hasInitials && (
            <span
              aria-hidden="true"
              className={cn(
                'select-none text-center',
                'font-[family-name:var(--scanner-font-sans)] font-[var(--scanner-font-medium)]',
                'text-[color:var(--scanner-text-primary)]',
                cfg.fontSize,
                cfg.lineHeight,
              )}
            >
              {initials.slice(0, 2).toUpperCase()}
            </span>
          )}

          {/* ── Icon fallback ── */}
          {showIcon && (
            <Icon
              name="user"
              size={cfg.iconSize}
              className="text-[var(--scanner-icon-tertiary)]"
            />
          )}
        </div>

        {/* ── Status dot (positioned outside overflow clip) ── */}
        {status && (
          <span
            className="absolute"
            style={{ bottom: cfg.statusBottom, right: cfg.statusRight }}
          >
            <Status status={status} size={cfg.statusSize} />
          </span>
        )}
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';
