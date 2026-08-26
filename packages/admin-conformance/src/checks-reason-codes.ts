import { type Finding, fail, pass } from "./finding"

/**
 * §8.8 — `GET /admin/lifecycle/reason-codes`.
 *
 * §8.3 already required a reason code on suspend and unsuspend so that an
 * audit row says *why* and not only *what*. It did not say how anyone was
 * meant to learn the codes, and for a while nobody could: mark8ly's two sets
 * were a Go var readable only by opening the file, and the console shipped a
 * hand-copied duplicate of them because a form cannot offer a menu it has no
 * way to fetch (tesserix-home#345).
 *
 * A copied vocabulary drifts in two directions and only one of them is loud.
 * Offering a retired code gets refused with §4.4's `invalid_reason_code`, which
 * someone sees. Missing a newly added code is silent — the option is simply not
 * there, and the operator picks the nearest wrong one. That second failure is
 * why this endpoint is a contract requirement rather than a convenience.
 */

const SECTION = "8.8"
const ENDPOINT = "lifecycle/reason-codes"

/** Phrased as a statement of fact, so a passing line reads as one. */
const CHECK = "declares the reason codes its lifecycle writes accept"

/**
 * The two verbs §8.3 names. Both are required even of a product whose sets are
 * identical: a product that serves only `suspend` leaves the console unable to
 * render the unsuspend form at all, and "the same codes apply" is a statement
 * it can make by repeating them, not by omitting the key.
 */
const VERBS = ["suspend", "unsuspend"] as const

/**
 * `snake_case`, matching every code in the estate today (`non_payment`,
 * `tos_violation`, `appeal_upheld`).
 *
 * Pinned because a code is a wire value that lands in an audit row and is
 * matched exactly on the product side. A product that shipped `Non-Payment`
 * would work fine against its own validator and break the moment a second
 * product's rows were read alongside it.
 */
const CODE_PATTERN = /^[a-z0-9]+(?:_[a-z0-9]+)*$/

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const failure = (detail: string): Finding[] => [
  fail(ENDPOINT, SECTION, CHECK, detail),
]

/**
 * Checks one verb's list, returning the problems found rather than throwing on
 * the first: a product with a malformed entry in each of its two lists should
 * see both, because it will fix both in one edit.
 */
function checkVerb(verb: string, value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [
      `$.data.${verb} is ${value === undefined ? "absent" : JSON.stringify(value)}; ` +
        "the contract requires an array of { code, label } for each of suspend and unsuspend",
    ]
  }
  if (value.length === 0) {
    return [
      `$.data.${verb} is empty. A product that declares this endpoint accepts reason codes ` +
        "for both verbs; an empty list leaves the console with a menu it cannot render and " +
        "a write it cannot make.",
    ]
  }

  const problems: string[] = []
  const seen = new Set<string>()

  value.forEach((entry, index) => {
    const at = `$.data.${verb}[${index}]`
    if (!isRecord(entry)) {
      problems.push(`${at} is ${JSON.stringify(entry)}; each entry must be an object`)
      return
    }

    const { code, label } = entry
    if (typeof code !== "string" || code.length === 0) {
      problems.push(`${at}.code is ${JSON.stringify(code)}; every entry needs a non-empty code`)
    } else if (!CODE_PATTERN.test(code)) {
      problems.push(
        `${at}.code is ${JSON.stringify(code)}; codes are snake_case — the value crosses the ` +
          "wire into an audit row and is matched exactly",
      )
    } else if (seen.has(code)) {
      problems.push(
        `${at}.code ${JSON.stringify(code)} is declared twice; a duplicated code makes the ` +
          "console's menu ambiguous about which label the operator chose",
      )
    } else {
      seen.add(code)
    }

    // A code with no label forces the console to render the wire value, which
    // is how `tos_violation` ends up in front of an operator as a menu option.
    if (typeof label !== "string" || label.trim().length === 0) {
      problems.push(
        `${at}.label is ${JSON.stringify(label)}; every code needs a human label, or the ` +
          "console renders the raw wire value as the menu option",
      )
    }
  })

  return problems
}

/**
 * Checks a `GET /admin/lifecycle/reason-codes` body.
 *
 * The status is the caller's concern — the runner has already turned 401/404/
 * 503 and any 4xx into their own findings before this is reached.
 */
export function checkReasonCodes(body: unknown): Finding[] {
  if (!isRecord(body)) {
    return failure(
      `the response body is ${JSON.stringify(body)}; the contract requires ` +
        "{ data: { suspend: [...], unsuspend: [...] } }",
    )
  }

  const data = body["data"]
  if (!isRecord(data)) {
    return failure(
      `$.data is ${data === undefined ? "absent" : JSON.stringify(data)}; the codes are ` +
        "wrapped in data like every other endpoint on this surface, so a generic client " +
        "can read .data without knowing which endpoint answered",
    )
  }

  const problems = VERBS.flatMap((verb) => checkVerb(verb, data[verb]))
  if (problems.length > 0) {
    return problems.map((detail) => fail(ENDPOINT, SECTION, CHECK, detail))
  }

  return [pass(ENDPOINT, SECTION, CHECK)]
}
