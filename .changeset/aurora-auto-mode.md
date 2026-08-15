---
"@tesserix/web": minor
---

Add `mode="auto"` to `AuroraAuthPanel` and `AuroraBackground`. The panel now publishes both surfaces as `--aurora-*` custom properties and scopes the dark set under `.dark`, so it follows the host's theme class instead of a theme resolved in JavaScript — no hydration flash, and no light panel wrapped around dark content.
