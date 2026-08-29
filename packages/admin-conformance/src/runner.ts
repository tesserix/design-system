import {
  checkEmptyResult,
  checkEntityRow,
  checkEnvelope,
  checkErrorShape,
  checkMoney,
  checkTimestamps,
} from "./assertions"
import { checkAuditLogScoping, checkInboxItems, checkKpis } from "./checks"
import { checkReasonCodes } from "./checks-reason-codes"
import {
  ENDPOINTS,
  ENDPOINT_IDS,
  isProbed,
  requiresSubtypes,
  type EndpointId,
} from "./contract"
import { DECLARATION_FILENAME } from "./declaration"
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
      findings.push(...(await checkUndeclared(client, id)))
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
          `declared, and deliberately never called: ${unprobedReason(id)}. ` +
            "What the contract requires of it is enforced against the declaration instead.",
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

/**
 * An endpoint the product did not declare.
 *
 * The suite skips it — declaring is what opts an endpoint into enforcement —
 * but it does NOT simply assume the endpoint is absent. It asks.
 *
 * # Why an undeclared endpoint is probed at all
 *
 * "Contracts are declared, not discovered" governs what is CHECKED. It was
 * never meant to make an implemented-but-undeclared endpoint invisible, and
 * treating absence as proof of absence produces the exact failure the
 * allowlist exists to prevent, one level up: an endpoint that is served, in
 * production, checked by nothing, reported as a clean skip.
 *
 * That gap is not hypothetical. The estate runs this suite from a Kubernetes
 * CronJob whose declaration lives in a Helm chart, while the contract requires
 * the product to commit its own `admin-conformance.json` at its repo root.
 * Two copies, nothing enforcing that they agree, and the drift is silent in
 * exactly one direction: an endpoint present in the repo file and missing from
 * the chart is simply never checked, and reports as a skip that reads as a
 * pass.
 *
 * So a 2xx here is a FAILURE, symmetrical with the declared-but-404 case
 * already reported by `transportFinding`. Declaring something you do not serve
 * and serving something you do not declare are the same mistake seen from
 * opposite sides, and only one of them was caught before.
 *
 * Anything else — 404, 501, a refusal, an unreachable host — is the honest
 * skip it always was: the product does not serve this, and said so.
 */
async function checkUndeclared(client: Client, id: EndpointId): Promise<Finding[]> {
  const endpoint = ENDPOINTS[id]
  const check = "declared in admin-conformance.json"

  const notDeclared = skip(
    id,
    endpoint.section,
    check,
    "not declared, so not checked. Declaring it is what opts an endpoint into enforcement.",
  )

  // Four endpoints cannot be probed blind, and neither absence is evidence.
  //
  // `entities` has no complete path without a `{type}`, which only the
  // declaration supplies — so an undeclared one has no URL to ask for.
  // `tenant-lifecycle`, `tenant-purge`, and `conversions` all have `isProbed`
  // false — the first two because asking would perform a write against real
  // state, `conversions` because asking would perform the unacceptable read
  // itself (a PII lookup). An undeclared instance of any of the three cannot
  // be detected without doing the very thing that must not be done.
  if (requiresSubtypes(id) || !isProbed(id)) {
    return [
      skip(
        id,
        endpoint.section,
        check,
        "not declared, and not probed: " +
          (requiresSubtypes(id)
            ? "its path needs a {type} only the declaration supplies, so there is nothing to ask for."
            : `${unprobedReason(id)}, and an undeclared instance cannot be detected without doing it.`),
      ),
    ]
  }

  let response: Result
  try {
    response = await client.get(endpoint.path, defaultQuery(id))
  } catch {
    // A probe that could not be made proves nothing. Reported as the plain
    // skip rather than as a finding either way — inventing a conclusion from a
    // failed request is how a suite starts lying in the reassuring direction.
    return [notDeclared]
  }

  if (response.status >= 200 && response.status <= 299) {
    return [
      fail(
        id,
        endpoint.section,
        check,
        `answers ${response.status} but is not declared in ${DECLARATION_FILENAME}. ` +
          "An endpoint that is served and undeclared is checked by nothing, and reports " +
          "as a skip that reads as a pass — declare it, or stop serving it. " +
          "(If the declaration the suite ran with is not the one in the product's repo, " +
          "those two copies have drifted; that is the same bug seen earlier.)",
      ),
    ]
  }

  return [notDeclared]
}

async function runEndpoint(
  client: Client,
  declaration: Declaration,
  id: EndpointId,
): Promise<Finding[]> {
  const endpoint = ENDPOINTS[id]
  const declared = declaration.endpoints[id]

  // This function always issues `client.get`; `endpoint.method` is never read
  // here. That is decorative for `tenant-purge` recording `POST` — nothing in
  // this file would ever turn that into a POST request. The entire guarantee
  // that the suite cannot purge a real tenant rests on `probe: false` routing
  // the id through the skip in `runConformance` before it reaches this
  // function at all, not on this function refusing to send the wrong verb.

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
 * Why an unprobed endpoint (`isProbed(id) === false`) is unprobed, worded for
 * an operator reading the report.
 *
 * There are two distinct reasons, not one caution reused three times — see
 * `isProbed`'s doc comment in `contract.ts` for the full argument. This
 * derives which one applies from the endpoint's own `method` rather than
 * naming ids, so it stays true if a future unprobed id is added: a non-GET
 * changes state by definition; the one unprobed GET (`conversions`) does not
 * change state but performs a read whose effect on the world — a PII lookup
 * — is unacceptable regardless.
 */
function unprobedReason(id: EndpointId): string {
  const endpoint = ENDPOINTS[id]
  return endpoint.method === "GET"
    ? "asking would perform a read whose effect on the world is unacceptable, even though nothing changes"
    : "asking would change real state"
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
    ...checkEntityRow(label, "8.9", response.body),
  ]

  if (id === "kpis") {
    findings.push(...checkKpis({ status: response.status, body: response.body }))
  }
  if (id === "inbox") {
    findings.push(
      ...checkInboxItems(response.body, {
        slaDeclared: declaration.endpoints.inbox?.slaDeclared,
        slaKinds: declaration.endpoints.inbox?.slaKinds,
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
