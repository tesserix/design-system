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

/**
 * Why an unprobed endpoint is unprobed, as data rather than as a fact
 * re-derived from `method`.
 *
 * `"changes-state"` — probing would mutate real state (a write, or an
 * operation with no read/write distinction the suite can rely on).
 * `"read-side-effect"` — probing is a GET, so the request changes nothing,
 * but making the request is itself the unacceptable act (here: a PII lookup
 * against live data).
 *
 * This is NOT a function of `method`. It happens that today's two
 * `"changes-state"` ids are POSTs and the one `"read-side-effect"` id is a
 * GET, but that is coincidence, not law: a future unprobed GET could exist
 * *because* it fires a side effect (an email, a webhook, a billing event) —
 * `"changes-state"` in every sense an operator cares about, despite the verb.
 * Re-deriving this from `endpoint.method` would describe that endpoint to an
 * on-call engineer as a harmless read "even though nothing changes," which
 * is false and reassuring in exactly the wrong direction. Every endpoint with
 * `probe: false` names its reason explicitly, here, instead.
 */
export type UnprobedReason = "changes-state" | "read-side-effect"

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
    unprobedReason: "changes-state",
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
  /**
   * §9.1 — the transactional outbox's undelivered and failed rows.
   *
   * `SlugsImplementing`, never `Slugs`: a product without an outbox has no
   * outbox, and that is not a 501 worth rendering in the console.
   */
  outbox: {
    id: "outbox",
    method: "GET",
    path: "/admin/outbox",
    section: "9.1",
    envelope: "data-pagination",
    summary: "Undelivered and failed outbox rows (contract v3).",
  },
  "email-sends": {
    id: "email-sends",
    method: "GET",
    path: "/admin/email-sends",
    section: "9.2",
    envelope: "data-pagination",
    summary: "Transactional email delivery log (contract v3).",
  },
  /**
   * §9.3 — the product's own notification log.
   *
   * NOT the console's notification bell, which is derived from ticket rows
   * and has no table behind it. Two different things with one word; see the
   * design's §1.1 before wiring either into the other.
   */
  notifications: {
    id: "notifications",
    method: "GET",
    path: "/admin/notifications",
    section: "9.3",
    envelope: "data-pagination",
    summary: "Product-owned notification log (contract v3).",
  },
  /**
   * §9.4 — the emergency-account inventory.
   *
   * The first READ in the estate gated on an exact capability VALUE
   * (`rotate-credentials`). A run that does not send one gets a 403 — the
   * endpoint working correctly, reported as a failure — so the caller must
   * pass `--capability rotate-credentials`. Probed, but only usefully so
   * once the signing identity holds that capability.
   */
  "break-glass": {
    id: "break-glass",
    method: "GET",
    path: "/admin/break-glass",
    section: "9.4",
    envelope: "data-pagination",
    summary: "Emergency-account inventory; requires the rotate-credentials capability (contract v3).",
  },
  /**
   * §9.5 — did this lead become a live account.
   *
   * `probe: false`, and not because it writes. It requires `?email=`, and
   * every value the suite could send is either a real person's address —
   * making the nightly run a scheduled PII lookup — or a synthetic one that
   * exercises only the `state: "none"` branch and asserts nothing. Declared,
   * never called.
   *
   * `free` rather than a §4.1 envelope: the body is a bare
   * `{ state, ref?, label?, idle_hours?, observed_at }`, which is neither a
   * page nor a flat map of scalars.
   */
  conversions: {
    id: "conversions",
    method: "GET",
    path: "/admin/conversions",
    section: "9.5",
    envelope: "free",
    probe: false,
    unprobedReason: "read-side-effect",
    summary: "Lead-to-account conversion state, by email; declared only, never invoked by the suite.",
  },
  "onboarding/funnel": {
    id: "onboarding/funnel",
    method: "GET",
    path: "/admin/onboarding/funnel",
    section: "9.6",
    envelope: "data-flat-map",
    summary: "Onboarding funnel counts as a flat map of scalars (contract v3).",
  },
  "onboarding/sessions": {
    id: "onboarding/sessions",
    method: "GET",
    path: "/admin/onboarding/sessions",
    section: "9.6",
    envelope: "data-pagination",
    summary: "Individual onboarding sessions behind the funnel (contract v3).",
  },
  /**
   * §9.7 — irreversible tenant erasure.
   *
   * `probe: false` for `tenant-lifecycle`'s reason, only stronger: suspending
   * a real tenant to check an envelope is worse than no check, and purging
   * one is unrecoverable. There is no sandbox tenant to point the suite at.
   *
   * `GET /admin/tenants/{id}/purge/preview` is deliberately NOT a separate
   * id. It is the read half of one operation and is meaningless without the
   * write; splitting them would let a product declare a preview it cannot
   * execute.
   */
  "tenant-purge": {
    id: "tenant-purge",
    method: "POST",
    path: "/admin/tenants/{id}/purge",
    section: "9.7",
    envelope: "free",
    probe: false,
    unprobedReason: "changes-state",
    summary: "Irreversible tenant erasure; declared only, never invoked by the suite.",
  },
} as const

export type EndpointId = keyof typeof ENDPOINTS
export type Endpoint = (typeof ENDPOINTS)[EndpointId]
export type EnvelopeKind = Endpoint["envelope"]

/**
 * Compile-time guarantee that every `probe: false` entry above carries an
 * `unprobedReason`. Not a lint rule and not a runtime check — `as const` on
 * `ENDPOINTS` makes each entry's exact literal type available here, so a
 * future entry that sets `probe: false` without also setting
 * `unprobedReason` fails the build on this line rather than surfacing later
 * as a `runner.ts` string bug or, worse, not surfacing at all.
 */
type _UnprobedEntriesHaveAReason = {
  [K in EndpointId]: (typeof ENDPOINTS)[K] extends { probe: false }
    ? (typeof ENDPOINTS)[K] extends { unprobedReason: UnprobedReason }
      ? true
      : false
    : true
}[EndpointId] extends true
  ? true
  : never
// Unused by design: its only job is to fail to compile if the mapped type
// above ever resolves to `never`.
const _unprobedEntriesHaveAReason: _UnprobedEntriesHaveAReason = true

export const ENDPOINT_IDS = Object.keys(ENDPOINTS) as EndpointId[]

export function isEndpointId(value: string): value is EndpointId {
  return Object.prototype.hasOwnProperty.call(ENDPOINTS, value)
}

/**
 * Whether the suite may call this endpoint over the wire.
 *
 * Three ids answer `false` — `tenant-lifecycle`, `conversions`, `tenant-purge`
 * — for two distinct reasons, not one caution applied three times. Each such
 * entry names its own reason via `unprobedReason`; see that type's doc
 * comment for why it is data on the endpoint rather than something derived
 * from `method` at read time.
 *
 * An unprobed endpoint is still reported, as a skip naming why. Silently
 * omitting it would make a declared endpoint indistinguishable from an
 * undeclared one in the report.
 */
export function isProbed(id: EndpointId): boolean {
  const endpoint = ENDPOINTS[id]
  return !("probe" in endpoint) || endpoint.probe !== false
}

/**
 * Why this endpoint is unprobed. Throws if it is not — callers must check
 * `isProbed` first, the same discipline `requiresSubtypes` callers already
 * follow for `entities`.
 *
 * An accessor rather than a property read for the reason `requiresSubtypes`
 * is one: `unprobedReason` exists only on the union members that declared
 * `probe: false`, so `endpoint.unprobedReason` does not type-check on the
 * general `Endpoint` union.
 */
export function getUnprobedReason(id: EndpointId): UnprobedReason {
  const endpoint = ENDPOINTS[id]
  if ("unprobedReason" in endpoint) return endpoint.unprobedReason
  throw new Error(`${id} is probed; it has no unprobedReason. Check isProbed first.`)
}

/**
 * Whether this endpoint's path is incomplete without a subtype.
 *
 * Only `entities` answers true: `/admin/entities/{type}` has no URL until the
 * declaration supplies a `{type}`. That makes it the one endpoint whose
 * ABSENCE from a declaration cannot be tested — there is nothing to ask for —
 * which is why `checkUndeclared` skips it explicitly rather than silently
 * getting a 404 for a path it made up.
 *
 * An accessor rather than a property read, for the same reason `isProbed` is
 * one: the field exists on a single member of the union, so reading it
 * directly does not type-check.
 */
export function requiresSubtypes(id: EndpointId): boolean {
  const endpoint = ENDPOINTS[id]
  return "requiresSubtypes" in endpoint && endpoint.requiresSubtypes === true
}
