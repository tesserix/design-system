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
 * §3.1 — `GET /admin/kpis` returns a flat map of scalars, and an
 * uninstrumented product answers `501`, never `200 {}`.
 *
 * The old shared route branched on three products and fell through to an empty
 * object, which is why dwellm8 rendered four em-dashes from launch. The
 * console cannot tell `{}` from real zeroes, so the distinction has to be
 * carried by the status code.
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
        "returns a flat map of metrics",
        `expected a JSON object of scalar metrics, got ${describe(response.body)}`,
      ),
    ]
  }

  const keys = Object.keys(response.body)
  if (keys.length === 0) {
    return [
      fail(
        endpoint,
        section,
        "does not return an empty object",
        "returned 200 with {}. A product with no metrics must answer 501 not_implemented " +
          "so the console can render \"not instrumented\" rather than dashes that look like zeroes.",
      ),
    ]
  }

  // A known, specific conflict rather than a generic shape error.
  //
  // §3.1 and §8.2 both describe /admin/kpis as a FLAT map, while §4.1's
  // { data, pagination } envelope covers lists. mark8ly generalised `data` to
  // singletons too, so its KPI endpoint answers { "data": { ... } } — which is
  // arguably the better design, being uniform, but is not what the contract
  // says. Reporting that as "key `data` is not a scalar" would send someone
  // looking for a bug in their metrics. Naming the conflict instead makes it
  // a decision: amend the contract, or unwrap the response.
  if (keys.length === 1 && keys[0] === "data" && isRecord(response.body.data)) {
    return [
      fail(
        endpoint,
        section,
        "returns a flat map of metrics",
        'returned { "data": { ... } }. §3.1 and §8.2 both specify a bare flat map at the ' +
          "top level, and §4.1's data envelope covers lists rather than singletons. This is " +
          "a contract-versus-implementation conflict, not a bug in the metrics: either amend " +
          "§3.1 to adopt the wrapped shape estate-wide, or return the map unwrapped.",
      ),
    ]
  }

  const nested = keys.filter((key) => !isScalar((response.body as Record<string, unknown>)[key]))
  if (nested.length > 0) {
    return [
      fail(
        endpoint,
        section,
        "returns a flat map of metrics",
        `these keys are not scalars: ${nested.join(", ")}. The console renders label ` +
          "and format from the registry, which cannot descend into nested objects.",
      ),
    ]
  }

  return [pass(endpoint, section, "returns a flat map of metrics")]
}

export interface InboxOptions {
  /**
   * Whether the product declared an SLA on this queue. `due_at` is required
   * only where one exists — the contract names devai's one-hour approval
   * gates and mark8ly's five-business-day SEA review as the two that have one.
   */
  readonly slaDeclared?: boolean
}

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

  if (options.slaDeclared) {
    const missingDue = items.filter(
      (item) => !isRecord(item) || item.due_at === undefined || item.due_at === null,
    )
    findings.push(
      missingDue.length > 0
        ? fail(
            endpoint,
            section,
            "every item carries due_at",
            `${missingDue.length} of ${items.length} items omit due_at, and this product ` +
              "declares an SLA on this queue. A declared SLA that nothing surfaces is the " +
              "gap §3.2 exists to close.",
          )
        : pass(endpoint, section, "every item carries due_at"),
    )
  } else {
    findings.push(
      skip(
        endpoint,
        section,
        "every item carries due_at",
        "no SLA declared for this queue, so due_at is optional",
      ),
    )
  }

  return findings
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
