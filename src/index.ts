/**
 * @scanner/design-system
 * Scanner Design System — React component library
 *
 * Built from Figma file "06. Scanner core 1.0.0"
 */

// Utilities
export { cn } from './utils';

// Token types
export type {
  SpacingToken,
  RadiusToken,
  FontSizeToken,
  LineHeightToken,
  FontWeightToken,
  FontFamilyToken,
  BgColorToken,
  TextColorToken,
  BorderColorToken,
  IconColorToken,
  StatusToken,
  ShadowToken,
  TextStyle,
  PrimitiveColor,
} from './tokens/types';

// --- Components (Tier 1: Leaf atoms) ---

export { Spinner } from './components/spinner';
export type { SpinnerProps, SpinnerSize, SpinnerPhase } from './components/spinner';

export { Toggle } from './components/toggle';
export type { ToggleProps, ToggleForcedState } from './components/toggle';

export { Badge } from './components/badge';
export type { BadgeProps, BadgeStatus, BadgeLayout } from './components/badge';

export { Link } from './components/link';
export type { LinkProps, LinkType, LinkSize, LinkForcedState } from './components/link';

// --- Icons ---

export { Icon } from './icons';
export type { IconProps, IconName, IconSize } from './icons';

// --- Components (Tier 2: Simple atoms with icon deps) ---

export { Tag } from './components/tag';
export type { TagProps, TagSize } from './components/tag';

export { CheckboxItem } from './components/checkbox-item';
export type { CheckboxItemProps, CheckboxSelection } from './components/checkbox-item';

export { RadioButtonItem } from './components/radio-button-item';
export type { RadioButtonItemProps, RadioButtonItemForcedState } from './components/radio-button-item';

// --- Components (Tier 3: Composed atoms) ---

export { Button } from './components/button';
export type {
  ButtonProps,
  ButtonType,
  ButtonEmphasis,
  ButtonSize,
} from './components/button';

export { Avatar, getInitials, toPixelSize } from './components/avatar';
export type {
  AvatarProps,
  AvatarSize,
  AvatarPixelSize,
  AvatarSizeName,
  AvatarVariant,
} from './components/avatar';

export { Tooltip, TooltipBubble } from './components/tooltip';
export type {
  TooltipProps,
  TooltipPosition,
  TooltipPlacement,
  TooltipAlignment,
  TooltipBubbleProps,
} from './components/tooltip';

export { IconTriggerTooltip } from './components/icon-trigger-tooltip';
export type { IconTriggerTooltipProps } from './components/icon-trigger-tooltip';

export { TextTriggerTooltip } from './components/text-trigger-tooltip';
export type {
  TextTriggerTooltipProps,
  TextTriggerTooltipPosition,
} from './components/text-trigger-tooltip';

// --- Components (Tier 4: Groups) ---

export { ButtonGroup } from './components/button-group';
export type {
  ButtonGroupProps,
  ButtonGroupOrientation,
  ButtonGroupPosition,
  ButtonGroupSize,
} from './components/button-group';

export { TagGroup } from './components/tag-group';
export type { TagGroupProps, TagGroupSize } from './components/tag-group';

export { TabGroup } from './components/tab-group';
export type { TabGroupProps } from './components/tab-group';

export { Breadcrumbs } from './components/breadcrumbs';
export type { BreadcrumbsProps, BreadcrumbItem } from './components/breadcrumbs';

export { SplitButton } from './components/split-button';
export type { SplitButtonProps } from './components/split-button';

export { AvatarGroup } from './components/avatar-group';
export type { AvatarGroupProps, AvatarGroupItem } from './components/avatar-group';

// --- Components (Tier 5: Form inputs) ---

export { TextInput } from './components/text-input';
export type { TextInputProps, TextInputSize, TextInputForcedState } from './components/text-input';

export { TextArea } from './components/text-area';
export type { TextAreaProps, TextAreaForcedState } from './components/text-area';

export { PasswordInput } from './components/password-input';
export type { PasswordInputProps, PasswordInputForcedState } from './components/password-input';

export { NumberInput } from './components/number-input';
export type { NumberInputProps, NumberInputSize, NumberInputForcedState } from './components/number-input';

export { DateInput } from './components/date-input';
export type { DateInputProps, DateInputSize, DateInputForcedState } from './components/date-input';

// --- Components (Tier 6: Checkbox & Radio groups, Pagination) ---

export { VerticalCheckboxGroup } from './components/vertical-checkbox-group';
export type { VerticalCheckboxGroupProps } from './components/vertical-checkbox-group';

export { HorizontalCheckboxGroup } from './components/horizontal-checkbox-group';
export type { HorizontalCheckboxGroupProps } from './components/horizontal-checkbox-group';

export { RadioButtonsVerticalGroup } from './components/radio-buttons-vertical-group';
export type {
  RadioButtonsVerticalGroupProps,
  RadioGroupSharedProps,
  RadioOption,
} from './components/radio-buttons-vertical-group';

export { RadioButtonsHorizontalGroup } from './components/radio-buttons-horizontal-group';
export type {
  RadioButtonsHorizontalGroupProps,
  RadioButtonOption,
} from './components/radio-buttons-horizontal-group';

export { Pagination } from './components/pagination';
export type { PaginationProps, PaginationSize } from './components/pagination';

// --- Components (Tier 7: Dropdown family) ---

export { SelectMenu, selectMenuOptionId } from './components/select-menu';
export type { SelectMenuProps, SelectMenuSize, SelectMenuFocusMode } from './components/select-menu';

// --- Components (Tier 8: Menu) ---

export { Menu, MenuDivider } from './components/menu';
export type { MenuProps, MenuDividerProps } from './components/menu';

// --- Components (Tier 9: Advanced composites) ---

export { ProgressBar } from './components/progress-bar';
export type { ProgressBarProps, ProgressBarStatus } from './components/progress-bar';

export { Stepper } from './components/stepper';
export type {
  StepperProps,
  StepperOrientation,
  StepperPosition,
  StepItem,
  StepState,
} from './components/stepper';

export { AccordionGroup } from './components/accordion-group';
export type {
  AccordionGroupProps,
  AccordionGroupItem,
} from './components/accordion-group';

// --- Components (Tier 10: Page-level) ---

export { PageHeader } from './components/page-header';
export type { PageHeaderProps } from './components/page-header';
