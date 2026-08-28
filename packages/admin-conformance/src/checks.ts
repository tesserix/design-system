import { type Finding, fail, pass, skip } from "./finding"

/**
 * Endpoint-specific checks from contract §3.
 *
 * Separate from `assertions/`, which enforces the §4 conventions every
 * endpoint shares. These are the per-endpoint rules, and each exists because
 * of a specific production failure named in the contract — the comments record
 * which, so a future reader can tell a real rule from a stylistic preference.
 */

export interface Response {
  readonly status: number
  readonly body?: unknown
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const isScalar = (value: unknown): boolean =>
  value === null ||
  typeof value === "number" ||
  typeof value === "string" ||
  typeof value === "boolean"

/**
 * The one failure `501` exists to prevent. The reasoning is worth repeating in
 * full in the detail: this is read in a red CI log, and "answer 501" without
 * the why reads as a pedantic status-code preference rather than the only way
 * the console can tell "no metrics yet" from "every metric is zero".
 */
const emptyMetrics = (endpoint: string, section: string, seen: string): Finding =>
  fail(
    endpoint,
    section,
    "does not return an empty map of metrics",
    `returned 200 with ${seen}. A product with no metrics must answer 501 not_implemented ` +
      'so the console can render "not instrumented" rather than dashes that look like zeroes.',
  )

/** Phrased as a statement of fact, so a passing line reads as one. */
const CHECK_KPI_SHAPE = "returns a flat map of metrics under data"

/**
 * §3.1 — `GET /admin/kpis` returns a flat map of scalars under `data`, and an
 * uninstrumented product answers `501`, never `200` with an empty map.
 *
 * The old shared route branched on three products and fell through to an empty
 * object, which is why dwellm8 rendered four em-dashes from launch. The
 * console cannot tell an empty map from real zeroes, so the distinction has to
 * be carried by the status code.
 *
 * The wrapper is the 2026-08-26 amendment: §3.1 used to specify a bare map at
 * the top level, which made the one singleton endpoint the only place a client
 * could not just read `.data`. It now matches §4.1's `{ data, pagination }`,
 * and the bare shape it used to require is the deviation.
 */
export function checkKpis(response: Response): Finding[] {
  const section = "3.1"
  const endpoint = "kpis"

  if (response.status === 501) {
    return [pass(endpoint, section, "answers 501 when uninstrumented")]
  }

  if (!isRecord(response.body)) {
    return [
      fail(
        endpoint,
        section,
        CHECK_KPI_SHAPE,
        `expected a JSON object with a data map of scalar metrics, got ${describe(response.body)}`,
      ),
    ]
  }

  const body = response.body

  // `{}` is checked before the envelope, because it is the dwellm8 failure
  // rather than a wrapping mistake: there are no metrics either way, and
  // telling someone to wrap an empty map in `data` would send them to fix the
  // wrong thing. Both spellings of "no metrics" get the same answer below.
  if (Object.keys(body).length === 0) {
    return [emptyMetrics(endpoint, section, "{}")]
  }

  // The pre-amendment shape, named rather than reported as a generic error.
  //
  // Until 2026-08-26 §3.1 specified exactly this: a bare map of scalars at the
  // top level. The amendment wrapped it in `data` so that every contract
  // endpoint answers under the same key, and a product still serving the bare
  // map is now the deviation. Saying so explicitly is the whole point — the
  // metrics are fine, and someone reading a red line that only complained
  // about a missing key would go looking for a bug that is not there.
  if (!("data" in body)) {
    const bare = Object.values(body).every(isScalar)
    return [
      fail(
        endpoint,
        section,
        CHECK_KPI_SHAPE,
        (bare
          ? "returned a bare flat map of metrics at the top level. "
          : "returned an object with no data key. ") +
          "§3.1 was amended to the wrapped shape, matching §4.1's data envelope, so that a " +
          'console reading `.data` needs no special case for this endpoint: wrap the map as ' +
          '{ "data": { ... } }.',
      ),
    ]
  }

  const metrics = body.data
  if (!isRecord(metrics)) {
    return [
      fail(
        endpoint,
        section,
        CHECK_KPI_SHAPE,
        `data is ${describe(metrics)}; §3.1 requires data to be an object whose values are scalar metrics.`,
      ),
    ]
  }

  const keys = Object.keys(metrics)
  if (keys.length === 0) {
    return [emptyMetrics(endpoint, section, '{ "data": {} }')]
  }

  const nested = keys.filter((key) => !isScalar(metrics[key]))
  if (nested.length > 0) {
    return [
      fail(
        endpoint,
        section,
        CHECK_KPI_SHAPE,
        `these keys under data are not scalars: ${nested.join(", ")}. The console renders label ` +
          "and format from the registry, which cannot descend into nested objects.",
      ),
    ]
  }

  return [pass(endpoint, section, CHECK_KPI_SHAPE)]
}

export interface InboxOptions {
  /**
   * Whether the product declared an SLA on this queue. `due_at` is required
   * only where one exists — the contract names devai's one-hour approval
   * gates and mark8ly's five-business-day SEA review as the two that have one.
   */
  readonly slaDeclared?: boolean
  /**
   * The item kinds that carry an SLA, for a queue that is not uniform. When
   * present, `due_at` is required of an item only when its `kind` is listed;
   * every other kind is free to omit it.
   *
   * Mutually exclusive with `slaDeclared`, which the declaration parser
   * enforces. This exists because SLA reality is per kind: mark8ly merges five
   * kinds and only `sea_manual_review` has a deadline, while
   * `erasure_request` deliberately has none.
   */
  readonly slaKinds?: readonly string[]
}

/** Where every inbox finding is reported. Shared so the two helpers agree. */
const INBOX_ENDPOINT = "inbox"
const INBOX_SECTION = "3.2"

/** Fields every inbox item carries, per the §3.2 example. */
const REQUIRED_ITEM_FIELDS = ["id", "kind", "title", "waiting_since"] as const

/**
 * §3.2 — the load-bearing endpoint. One shape across products is what lets the
 * console's front door work without knowing that HomeChef calls them
 * "approvals", mark8ly "onboarding sessions" and devai "approval gates".
 */
export function checkInboxItems(body: unknown, options: InboxOptions): Finding[] {
  const section = "3.2"
  const endpoint = "inbox"

  if (!isRecord(body) || !Array.isArray(body.items)) {
    return [
      fail(
        endpoint,
        section,
        "returns { items, total }",
        `expected an object with an items array, got ${describe(body)}`,
      ),
    ]
  }

  const items = body.items
  if (items.length === 0) {
    // An empty queue is the healthy state, not a gap. Reporting it as
    // anything but a pass would train people to ignore this endpoint.
    return [pass(endpoint, section, "returns { items, total } (queue is empty)")]
  }

  const findings: Finding[] = []

  for (const field of REQUIRED_ITEM_FIELDS) {
    const missing = items.filter((item) => !isRecord(item) || item[field] === undefined)
    if (missing.length > 0) {
      findings.push(
        fail(
          endpoint,
          section,
          `every item carries ${field}`,
          `${missing.length} of ${items.length} items omit ${field}. ` +
            (field === "waiting_since"
              ? "waiting_since is what makes the queue sortable across products; " +
                "an item without it is invisible to the only question the inbox asks."
              : "It is required by the §3.2 shape."),
        ),
      )
    } else {
      findings.push(pass(endpoint, section, `every item carries ${field}`))
    }
  }

  findings.push(...checkDueAt(items, options))

  return findings
}

/** True when an item carries no usable `due_at`. `null` is not a value here. */
const omitsDueAt = (item: unknown): boolean =>
  !isRecord(item) || item.due_at === undefined || item.due_at === null

/**
 * §3.2's `due_at`, against whichever SLA shape the product declared.
 *
 * Three declarations, three different questions:
 *
 *   - `slaKinds` — a queue where only some kinds are time-bound. Checked per
 *     kind, because a product forced to choose one boolean for a mixed queue
 *     must either fabricate a deadline it has refused to model or understate
 *     a real one.
 *   - `slaDeclared` — a uniform queue. Every item owes a `due_at`.
 *   - neither — no SLA anywhere, so `due_at` is optional and this is a skip.
 */
function checkDueAt(items: readonly unknown[], options: InboxOptions): Finding[] {
  const check = "every item carries due_at"

  if (options.slaKinds && options.slaKinds.length > 0) {
    const declared = new Set(options.slaKinds)
    const bearing = items.filter((item) => isRecord(item) && declared.has(String(item.kind)))

    // A declared kind that did not appear on this page demonstrated nothing
    // about whether the product carries its due_at. `pass` would claim
    // coverage the run does not have — the same rule §8.9's row assertion
    // follows for a page with no rows.
    if (bearing.length === 0) {
      return [
        skip(
          INBOX_ENDPOINT,
          INBOX_SECTION,
          check,
          `no item of a declared SLA kind (${options.slaKinds.join(", ")}) appeared on ` +
            "this page, so nothing about due_at was exercised",
        ),
      ]
    }

    const missing = bearing.filter(omitsDueAt)
    return [
      missing.length > 0
        ? fail(
            INBOX_ENDPOINT,
            INBOX_SECTION,
            check,
            `${missing.length} of ${bearing.length} items whose kind carries an SLA omit ` +
              "due_at. A declared SLA that nothing surfaces is the gap §3.2 exists to close. " +
              `Items of other kinds are not checked: declared SLA kinds are ${options.slaKinds.join(", ")}.`,
          )
        : pass(INBOX_ENDPOINT, INBOX_SECTION, check),
    ]
  }

  if (options.slaDeclared) {
    const missing = items.filter(omitsDueAt)
    return [
      missing.length > 0
        ? fail(
            INBOX_ENDPOINT,
            INBOX_SECTION,
            check,
            `${missing.length} of ${items.length} items omit due_at, and this product ` +
              "declares an SLA on this queue. A declared SLA that nothing surfaces is the " +
              "gap §3.2 exists to close. If only some kinds are time-bound, declare " +
              "slaKinds instead of slaDeclared.",
          )
        : pass(INBOX_ENDPOINT, INBOX_SECTION, check),
    ]
  }

  return [
    skip(INBOX_ENDPOINT, INBOX_SECTION, check, "no SLA declared for this queue, so due_at is optional"),
  ]
}


/** Keys a row might use to name the product it came from. */
const PRODUCT_FIELDS = ["product", "source", "slug", "product_slug"] as const

/**
 * §3.3 — `/admin/audit-logs` must be scoped to the calling product.
 *
 * The rule exists because the existing shared route validated its `:product`
 * parameter and then queried mark8ly's table regardless, so every other
 * product's overview displayed mark8ly's critical-event count. A route that
 * ignores its own scope parameter is worse than no route.
 *
 * The honest limit: §3.3's rows are bare — the platform API namespaces them as
 * `<slug>:<id>` on arrival, so a conforming row usually carries no product
 * field at all. When there is nothing to compare against, this reports a SKIP
 * rather than a pass. A green tick here would assert something the suite
 * cannot see from outside the product, which is the exact failure mode
 * conformance is supposed to remove.
 */
export function checkAuditLogScoping(body: unknown, slug: string): Finding[] {
  const section = "3.3"
  const endpoint = "audit-logs"
  const check = "rows are scoped to the calling product"

  const rows = isRecord(body) && Array.isArray(body.data) ? body.data : []
  if (rows.length === 0) {
    return [
      skip(
        endpoint,
        section,
        check,
        "no rows returned, which proves nothing either way",
      ),
    ]
  }

  const foreign = new Set<string>()
  let attributed = 0
  for (const row of rows) {
    if (!isRecord(row)) continue
    for (const field of PRODUCT_FIELDS) {
      const value = row[field]
      if (typeof value !== "string" || value === "") continue
      attributed += 1
      if (value !== slug) foreign.add(value)
      break
    }
  }

  if (attributed === 0) {
    return [
      skip(
        endpoint,
        section,
        check,
        `cannot be verified from outside: none of the ${rows.length} rows carry a ` +
          `product field (${PRODUCT_FIELDS.join(", ")}). §3.3 rows are bare by design, ` +
          "so this check reports a skip rather than a pass it cannot justify.",
      ),
    ]
  }

  if (foreign.size > 0) {
    return [
      fail(
        endpoint,
        section,
        check,
        `rows attributed to other products: ${[...foreign].sort().join(", ")}. ` +
          `This endpoint was called as "${slug}" and must return only its own rows.`,
      ),
    ]
  }

  return [pass(endpoint, section, check)]
}

function describe(value: unknown): string {
  if (value === undefined) return "no body"
  if (value === null) return "null"
  if (Array.isArray(value)) return "an array"
  return typeof value
}
