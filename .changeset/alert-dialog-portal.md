---
"@tesserix/web": patch
---

AlertDialog: portal the overlay to `document.body`, and use the destructive colour for destructive confirms.

The scrim used `position: fixed` without a portal, so it was captured by any ancestor establishing a containing block — a transform, filter, backdrop-filter, contain or will-change. In mark8ly's admin, where every page carries `animate-[fadeInUp...]` with `animation-fill-mode: both`, that leaves an identity `transform: matrix(1,0,0,1,0,0)` applied for as long as the page is mounted: the overlay rendered as a grey rectangle over the content column (measured 1152×448 instead of the viewport's 1920×779), leaving the sidebar and header undimmed.

Also: `type="confirm"` now uses `bg-destructive` rather than `bg-warning`, since a confirm dialog is overwhelmingly confirming a removal; the scrim is `bg-foreground/40` with no `backdrop-blur`; and the panel uses the system radius and `shadow-xl` instead of `rounded-lg` + `shadow-2xl`.
