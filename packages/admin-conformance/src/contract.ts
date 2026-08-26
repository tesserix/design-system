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
    /**
     * A flat map of scalars wrapped in `data` (amended 2026-08-26). §3.1
     * originally specified a bare map at the top level; every other endpoint
     * already answers with a `data` envelope, so the singleton was the odd one
     * out and a generic client could not simply read `.data`. mark8ly, the only
     * implementer, already returned the wrapped shape.
     */
    envelope: "data-flat-map",
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
  /**
   * §8.3's tenant lifecycle writes, declared but never called.
   *
   * `probe: false` is not an oversight: a conformance run that suspended a
   * real tenant to see whether the endpoint conforms would be worse than no
   * check at all, and there is no sandbox tenant the suite could be pointed
   * at. So this id carries no wire check whatsoever.
   *
   * It exists for one reason — to be the antecedent of a rule. §8.3 requires
   * reason codes on these writes, §8.8 requires them to be *fetchable*, and
   * without a declarable id for the writes there is nothing for that
   * requirement to attach to. See `declaration-rules.ts`.
   */
  "tenant-lifecycle": {
    id: "tenant-lifecycle",
    method: "POST",
    path: "/admin/tenants/{id}/suspend",
    section: "8.3",
    envelope: "free",
    probe: false,
    summary: "Tenant suspend/unsuspend writes; declared only, never invoked by the suite.",
  },
  /**
   * §8.8 — the vocabulary a product's lifecycle writes accept.
   *
   * `free` rather than a §4.1 envelope: the body is `{ data: { suspend, unsuspend } }`,
   * which is neither a page nor a flat map of scalars. Its shape is fixed by
   * §8.8 and checked by `checkReasonCodes`, so §4.1 correctly reports a skip
   * rather than asserting an envelope the contract does not require here.
   */
  "lifecycle/reason-codes": {
    id: "lifecycle/reason-codes",
    method: "GET",
    path: "/admin/lifecycle/reason-codes",
    section: "8.8",
    envelope: "free",
    summary: "The reason codes this product's lifecycle writes accept (contract v2).",
  },
} as const

export type EndpointId = keyof typeof ENDPOINTS
export type Endpoint = (typeof ENDPOINTS)[EndpointId]
export type EnvelopeKind = Endpoint["envelope"]

export const ENDPOINT_IDS = Object.keys(ENDPOINTS) as EndpointId[]

export function isEndpointId(value: string): value is EndpointId {
  return Object.prototype.hasOwnProperty.call(ENDPOINTS, value)
}

/**
 * Whether the suite may call this endpoint over the wire.
 *
 * Only §8.3's tenant-lifecycle writes answer `false`, and the reason is not
 * caution — it is that the check would be the deviation. Every other endpoint
 * in this registry is a GET whose worst outcome is a wasted request; suspending
 * a live merchant's tenant to confirm the route conforms is not a check anyone
 * would run twice.
 *
 * An unprobed endpoint is still reported, as a skip naming why. Silently
 * omitting it would make a declared endpoint indistinguishable from an
 * undeclared one in the report.
 */
export function isProbed(id: EndpointId): boolean {
  const endpoint = ENDPOINTS[id]
  return !("probe" in endpoint) || endpoint.probe !== false
}
