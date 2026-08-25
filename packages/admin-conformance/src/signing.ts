import { createHash, createHmac, randomUUID } from "node:crypto"

/**
 * The caller's half of mark8ly's request-signing scheme for `/admin/*`.
 *
 * The reference implementation is mark8ly's
 * `services/marketplace-api/internal/handlers/platformadmin/signature.go`, and
 * its package doc states the scheme is specified nowhere else. What keeps this
 * port honest is `testdata/vectors.json`, copied byte-for-byte from theirs.
 * Change anything here without the vectors still passing and every request
 * 401s — the far end returns one opaque status for every rejection, by design,
 * so there is no diagnostic to work back from.
 *
 * Only signing is implemented. Nothing verifies inbound requests with this
 * scheme in TypeScript, and an unused constant-time comparison in a
 * security-relevant file is worse than an absent one.
 */

/** The five headers the far end reads. Names must match theirs exactly. */
export const PLATFORM_HEADERS = {
  operator: "X-Platform-Operator",
  capability: "X-Platform-Capability",
  timestamp: "X-Platform-Timestamp",
  nonce: "X-Platform-Nonce",
  signature: "X-Platform-Signature",
} as const

export interface SignatureInput {
  readonly method: string
  /**
   * The percent-DECODED path — `/tenants/t one` with a real space, never
   * `/tenants/t%20one`. The far end signs Go's `Request.URL.Path`, which
   * net/http has already decoded. Signing the wire form instead 401s every
   * request whose path contains an encoded character, and nothing local
   * shows it.
   */
  readonly path: string
  readonly rawQuery?: string
  readonly body?: string
  readonly timestamp: string
  readonly nonce: string
  readonly operator: string
  readonly capability: string
}

/**
 * Characters `encodeURIComponent` leaves literal but Go's `url.QueryEscape`
 * percent-encodes.
 *
 * Mark8ly's package doc warns about the space (`%20` vs `+`) and stops there.
 * That is the most common divergence but NOT the only one: verified against
 * Go 1.26, `QueryEscape` also escapes `! * ' ( )`, which
 * `encodeURIComponent` passes through. A port that applies only the
 * documented space fix still 401s on `?actor=O'Brien`.
 *
 * `~ - _ .` are left alone by both, and `+` is `%2B` in both, so the two
 * agree everywhere else.
 */
const GO_EXTRA_ESCAPES: ReadonlyArray<readonly [RegExp, string]> = [
  [/!/g, "%21"],
  [/\*/g, "%2A"],
  [/'/g, "%27"],
  [/\(/g, "%28"],
  [/\)/g, "%29"],
]

/** Escapes one component the way Go's `url.QueryEscape` does. */
function queryEscape(value: string): string {
  let escaped = encodeURIComponent(value).replace(/%20/g, "+")
  for (const [pattern, replacement] of GO_EXTRA_ESCAPES) {
    escaped = escaped.replace(pattern, replacement)
  }
  return escaped
}

/**
 * Orders two strings by their UTF-8 bytes, as Go's `sort.Strings` does.
 *
 * JavaScript's default sort compares UTF-16 code units, which agrees with
 * Go for ASCII but not above the BMP: a character encoded as a surrogate
 * pair sorts before U+E000..U+FFFF in UTF-16 and after it in UTF-8. Query
 * keys are ASCII in practice, but "in practice" is what a canonicaliser
 * cannot rely on — both sides must agree byte-for-byte or the request 401s.
 */
function compareUtf8(a: string, b: string): number {
  const left = Buffer.from(a, "utf8")
  const right = Buffer.from(b, "utf8")
  return Buffer.compare(left, right)
}

/**
 * Renders a query string deterministically: keys sorted, then values within a
 * repeated key sorted, each escaped, joined by `&`.
 *
 * The raw string the caller happened to build with is irrelevant — parsing
 * decodes both `%20` and `+` to a space — so only the re-escaping on the way
 * out matters.
 */
export function canonicalQuery(raw: string | undefined): string {
  if (!raw) return ""

  const params = new URLSearchParams(raw)
  const byKey = new Map<string, string[]>()
  for (const [key, value] of params) {
    const existing = byKey.get(key)
    if (existing) existing.push(value)
    else byKey.set(key, [value])
  }

  const keys = [...byKey.keys()].sort(compareUtf8)
  const parts: string[] = []
  for (const key of keys) {
    const values = [...(byKey.get(key) ?? [])].sort(compareUtf8)
    for (const value of values) {
      parts.push(`${queryEscape(key)}=${queryEscape(value)}`)
    }
  }
  return parts.join("&")
}

/**
 * Fields joined by `\n` that are not otherwise protected from ambiguity.
 * `rawQuery` is percent-escaped by `canonicalQuery` and the body is folded
 * into a fixed-width hash, so neither needs the guard.
 */
const LINE_BREAK_GUARDED = [
  "method",
  "path",
  "timestamp",
  "nonce",
  "operator",
  "capability",
] as const

function assertNoLineBreaks(input: SignatureInput): void {
  for (const field of LINE_BREAK_GUARDED) {
    const value = input[field]
    if (typeof value === "string" && /[\n\r]/.test(value)) {
      throw new Error(
        `admin-conformance: ${field} must not contain a newline or carriage return`,
      )
    }
  }
}

/**
 * Builds the string the HMAC covers: eight fields joined by `\n`.
 *
 * The body is hashed rather than inlined so a captured signature cannot be
 * lifted onto a different payload. An absent body hashes as the empty string.
 */
export function canonicalString(input: SignatureInput): string {
  assertNoLineBreaks(input)

  const bodyHash = createHash("sha256")
    .update(input.body ?? "", "utf8")
    .digest("hex")

  return [
    input.method.trim().toUpperCase(),
    input.path,
    canonicalQuery(input.rawQuery),
    bodyHash,
    input.timestamp,
    input.nonce,
    input.operator,
    input.capability,
  ].join("\n")
}

/**
 * Returns the lowercase hex HMAC-SHA256 of the canonical string.
 *
 * Refuses an empty secret: an unconfigured secret reaching here is a
 * misconfiguration, and producing a valid-looking HMAC over `""` turns it
 * into a remote 401 with no local symptom.
 */
export function sign(secret: string, input: SignatureInput): string {
  if (!secret) {
    throw new Error("admin-conformance: signing secret must not be empty")
  }
  return createHmac("sha256", secret)
    .update(canonicalString(input), "utf8")
    .digest("hex")
}

export interface SignedRequestOptions {
  readonly url: URL
  readonly method?: string
  readonly body?: string
  readonly secret: string
  readonly operator: string
  readonly capability: string
  /** Injectable for tests. Defaults to the current time. */
  readonly now?: () => Date
  /** Injectable for tests. Defaults to a random UUID. */
  readonly nonce?: () => string
}

/**
 * Builds the five signed headers for one request.
 *
 * Takes a parsed `URL` rather than a path string so `url.pathname` supplies
 * the decoded path the scheme requires, rather than whatever the caller
 * concatenated.
 *
 * The timestamp is unsigned decimal seconds: the far end rejects a leading
 * `+` or `-` outright, treating `+1755859200` as malformed rather than as an
 * instant.
 */
export function signedHeaders(options: SignedRequestOptions): Record<string, string> {
  const now = options.now ?? (() => new Date())
  const nonce = options.nonce ?? (() => randomUUID())

  const input: SignatureInput = {
    method: options.method ?? "GET",
    path: decodeURIComponent(options.url.pathname),
    rawQuery: options.url.search.replace(/^\?/, ""),
    body: options.body,
    timestamp: String(Math.floor(now().getTime() / 1000)),
    nonce: nonce(),
    operator: options.operator,
    capability: options.capability,
  }

  return {
    [PLATFORM_HEADERS.operator]: input.operator,
    [PLATFORM_HEADERS.capability]: input.capability,
    [PLATFORM_HEADERS.timestamp]: input.timestamp,
    [PLATFORM_HEADERS.nonce]: input.nonce,
    [PLATFORM_HEADERS.signature]: sign(options.secret, input),
  }
}
