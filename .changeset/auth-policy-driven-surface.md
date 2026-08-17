---
"@tesserix/web": major
---

Rework the auth surface into a provider-neutral, policy-driven component set, and rename it from `Aurora*` to `Auth*`.

**Breaking — renames.** `aurora-auth` is now `auth`, and every export drops the Aurora prefix: `AuroraAuthPanel` → `AuthPanel`, `AuroraBackground` → `AuthBackground`, `AuroraProviderButton/List/Mark` → `AuthProviderButton/List/Mark`, `resolveAuroraProvider` → `resolveAuthProvider`, `useAuroraPalette` → `useAuthPalette`, `deriveAuroraPalette` → `deriveAuthPalette`, `AURORA_FALLBACK_BRAND` → `AUTH_FALLBACK_BRAND`. The CSS custom properties move with them: `--aurora-*` → `--auth-*`, and the `data-aurora-*` hooks become `data-auth-*`. Update imports and any CSS that targeted those properties.

**Theming is now token-first.** Every surface role resolves in three steps: an explicitly supplied colour wins, then the host's design token (`--background`, `--foreground`, `--card`, `--primary`, `--muted-foreground`, `--input`, `--destructive`, `--radius`), then the platform default as the `var()` fallback. A product that themes its design tokens gets a matching sign-in page for free, and a standalone page that loads no tokens renders exactly as before. Radius, font stack, card width, backdrop blur and grid size are custom properties too, overridable by CSS or via the new `metrics` prop — nothing visual is hardcoded any more.

**Provider-neutral policies with adapters.** Components consume neutral shapes — `AuthBranding`, `AuthMethodPolicy`, `PasswordPolicy`, `LockoutPolicy`, `AuthLegalLinks` — and never know which identity provider produced them. `fromZitadel()` (plus `zitadelBranding`, `zitadelMethodPolicy`, `zitadelPasswordPolicy`, `zitadelLockoutPolicy`, `zitadelLegalLinks`) maps a Zitadel policy bundle onto them; the adapter is a pure function, so projects on another IdP tree-shake it away. Every policy field is optional, so supplying none yields a plain username-and-password form — plain auth is the default, not a separate mode.

**New components.** `AuthCredentialForm` (with an optional two-step identifier-then-password flow), `AuthPasswordField` with a live complexity checklist, `AuthMfaSelector`, `AuthOtpStep` (TOTP, emailed and texted codes, auto-submitting on completion), `AuthPasskeyPrompt`, `AuthRegisterForm` with terms/privacy gating, `AuthPasswordResetRequest`, `AuthSetPasswordForm`, `AuthLockoutNotice`, and the `AuthField`/`AuthInput`/`AuthSubmitButton`/`AuthLinkButton`/`AuthError` primitives.

**Deprecations.** `auth-layout` (`AuthLayout`, `AuthCard*`, `AuthSocial*`) is deprecated in favour of the new set. It still works and is not removed.
