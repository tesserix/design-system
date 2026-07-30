---
"@tesserix/web": minor
---

Add `AppStoreBadges` — a configurable App Store / Google Play download badge row.

Ships the layout rules both stores impose (equal visual weight, clear space,
40px minimum, App Store placed first, meaningful alt text) but deliberately
ships **no badge artwork**: neither Apple nor Google grants the right to
redistribute their badges, so each app self-hosts the official asset and passes
the path via `artworkSrc`.

Badges render per-platform only when a URL is configured, so a platform can be
switched on without touching consuming surfaces. `placeholder="coming-soon"`
opts into an inert pre-launch plate that carries no store trademark artwork.
