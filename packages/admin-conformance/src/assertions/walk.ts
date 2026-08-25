/**
 * Depth-first traversal of a parsed JSON body, shared by the checks that have
 * to look everywhere rather than at one named field (§4.2 money, §4.3
 * timestamps).
 *
 * Paths are reported as `data[1].plan.billing` because these findings are read
 * in a CI log with no request and no response next to them — a check that says
 * only "an amount was not an integer" costs the reader a manual bisect of the
 * payload.
 */

/** A plain JSON object. Arrays are excluded, which `typeof` alone does not do. */
export type JsonRecord = Readonly<Record<string, unknown>>

export interface Node {
  /** Human-readable location, e.g. `data[1].due_at`. */
  readonly path: string
  readonly value: unknown
}

export function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/**
 * A key is appended with dot notation only when it is a plain identifier;
 * anything else goes in brackets, so a product whose keys contain dots or
 * spaces still yields a path that reads unambiguously.
 */
export function childPath(parent: string, key: string): string {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(key)
    ? `${parent}.${key}`
    : `${parent}[${JSON.stringify(key)}]`
}

/**
 * Yields every node in the tree, the root included, parents before children.
 *
 * The `seen` set is not about JSON — a parsed body cannot contain a cycle — but
 * about the unit tests and any caller that hands us a hand-built literal. A
 * conformance run that hangs is far worse than one that reports a finding.
 */
export function* walk(root: unknown, base = "$", seen = new WeakSet<object>()): Generator<Node> {
  yield { path: base, value: root }

  if (typeof root !== "object" || root === null) return
  if (seen.has(root)) return
  seen.add(root)

  if (Array.isArray(root)) {
    for (const [index, item] of root.entries()) {
      yield* walk(item, `${base}[${index}]`, seen)
    }
    return
  }

  for (const [key, value] of Object.entries(root)) {
    yield* walk(value, childPath(base, key), seen)
  }
}

/** Strips the synthetic `$.` root prefix so findings read as field paths. */
export function displayPath(path: string): string {
  return path === "$" ? "the response body" : path.replace(/^\$\.?/, "")
}

/** What a value *is*, phrased for a failure detail: "a string", "null", "an array". */
export function describeValue(value: unknown): string {
  if (value === null) return "null"
  if (Array.isArray(value)) return "an array"
  if (typeof value === "object") return "an object"
  if (typeof value === "undefined") return "absent"
  return `a ${typeof value} (${JSON.stringify(value)})`
}
