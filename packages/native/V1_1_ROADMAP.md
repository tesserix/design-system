# @tesserix/native v1.1 Roadmap

## Objective
Ship a stable, accessible, themeable component foundation that teams can use in production mobile apps without building wrappers around core controls.

## Current Baseline (v1.0)
- Solid primitive coverage: layout, typography, basic controls, and feedback.
- Good unit test presence across existing components.
- Gaps: inconsistent accessibility, no shared theming runtime, missing form/overlay primitives, and API inconsistencies.

## Guiding Principles
- Keep API surface consistent across components (`error` vs `danger`, `isDisabled`, shared size scales).
- Accessibility is not optional: all interactive components must expose consistent role/state/label behavior.
- Prefer shared primitives/hooks over repeated per-component logic.
- Keep Expo-first compatibility and avoid native-module lock-in for core components.

## Scope for v1.1

### P0: Fix and Stabilize Existing Surface (Week 1)
Purpose: remove correctness issues before adding breadth.

1. Fix `Stack` prop behavior and typing
- Ensure spacing/layout props inherited from `Box` are actually applied.
- Stop forwarding non-RN props to `View`.
- Remove `@ts-ignore` child cloning path by tightening child style typing.
- Estimate: 0.5 to 1 day.
- Dependency: none.

2. Normalize semantic color API
- Standardize on `error` (or `danger`) across all components; keep a deprecated alias for one minor version.
- Update docs/tests accordingly.
- Estimate: 0.5 day.
- Dependency: none.

3. Accessibility baseline for existing controls
- `Button`, `IconButton`, `Checkbox`, `Switch`, `Input`:
  - set `accessibilityRole`
  - expose `accessibilityState` (`disabled`, `checked`, `busy`)
  - improve label/hint wiring where label/helper text exists
- Add focused tests for role/state/label behavior.
- Estimate: 1 to 1.5 days.
- Dependency: none.

Exit criteria:
- No unknown prop forwarding warnings for `Stack`.
- All interactive controls pass shared accessibility tests.

### P1: Form Foundation (Week 2)
Purpose: unlock real app forms and validation UX.

1. Add field primitives
- `FormControl`
- `Label`
- `HelperText`
- `ErrorText`
- `Field` (composed wrapper)
- Estimate: 1 day.
- Dependency: P0 accessibility conventions.

2. Add core form inputs
- `Radio`
- `RadioGroup`
- `Textarea`
- `Select` (RN picker-based implementation)
- Estimate: 2 to 3 days.
- Dependency: field primitives.

3. Validation + states consistency
- Standardize `isInvalid`, `isDisabled`, `isRequired`, `isReadOnly` across inputs.
- Estimate: 0.5 to 1 day.
- Dependency: inputs above.

Exit criteria:
- A login/profile settings form can be built without custom wrappers.

### P2: Overlay and Feedback (Week 3)
Purpose: cover mobile UX patterns that appear in every app.

1. `Modal` and `BottomSheet`
- `Modal`: focus trap basics, backdrop click behavior, animation.
- `BottomSheet`: snap points (simple), drag-to-close (gesture-based optional if no extra native dependency).
- Estimate: 2 to 3 days.
- Dependency: accessibility baseline.

2. `Toast` / `Snackbar`
- Queue manager, placement, auto-dismiss, action button.
- Estimate: 1 to 1.5 days.
- Dependency: none.

3. `Tooltip` and `Banner`
- Keep tooltip minimal for touch-first interaction.
- Estimate: 1 day.
- Dependency: none.

Exit criteria:
- At least one app-level flow can do modal confirm + toast result without external UI libs.

### P3: Theming Runtime (Week 4)
Purpose: replace hardcoded color maps with portable semantic theming.

1. Theme primitives
- `ThemeProvider`
- `useTheme`
- `createTheme` helper
- Estimate: 1 day.
- Dependency: none.

2. Semantic token mapping
- Migrate component colors from inline hex maps to semantic slots (surface, text, border, accent, feedback colors).
- Estimate: 2 days.
- Dependency: theme primitives.

3. Color scheme support
- light/dark mode support via `Appearance`.
- explicit override (`light` | `dark` | `system`).
- Estimate: 1 day.
- Dependency: theme primitives.

Exit criteria:
- Switching theme updates all components without per-component overrides.

## Suggested Build Order
1. P0 fix/stabilize.
2. P1 form foundation.
3. P3 theming runtime (can start in parallel with late P1 once APIs are stable).
4. P2 overlays/feedback.

## Effort Summary
- P0: 2 to 3 days
- P1: 3.5 to 5 days
- P2: 4 to 5.5 days
- P3: 4 days
- Total: 13.5 to 17.5 working days (~3 to 4 weeks with review/buffer)

## Testing Strategy
- Keep unit tests for logic and props.
- Add interaction tests for accessibility state transitions (`checked`, `disabled`, `busy`).
- Add snapshot coverage only for stable visual primitives.
- Add one integration test per phase:
  - Form flow integration (P1)
  - Overlay flow integration (P2)
  - Theme switching integration (P3)

## Docs and DX Deliverables
- Update `packages/native/README.md` with full component list.
- Add API tables for new components and shared prop conventions.
- Add migration notes for renamed/deprecated props.
- Add usage recipes:
  - Auth form
  - Settings screen
  - Confirmation modal + toast pattern

## Release Plan

### v1.1.0-beta.1
- P0 complete.
- P1 core primitives (`FormControl`, `Label`, `ErrorText`, `RadioGroup`, `Textarea`).

### v1.1.0-beta.2
- P2 overlays (`Modal`, `Toast`) + initial theming API.

### v1.1.0-rc.1
- P3 complete + API freeze.
- Migration notes finalized.

### v1.1.0
- Stable release after one internal app validation cycle.

## Risks and Mitigations
- Risk: API churn while introducing theming.
  - Mitigation: freeze shared prop conventions in P0 before new components.
- Risk: overlay behavior differs between iOS/Android.
  - Mitigation: test each overlay component on both platforms before beta cut.
- Risk: adding gesture-heavy dependencies increases install friction.
  - Mitigation: keep core components dependency-light; make advanced behaviors opt-in.
