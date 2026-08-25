import { readFileSync } from "node:fs"

import { ENDPOINT_IDS, isEndpointId, type EndpointId } from "./contract"

/**
 * `admin-conformance.json` — a product's committed statement of which contract
 * endpoints it implements.
 *
 * The contract's "contracts are declared, not discovered" is the whole design
 * here: the suite skips what a product has not declared and FAILS anything it
 * has. Partial implementation is legitimate; silent deviation is not.
 *
 * That is why this is an allowlist rather than a denylist of unimplemented
 * endpoints. Exclusion by absence cannot be forgotten — a product that has not
 * written the key gets skipped and stays honest. A denylist has to be edited
 * by whoever is adding a product in a hurry, and the edit that never happens
 * is the one that turns an unimplemented endpoint into a silent pass.
 *
 * The same reasoning makes every parse failure here a throw rather than a
 * warning. A declaration this file could not understand is a declaration
 * nothing is checking.
 */

/** The filename a product commits at its repo root. Not configurable, on purpose. */
export const DECLARATION_FILENAME = "admin-conformance.json"

/** How one endpoint was declared, after `true` has been widened to an object. */
export interface EndpointDeclaration {
  readonly implemented: boolean
  /**
   * `entities` only: the product-defined `{type}` values it serves. Present
   * exactly when `entities` is implemented.
   */
  readonly types?: readonly string[]
  /**
   * `inbox` only: whether the product promises an SLA. `due_at` is required of
   * an inbox item only when one is declared, so this cannot be inferred from
   * the responses — a product with no SLA and a product that forgot `due_at`
   * look identical on the wire.
   */
  readonly slaDeclared?: boolean
}

export interface Declaration {
  readonly slug: string
  readonly contractVersion: number
  readonly endpoints: Readonly<Partial<Record<EndpointId, EndpointDeclaration>>>
}

/**
 * Lowercase kebab-case: the slug appears in URLs, log lines and store keys, so
 * a case difference between two products would read as two products.
 */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Option keys each endpoint accepts. An endpoint absent here accepts none. */
const ENDPOINT_OPTION_KEYS: Partial<Record<EndpointId, readonly string[]>> = {
  entities: ["types"],
  inbox: ["slaDeclared"],
}

/**
 * Every message is prefixed so it is recognisable when it surfaces three
 * layers up in a CI log with no other context around it.
 */
const problem = (message: string): Error =>
  new Error(`admin-conformance: ${message}`)

/**
 * Narrows to a plain JSON object. Arrays are excluded explicitly: `typeof []`
 * is `"object"`, so an array would otherwise pass as a record and then fail
 * later with a message about a missing field rather than the wrong shape.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function parseSlug(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    throw problem("slug is required and must be a non-empty string")
  }
  if (!SLUG_PATTERN.test(value)) {
    throw problem(
      `slug ${JSON.stringify(value)} must be lowercase kebab-case, e.g. "mark8ly"`,
    )
  }
  return value
}

function parseContractVersion(value: unknown): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    throw problem("contractVersion is required and must be a positive integer")
  }
  return value
}

/**
 * Rejects an option key no endpoint recognises.
 *
 * A typo'd option is the same trap as a typo'd endpoint id, one level down:
 * `slaDeclard` would be dropped, the inbox would be checked as if it declared
 * no SLA, and the missing `due_at` the product does owe would never be caught.
 */
function assertKnownOptions(id: EndpointId, options: Record<string, unknown>): void {
  const allowed = ENDPOINT_OPTION_KEYS[id] ?? []
  for (const key of Object.keys(options)) {
    if (!allowed.includes(key)) {
      const list = allowed.length > 0 ? allowed.join(", ") : "none"
      throw problem(
        `endpoints["${id}"] has unknown option ${JSON.stringify(key)}; accepted options: ${list}`,
      )
    }
  }
}

function parseEntityTypes(value: unknown): readonly string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw problem(
      'endpoints["entities"].types must be a non-empty array of type names',
    )
  }
  // Rebuilt element by element rather than copied wholesale: narrowing each
  // entry as it is appended is what makes the returned `string[]` true, rather
  // than an assertion that it is.
  const types: string[] = []
  for (const type of value) {
    if (typeof type !== "string" || type.length === 0) {
      throw problem(
        `endpoints["entities"].types must contain non-empty strings, got ${JSON.stringify(type)}`,
      )
    }
    types.push(type)
  }
  return types
}

function parseSlaDeclared(value: unknown): boolean {
  if (value === undefined) return false
  if (typeof value !== "boolean") {
    throw problem('endpoints["inbox"].slaDeclared must be a boolean')
  }
  return value
}

function parseEndpoint(id: EndpointId, value: unknown): EndpointDeclaration {
  // `false` and absence are the same statement — not implemented — so neither
  // needs its options validated. Only a claim of implementation is checkable.
  if (value === false) return { implemented: false }

  const options: Record<string, unknown> =
    value === true ? {} : isRecord(value) ? value : rejectEndpointValue(id, value)
  assertKnownOptions(id, options)

  const declaration: EndpointDeclaration = { implemented: true }

  if (id === "entities") {
    // `requiresSubtypes` in contract.ts: `/admin/entities/{type}` has no
    // meaning until the product says which types it serves, so "implemented"
    // without them is not a declaration anything can be checked against.
    if (!("types" in options)) {
      throw problem(
        'endpoints["entities"] must declare the types it serves, e.g. { "types": ["tenants"] }',
      )
    }
    return { ...declaration, types: parseEntityTypes(options["types"]) }
  }

  if (id === "inbox") {
    return { ...declaration, slaDeclared: parseSlaDeclared(options["slaDeclared"]) }
  }

  return declaration
}

/** Throws for an endpoint value that is neither a boolean nor an options object. */
function rejectEndpointValue(id: EndpointId, value: unknown): never {
  throw problem(
    `endpoints["${id}"] must be true, false, or an options object, got ${JSON.stringify(value) ?? typeof value}`,
  )
}

function parseEndpoints(value: unknown): Partial<Record<EndpointId, EndpointDeclaration>> {
  // Required rather than defaulted to `{}`: a product whose endpoints block
  // went missing in a merge would otherwise report a clean run of nothing.
  if (!isRecord(value)) {
    throw problem("endpoints is required and must be a JSON object")
  }

  const parsed: Partial<Record<EndpointId, EndpointDeclaration>> = {}
  for (const [key, raw] of Object.entries(value)) {
    // A typo'd endpoint key would otherwise mean "not implemented", which the
    // suite reports as a pass — precisely the silent deviation this file
    // exists to prevent. So it is a hard error, and the message carries the
    // valid ids so the fix does not require finding this source.
    if (!isEndpointId(key)) {
      throw problem(
        `unknown endpoint ${JSON.stringify(key)}; valid ids are: ${ENDPOINT_IDS.join(", ")}`,
      )
    }
    parsed[key] = parseEndpoint(key, raw)
  }
  return parsed
}

/**
 * Validates one parsed-JSON value and returns a typed declaration.
 *
 * Throws on the first problem, naming the exact field. The alternative —
 * collecting every problem — reads better in the abstract and worse in a CI
 * log, where the first message is the one anyone acts on.
 */
export function parseDeclaration(raw: unknown): Declaration {
  if (!isRecord(raw)) {
    throw problem("must be a JSON object")
  }

  return {
    slug: parseSlug(raw["slug"]),
    contractVersion: parseContractVersion(raw["contractVersion"]),
    endpoints: parseEndpoints(raw["endpoints"]),
  }
}

/**
 * Reads and parses a declaration from disk.
 *
 * The three ways this fails — absent, unparseable, invalid — get three
 * different messages, all naming the path. They have three different fixes,
 * and a suite that reports "could not load declaration" for all of them sends
 * whoever hits it to read this file.
 */
export function loadDeclaration(filePath: string): Declaration {
  let contents: string
  try {
    contents = readFileSync(filePath, "utf8")
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    throw new Error(`${filePath}: not found or unreadable (${reason})`)
  }

  let raw: unknown
  try {
    raw = JSON.parse(contents)
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    throw new Error(`${filePath}: not valid JSON (${reason})`)
  }

  try {
    return parseDeclaration(raw)
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    throw new Error(`${filePath}: ${reason}`)
  }
}

/**
 * The endpoints a declaration claims, in `ENDPOINTS` order.
 *
 * Contract order rather than the order the JSON happened to list them in, so
 * two products' reports line up and a reordered declaration produces no diff.
 */
export function implementedEndpoints(declaration: Declaration): EndpointId[] {
  return ENDPOINT_IDS.filter((id) => declaration.endpoints[id]?.implemented === true)
}
