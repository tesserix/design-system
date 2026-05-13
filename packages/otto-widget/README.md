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

## Theming

Both components expose a handful of CSS custom properties (prefixed
`--otto-*`) and the widget accepts an optional `theme` prop for the three
most common overrides (primary, primaryFg, accent). The defaults follow a
restrained neutral aesthetic that works against most brand palettes.
