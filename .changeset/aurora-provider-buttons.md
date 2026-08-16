---
"@tesserix/web": minor
---

Add `AuroraProviderButton` and `AuroraProviderList` for identity-provider sign-in, with brand marks for Google, Microsoft, Apple, GitHub, GitLab, Facebook/Meta, Instagram, Okta, passkey and a generic SSO fallback. An IdP the tenant named after a brand ("Google" over generic OIDC) resolves to that brand's mark; a list with no enabled provider renders nothing rather than an orphan divider, and four or more collapse to an icon row on phones.

Rework the light aurora surface: cooler `#F6F6FC` canvas, near-opaque card with a two-stage shadow, solid input fills, a fainter gridline and a new `surfaceHover` token (`--aurora-hover`). The panel now sizes to `100svh` and scales its washes with the viewport so phone browser chrome cannot clip the card.
