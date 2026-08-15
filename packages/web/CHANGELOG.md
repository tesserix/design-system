# @tesserix/web

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
