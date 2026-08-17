---
"@tesserix/web": minor
---

Let `AuditLogViewer` attribute a row to its source. Entries take an optional opaque `source`, and a new `renderSource` prop turns that id into a label — so a merged multi-source timeline no longer has to smuggle attribution through `target` or `metadata`. A matching `renderMetadata` prop formats the stringified JSON consumers put in `metadata` instead of rendering it raw. Rows now render as a `<button>` only when `onEntrySelect` is supplied, so a read-only log stops emitting focusable controls that do nothing.
