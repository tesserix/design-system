import type { Declaration } from "./declaration"
import { type Finding, fail, pass, skip } from "./finding"

/**
 * Rules that hold between endpoints rather than within one response.
 *
 * Every other check in this suite reads one body and judges it. These read the
 * declaration itself, and they exist because the contract has requirements that
 * no single response can violate — the deviation is a *combination* of what a
 * product implements and what it does not.
 *
 * They are findings rather than parse-time throws on purpose. `declaration.ts`
 * throws for a file nothing could check; a file that is perfectly well-formed
 * and describes a product with a real contract gap belongs in the report, next
 * to the other failures, with the section that says so.
 */

const CHECK = "declares a way to fetch the reason codes its writes require"

/**
 * §8.3 + §8.8 — a product implementing tenant lifecycle writes must also serve
 * `GET /admin/lifecycle/reason-codes`.
 *
 * This is the rule tesserix-home#345 exists to make unrepeatable. §8.3 required
 * a reason code on suspend and unsuspend from the day it was written, and the
 * codes were a closed set validated authoritatively by the product — all
 * correct, and all invisible. The console could not fetch them, so it copied
 * them, and a copied vocabulary is a drift with a countdown on it.
 *
 * The failure is stated against the *writes*, not against the missing endpoint,
 * because that is the order the gap appears in: a product ships suspend first
 * and discovers the requirement second.
 */
export function checkLifecycleReasonCodesDeclared(declaration: Declaration): Finding[] {
  const writes = declaration.endpoints["tenant-lifecycle"]?.implemented === true
  const codes = declaration.endpoints["lifecycle/reason-codes"]?.implemented === true

  if (!writes) {
    return [
      skip(
        "tenant-lifecycle",
        "8.8",
        CHECK,
        "the product declares no tenant lifecycle writes, so there is no vocabulary it owes anyone",
      ),
    ]
  }

  if (!codes) {
    return [
      fail(
        "tenant-lifecycle",
        "8.8",
        CHECK,
        'declares "tenant-lifecycle" but not "lifecycle/reason-codes". §8.3 requires a reason ' +
          "code on suspend and unsuspend; §8.8 requires the accepted codes to be fetchable. A " +
          "product that validates a closed set it never publishes leaves every caller to " +
          "hand-copy it from the source, which is the drift this pair of sections closes.",
      ),
    ]
  }

  return [pass("tenant-lifecycle", "8.8", CHECK)]
}

/** Every cross-endpoint rule, in report order. */
export function checkDeclarationRules(declaration: Declaration): Finding[] {
  return [...checkLifecycleReasonCodesDeclared(declaration)]
}
