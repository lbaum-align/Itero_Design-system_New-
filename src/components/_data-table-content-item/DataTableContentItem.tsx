import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Avatar } from '../avatar';
import { Badge } from '../badge';
import { Button } from '../button';
import { Link } from '../link';
import { SlotContent } from '../slot-content';
import type {
  DataTableContentItemProps,
  DataTableContentItemSize,
  DataTableContentProgress,
} from './data-table-content-item.types';

/*
 * Source: Figma "06. Scanner core 1.0.0 full" → Items / Data table content item (node 30526:43149)
 * Size (Large (1 line), X-large (2 lines), 2X-large (3 lines)) × Content (Text, Text + subtext,
 * Link, Badge, Progress, Buttons, Slot) = 21 variants, plus the "Show avatar" boolean.
 *
 * - Cell height is fixed per size (52 / 72 / 92) and the content is vertically centred; Figma binds
 *   16px vertical padding on some variants but keeps min = max = height, so the padding is dropped.
 * - Right padding spacing-04 (16px); the Buttons variant uses spacing-01 (4px) and right-aligns.
 * - Text is "Body/$tp-body-02" 18/28: `text-primary` for the text, `text-secondary` for the subtext,
 *   truncated with an ellipsis after 1 line (2 lines for the 2X-large text + subtext title).
 * - Avatar is 28px at Large and 36px at X-large / 2X-large, 16px gap before the text.
 * - Progress is Figma's own "indicator": 3 × 36×4 rounded "Patch" rectangles with a 2px
 *   `border-subtle` stroke and a 4px gap (X-large adds the text, 2X-large text + subtext).
 */

const heights: Record<DataTableContentItemSize, string> = {
  large: 'h-[var(--scanner-data-table-row-height-lg)]',
  'x-large': 'h-[var(--scanner-data-table-row-height-xl)]',
  '2x-large': 'h-[var(--scanner-data-table-row-height-2xl)]',
};

const avatarSize: Record<DataTableContentItemSize, 28 | 36> = {
  large: 28,
  'x-large': 36,
  '2x-large': 36,
};

const bodyText = cn(
  'font-[family-name:var(--scanner-font-sans)] font-[number:var(--scanner-font-regular)]',
  'text-[length:var(--scanner-text-scanner-md)] leading-[var(--scanner-leading-lg)]',
);

const primaryText = cn(bodyText, 'text-[color:var(--scanner-text-primary)]');
const secondaryText = cn(bodyText, 'text-[color:var(--scanner-text-secondary)]');

/** Figma's segmented progress "indicator". */
const ProgressIndicator = ({ value = 0, segments = 3, label = 'Progress' }: DataTableContentProgress) => (
  <span
    role="progressbar"
    aria-valuemin={0}
    aria-valuemax={segments}
    aria-valuenow={Math.min(Math.max(value, 0), segments)}
    aria-label={label}
    data-progress-indicator=""
    className="flex items-center gap-[var(--scanner-spacing-2)]"
  >
    {Array.from({ length: segments }, (_, index) => (
      <span
        key={index}
        data-filled={index < value || undefined}
        className={cn(
          'block rounded-[var(--scanner-radius-sm)]',
          'w-[var(--scanner-data-table-progress-segment-width)]',
          'h-[var(--scanner-data-table-progress-segment-height)]',
          'border-[length:var(--scanner-data-table-progress-segment-stroke)] border-solid',
          index < value
            ? 'border-[color:var(--scanner-border-interactive)] bg-[var(--scanner-border-interactive)]'
            : 'border-[color:var(--scanner-border-subtle)]',
        )}
      />
    ))}
  </span>
);

/**
 * Content cell of a data table row (private sub-component of `DataTable`).
 *
 * Renders a `<td>` whose body depends on `content`; reuses `Avatar`, `Link`, `Badge`, `Button`
 * and `SlotContent`.
 *
 * @example
 * <_DataTableContentItem text="Jane Doe" subtext="ID 12345" content="text-subtext" size="x-large" />
 * <_DataTableContentItem content="badge" text="Completed" badgeStatus="success" />
 * <_DataTableContentItem content="buttons" actions={[{ iconName: 'edit', label: 'Edit row' }]} />
 */
export const DataTableContentItem = forwardRef<HTMLTableCellElement, DataTableContentItemProps>(
  (
    {
      size = 'large',
      content = 'text',
      text,
      subtext,
      avatar,
      showAvatar,
      href,
      external = false,
      onLinkClick,
      badgeStatus = 'neutral',
      badgeIconName,
      progress,
      actions,
      children,
      className,
      'data-state': dataState,
      ...rest
    },
    ref,
  ) => {
    const isButtons = content === 'buttons';
    const withAvatar =
      (content === 'text' || content === 'text-subtext') && (showAvatar ?? !!avatar) && !!avatar;
    /* Figma's Large (1 line) "Text + subtext" variant renders the text only. */
    const withSubtext = content === 'text-subtext' && size !== 'large';
    const clampTitle = size === '2x-large' && withSubtext ? 'line-clamp-2' : 'truncate';

    const body = () => {
      switch (content) {
        case 'link':
          return (
            <Link
              href={href}
              external={external}
              onClick={onLinkClick}
              data-state={dataState === 'pressed' ? undefined : dataState}
              className="min-w-0 max-w-full truncate"
            >
              {text}
            </Link>
          );
        case 'badge':
          return (
            <Badge status={badgeStatus} iconName={badgeIconName} className="max-w-full">
              {text}
            </Badge>
          );
        case 'progress':
          return (
            <>
              {/* Above Large the indicator sits in a 8px-padded wrapper, exactly like Figma */}
              {size === 'large' ? (
                (children ?? <ProgressIndicator {...progress} />)
              ) : (
                <span className="flex py-[var(--scanner-spacing-3)]">
                  {children ?? <ProgressIndicator {...progress} />}
                </span>
              )}
              {size !== 'large' && (
                <span className={cn(primaryText, 'max-w-full truncate')}>{text}</span>
              )}
              {size === '2x-large' && (
                <span className={cn(secondaryText, 'max-w-full truncate')}>{subtext}</span>
              )}
            </>
          );
        case 'buttons':
          return (
            children ??
            (actions ?? []).map((action) => (
              <Button
                key={action.label}
                emphasis="ghost"
                size="medium"
                iconOnly
                iconName={action.iconName}
                aria-label={action.label}
                onClick={action.onClick}
                disabled={action.disabled}
                data-state={dataState}
                className="size-[var(--scanner-data-table-action-size)]"
              />
            ))
          );
        case 'slot':
          return children ?? <SlotContent />;
        case 'text':
        case 'text-subtext':
        default:
          return (
            <>
              {withAvatar && avatar && <Avatar {...avatar} size={avatarSize[size]} />}
              <span className="flex min-w-0 flex-1 flex-col justify-center gap-[var(--scanner-spacing-2)]">
                <span className={cn(primaryText, clampTitle)}>{text}</span>
                {withSubtext && <span className={cn(secondaryText, 'truncate')}>{subtext}</span>}
              </span>
            </>
          );
      }
    };

    const layout =
      content === 'progress' || content === 'slot'
        ? 'flex-col items-start justify-center'
        : isButtons
          ? 'items-center justify-end gap-[var(--scanner-spacing-3)]'
          : 'items-center gap-[var(--scanner-spacing-5)]';

    return (
      <td
        ref={ref}
        data-data-table-item="content"
        data-content={content}
        data-size={size}
        data-state={dataState}
        className={cn(
          'p-0 pl-[var(--scanner-data-table-cell-gap,0px)] align-middle',
          isButtons ? 'pr-[var(--scanner-spacing-2)]' : 'pr-[var(--scanner-spacing-5)]',
          heights[size],
          className,
        )}
        {...rest}
      >
        <div className={cn('flex', layout, heights[size])}>{body()}</div>
      </td>
    );
  },
);

DataTableContentItem.displayName = 'DataTableContentItem';
