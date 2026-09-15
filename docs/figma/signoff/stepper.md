# Stepper — sign-off

**Figma**: `Stepper` `34201:2333` (page "Stepper" `34201:1155`), file `TCdFM9Hy78GHyifCSlkedx`
**Variants**: Position (Horizontal stepper, Vertical) = 2 (8 step slots, 4 visible by default).

## Storybook coverage (`Components/Stepper`)
`Default` (controls: Position, currentStep, error, skeleton) · `Position: Horizontal stepper` · `Position: Vertical` · `AllStates` (every item state in both positions) ·
`Progression` (step 1 → all completed, error, skeleton × both positions) · `Figma matrix (all 2 variants)` · `Maximum: 8 steps` ·
`Overflow: long labels truncate with tooltip` · play test `AnnouncesProgress`.
Unit tests: `stepper.test.tsx` (8).

## Fixed during audit
- Horizontal layout had no gap between items → 8px gap (Figma), vertical keeps 8px
- `<li className="contents">` (drops list semantics in some browsers) → real flex `<li>` items
- Added Figma property alias `position` ("Position"), per-step `state` override, `statusLabels` (visually hidden "completed / current step / error / not started" after each label), overridable `aria-label` (default "Progress"), `aria-busy` while skeleton; props extend `OlHTMLAttributes`
- Items now render the Figma indicator icons, line and skeleton (see item sign-offs)

## Remaining deviations / Figma notes
- Figma docs say "three states" but list five (not started, in progress, completed, error, skeleton). Implemented all five.
- Long labels truncate by flex shrinking; when the container is far too narrow, short labels shrink too (proportional flex shrink).
- More than 8 steps are not rendered (Figma draws 8 slots; docs: "more than 8 steps … may overwhelm").
- Docs typo "Vartical"; ignored.
