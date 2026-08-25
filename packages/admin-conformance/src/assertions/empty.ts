import { ENDPOINTS, isEndpointId } from "../contract"
import { type Finding, fail, pass, skip } from "../finding"
import { describeValue, isRecord } from "./walk"

/**
 * §4.5 — the empty result.
 *
 * An endpoint with no rows answers 200 with an empty array. Not 404, not 204,
 * not `null`, and above all not `{}`.
 *
 * This check exists because of a specific outage shape, not as a matter of
 * taste. A Go handler that returns a `nil` slice serialises it as `null`, and
 * a `nil` map as `{}`. Both are falsy-adjacent values that a TypeScript caller
 * does not defend against: `body.data ?? []` passes `{}` straight through,
 * because `{}` is neither null nor undefined, and the next `.map()` throws.
 * The failure therefore lands exactly when a tenant has no data — a new
 * tenant, a filtered view, a quiet day — which is precisely when a console
 * page most needs to render something calm rather than a stack trace.
 */
export const EMPTY_SECTION = "4.5"

const CHECK = "returns 200 with an empty array when there are no rows"

/** The key holding the collection, per the endpoint's envelope (§4.1). */
function collectionKey(endpointId: string): string | undefined {
  if (!isEndpointId(endpointId)) return undefined
  const envelope = ENDPOINTS[endpointId].envelope
  if (envelope === "data-pagination") return "data"
  if (envelope === "items-total") return "items"
  return undefined
}

/** Checks a response captured from a query the product knows returns nothing. */
export function checkEmptyResult(
  endpointId: string,
  section: string,
  body: unknown,
  status: number,
): Finding[] {
  const key = collectionKey(endpointId)
  if (key === undefined) {
    return [
      skip(
        endpointId,
        section,
        CHECK,
        `${endpointId} has no collection in its envelope, so there is no empty array for §4.5 to require`,
      ),
    ]
  }

  if (status !== 200) {
    return [
      fail(
        endpointId,
        section,
        CHECK,
        `the endpoint answered ${status} for a query with no rows; the contract requires 200 with an empty ${key} array — an absent collection is not an error condition`,
      ),
    ]
  }

  if (!isRecord(body)) {
    return [
      fail(
        endpointId,
        section,
        CHECK,
        `the response body is ${describeValue(body)}; the contract requires a JSON object whose ${key} is an empty array`,
      ),
    ]
  }

  const collection = body[key]
  if (!Array.isArray(collection)) {
    return [
      fail(
        endpointId,
        section,
        CHECK,
        `${key} is ${describeValue(collection)}; the contract requires an empty array — a caller's \`${key} ?? []\` does not rescue null or {}, it crashes on the next iteration`,
      ),
    ]
  }

  if (collection.length > 0) {
    return [
      skip(
        endpointId,
        section,
        CHECK,
        `${key} came back with ${collection.length} row(s), so this response could not exercise the empty case; point the check at a query known to match nothing`,
      ),
    ]
  }

  return [pass(endpointId, section, CHECK)]
}
