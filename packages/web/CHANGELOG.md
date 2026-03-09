# @tesserix/web

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
