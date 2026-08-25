import { ENDPOINTS, type EnvelopeKind, isEndpointId } from "../contract"
import { type Finding, fail, pass, skip } from "../finding"
import { childPath, describeValue, displayPath, isRecord } from "./walk"

/**
 * §4.1 — response envelopes.
 *
 * The contract names one paginated shape and no synonyms:
 *
 *   { "data": [...], "pagination": { "page": 1, "limit": 50, "total": 320 } }
 *
 * The reason it is worth a check of its own is that the alternative is not a
 * different envelope, it is *one envelope per product*: `{logs, total, page,
 * limit}` here, `{results, count}` there. Every such variant costs the console
 * a bespoke adapter, and the console is where they all have to meet. A
 * deviation that ships is one nobody can take back.
 */
export const ENVELOPE_SECTION = "4.1"

const CHECK: Record<EnvelopeKind, string> = {
  "data-pagination": "responds with the { data, pagination } envelope",
  "items-total": "responds with the { items, total } envelope",
  "flat-map": "responds with a flat map of scalar metrics",
  free: "has no envelope requirement",
}

const PAGINATION_COUNTERS = ["page", "limit", "total"] as const

/** Renders observed top-level keys for a failure detail, in wire order. */
const keysOf = (body: Record<string, unknown>): string =>
  Object.keys(body).length === 0 ? "no keys" : Object.keys(body).join(", ")

/**
 * Counters are required to be whole and non-negative rather than merely
 * `typeof "number"`. `page: 1.5` and `total: -1` are both arithmetic bugs
 * upstream, and both survive a naive type check while breaking any consumer
 * that pages through the result.
 */
function checkCounter(
  endpointId: string,
  section: string,
  check: string,
  path: string,
  value: unknown,
): Finding | undefined {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    return fail(
      endpointId,
      section,
      check,
      `${displayPath(path)} is ${describeValue(value)}; the contract requires a non-negative whole number`,
    )
  }
  return undefined
}

function checkKeys(
  endpointId: string,
  section: string,
  check: string,
  body: Record<string, unknown>,
  required: readonly string[],
): Finding[] {
  const missing = required.filter((key) => !(key in body))
  if (missing.length > 0) {
    return [
      fail(
        endpointId,
        section,
        check,
        `the response body has ${keysOf(body)} and is missing ${missing.join(", ")}; the contract requires exactly { ${required.join(", ")} }`,
      ),
    ]
  }

  // The contract says "exactly", so an extra top-level key is reported rather
  // than tolerated: `meta` alongside `pagination` is how a second, undeclared
  // envelope starts, and the console has no way to know which one to read.
  const extra = Object.keys(body).filter((key) => !required.includes(key))
  if (extra.length > 0) {
    return [
      fail(
        endpointId,
        section,
        check,
        `the response body carries extra top-level keys (${extra.join(", ")}); the contract requires exactly { ${required.join(", ")} }`,
      ),
    ]
  }
  return []
}

function checkCollection(
  endpointId: string,
  section: string,
  check: string,
  body: Record<string, unknown>,
  key: string,
): Finding[] {
  const value = body[key]
  if (Array.isArray(value)) return []
  return [
    fail(
      endpointId,
      section,
      check,
      `${key} is ${describeValue(value)}; the contract requires an array, empty when there are no rows`,
    ),
  ]
}

function checkDataPagination(endpointId: string, section: string, body: Record<string, unknown>): Finding[] {
  const check = CHECK["data-pagination"]
  const shape = checkKeys(endpointId, section, check, body, ["data", "pagination"])
  if (shape.length > 0) return shape

  const findings = checkCollection(endpointId, section, check, body, "data")
  const pagination = body["pagination"]
  if (!isRecord(pagination)) {
    return [
      ...findings,
      fail(
        endpointId,
        section,
        check,
        `pagination is ${describeValue(pagination)}; the contract requires an object with numeric page, limit and total`,
      ),
    ]
  }

  const counters = PAGINATION_COUNTERS.flatMap((counter) => {
    if (!(counter in pagination)) {
      return [
        fail(
          endpointId,
          section,
          check,
          `pagination.${counter} is absent; the contract requires numeric page, limit and total`,
        ),
      ]
    }
    const bad = checkCounter(endpointId, section, check, childPath("$.pagination", counter), pagination[counter])
    return bad ? [bad] : []
  })

  return [...findings, ...counters]
}

function checkItemsTotal(endpointId: string, section: string, body: Record<string, unknown>): Finding[] {
  const check = CHECK["items-total"]
  const shape = checkKeys(endpointId, section, check, body, ["items", "total"])
  if (shape.length > 0) return shape

  const bad = checkCounter(endpointId, section, check, "$.total", body["total"])
  return [...checkCollection(endpointId, section, check, body, "items"), ...(bad ? [bad] : [])]
}

/**
 * A flat map is flat all the way down: a nested object is almost always a
 * paginated envelope that leaked in, and a consumer rendering tiles cannot
 * display one.
 */
function checkFlatMap(endpointId: string, section: string, body: Record<string, unknown>): Finding[] {
  const check = CHECK["flat-map"]
  const nested = Object.entries(body).filter(
    ([, value]) => typeof value === "object" && value !== null,
  )
  if (nested.length === 0) return [pass(endpointId, section, check)]

  return nested.map(([key, value]) =>
    fail(
      endpointId,
      section,
      check,
      `${key} is ${describeValue(value)}; the contract requires a flat map whose values are scalars`,
    ),
  )
}

/** Checks one parsed body against one envelope kind. */
export function checkEnvelopeShape(
  endpointId: string,
  section: string,
  body: unknown,
  kind: EnvelopeKind,
): Finding[] {
  const check = CHECK[kind]

  if (kind === "free") {
    // Reported as a skip, never a pass: a green line saying the envelope was
    // checked, when nothing was, is how an unchecked endpoint acquires a
    // reputation for being checked.
    return [
      skip(
        endpointId,
        section,
        check,
        "the contract fixes no envelope for this endpoint, so §4.1 has nothing to assert",
      ),
    ]
  }

  if (!isRecord(body)) {
    return [
      fail(
        endpointId,
        section,
        check,
        `the response body is ${describeValue(body)}; the contract requires a JSON object`,
      ),
    ]
  }

  const findings =
    kind === "data-pagination"
      ? checkDataPagination(endpointId, section, body)
      : kind === "items-total"
        ? checkItemsTotal(endpointId, section, body)
        : checkFlatMap(endpointId, section, body)

  return findings.length > 0 ? findings : [pass(endpointId, section, check)]
}

/**
 * Checks a body against the envelope the registry records for that endpoint.
 *
 * An unrecognised id is a skip rather than a failure: a product may run this
 * suite over endpoints of its own, and failing them against a contract that
 * never described them would be noise.
 */
export function checkEnvelope(endpointId: string, section: string, body: unknown): Finding[] {
  if (!isEndpointId(endpointId)) {
    return [
      skip(
        endpointId,
        section,
        "responds with the envelope the contract fixes",
        `${endpointId} is not an endpoint the contract defines, so no envelope is required of it`,
      ),
    ]
  }
  return checkEnvelopeShape(endpointId, section, body, ENDPOINTS[endpointId].envelope)
}
