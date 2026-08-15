---
"@tesserix/web": minor
---

Add `AuroraAuthPanel`, the white-label sign-in surface.

A tenant supplies one primary colour; the three aurora washes are derived from it
(hue +38° and −42°), so no two tenants land on the same background and nobody has
to pick a gradient. The accent is lifted until it reads AA against its own card,
because tenants will pick colours that vanish on their own surface.

Also exports `AuroraBackground` for reuse on other white-label pages,
`useAuroraPalette()` for children that need the derived values in JS (an inline
SVG wordmark, for example), and `deriveAuroraPalette()` for branding previews.
The panel publishes the palette as `--aurora-*` CSS custom properties, so form
controls inside it can be tenant-tinted without prop drilling.
