# @tesserix/web

## 2.1.0

### Minor Changes

- f50319a: Fix five defects in `Command` that made it unusable as a real command palette, and give `CommandPalette` what an async palette needs.

  - **Keyboard navigation now works from the search input.** The `ArrowDown`/`ArrowUp`/`Enter` handler lived on `CommandList`, a _sibling_ of `CommandInput`, so keystrokes from the input — where focus sits for a palette's whole life — never reached it. It moves to the `Command` wrapper, an ancestor of both.
  - **`Enter` can no longer act on a stale selection.** The active value was written synchronously from a registry that items only populate in an effect, so after typing it could point at an item no longer on screen. The highlight is now reconciled against the current match set, and `Enter` re-checks membership before firing.
  - **`CommandEmpty` no longer contradicts the list.** Emptiness meant "nothing selectable", so a list of matching-but-`disabled` items rendered the items _and_ "no results". It now means "nothing rendered".
  - **The combobox pattern is complete.** `CommandInput` declares `role="combobox"`, `aria-expanded`, `aria-controls` and `aria-autocomplete`, and points `aria-activedescendant` at the highlighted option — which was the missing piece that left arrowing silent for screen readers. Options carry stable ids.
  - **`CommandPalette` supports server-driven search** via `query`/`onQueryChange`, `loading`, and `shouldFilter`, and now routes selection through `onValueChange` so `Enter` triggers an item's `onSelect` rather than only a mouse click.

  Arrow navigation also skips `disabled` items, and the new `CommandLoading` part is exported.

  Note for consumers: `CommandInput` now has `role="combobox"`, so a test querying it by `getByRole("textbox")` must query `getByRole("combobox")` instead.

  The item registry is also mirrored into a ref so keyboard handlers read the live list rather than the snapshot their render closed over — a key pressed in the same tick as mount previously did nothing.

## 2.0.0

### Major Changes

- c044b6e: Rework the auth surface into a provider-neutral, policy-driven component set, and rename it from `Aurora*` to `Auth*`.

  **Breaking — renames.** `aurora-auth` is now `auth`, and every export drops the Aurora prefix: `AuroraAuthPanel` → `AuthPanel`, `AuroraBackground` → `AuthBackground`, `AuroraProviderButton/List/Mark` → `AuthProviderButton/List/Mark`, `resolveAuroraProvider` → `resolveAuthProvider`, `useAuroraPalette` → `useAuthPalette`, `deriveAuroraPalette` → `deriveAuthPalette`, `AURORA_FALLBACK_BRAND` → `AUTH_FALLBACK_BRAND`. The CSS custom properties move with them: `--aurora-*` → `--auth-*`, and the `data-aurora-*` hooks become `data-auth-*`. Update imports and any CSS that targeted those properties.

  **Theming is now token-first.** Every surface role resolves in three steps: an explicitly supplied colour wins, then the host's design token (`--background`, `--foreground`, `--card`, `--primary`, `--muted-foreground`, `--input`, `--destructive`, `--radius`), then the platform default as the `var()` fallback. A product that themes its design tokens gets a matching sign-in page for free, and a standalone page that loads no tokens renders exactly as before. Radius, font stack, card width, backdrop blur and grid size are custom properties too, overridable by CSS or via the new `metrics` prop — nothing visual is hardcoded any more.

  **Provider-neutral policies with adapters.** Components consume neutral shapes — `AuthBranding`, `AuthMethodPolicy`, `PasswordPolicy`, `LockoutPolicy`, `AuthLegalLinks` — and never know which identity provider produced them. `fromZitadel()` (plus `zitadelBranding`, `zitadelMethodPolicy`, `zitadelPasswordPolicy`, `zitadelLockoutPolicy`, `zitadelLegalLinks`) maps a Zitadel policy bundle onto them; the adapter is a pure function, so projects on another IdP tree-shake it away. Every policy field is optional, so supplying none yields a plain username-and-password form — plain auth is the default, not a separate mode.

  **New components.** `AuthCredentialForm` (with an optional two-step identifier-then-password flow), `AuthPasswordField` with a live complexity checklist, `AuthMfaSelector`, `AuthOtpStep` (TOTP, emailed and texted codes, auto-submitting on completion), `AuthPasskeyPrompt`, `AuthRegisterForm` with terms/privacy gating, `AuthPasswordResetRequest`, `AuthSetPasswordForm`, `AuthLockoutNotice`, and the `AuthField`/`AuthInput`/`AuthSubmitButton`/`AuthLinkButton`/`AuthError` primitives.

  **Deprecations.** `auth-layout` (`AuthLayout`, `AuthCard*`, `AuthSocial*`) is deprecated in favour of the new set. It still works and is not removed.

## 1.13.0

### Minor Changes

- 42fd2b3: Let `AuditLogViewer` attribute a row to its source. Entries take an optional opaque `source`, and a new `renderSource` prop turns that id into a label — so a merged multi-source timeline no longer has to smuggle attribution through `target` or `metadata`. A matching `renderMetadata` prop formats the stringified JSON consumers put in `metadata` instead of rendering it raw. Rows now render as a `<button>` only when `onEntrySelect` is supplied, so a read-only log stops emitting focusable controls that do nothing.

### Patch Changes

- 822214d: Stop `AuroraAuthPanel` from white-screening the sign-in page over tenant configuration.

  `deriveAuroraPalette` throws on anything that is not a hex colour — correct for a pure utility, fatal for a login screen, because `brandColor` comes straight from a tenant's Zitadel `LabelPolicy.primaryColor`, which is empty until someone sets one. `AuroraAuthPanel` and `AuroraBackground` now fall back to `AURORA_FALLBACK_BRAND` (exported) and warn outside production instead of throwing. The utility keeps its strict contract.

  Also fixes `resolveAuroraProvider` resolving an IdP display name like `constructor` or `toString` to an `Object.prototype` member, which rendered a non-component and crashed the provider button. It now checks own keys only.

## 1.12.0

### Minor Changes

- 0bc1a10: Export `AuroraProviderMark` so a host with its own button chrome — a Zitadel login form whose submit button carries the server action and pending state — can still render the resolved brand logo.

## 1.11.0

### Minor Changes

- 9ffc570: Add `AuroraProviderButton` and `AuroraProviderList` for identity-provider sign-in, with brand marks for Google, Microsoft, Apple, GitHub, GitLab, Facebook/Meta, Instagram, Okta, passkey and a generic SSO fallback. An IdP the tenant named after a brand ("Google" over generic OIDC) resolves to that brand's mark; a list with no enabled provider renders nothing rather than an orphan divider, and four or more collapse to an icon row on phones.

  Rework the light aurora surface: cooler `#F6F6FC` canvas, near-opaque card with a two-stage shadow, solid input fills, a fainter gridline and a new `surfaceHover` token (`--aurora-hover`). The panel now sizes to `100svh` and scales its washes with the viewport so phone browser chrome cannot clip the card.

## 1.10.1

### Patch Changes

- 7e4d213: Expose `inputBorder` on the aurora palette and `--aurora-input-border` on the panel, so host form controls can pick up a brand-tinted field border instead of a neutral one.

## 1.10.0

### Minor Changes

- 5f848aa: Add `mode="auto"` to `AuroraAuthPanel` and `AuroraBackground`. The panel now publishes both surfaces as `--aurora-*` custom properties and scopes the dark set under `.dark`, so it follows the host's theme class instead of a theme resolved in JavaScript — no hydration flash, and no light panel wrapped around dark content.

## 1.9.1

### Patch Changes

- 4f2e769: Make `AuroraAuthPanel`'s `title` optional.

  Hosts that already render their own heading — the Zitadel login, where every
  step supplies its own translated `<h1>` — were forced to either nest headings
  or leave an empty one in the card.

## 1.9.0

### Minor Changes

- 15221e8: Add `AuroraAuthPanel`, the white-label sign-in surface.

  A tenant supplies one primary colour; the three aurora washes are derived from it
  (hue +38° and −42°), so no two tenants land on the same background and nobody has
  to pick a gradient. The accent is lifted until it reads AA against its own card,
  because tenants will pick colours that vanish on their own surface.

  Also exports `AuroraBackground` for reuse on other white-label pages,
  `useAuroraPalette()` for children that need the derived values in JS (an inline
  SVG wordmark, for example), and `deriveAuroraPalette()` for branding previews.
  The panel publishes the palette as `--aurora-*` CSS custom properties, so form
  controls inside it can be tenant-tinted without prop drilling.

## 1.8.1

### Patch Changes

- Republish with resolved sibling versions.

  The 1.8.0 artifact on the public npm registry shipped `@tesserix/hooks`,
  `@tesserix/tokens` and `@tesserix/utils` as `workspace:*`, a pnpm-only
  specifier that npm's resolver cannot handle — `npm install @tesserix/web@1.8.0`
  fails, and it fails silently, with no error on stdout, stderr or the debug log.

  Cause: 1.8.0 was published to npm with `npm publish`, which ships package.json
  verbatim. `pnpm publish` / `changeset publish` rewrite the workspace protocol
  to concrete versions at pack time, which is why the GitHub Packages copy of
  1.8.0 and every earlier release are unaffected.

  No source or component changes — `workspace:*` remains correct in the monorepo.
  Publish this and every future release through pnpm, never bare `npm publish`.

## 1.8.0

### Minor Changes

- f66f409: Add `AppStoreBadges` — a configurable App Store / Google Play download badge row.

  Ships the layout rules both stores impose (equal visual weight, clear space,
  40px minimum, App Store placed first, meaningful alt text) but deliberately
  ships **no badge artwork**: neither Apple nor Google grants the right to
  redistribute their badges, so each app self-hosts the official asset and passes
  the path via `artworkSrc`.

  Badges render per-platform only when a URL is configured, so a platform can be
  switched on without touching consuming surfaces. `placeholder="coming-soon"`
  opts into an inert pre-launch plate that carries no store trademark artwork.

## 1.7.1

### Patch Changes

- 86b25c1: fix: add Tailwind v4 source registration for component class detection

  Tailwind v4 excludes node_modules from content scanning by default, causing component styles (e.g., sidebar) to be missing in consuming apps. Added `tailwind-source.css` export so apps can use `@import "@tesserix/web/tailwind-source"` to register component files.

## 1.7.0

### Minor Changes

- 01f6198: Rewrite form and interactive components to use Radix UI primitives: checkbox, radio-group, switch, progress, slider, dropdown-menu. Add size prop to SelectTrigger. Add full dropdown-menu sub-component set (Portal, Group, CheckboxItem, RadioGroup, RadioItem, Sub, SubTrigger, SubContent).

## 1.6.0

### Minor Changes

- 3718844: Add loading state, validation UI, floating input, skeleton variants, and improved badge/card/dialog

  Button:

  - Added isLoading and loadingText props with spinner and aria-busy
  - Fixed icon-sm size from h-10 to h-8

  Input:

  - Added isValid/isInvalid props with check/alert icons
  - Added helperText/errorText with aria-describedby accessibility
  - Bare input returned when no validation props (backward compatible)
  - New FloatingInput component with animated floating label

  Badge:

  - Added asChild prop with Radix Slot support
  - Changed base element from div to span
  - Added icon support with svg sizing and gap

  Skeleton:

  - New SkeletonShimmer with gradient animation
  - New TextSkeleton with configurable lines and last-line width
  - New AvatarSkeleton with sm/md/lg sizes
  - New ButtonSkeleton with sm/md/lg sizes
  - New TableRowSkeleton with configurable columns

  Card:

  - Added container queries on CardHeader for responsive action layout
  - Added data-slot attributes on all sub-components

  Dialog:

  - Added showCloseButton prop on DialogContent

## 1.5.0

### Minor Changes

- fc1ed61: Add marketplace-admin components and enhance existing ones

  New components:

  - CircularProgress: SVG-based circular progress indicator
  - StatusBadge: Status badge with domain-specific mappings (order, payment, user, product, etc.)
  - TableSkeleton (alias for DataTableSkeleton), CardGridSkeleton, ListSkeleton, DashboardSkeleton, FormSkeleton: Skeleton loaders
  - DataTableSkeleton: Added columns prop
  - ResponsiveTable: Desktop table / mobile card responsive layout
  - ComponentErrorBoundary, WidgetErrorBoundary, ChartErrorBoundary: Error boundary wrappers
  - PhoneInput: Country code selector with auto-detection
  - AlertDialog: Typed alert/confirm dialogs (success/error/warning/info/confirm)
  - AuthLayoutCentered, AuthLayoutBackground, AuthCardCentered, AuthCardFooter: Centered auth layout
  - TenantSwitcher: Generic workspace/org/tenant switcher with search, grouping, defaults
  - SidebarSearch: Fuzzy search for sidebar navigation items with keyboard nav and highlighting

  Enhanced components:

  - Slider: Upgraded to multi-thumb with value:number[] / onValueChange API
  - ErrorState: Added 8 error types, suggestions, technical details, copy-to-clipboard
  - Button: Added gradient, success, warning variants and icon-sm, icon-lg sizes
  - Badge: Added error, neutral variants with semantic tokens
  - Alert: Added error variant with semantic tokens
  - Card: Added CardAction component
  - Checkbox: Added label, description, onCheckedChange props
  - Switch: Added onCheckedChange prop
  - Collapsible: Added asChild support to CollapsibleTrigger
  - UserMenu: Added icon, variant (destructive), and separator support to actions

## 1.4.0

### Minor Changes

- 6f91c55: Enhance Combobox with description, icon, searchTerms, error, loading, and renderOption support. Add unit tests (20 cases) and comprehensive documentation.

## 1.3.0

### Minor Changes

- Add new components and improve existing ones

  - Add ConfirmDialog, ErrorState, CountUp, AnimateOnScroll components
  - Add reusable two-rail sidebar variation
  - Upgrade Badge, Avatar, Select, Tooltip to Radix primitives
  - Add asChild and align props to DropdownMenu
  - Switch to unbundled build for tree-shaking support
  - Simplify button variants and sizes
  - Fix overlay-layering test for Radix v1.2+
