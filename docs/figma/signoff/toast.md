# Toast — sign-off

**Figma**: `Toast` `34305:10008` (page Notification `15305:6745`) · **Variants**: Type (Toast, Inline) × Status (Information, Success, Warning, Error) = 8, plus Show action, Closable
**Status**: ✅ Built 2026-09-15

## API
`Toast`: `type` · `status` · `title` / `message` / `showTitle` (→ `_NotificationTextContent`) · `showAction` + `action` (`NotificationActionProps` → `_NotificationAction`) · `closable` / `onClose` / `closeLabel` · `statusLabel` (icon accessible name, defaults to the status).
Queue: `ToastProvider` (`placement` default `top-right`, `duration` default 7000 ms, `limit` default 5, `label` default "Notifications") + `useToast()` → `{ show(options) → id, dismiss(id), dismissAll() }`. `options.duration` (`null` = persistent; defaults to `null` when the toast has an `action`), `options.id` (same id replaces), `options.onClose` (called on close button, timeout, dismiss or being pushed past `limit`).

## Implementation
- Layout (all variants): 20px padding and gap, 16px radius; 28px status icon · 8px · text content + action column; 28px close icon (`close-empty`, `icon-secondary`).
- Toast: `bg-elevated` + `shadow-depth-01`, 296–400px. Inline: `bg-highlight-{blue|green|orange|red}` + 1px inset `border-highlight-*` stroke, 296px min, fills its container.
- Icons from the registry, verified against Figma instances: Information → `information` (`icon-link`), Success → `checkmark` "Checkmark fill" (`icon-success`), Warning → `warning` (`icon-warning`), Error → `error` (`icon-error`).
- ARIA: `role="status"` + `aria-live="polite"` (information, success), `role="alert"` + `aria-live="assertive"` (warning, error), `aria-atomic`; status icon has `role="img"` with the status name. Keyboard per Figma docs: Tab → action(s) → close icon, Enter/Space activate.
- Queue (Figma docs "Placement"): top right, newest on top, 16px apart ($spacing-03 in Scanner mode), auto-dismiss after 7 s. Each toast's timer pauses on hover and while focus is inside it and resumes with the remaining time. Stack is a `role="region"` landmark, `pointer-events-none` except the toasts, 24px from the viewport edge.

## Storybook coverage
`Default` (controls) · `Type: Toast | Inline` · `Status: Information | Success | Warning | Error` · `Figma matrix (all 8 variants)` · `AllStates` (Type × Status × default / no action / not closable / no title / button action) · `LongContent` · `Toast queue (ToastProvider + useToast)` (placement/duration/limit controls, play test) · play tests `DismissAndAction`, `LinkAction` — all passing in headless Edge.
Unit tests: `toast.test.tsx` — 18 passing (Toast rendering/roles/icons per status, action/closable, keyboard, ref; provider: newest-first, 7 s auto-dismiss, hover/focus pause + resume, persistent toasts, dismiss/dismissAll, id replacement + limit, placement).

## Tokens
`src/tokens/components/notification.css`: `--scanner-toast-min-width` (296px), `--scanner-toast-max-width` (400px), `--scanner-toast-icon-size` (28px), `--scanner-toast-close-focus-width` (2px).

## Visual comparison
Figma matrix (at Figma's 350px width) vs Figma set screenshot: icon/title alignment, 16px title↔message gap, 16px action padding, colours and shadow match; Warning toast hugs to 372px (Figma 384 — stale Button instances, see below). Dark theme checked.

## Remaining deviations / Figma inconsistencies
- Main-component widths vary: Information toast min 288 (others 296), Warning toast max 900 (others 400), Success/Warning toast gap 16 unbound (others 20). Implemented 296 / 400 / 20.
- Type=Inline, Status=Warning icon is 32×32 (all others 28). Implemented 28.
- Warning toast action buttons are stale Button instances (2px stroke, 100px min width) → current Button spec (see `_notification-action` sign-off).
- No close-icon states in Figma — hover `bg-hover`, pressed `bg-active`, 2px `border-focus` ring added.
- `z-index` of the stack uses Tailwind `z-50` (no z-index token exists).
