/**
 * The Product Admin Integration Contract, as data.
 *
 * Source: `tesserix-home/docs/superpowers/specs/2026-08-14-product-admin-integration-contract.md`
 * (v2, amended 2026-08-22). Where this file and that document disagree, the
 * document is right and this file is a bug.
 *
 * Endpoint ids are the strings a product writes in its `admin-conformance.json`.
 * They are stable: renaming one silently turns a product's declaration into
 * "not implemented", which reports as a pass. Add, never rename.
 */

export const ENDPOINTS = {
  kpis: {
    id: "kpis",
    method: "GET",
    path: "/admin/kpis",
    section: "3.1",
    /** A flat map, not the pagination envelope. */
    envelope: "flat-map",
    summary: "Headline business metrics; 501 when uninstrumented, never {}.",
  },
  inbox: {
    id: "inbox",
    method: "GET",
    path: "/admin/inbox",
    section: "3.2",
    envelope: "items-total",
    summary: "Everything waiting on a human, in one shape across products.",
  },
  "audit-logs": {
    id: "audit-logs",
    method: "GET",
    path: "/admin/audit-logs",
    section: "3.3",
    envelope: "data-pagination",
    summary: "Audit trail, scoped to the calling product.",
  },
  entities: {
    id: "entities",
    method: "GET",
    path: "/admin/entities",
    section: "3.4",
    envelope: "data-pagination",
    /**
     * The only endpoint whose path is incomplete on its own: `{type}` is
     * product-defined, so a declaration supplies the types it serves.
     */
    requiresSubtypes: true,
    summary: "Searchable records for the Directory and the command palette.",
  },
  health: {
    id: "health",
    method: "GET",
    path: "/admin/health",
    section: "3.5",
    envelope: "free",
    summary: "Self-reported dependency health.",
  },
  "billing/subscriptions": {
    id: "billing/subscriptions",
    method: "GET",
    path: "/admin/billing/subscriptions",
    section: "8.2",
    envelope: "data-pagination",
    summary: "Cross-tenant subscriptions (contract v2).",
  },
  "billing/trials": {
    id: "billing/trials",
    method: "GET",
    path: "/admin/billing/trials",
    section: "8.2",
    envelope: "data-pagination",
    summary: "Expiring trials with dunning state (contract v2).",
  },
} as const

export type EndpointId = keyof typeof ENDPOINTS
export type Endpoint = (typeof ENDPOINTS)[EndpointId]
export type EnvelopeKind = Endpoint["envelope"]

export const ENDPOINT_IDS = Object.keys(ENDPOINTS) as EndpointId[]

export function isEndpointId(value: string): value is EndpointId {
  return Object.prototype.hasOwnProperty.call(ENDPOINTS, value)
}
