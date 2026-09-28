import type { CSSProperties, MouseEvent, ReactNode, RefObject } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../../icons';
import { SelectMenu } from '../select-menu';
import { SelectMenuItem } from '../_select-menu-item';
import { Tag } from '../tag';
import { fieldRoot, skeletonFill } from '../text-input/field-styles';
import { optionDomId } from './select-field';
import type { DropdownOption, DropdownSize } from './dropdown.types';

/*
 * Shared private parts for Dropdown and Combobox (not exported from the package barrel):
 * chevron, selected-value tags, the option menu, hidden form inputs and the skeleton.
 */

/** Figma "Chevron down" — `icon-tertiary`, `icon-primary` on hover, `icon-disabled` when disabled; "Chevron up" while open. */
export function SelectChevron({ open, size, disabled }: { open: boolean; size: 20 | 24; disabled: boolean }) {
  return (
    <Icon
      name={open ? 'chevron-up' : 'chevron-down'}
      size={size}
      data-part="chevron"
      className={cn(
        'transition-colors duration-150',
        disabled
          ? 'text-[color:var(--scanner-icon-disabled)]'
          : cn(
              'text-[color:var(--scanner-icon-tertiary)]',
              'group-hover/field:text-[color:var(--scanner-icon-primary)] group-data-[state=hovered]/field:text-[color:var(--scanner-icon-primary)]',
            ),
      )}
    />
  );
}

/** Selected values as dismissible tags (Figma "02 Tag group": Small tags, Extra small at Size=Small). */
export function SelectedTags({
  size,
  options,
  selected,
  disabled,
  onRemove,
}: {
  size: DropdownSize;
  options: DropdownOption[];
  selected: string[];
  disabled: boolean;
  onRemove: (value: string) => void;
}) {
  const tagSize = size === 'small' ? 'extra-small' : 'small';
  return (
    <>
      {selected.map((v) => {
        const text = options.find((o) => o.value === v)?.label ?? v;
        return (
          <Tag key={v} size={tagSize} disabled={disabled} onDismiss={() => onRemove(v)} dismissLabel={`Remove ${text}`}>
            {text}
          </Tag>
        );
      })}
    </>
  );
}

export interface OptionsMenuProps {
  id: string;
  listRef: RefObject<HTMLDivElement | null>;
  size: DropdownSize;
  options: DropdownOption[];
  selected: string[];
  activeValue: string | null;
  multi: boolean;
  onPick: (value: string) => void;
  maxHeight?: CSSProperties['maxHeight'];
  label?: string;
  /** Shown as a disabled option when `options` is empty. */
  emptyText?: ReactNode;
}

/**
 * The option list: a `SelectMenu` (activedescendant mode) 4px below the field and as wide as it
 * (Figma Dropdown docs anatomy). The trigger / input owns `aria-activedescendant`, so the listbox is not
 * focusable and pressing inside it never moves focus.
 */
export function OptionsMenu({
  id,
  listRef,
  size,
  options,
  selected,
  activeValue,
  multi,
  onPick,
  maxHeight,
  label,
  emptyText,
}: OptionsMenuProps) {
  return (
    <SelectMenu
      ref={listRef}
      id={id}
      size={size}
      focusMode="activedescendant"
      activeValue={activeValue}
      value={null}
      onChange={onPick}
      tabIndex={-1}
      aria-activedescendant={undefined}
      aria-label={label}
      aria-multiselectable={multi || undefined}
      scroll={maxHeight !== undefined}
      maxHeight={maxHeight}
      onMouseDown={(e: MouseEvent<HTMLDivElement>) => e.preventDefault()}
      className="absolute top-full left-0 z-40 mt-[var(--scanner-spacing-2)] w-full"
    >
      {options.length === 0 && emptyText ? (
        <SelectMenuItem optionText={emptyText} disabled />
      ) : (
        options.map((o) => (
          <SelectMenuItem
            key={o.value}
            id={optionDomId(id, o.value)}
            value={o.value}
            optionText={o.label}
            selected={selected.includes(o.value)}
            disabled={o.disabled}
            showHeadline={o.headline !== undefined}
            headlineText={o.headline}
            showSubtext={o.subtext !== undefined}
            subheadText={o.subtext}
            showDivider={o.divider}
          />
        ))
      )}
    </SelectMenu>
  );
}

/** Hidden inputs so the field participates in native forms. */
export function HiddenInputs({ name, selected, disabled }: { name?: string; selected: string[]; disabled: boolean }) {
  if (!name) return null;
  if (selected.length === 0) return <input type="hidden" name={name} value="" disabled={disabled} />;
  return (
    <>
      {selected.map((v) => (
        <input key={v} type="hidden" name={name} value={v} disabled={disabled} />
      ))}
    </>
  );
}

/** Figma State=Skeleton: label box · field box · helper box. */
export function SelectFieldSkeleton({
  layer,
  showLabel,
  showHelper,
  barClassName,
  fieldClassName,
  className,
  style,
}: {
  layer: 1 | 2;
  showLabel: boolean;
  showHelper: boolean;
  /** Bar height (16px at X-Large, 8px otherwise). */
  barClassName: string;
  /** Field box height + radius. */
  fieldClassName: string;
  className?: string;
  style?: CSSProperties;
}) {
  const bar = cn('w-[var(--scanner-dropdown-skeleton-bar-width)]', barClassName, skeletonFill);
  return (
    <div aria-hidden="true" data-skeleton="" data-layer={layer} className={cn(fieldRoot, className)} style={style}>
      {showLabel && (
        <div className="flex w-full items-start pb-[var(--scanner-spacing-3)]">
          <div className={bar} />
        </div>
      )}
      <div className={cn('w-full', fieldClassName, skeletonFill)} />
      {showHelper && (
        <div className="flex w-full items-start pt-[var(--scanner-spacing-3)]">
          <div className={bar} />
        </div>
      )}
    </div>
  );
}
