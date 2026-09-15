import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import type { BadgeLayout, BadgeProps, BadgeStatus } from './badge.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Badge (node 12855:13246)
 * Status (Netral, Info, Success, Warning, Destructive) × State (Enabled, Loading) × Layout (Default, On image) = 20 variants.
 *
 * The 1px highlight stroke sits inside the box in Figma, so it is drawn as an inset shadow
 * (a CSS border would make the badge 2px larger).
 */

const ICON_SIZE = 28;

type Colours = { surface: string; text: string; icon: string };

const colours: Record<BadgeLayout, Record<BadgeStatus, Colours>> = {
  default: {
    neutral: {
      surface: 'bg-[var(--scanner-bg-highlight-gray)] shadow-[inset_0_0_0_1px_var(--scanner-border-highlight-gray)]',
      text: 'text-[color:var(--scanner-text-primary)]',
      icon: 'text-[color:var(--scanner-icon-primary)]',
    },
    info: {
      surface: 'bg-[var(--scanner-bg-highlight-blue)] shadow-[inset_0_0_0_1px_var(--scanner-border-highlight-blue)]',
      text: 'text-[color:var(--scanner-text-on-highlight-blue)]',
      icon: 'text-[color:var(--scanner-icon-on-highlight-blue)]',
    },
    success: {
      surface: 'bg-[var(--scanner-bg-highlight-green)] shadow-[inset_0_0_0_1px_var(--scanner-border-highlight-green)]',
      text: 'text-[color:var(--scanner-text-on-highlight-green)]',
      icon: 'text-[color:var(--scanner-icon-on-highlight-green)]',
    },
    warning: {
      surface: 'bg-[var(--scanner-bg-highlight-orange)] shadow-[inset_0_0_0_1px_var(--scanner-border-highlight-orange)]',
      text: 'text-[color:var(--scanner-text-on-highlight-orange)]',
      icon: 'text-[color:var(--scanner-icon-on-highlight-orange)]',
    },
    destructive: {
      surface: 'bg-[var(--scanner-bg-highlight-red)] shadow-[inset_0_0_0_1px_var(--scanner-border-highlight-red)]',
      text: 'text-[color:var(--scanner-text-on-highlight-red)]',
      icon: 'text-[color:var(--scanner-icon-on-highlight-red)]',
    },
  },
  'on-image': {
    neutral: {
      surface: 'bg-[var(--scanner-bg-elevated)]',
      text: 'text-[color:var(--scanner-text-primary)]',
      icon: 'text-[color:var(--scanner-icon-primary)]',
    },
    info: {
      surface: 'bg-[var(--scanner-bg-elevated)]',
      text: 'text-[color:var(--scanner-text-link)]',
      icon: 'text-[color:var(--scanner-icon-link)]',
    },
    success: {
      surface: 'bg-[var(--scanner-bg-elevated)]',
      text: 'text-[color:var(--scanner-text-success)]',
      icon: 'text-[color:var(--scanner-icon-success)]',
    },
    warning: {
      surface: 'bg-[var(--scanner-bg-elevated)]',
      text: 'text-[color:var(--scanner-text-warning)]',
      icon: 'text-[color:var(--scanner-icon-warning)]',
    },
    destructive: {
      surface: 'bg-[var(--scanner-bg-elevated)]',
      text: 'text-[color:var(--scanner-text-error)]',
      icon: 'text-[color:var(--scanner-icon-error)]',
    },
  },
};

/**
 * Scanner Badge — a compact, non-interactive marker for status or category.
 *
 * Figma props → React: Status → `status`, Layout → `layout`, State=Loading → `loading`,
 * Show icon → `showIcon`, Icon → `iconName` / `icon`, Text value → `children`.
 * Labels stay on one line and truncate with an ellipsis — pass `title` (or wrap in a Tooltip) to expose the full text.
 *
 * @example
 * <Badge status="success">Active</Badge>
 * <Badge status="warning" showIcon>Pending</Badge>
 * <Badge layout="on-image" status="info">3 new</Badge>
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      status = 'neutral',
      layout = 'default',
      icon,
      iconName,
      showIcon = false,
      loading = false,
      className,
      ...rest
    },
    ref,
  ) => {
    /* ── State=Loading (skeleton) ── */
    if (loading) {
      return (
        <span
          ref={ref}
          aria-hidden="true"
          data-skeleton=""
          className={cn(
            'inline-block animate-pulse align-middle rounded-[var(--scanner-radius-sm)]',
            'h-[var(--scanner-badge-skeleton-height)] w-[var(--scanner-badge-skeleton-width)]',
            'bg-[var(--scanner-bg-highlight-gray)]',
            className,
          )}
          {...rest}
        />
      );
    }

    const c = colours[layout][status];
    const hasIcon = showIcon || !!icon || !!iconName;

    return (
      <span
        ref={ref}
        data-status={status}
        data-layout={layout}
        className={cn(
          'inline-flex max-w-full items-center justify-center overflow-hidden align-middle',
          'min-w-[var(--scanner-badge-min-width)] gap-[var(--scanner-spacing-2)]',
          'px-[var(--scanner-spacing-3)] py-[var(--scanner-spacing-2)] rounded-[var(--scanner-radius-sm)]',
          'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
          'text-[length:var(--scanner-text-scanner-md)] leading-[var(--scanner-leading-lg)]',
          c.surface,
          c.text,
          className,
        )}
        {...rest}
      >
        {hasIcon && (
          <span
            data-part="icon"
            className={cn(
              'inline-flex shrink-0 items-center justify-center size-[var(--scanner-badge-icon-size)]',
              c.icon,
            )}
          >
            {icon ??
              (iconName ? (
                /* IconSize has no 28 — render 24 and stretch to the 28px token box */
                <Icon name={iconName} size={24} className="size-full" />
              ) : (
                /* Figma default icon "Information" */
                <Icon name="information" size={ICON_SIZE} />
              ))}
          </span>
        )}
        <span className="min-w-0 truncate text-center">{children}</span>
      </span>
    );
  },
);

Badge.displayName = 'Badge';
