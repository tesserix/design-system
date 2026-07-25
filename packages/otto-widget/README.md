# @tesserix/otto-widget

Reusable React 19 components for the Otto support-chat module. Ships with
scoped CSS so it drops into any host app without style bleed.

## Exports

```ts
import {
  OttoWidget,      // Customer-facing floating chat launcher + panel
  OttoInbox,       // Staff-side two-pane inbox (list + thread)
  useOttoChannel,  // Low-level WebSocket hook if you need to build your own UI
  buildOttoApi,    // REST client factory
} from "@tesserix/otto-widget";

// Styles (import once per host app)
import "@tesserix/otto-widget/styles/otto.css";   // widget
import "@tesserix/otto-widget/styles/inbox.css";  // inbox
```

## Host-app contract

Both components call REST through a base URL you provide and open a
WebSocket whose URL you build via a callback. This keeps the components
transport-agnostic: the host owns its own proxy layer.

```tsx
// Storefront — single-tenant, anonymous-friendly
<OttoWidget
  apiBaseUrl="/api/otto"
  buildWsUrl={(id) =>
    `${wsProto()}://${location.host}/api/v1/storefront/otto/conversations/${id}/ws`
  }
/>

// Admin inbox — staff-authenticated
<OttoInbox
  apiBaseUrl="/api/admin/otto"
  buildInboxWsUrl={() => `${wsProto()}://${location.host}/api/v1/admin/otto/ws`}
  buildConversationWsUrl={(id) =>
    `${wsProto()}://${location.host}/api/v1/admin/otto/conversations/${id}/ws`
  }
  currentUserId={staffUserId}
/>
```

The host is responsible for wiring its `/api/otto/*` and
`/api/admin/otto/*` routes to the backend Otto service with the right
tenant/store headers. The package ships no assumptions about auth.

## Per-product props (v0.3.0)

Three props differ per product:

| Prop | Purpose |
|---|---|
| `tenantId` | Forwarded as `X-Tenant-ID` on every Otto REST call. Picks the per-product SLM, MCP server, reason whitelist, and RAG namespace on the backend. Required for any non-marketplace product. |
| `reasons` | Per-product intake-reason list. Each option may set `requiresDob` (account/order lookup) and/or `requiresStatus: false` (quick-ask — hides the "current status / one-line summary" field). Always put a `general_question` option at the top so a customer can fire a one-liner without filling the status field. |
| `statusPlaceholder` | Domain-shaped example text for the status field. Defaults to a marketplace example (`Order #2041 arrived damaged`) — every non-marketplace product MUST override this. |

```tsx
const FANZONE_REASONS: readonly ReasonOption[] = [
  { value: "general_question", label: "Ask a quick question", requiresStatus: false },
  { value: "points_question", label: "Points or leaderboard question" },
  // …
];

<OttoWidget
  apiBaseUrl="/api/otto"
  tenantId="fanzone"
  reasons={FANZONE_REASONS}
  statusPlaceholder="e.g. Points not updating after IPL #2042"
/>
```

## Platform mode (v0.6.0)

`OttoInbox` has an opt-in **platform mode** for a cross-tenant inbox (the
Tesserix platform console in tesserix-home admin, which sees conversations
across every product). Pass `tenantLabels` — a map of tenant id → friendly
product name — and the presence of that prop switches the mode on:

```tsx
<OttoInbox
  apiBaseUrl="/api/admin/otto"        // point at the PLATFORM proxy
  buildInboxWsUrl={() => `${wsProto()}://${location.host}/api/v1/admin/otto/ws`}
  buildConversationWsUrl={(id) =>
    `${wsProto()}://${location.host}/api/v1/admin/otto/conversations/${id}/ws`
  }
  currentUserId={staffUserId}
  tenantLabels={{
    homechef: "HomeChef",
    fanzone: "FanZone",
    stockpilot: "StockPilot",
  }}
/>
```

In platform mode:

- **Product badge** on every conversation row and in the thread header
  (friendly label, falling back to the raw tenant id for any tenant not in
  `tenantLabels`).
- **Tenant filter** chips derived from the tenant ids present in the fetched
  list (no extra endpoint). Selecting one filters the rows client-side; it
  composes with the Pending / Active / Closed tabs.

Omit `tenantLabels` and the inbox behaves exactly as before — single tenant,
no badges, no filter. An empty object (`tenantLabels={{}}`) still enables the
mode; every badge then shows the raw tenant id.

The widget never hardcodes either surface: the same component renders the
per-tenant admin inbox and the platform inbox. The only difference is the
`apiBaseUrl` (which proxy the host points at) and whether `tenantLabels` is
passed. Conversations already carry `tenant_id` on the wire, so no backend
change is required.

## Theming

Both components expose a handful of CSS custom properties (prefixed
`--otto-*`) and the widget accepts an optional `theme` prop for the three
most common overrides (primary, primaryFg, accent). The defaults follow a
restrained neutral aesthetic that works against most brand palettes.
