---
"@tesserix/web": minor
---

AuditLogViewer: per-entry expand/collapse, composable parts, and accessibility fixes.

`@tesserix/web` now requires `lucide-react` as a peer dependency (via `@tesserix/icons`). `@tesserix/icons` is now a runtime dependency of `@tesserix/web`.

- Rows can now carry collapsible `detail` (or supply it via `renderDetail`), revealed by a disclosure button that is a sibling of the row summary rather than nested inside it.
- The component is now composable: `AuditLogRoot`, `AuditLogRow`, `AuditLogSummary`, `AuditLogDisclosure`, `AuditLogDetail` and friends are exported, and also attached as `AuditLogViewer.Row` etc. The `entries` prop remains the default path and is unchanged.
- New optional props: `labels`, `headingLevel`, `selectedEntryId`, `expandedIds`, `defaultExpandedIds`, `onExpandedChange`, `loading`, `loadingRowCount`, `renderSummary`, `renderDetail`.
- New optional `AuditLogEntry` fields: `dateTime`, `detail`, `severity`.
- Fixes: the entry count now pluralizes ("1 entry", not "1 entries"); `<time>` carries `dateTime` when supplied; selectable rows have a visible focus ring; the title's heading level is configurable and labels the entry list via `aria-labelledby`; long metadata wraps instead of overflowing.

Known gap: `severity="warning"` currently renders no coloured rule, because this package has no `--warning` token yet. This is a pre-existing gap that also affects several other components, not something new introduced here.
