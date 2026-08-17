---
"@tesserix/web": minor
---

Make `brandColor` optional on `AuthPanel` and `AuthBackground`.

The token-first cascade could never reach the brand-derived roles, because `brandColor` was a required prop: `accent`, the input border, the button gradient and the three washes were always painted literally from it. A product that wanted its own design tokens to drive the accent had no clean way to say so — passing an empty string worked but tripped the development warning and fell back to the platform brand.

Omitting `brandColor` now means "theme me from the design tokens": the accent defers to `var(--primary)`, the input border to `var(--input)`, and intensity defaults to `flat` so no washes are drawn at all. Supplying a `brandColor` keeps the white-label tenant surface exactly as it was, and an explicit `intensity` still wins either way.
