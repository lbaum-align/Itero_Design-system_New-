# Scanner Design System — Component Build Order

> **Status (2026-09-28): complete.** Every component in this plan is built and verified against Figma
> "06. Scanner core 1.0.0 full" (`TCdFM9Hy78GHyifCSlkedx`); per-component reports are in [signoff/](signoff/).
> Plus one non-Figma addition: [Toolbar](signoff/toolbar.md).

**Source**: Figma "06. Scanner core 1.0.0" (76 published components)  
**Strategy**: Dependency-driven tiers — each tier only depends on lower tiers.

## Naming conventions
- `_` prefix = private sub-component (not exported from barrel)
- `01` prefix = atomic unit
- `02` prefix = composition of 01s
- `03` prefix = higher-level composition

---

## Tier 0 — Utilities (already done)
| Component | Status |
|-----------|--------|
| `cn()` utility | ✅ |
| Token CSS files | ✅ |
| TypeScript types | ✅ |

## Tier 1 — Leaf atoms (no dependencies)
| # | Component | Figma name | Node ID | Variants |
|---|-----------|-----------|---------|----------|
| 1 | Spinner | Spinner | — | (no variant props) |
| 2 | Toggle | Toggle | — | Selected, State |
| 3 | Badge | Badge | — | Status, State, Layout |
| 4 | Link | Link | — | Type, State, Size |
| 5 | Logo | Logo | — | Variation |
| 6 | Cursor | Cursor | — | Type |
| 7 | SlotContent | Slot content | — | (utility) |
| 8 | Scroll | Scroll | — | Position |

## Tier 2 — Simple atoms with icon deps only
| # | Component | Figma name | Dependencies |
|---|-----------|-----------|-------------|
| 9 | Tag | 01 Tag | Close empty icon |
| 10 | CheckboxItem | 01 Checkbox item | Selected, State |
| 11 | RadioButtonItem | 01 Radio button item | Selected, State |
| 12 | _TabItem | _Tab item | State |
| 13 | _PaginationItem | _Pagination item | Size, State |
| 14 | _Days | _Days | State |
| 15 | _TooltipContainer | _Tooltip container | — |
| 16 | _BreadcrumbLink | _Breadcrumb link | State |
| 17 | _Status (Avatar) | _Status | State |
| 18 | NotificationTextContent | .Notification text content | Show title |

## Tier 3 — Composed atoms (depend on Tier 1–2)
| # | Component | Figma name | Dependencies |
|---|-----------|-----------|-------------|
| 19 | Button | 01 Button | Spinner, icons |
| 20 | Tooltip | 01 Tooltip | _TooltipContainer |
| 21 | IconTriggerTooltip | 02 Icon trigger tooltip | _TooltipContainer, Help icon |
| 22 | TextTriggerTooltip | 03 Text trigger tooltip | _TooltipContainer |
| 23 | Avatar | 01 Avatar | _Status, User icon |
| 24 | Popover | Popover | SlotContent |
| 25 | _KeyboardShortcut | _Keyboard shortcut | — |

## Tier 4 — Groups (depend on Tier 3)
| # | Component | Figma name | Dependencies |
|---|-----------|-----------|-------------|
| 26 | ButtonGroup | 02 Buttons group | Button |
| 27 | SplitButton | 02 Split button | Button |
| 28 | TagGroup | 02 Tag group | Tag |
| 29 | TabGroup | Tab group | _TabItem |
| 30 | AvatarGroup | 02 Avatars group | Avatar |
| 31 | Breadcrumbs | Breadcrumbs | _BreadcrumbLink |
| 32 | _MenuTrailingElements | _Menu trailing elements | _KeyboardShortcut, Toggle, icon |
| 33 | NotificationAction | .Notification action | Link, Button |

## Tier 5 — Form inputs (depend on Tier 3: IconTriggerTooltip, Button)
| # | Component | Figma name | Dependencies |
|---|-----------|-----------|-------------|
| 34 | TextInput | Text input | IconTriggerTooltip, Close icon |
| 35 | TextArea | Text area | IconTriggerTooltip, Close icon |
| 36 | PasswordInput | Password input | IconTriggerTooltip, Link |
| 37 | NumberInput | Number input | IconTriggerTooltip, Button |
| 38 | DateInput | Date input | IconTriggerTooltip |

## Tier 6 — Checkbox & Radio groups (depend on Tier 2 items + Tier 3 tooltip)
| # | Component | Figma name | Dependencies |
|---|-----------|-----------|-------------|
| 39 | VerticalCheckboxGroup | 02 Vertical checkbox group | CheckboxItem, IconTriggerTooltip |
| 40 | HorizontalCheckboxGroup | 03 Horizontal checkbox group | CheckboxItem, IconTriggerTooltip |
| 41 | RadioButtonsVerticalGroup | 02 Radio buttons vertical group | RadioButtonItem, IconTriggerTooltip |
| 42 | RadioButtonsHorizontalGroup | 03 Radio buttons horizontal group | RadioButtonItem, IconTriggerTooltip |
| 43 | Pagination | Pagination | Button, _PaginationItem, icon |

## Tier 7 — Dropdown family (depend on Tier 4 TagGroup + Tier 3 tooltip)
| # | Component | Figma name | Dependencies |
|---|-----------|-----------|-------------|
| 44 | _SelectMenuItem | _Select menu Item | icon |
| 45 | SelectMenu | Select menu | _SelectMenuItem |
| 46 | Dropdown | Dropdowm (sic) | TagGroup, icons |
| 47 | Combobox | Combobox | TagGroup, icons |
| 48 | SearchInput | Search input | SelectMenu, icons |

## Tier 8 — Menu (depends on Tier 4 _MenuTrailingElements)
| # | Component | Figma name | Dependencies |
|---|-----------|-----------|-------------|
| 49 | _MenuItems | _Menu items | _MenuTrailingElements, icon |
| 50 | Menu | Menu | _MenuItems |

## Tier 9 — Advanced composites
| # | Component | Figma name | Dependencies |
|---|-----------|-----------|-------------|
| 51 | ProgressBar | Progress bar | Link, icons |
| 52 | _SliderControl | _Slider control | Tooltip |
| 53 | Slider | Slider | _SliderControl, NumberInput |
| 54 | Calendar | 02 Calendar | _Days, icons, Scroll |
| 55 | DatePicker | 01 Date picker | Calendar, IconTriggerTooltip |
| 56 | ModalWindow | Modal window | Button, icons, SlotContent |
| 57 | Toast | Toast | NotificationTextContent, NotificationAction, icons |
| 58 | _StepCounter | _Step counter | icons |
| 59 | _VerticalStepperItems | _Vertical stepper items | _StepCounter, icons |
| 60 | _HorizontalStepperItems | _Horizontal stepper items | _StepCounter, icons |
| 61 | Stepper | Stepper | _HorizontalStepperItems, _VerticalStepperItems |
| 62 | _AccordionItem | _01 Accordion item | icons |
| 63 | AccordionGroup | 02 Accordion group | _AccordionItem |

## Tier 10 — Page-level
| # | Component | Figma name | Dependencies |
|---|-----------|-----------|-------------|
| 64 | PageHeader | Page header | Button, TabGroup, Breadcrumbs |
| 65 | Header | Header | Menu, Logo, Button |

## Tier 11 — Data Table (most complex, depends on many)
| # | Component | Figma name | Dependencies |
|---|-----------|-----------|-------------|
| 66 | _DataTableDragItem | Items / Data table drag item | icon |
| 67 | _DataTableCheckboxItem | Items / Data table checkbox item | CheckboxItem |
| 68 | _DataTableExpansionItem | Items / Data table expansion item | icon |
| 69 | _DataTableHeaderItem | Items / Data table header item | icons |
| 70 | _DataTableContentItem | Items / Data table content item | Avatar, Badge, SlotContent, Link, Button, icon |
| 71 | DataTableHeaderRow | Rows / Data table header row | _DataTableHeaderItem, _DataTableCheckboxItem |
| 72 | DataTableContentRow | Rows / Data table content row | _DataTableContentItem, _DataTableDragItem, _DataTableExpansionItem, _DataTableCheckboxItem |
| 73 | DataTableToolbars | Bars / Data table toolbars | SearchInput, Button |
| 74 | DataTablePagination | Bars / Data table pagination | Dropdown, Button |
| 75 | DataTable | Data table | DataTableToolbars, DataTableHeaderRow, DataTableContentRow, DataTablePagination, Scroll |

---

## _Decoration (standalone, Logo page utility)
| # | Component | Figma name | Dependencies |
|---|-----------|-----------|-------------|
| 76 | _Decoration | _Decoration | icon |

## Summary
- **76 total published components**
- **12 tiers** (0–11)
- **~22 private** sub-components (not exported)
- **~54 public** components (exported from barrel)
- Icons are cross-cutting — extract in parallel with Tier 1
