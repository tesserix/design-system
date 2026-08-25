import { type Finding, fail, pass, skip } from "../finding"
import { childPath, describeValue, displayPath, isRecord, walk } from "./walk"

/**
 * §4.3 — timestamps.
 *
 * Every instant is ISO 8601 with an explicit offset: `2026-08-12T09:31:00Z`,
 * or `2026-08-12T09:31:00+05:30`.
 *
 * The offset is the entire point of the rule. A string like
 * `2026-08-12T09:31:00` is not a slightly worse instant, it is not an instant
 * at all: the reader has to supply a zone, and every reader supplies a
 * different one. `new Date("2026-08-12T09:31:00")` resolves in the *browser's*
 * zone, so an audit entry written in Mumbai is rendered five and a half hours
 * off for a viewer in London, silently and plausibly. Nothing throws; the
 * numbers are simply wrong.
 *
 * A numeric epoch fails for the same reason it looks harmless: seconds and
 * milliseconds are indistinguishable by inspection, and a consumer guessing
 * wrong lands in 1970 or 56000 AD.
 */
export const TIMESTAMP_SECTION = "4.3"

const CHECK = "expresses timestamps as ISO 8601 with an explicit offset"

/**
 * The contract names `waiting_since`, `due_at`, `created_at` and `updated_at`,
 * but the rule is about the convention rather than those four spellings — a
 * product's `archived_at` is under it too. Matching the suffix rather than a
 * fixed list also keeps a substring like `since_label` out.
 */
const TIMESTAMP_KEY = /_(at|since)$/

const ISO_8601_WITH_OFFSET =
  /^\d{4}-\d{2}-\d{2}[Tt]\d{2}:\d{2}:\d{2}(\.\d+)?([Zz]|[+-]\d{2}:\d{2})$/

const REQUIREMENT =
  "the contract requires ISO 8601 with an explicit offset, e.g. 2026-08-12T09:31:00Z or 2026-08-12T09:31:00+05:30"

function checkValue(
  endpointId: string,
  section: string,
  path: string,
  value: unknown,
): Finding[] {
  // An absent value is not a malformed one: the contract has optional
  // timestamps (`due_at` on an item with no deadline) and requires them to be
  // null rather than invented.
  if (value === null) return []

  if (typeof value !== "string") {
    return [
      fail(
        endpointId,
        section,
        CHECK,
        `${displayPath(path)} is ${describeValue(value)}; ${REQUIREMENT}`,
      ),
    ]
  }

  if (!ISO_8601_WITH_OFFSET.test(value)) {
    return [
      fail(
        endpointId,
        section,
        CHECK,
        `${displayPath(path)} is "${value}", which carries no explicit offset or is not a full instant; ${REQUIREMENT}`,
      ),
    ]
  }

  // The pattern accepts `2026-13-45T09:31:00Z`; only parsing rejects it.
  if (Number.isNaN(Date.parse(value))) {
    return [
      fail(
        endpointId,
        section,
        CHECK,
        `${displayPath(path)} is "${value}", which is shaped like ISO 8601 but is not a real instant; ${REQUIREMENT}`,
      ),
    ]
  }

  return []
}

/** Walks a response and checks every timestamp-named field it finds. */
export function checkTimestamps(endpointId: string, section: string, body: unknown): Finding[] {
  const findings: Finding[] = []
  let seenAny = false

  for (const node of walk(body)) {
    if (!isRecord(node.value)) continue
    for (const [key, value] of Object.entries(node.value)) {
      if (!TIMESTAMP_KEY.test(key)) continue
      seenAny = true
      findings.push(...checkValue(endpointId, section, childPath(node.path, key), value))
    }
  }

  if (!seenAny) {
    return [
      skip(
        endpointId,
        section,
        CHECK,
        "the response carries no field named *_at or *_since, so §4.3 has nothing to assert",
      ),
    ]
  }

  return findings.length > 0 ? findings : [pass(endpointId, section, CHECK)]
}
