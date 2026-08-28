---
"@tesserix/web": minor
---

ConfirmDialog can describe its confirm button, and destructive confirmations no longer dismiss on outside click

Three changes, from tesserix/design-system#27.

**`confirmDescribedBy`** associates the confirm button with an element explaining why it is disabled — typically an `aria-live` status line in `children`. The console forked `ConfirmDialog` into a ~55-line `DestructiveConfirmDialog` to get this; that fork can now be deleted, which stops future a11y fixes here from failing to reach it. Deliberately narrow rather than a props spread: `onClick`, `disabled` and `variant` are all controlled by this component, and a caller overriding one would conflict silently.

**Destructive confirmations are no longer dismissed by clicking the overlay.** `variant` already defaults to `"destructive"`, so this changes behaviour for existing consumers. A stray click should not silently abandon a flow whose confirm button destroys data — and afterwards the operator cannot tell whether they cancelled or mis-clicked. Pass `dismissOnOutsideClick` to opt back in; `variant="default"` is unaffected. `DialogContent` gains the same prop, defaulting to `true`, so a plain `Dialog` is unchanged.

**`inertBackground`** marks everything outside the dialog `inert` while it is open. **Opt-in**, because `Dialog` portals into `document.body` and turning it on reaches every sibling mounted there — toasts, live regions. Dialog-owned nodes are exempt via `data-dialog-portal`, so nesting is safe. Worth enabling where modality matters: without it, modality rests on `aria-modal="true"` alone, which is the ARIA contract but has uneven screen-reader support.
