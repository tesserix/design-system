/**
 * `@tesserix/admin-conformance` — the enforcement half of the Product Admin
 * Integration Contract.
 *
 * The contract's §5 puts it plainly: a document alone produces exactly the
 * drift it describes. A product runs this against its own admin API in CI,
 * declares which endpoints it implements, and the suite fails the build on any
 * declared endpoint that deviates. Partial implementation is legitimate;
 * silent deviation is not.
 */

export { ENDPOINTS, ENDPOINT_IDS, isEndpointId } from "./contract"
export type { Endpoint, EndpointId, EnvelopeKind } from "./contract"

export {
  DECLARATION_FILENAME,
  implementedEndpoints,
  loadDeclaration,
  parseDeclaration,
} from "./declaration"
export type { Declaration, EndpointDeclaration } from "./declaration"

export { runConformance } from "./runner"
export type { RunOptions } from "./runner"

export { exitCode, formatReport } from "./report"
export type { ReportOptions } from "./report"

export type { Finding, Status } from "./finding"

// The signing scheme is exported because a product's own integration tests
// need to make signed calls too, and a second hand-rolled implementation is
// exactly what the golden vectors exist to prevent.
export { PLATFORM_HEADERS, canonicalQuery, canonicalString, sign, signedHeaders } from "./signing"
export type { SignatureInput, SignedRequestOptions } from "./signing"
