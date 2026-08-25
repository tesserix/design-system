import { type Finding, fail, pass } from "../finding"
import { describeValue, isRecord } from "./walk"

/**
 * §4.4 — errors.
 *
 * An error response is a machine-readable code and a human-readable sentence,
 * side by side:
 *
 *   { "error": "not_found", "message": "Chef abc123 does not exist" }
 *
 * The split matters because the two fields have different audiences and
 * different lifetimes. `error` is what a caller branches on, so it must be
 * stable enough to be pinned in code; `message` is what a person reads, so it
 * is free to be reworded, translated, or given more detail at any time.
 *
 * Putting a sentence in `error` collapses the two: callers end up matching on
 * prose, and the next copy edit — a capital letter, a renamed noun — breaks
 * their branch with no compiler and no deprecation. That is why an `error`
 * containing a space or an upper-case letter fails here rather than being
 * tolerated as a style preference.
 */
export const ERROR_SECTION = "4.4"

const CHECK = "returns a machine-readable error code beside a human message"

/** snake_case: lower-case letters, digits and underscores, starting on a letter. */
const ERROR_CODE = /^[a-z][a-z0-9_]*$/

function checkCode(endpointId: string, section: string, body: Record<string, unknown>): Finding[] {
  const code = body["error"]
  if (typeof code === "string" && ERROR_CODE.test(code)) return []
  return [
    fail(
      endpointId,
      section,
      CHECK,
      `error is ${describeValue(code)}; the contract requires a stable snake_case code such as "not_found" — prose belongs in message`,
    ),
  ]
}

function checkMessage(endpointId: string, section: string, body: Record<string, unknown>): Finding[] {
  const message = body["message"]
  if (typeof message === "string" && message.trim().length > 0) return []
  return [
    fail(
      endpointId,
      section,
      CHECK,
      `message is ${describeValue(message)}; the contract requires a non-empty human-readable sentence`,
    ),
  ]
}

/**
 * Checks one error body.
 *
 * The code and the message are reported as separate findings on purpose: a
 * body that gets both wrong should say so in one run, rather than reveal the
 * second problem only after the first is fixed and CI is run again.
 */
export function checkErrorShape(endpointId: string, section: string, body: unknown): Finding[] {
  if (!isRecord(body)) {
    return [
      fail(
        endpointId,
        section,
        CHECK,
        `the error body is ${describeValue(body)}; the contract requires { "error": "<snake_case code>", "message": "<sentence>" }`,
      ),
    ]
  }

  const findings = [...checkCode(endpointId, section, body), ...checkMessage(endpointId, section, body)]
  return findings.length > 0 ? findings : [pass(endpointId, section, CHECK)]
}
