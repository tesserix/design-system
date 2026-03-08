---
"@tesserix/web": minor
---

Add marketplace-admin components and enhance existing ones

New components:
- CircularProgress: SVG-based circular progress indicator
- StatusBadge: Status badge with domain-specific mappings (order, payment, user, product, etc.)
- TableSkeleton, CardGridSkeleton, ListSkeleton, DashboardSkeleton, FormSkeleton: Skeleton loaders
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
