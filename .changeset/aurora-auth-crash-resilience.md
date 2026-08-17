---
"@tesserix/web": patch
---

Stop `AuroraAuthPanel` from white-screening the sign-in page over tenant configuration.

`deriveAuroraPalette` throws on anything that is not a hex colour — correct for a pure utility, fatal for a login screen, because `brandColor` comes straight from a tenant's Zitadel `LabelPolicy.primaryColor`, which is empty until someone sets one. `AuroraAuthPanel` and `AuroraBackground` now fall back to `AURORA_FALLBACK_BRAND` (exported) and warn outside production instead of throwing. The utility keeps its strict contract.

Also fixes `resolveAuroraProvider` resolving an IdP display name like `constructor` or `toString` to an `Object.prototype` member, which rendered a non-component and crashed the provider button. It now checks own keys only.
