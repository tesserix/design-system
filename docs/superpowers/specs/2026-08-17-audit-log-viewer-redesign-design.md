# AuditLogViewer Redesign — Design

**Date:** 2026-08-17
**Author:** Mahesh Sangawar
**Status:** Draft for review
**Repos touched:** `design-system` (`packages/web`)

## 1. Context & goal

`AuditLogViewer` is a single 92-line component in `@tesserix/web` that renders a
card, a heading, an entry count, and an `<ol>` of audit rows. Its one production
consumer is the Tesserix console's platform audit surface
(`tesserix-home/apps/console/app/(console)/platform/audit-log/audit-timeline.tsx`),
which drives it with an `entries` array plus the `renderSource` and
`renderMetadata` slots added in design-system#12.

A review of the component against its siblings (`Timeline`, `Accordion`,
`Collapsible`, `NotificationCenter`) surfaced seven defects and three missing
capabilities. The goal is to fix all of them, add per-entry expand/collapse, and
open the component up for composition — **without breaking the console**.

Non-goal: migrating the console. Every new capability is opt-in, and the console
keeps working untouched.

## 2. Defects this design fixes

| # | Defect | Fix |
|---|---|---|
| 1 | `{entries.length} entries` never pluralizes — renders "1 entries" | `labels.countLabel(n)` |
| 2 | `<time>` carries no `dateTime` attribute; `timestamp` is an opaque display string | new optional `entry.dateTime` (ISO); attribute omitted entirely when absent |
| 3 | Clickable rows have no `focus-visible` ring, unlike every other interactive component in the package | ring tokens copied from `button.tsx` |
| 4 | `<h3>Audit Log</h3>` — hardcoded level *and* hardcoded English | `headingLevel` (default 3) + `labels.title` |
| 5 | The `<ol>` is not associated with that heading | `aria-labelledby` wiring |
| 6 | Row sentence built by string concatenation (`actor action target`) — unlocalizable | `renderSummary?(entry)` escape hatch |
| 7 | Long `metadata` (JSON blobs) overflows the card | `break-words` |

## 3. Decisions (locked in via brainstorming)

| Decision | Choice |
|---|---|
| API shape | **Hybrid.** `entries` stays the default path; composable parts are exported alongside and the wrapper is built *from* them. |
| Expand/collapse trigger | **Separate chevron button**, sibling to the summary. The summary stays the `onEntrySelect` target. |
| Metadata placement | **Stays inline**, exactly as today. Collapsible detail is a new opt-in slot. |
| Export style | Flat named exports (matching `Timeline`/`Accordion`) **plus** dot-notation aliases attached to `AuditLogViewer`. |
| Severity | **Included** — `"info" \| "warning" \| "critical"`, left rule plus sr-only text. |
| Expansion modes | Multiple-open only. A `single` mode is YAGNI for an audit log. |
| Versioning | Additive → **minor** bump (`2.2.1` → `2.3.0`). No consumer migration. |

## 4. Architecture

The single file splits into a focused set, per the project's <400-line rule:

| File | Contents |
|---|---|
| `audit-log-context.tsx` | expansion + selection context, `useAuditLogRow` |
| `audit-log-parts.tsx` | the exported primitives |
| `audit-log-viewer.tsx` | the data-driven wrapper, composed from those parts |
| `index.ts` | barrel |

Parts: `AuditLogRoot`, `AuditLogHeader`, `AuditLogTitle`, `AuditLogCount`,
`AuditLogList`, `AuditLogRow`, `AuditLogSummary`, `AuditLogDisclosure`,
`AuditLogTime`, `AuditLogSource`, `AuditLogMetadata`, `AuditLogDetail`,
`AuditLogEmpty`, `AuditLogSkeleton`.

### 4.1 Row markup

HTML forbids a `<button>` inside a `<button>`, so the chevron cannot live within
the selectable summary. They are siblings:

```html
<li>                                        <!-- border, padding, severity rule -->
  <div class="flex">
    <button id="e1-sum">Mahesh updated billing settings … 09:12</button>
    <button aria-expanded="true" aria-controls="e1-det" aria-label="Expand …">⌄</button>
  </div>
  <div id="e1-det" role="region" aria-labelledby="e1-sum">…</div>
</li>
```

`#e1-sum` is a plain `<div>`, not a `<button>`, when `onEntrySelect` is absent —
preserving the 2.1.0 behaviour the console explicitly relies on. The chevron
renders **only** for entries that have detail, so today's console rows are
unchanged.

The detail region is conditionally rendered rather than `hidden`, so collapsed
content stays out of the accessibility tree and out of the DOM.

### 4.2 Entry type

```ts
export interface AuditLogEntry {
  id: string
  actor: string
  action: string
  target?: string
  timestamp: string
  dateTime?: string                 // new — ISO 8601, for <time dateTime>
  metadata?: string
  source?: string
  detail?: React.ReactNode          // new — collapsible
  severity?: "info" | "warning" | "critical"  // new
}
```

Every new field is optional. An existing `AuditLogEntry` remains valid.

### 4.3 State

- **Expansion** — uncontrolled via `defaultExpandedIds`, controlled via
  `expandedIds` + `onExpandedChange`. Follows the controlled/uncontrolled
  pattern already established in `collapsible.tsx`.
- **Selection** — `selectedEntryId` → `aria-current="true"` plus a tone class.
- **Loading** — `loading` → `AuditLogSkeleton` rows (`loadingRowCount`, default 3).
- **Severity** — left rule plus sr-only text. Never colour alone.

All state updates are immutable (new `Set`/array per change), per the project
coding-style rule.

### 4.4 Localization

A single `labels` prop carries every user-visible string:

```ts
interface AuditLogLabels {
  title: string
  countLabel: (count: number) => string
  expand: string
  collapse: string
  empty: string
}
```

Defaults are English and match today's output, except that `countLabel`
pluralizes correctly. `renderSummary?(entry)` covers the row sentence, whose
word order is not translatable by string substitution.

## 5. Accessibility

- Root is a `<section>` labelled by the heading; the `<ol>` uses `aria-labelledby`.
- The disclosure button's accessible name includes the entry's summary text, so a
  screen-reader user hears *which* row is expanding rather than a bare "Expand".
- Detail region is a labelled `role="region"` pointing back at its summary.
- `focus-visible` rings on both the summary and the chevron.
- Severity is conveyed by an sr-only word in addition to the colour rule.

Target: WCAG 2.1 AA, matching the project baseline.

## 6. Testing

**Vitest** — the existing 9 tests must pass **unmodified**; that is the
backward-compatibility proof. New cases:

- pluralization at 0, 1, and n
- `dateTime` present when supplied, attribute wholly absent when not
- `aria-expanded` toggles; detail mounts and unmounts
- controlled expansion (`expandedIds` + `onExpandedChange`)
- chevron suppressed for entries without detail
- `aria-current` on the selected entry
- skeleton rows while `loading`
- `labels` overrides
- **the summary button contains no nested button** (guards §4.1)

**Storybook** — new `Expandable`, `Selected`, `Loading`, `Severity`, and
`Composed` stories. The expand/collapse story carries a play function, since CI
runs the Storybook test-runner (design-system#23). Existing stories are
untouched.

## 7. Documentation

`apps/docs/content/web-components/audit-log-viewer.mdx` is **generated** —
`pnpm docs:generate` silently destroys hand-written prose in it. Component
documentation therefore lives in JSDoc on the exported types and parts, not in
the MDX.

## 8. Rollout

1. Land in `design-system` behind a changeset (minor).
2. Console picks the new version up on its normal bump; no code change required.
3. `renderDetail` adoption in the console's audit surface is a separate, later
   change — it currently has no entry-detail view, which is what motivated
   per-row disclosure in the first place.

## 9. Risks

| Risk | Mitigation |
|---|---|
| Silent visual regression in the console | Existing tests and stories run unmodified; metadata placement deliberately unchanged |
| Nested-button invalid HTML | Explicit test asserting no nested interactive elements |
| API surface growth (14 parts) | Parts are exports of one component folder, documented together; the `entries` path remains the documented default |
