import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';
import type { IconName } from '../../icons';
import type { ButtonEmphasis, ButtonType } from '../button';
import type { SearchInputProps } from '../search-input';

/** One toolbar / bulk-action button (rendered as a Large `Button`). */
export interface DataTableToolbarAction {
  /** Stable key. */
  id: string;
  /** Button text — also the accessible name of icon-only actions. */
  label: string;
  /** Leading icon (Figma "Text + icon") — with `iconOnly` → Figma "Content: Icon only". */
  iconName?: IconName;
  /** Render icon only; `label` becomes the `aria-label`. */
  iconOnly?: boolean;
  /**
   * Button emphasis. Figma: toolbar icon actions and bulk actions are Secondary, the last toolbar action is Primary.
   * Default `'secondary'`.
   */
  emphasis?: ButtonEmphasis;
  /** Button type. Default `'brand'`. */
  variant?: ButtonType;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface DataTableToolbarsProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Figma "Bulk actions". `true` swaps the actions for the selection summary, bulk actions and Cancel.
   * Default: `selectedCount > 0`.
   */
  bulkActions?: boolean;

  /* ── Search + filter (left, both variants) ── */
  /** Show the Large search input. Default `true`. */
  showSearch?: boolean;
  /** Props forwarded to `SearchInput` (value, onChange, onSearch, placeholder, aria-label…). Size is always Large. */
  searchProps?: Omit<SearchInputProps, 'size'>;
  /** Filter controls rendered after the search input (Figma frame "Search + filter"). */
  filters?: ReactNode;

  /* ── Bulk actions = False ── */
  /** Right-aligned actions. Figma: three Secondary icon-only buttons + one Primary text button. */
  actions?: DataTableToolbarAction[];

  /* ── Bulk actions = True ── */
  /** Number of selected rows shown in the summary. */
  selectedCount?: number;
  /** Summary text. Default `` `${count} item(s) selected` `` ("2 items selected"). */
  selectedLabel?: (count: number) => ReactNode;
  /** Bulk actions for the selection (Figma: Secondary text buttons "Action 1…3"). */
  bulkActionItems?: DataTableToolbarAction[];
  /** Called by the Cancel button — clear the selection. Omit to hide Cancel. */
  onCancel?: () => void;
  /** Cancel button text. Default `'Cancel'`. */
  cancelLabel?: string;
}
