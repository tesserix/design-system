import { type Finding, fail, pass, skip } from "../finding"
import { type JsonRecord, childPath, describeValue, displayPath, isRecord, walk } from "./walk"

/**
 * §4.2 — money.
 *
 * Money is always minor units plus an explicit currency:
 *
 *   { "amount": 98420, "currency": "INR" }
 *
 * Never a float (₹984.20 is not representable in binary floating point, and a
 * rounding error in a ledger is found by a customer rather than by a test),
 * and never a bare number (that forces every consumer to guess the currency,
 * and consumers in this estate serve INR and USD tenants side by side).
 *
 * WHICH FIELDS COUNT AS MONEY — a deliberately narrow heuristic, because a
 * false positive here fails somebody's build over a field that was never
 * money. Two rules only:
 *
 *   1. any object carrying an `amount` key, and
 *   2. any value under a key ending in `_amount`, `_cents` or `_minor`.
 *
 * Explicitly NOT included: `price`, `total`, `cost`, `balance`, `fee`,
 * `revenue`. The decisive counter-example is `pagination.total` from §4.1 — a
 * bare integer present in every paginated response the contract defines. A
 * heuristic that reads `total` as money fails every conformant product on its
 * first endpoint. A product that wants such a field checked can name it
 * `revenue_amount`, which is the spelling the contract's own examples use.
 */
export const MONEY_SECTION = "4.2"

const CHECK = "expresses money as minor units with an explicit currency"

/** Keys whose value is expected to *be* a money object. */
const MONEY_KEY = /_(amount|cents|minor)$/

/** ISO 4217 alphabetic codes are exactly three upper-case letters. */
const CURRENCY_CODE = /^[A-Z]{3}$/

const REQUIREMENT =
  'the contract requires { "amount": <integer minor units>, "currency": "<ISO-4217 code>" }'

interface Located {
  readonly path: string
  readonly value: unknown
}

/**
 * Collects money-shaped nodes.
 *
 * Candidates are keyed by path so a field matched by both rules —
 * `price_amount: { amount, currency }` — is reported once, not twice.
 */
function collect(body: unknown): { readonly candidates: Located[]; readonly bare: Located[] } {
  const candidates = new Map<string, JsonRecord>()
  const bare: Located[] = []

  for (const node of walk(body)) {
    if (!isRecord(node.value)) continue
    if ("amount" in node.value) candidates.set(node.path, node.value)

    for (const [key, value] of Object.entries(node.value)) {
      if (!MONEY_KEY.test(key)) continue
      const path = childPath(node.path, key)
      if (isRecord(value)) candidates.set(path, value)
      // `null` is an absent amount rather than a malformed one; the contract
      // does not require every optional money field to be populated.
      else if (value !== null) bare.push({ path, value })
    }
  }

  return {
    candidates: [...candidates].map(([path, value]) => ({ path, value })),
    bare,
  }
}

function checkAmount(endpointId: string, section: string, candidate: Located): Finding[] {
  const amount = isRecord(candidate.value) ? candidate.value["amount"] : undefined
  if (typeof amount === "number" && Number.isInteger(amount)) return []
  return [
    fail(
      endpointId,
      section,
      CHECK,
      `${displayPath(candidate.path)}.amount is ${describeValue(amount)}; ${REQUIREMENT}`,
    ),
  ]
}

function checkCurrency(endpointId: string, section: string, candidate: Located): Finding[] {
  const currency = isRecord(candidate.value) ? candidate.value["currency"] : undefined
  if (typeof currency === "string" && CURRENCY_CODE.test(currency)) return []
  return [
    fail(
      endpointId,
      section,
      CHECK,
      `${displayPath(candidate.path)}.currency is ${describeValue(currency)}; ${REQUIREMENT}`,
    ),
  ]
}

/** Walks a response and checks every money-shaped value it finds. */
export function checkMoney(endpointId: string, section: string, body: unknown): Finding[] {
  const { candidates, bare } = collect(body)

  if (candidates.length === 0 && bare.length === 0) {
    return [
      skip(
        endpointId,
        section,
        CHECK,
        "the response carries no money-shaped field, so §4.2 has nothing to assert",
      ),
    ]
  }

  const bareFindings = bare.map((found) =>
    fail(
      endpointId,
      section,
      CHECK,
      `${displayPath(found.path)} is ${describeValue(found.value)} where a money object is expected; ${REQUIREMENT}`,
    ),
  )

  const candidateFindings = candidates.flatMap((candidate) => [
    ...checkAmount(endpointId, section, candidate),
    ...checkCurrency(endpointId, section, candidate),
  ])

  const findings = [...bareFindings, ...candidateFindings]
  return findings.length > 0 ? findings : [pass(endpointId, section, CHECK)]
}
