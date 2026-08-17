---
"@tesserix/web": patch
---

Paint the auth surface's primary button, its shadow and the card border from the design tokens when no `brandColor` is given.

`AuthPanel` already deferred its accent, canvas, text, card and radius to the host's tokens, but the button gradient, the glow beneath it and the brand tint on the card edge were still derived from the fallback brand — so a sign-in page with no `brandColor` still rendered a blue button while every other component in the system read neutral. The button now resolves to `var(--primary)`, its text to `var(--primary-foreground)`, its shadow to `none`, and the card border to `var(--border)`. Supplying a `brandColor` keeps the derived gradient, glow and tinted border exactly as before.
