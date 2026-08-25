import { signedHeaders } from "./signing"

/**
 * The signed HTTP layer.
 *
 * Contract §5 documents the runner as `npx @tesserix/admin-conformance --base
 * $ADMIN_API_BASE --slug <product>` and says nothing about credentials — but a
 * product's `/admin/*` surface refuses anything unsigned, so the suite cannot
 * assert anything without them. That gap is why this file exists rather than a
 * bare `fetch`.
 */

/** Default request timeout. Generous: a cold product pod is not a deviation. */
const DEFAULT_TIMEOUT_MS = 15_000

export interface ClientConfig {
  /**
   * The product's platform admin front door, including its prefix — for
   * mark8ly that is `.../api/v1/platform`, NOT `.../api/v1`. Their Istio
   * AuthorizationPolicy denies un-JWT'd requests to `/api/v1/admin/*`, and
   * this surface authenticates by HMAC rather than JWT, so the wrong prefix
   * returns 403 at the mesh before the application sees it.
   */
  readonly base: string
  readonly secret: string
  readonly operator: string
  readonly capability: string
  readonly timeoutMs?: number
  /** Injectable for tests. Defaults to the global fetch. */
  readonly fetchImpl?: typeof fetch
}

export interface Result {
  readonly status: number
  /** Parsed JSON, or undefined when the body was not JSON. */
  readonly body?: unknown
  /** Set when the body could not be parsed — itself a reportable deviation. */
  readonly parseError?: string
  readonly contentType: string | null
  readonly url: string
}

export interface Client {
  get(path: string, query?: Record<string, string>): Promise<Result>
}

/**
 * Joins the base and a contract path without doubling or dropping a slash.
 *
 * Worth its own function because the failure is silent: a doubled slash is a
 * different path, so a different canonical string, so a different signature —
 * and the far end answers 401, which reads as a credentials problem rather
 * than a URL one.
 */
export function joinUrl(base: string, path: string, query?: Record<string, string>): URL {
  const url = new URL(base.replace(/\/+$/, "") + "/" + path.replace(/^\/+/, ""))
  for (const [key, value] of Object.entries(query ?? {})) {
    url.searchParams.set(key, value)
  }
  return url
}

export function createClient(config: ClientConfig): Client {
  if (!config.secret) {
    throw new Error(
      "admin-conformance: a signing secret is required — the product's /admin/* surface refuses unsigned requests",
    )
  }

  const fetchImpl = config.fetchImpl ?? fetch
  const timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS

  return {
    async get(path, query) {
      const url = joinUrl(config.base, path, query)
      const headers = signedHeaders({
        url,
        method: "GET",
        secret: config.secret,
        operator: config.operator,
        capability: config.capability,
      })

      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), timeoutMs)
      try {
        const response = await fetchImpl(url.toString(), {
          method: "GET",
          headers: { ...headers, Accept: "application/json" },
          signal: controller.signal,
        })

        const text = await response.text()
        // A body that will not parse is reported, never thrown. "This
        // endpoint did not return JSON" is precisely the class of deviation
        // the suite exists to catch, and an exception here would present it
        // as a crash in the tool instead.
        let body: unknown
        let parseError: string | undefined
        if (text.length > 0) {
          try {
            body = JSON.parse(text)
          } catch (error) {
            parseError = `response body is not valid JSON: ${
              error instanceof Error ? error.message : String(error)
            }`
          }
        }

        return {
          status: response.status,
          body,
          parseError,
          contentType: response.headers.get("content-type"),
          url: url.toString(),
        }
      } finally {
        clearTimeout(timer)
      }
    },
  }
}
