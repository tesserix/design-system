import {
  checkEmptyResult,
  checkEnvelope,
  checkErrorShape,
  checkMoney,
  checkTimestamps,
} from "./assertions"
import { checkAuditLogScoping, checkInboxItems, checkKpis } from "./checks"
import { checkReasonCodes } from "./checks-reason-codes"
import { ENDPOINTS, ENDPOINT_IDS, isProbed, type EndpointId } from "./contract"
import { checkDeclarationRules } from "./declaration-rules"
import type { Declaration } from "./declaration"
import { type Finding, fail, skip } from "./finding"
import { createClient, type Client, type Result } from "./http"

/**
 * The runner: one call per declared endpoint, every check over each response.
 *
 * Undeclared endpoints are reported as skips rather than omitted. A product
 * that declares nothing must produce a report full of skips, not a clean run —
 * §5's "partial implementation is legitimate; silent deviation is not" cuts
 * both ways, and an empty report reads as a pass to everyone who sees it.
 */

export interface RunOptions {
  readonly base: string
  readonly secret: string
  readonly operator: string
  readonly capability: string
  readonly declaration: Declaration
  readonly timeoutMs?: number
  readonly fetchImpl?: typeof fetch
}

export async function runConformance(options: RunOptions): Promise<Finding[]> {
  const client = createClient({
    base: options.base,
    secret: options.secret,
    operator: options.operator,
    capability: options.capability,
    timeoutMs: options.timeoutMs,
    fetchImpl: options.fetchImpl,
  })

  const findings: Finding[] = []

  for (const id of ENDPOINT_IDS) {
    const declared = options.declaration.endpoints[id]
    if (!declared?.implemented) {
      findings.push(
        skip(
          id,
          ENDPOINTS[id].section,
          "declared in admin-conformance.json",
          "not declared, so not checked. Declaring it is what opts an endpoint into enforcement.",
        ),
      )
      continue
    }
    // Declared, but the suite must not call it — see `isProbed`. Reported as a
    // skip so the line is present and says why; its enforcement lives in the
    // declaration rules below, not on the wire.
    if (!isProbed(id)) {
      findings.push(
        skip(
          id,
          ENDPOINTS[id].section,
          "is declared",
          "declared, and deliberately never called: a conformance run that invoked this write " +
            "would change real state. What the contract requires of it is enforced against the " +
            "declaration instead.",
        ),
      )
      continue
    }
    findings.push(...(await runEndpoint(client, options.declaration, id)))
  }

  // Cross-endpoint rules last, so they read as conclusions about the product
  // rather than as another endpoint's result.
  findings.push(...checkDeclarationRules(options.declaration))

  return findings
}

async function runEndpoint(
  client: Client,
  declaration: Declaration,
  id: EndpointId,
): Promise<Finding[]> {
  const endpoint = ENDPOINTS[id]
  const declared = declaration.endpoints[id]

  // `entities` is the one endpoint whose path is incomplete on its own: the
  // `{type}` segment is product-defined, so the declaration supplies it and
  // each type is checked separately.
  if (id === "entities") {
    const types = declared?.types ?? []
    const results: Finding[] = []
    for (const type of types) {
      const response = await client.get(`${endpoint.path}/${type}`)
      results.push(...checkResponse(declaration, id, `${id}/${type}`, response))
    }
    return results
  }

  const response = await client.get(endpoint.path, defaultQuery(id))
  return checkResponse(declaration, id, id, response)
}

/**
 * Query parameters the suite sends so an endpoint has something to answer.
 * Kept small deliberately: the contract specifies these filters, and inventing
 * others would test the suite's imagination rather than the contract.
 */
function defaultQuery(id: EndpointId): Record<string, string> | undefined {
  if (id === "audit-logs") return { limit: "50" }
  return undefined
}

/**
 * Transport-level outcomes that must short-circuit the shape checks.
 *
 * A 401 produces no body worth checking, and letting it fall through to the
 * envelope assertions would report a dozen shape violations for what is one
 * credentials problem — the far end deliberately returns a single opaque
 * status for every rejection, so the suite has to supply the diagnosis the
 * response withholds.
 */
function transportFinding(
  id: string,
  section: string,
  response: Result,
): Finding | undefined {
  if (response.status === 401) {
    return fail(
      id,
      section,
      "authenticates",
      "401 unauthenticated. The far end returns one opaque status for a bad signature, " +
        "a timestamp outside its window, and a replayed nonce alike — check, in order: " +
        "the secret matches the product's, the base URL includes the product's platform " +
        "prefix, and this machine's clock is within the replay window.",
    )
  }
  if (response.status === 503) {
    return fail(
      id,
      section,
      "is configured",
      "503 not_configured. The surface is deployed but has no signing secret, so it " +
        "refuses every request. This is a deployment gap on the product side, not a " +
        "contract deviation.",
    )
  }
  if (response.status === 404) {
    return fail(
      id,
      section,
      "is mounted",
      "404. The endpoint is declared in admin-conformance.json but is not mounted — " +
        "declaring an endpoint is a promise that it answers.",
    )
  }
  if (response.parseError) {
    return fail(id, section, "returns JSON", response.parseError)
  }
  return undefined
}

function checkResponse(
  declaration: Declaration,
  id: EndpointId,
  label: string,
  response: Result,
): Finding[] {
  const section = ENDPOINTS[id].section

  const transport = transportFinding(label, section, response)
  if (transport) return [transport]

  // An error response is checked against §4.4 rather than against the
  // endpoint's success shape: a 4xx/5xx that carries a stable code is
  // conforming, and asserting the success envelope over it would report the
  // wrong deviation.
  if (response.status >= 400) {
    return checkErrorShape(label, "4.4", response.body)
  }

  const findings: Finding[] = [
    ...checkEnvelope(id, "4.1", response.body),
    ...checkMoney(label, "4.2", response.body),
    ...checkTimestamps(label, "4.3", response.body),
    ...checkEmptyResult(label, "4.5", response.body, response.status),
  ]

  if (id === "kpis") {
    findings.push(...checkKpis({ status: response.status, body: response.body }))
  }
  if (id === "inbox") {
    findings.push(
      ...checkInboxItems(response.body, {
        slaDeclared: declaration.endpoints.inbox?.slaDeclared,
      }),
    )
  }
  if (id === "audit-logs") {
    findings.push(...checkAuditLogScoping(response.body, declaration.slug))
  }
  if (id === "lifecycle/reason-codes") {
    findings.push(...checkReasonCodes(response.body))
  }

  return findings
}
